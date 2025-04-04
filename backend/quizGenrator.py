import os
import json
from PyPDF2 import PdfReader
import google.generativeai as genai
# from google import genai
import streamlit as st
import chromadb
from chromadb import Client
from chromadb.config import Settings
import base64
from sentence_transformers import SentenceTransformer
import requests
import aiohttp
import asyncio
# Configure Generative AI with API Key
genai.configure(api_key="AIzaSyDxtipjq-0M7JJTC6XvTvy34_gdHAJA-iE")

# Initialize the Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

# Initialize ChromaDB client
chroma_client = chromadb.Client()
chroma_collection = chroma_client.get_or_create_collection("pdf_texts")

# Initialize Sentence Transformer for embedding
embedder = SentenceTransformer("all-MiniLM-L6-v2")


def extract_text_from_pdf(file):
    """
    Extract text from a PDF file.
    Args:
        file (UploadedFile): The uploaded PDF file.
    Returns:
        str: Extracted text content.
    """
    try:
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text.strip()
    except Exception as e:
        st.error(f"Error reading PDF: {e}")
        return ""


def store_text_in_chromadb(text, source):
    """
    Store extracted text in ChromaDB with embeddings.
    Args:
        text (str): Text content to store.
        source (str): Source identifier for the text.
    """
    embeddings = embedder.encode([text])
    chroma_collection.add(embeddings=embeddings, documents=[text], metadatas=[{"source": source}], ids=[source])


def search_chromadb_for_topic(topic):
    """
    Search ChromaDB for content related to a specific topic.
    Args:
        topic (str): The topic to search for.
    Returns:
        str: Combined relevant content.
    """
    query_embedding = embedder.encode([topic])
    results = chroma_collection.query(query_embeddings=query_embedding, n_results=5)

    # Flatten the list of documents into a single string
    documents = [doc if isinstance(doc, str) else " ".join(doc) for doc in results["documents"]]
    combined_content = "\n".join(documents)
    return combined_content

def generate_quiz_with_gemini(content, level, question_type, no_of_questions):
    """
    Generate a quiz using Gemini via the Generative AI API.
    Args:
        content (str): The content from the PDF to generate the quiz.
        level (str): The difficulty level of the quiz ('easy', 'medium', 'hard').
        question_type (str): The type of questions to generate ('multiple_choice', 'true_false', etc.).
        no_of_questions (int): The number of questions to generate.
    Returns:
        dict: Quiz data in JSON format.
    """
    prompt = (
        f"You are an expert Quiz Generator. Generate a {level} level quiz with {no_of_questions} questions based only on the following content. "
        f"The questions should be of type '{question_type}' and should include four options with the correct answer. "
        "And json file should look like "
        ''' 
           {
  "quiz": {
    "title": "Sample Quiz with Multiple Choice and True/False",
    "questions": [
      {
        "question": "What is the capital of France?",
        "options": [
          "Berlin",
          "Madrid",
          "Paris",
          "Rome"
        ],
        "answer": "Paris"
      },
      {
        "question": "Which planet is known as the 'Red Planet'?",
        "options": [
          "Jupiter",
          "Mars",
          "Venus",
          "Saturn"
        ],
        "answer": "Mars"
      },
      {
        "question": "What is the largest mammal in the world?",
        "options": [
          "African Elephant",
          "Blue Whale",
          "Polar Bear",
          "Giraffe"
        ],
        "answer": "Blue Whale"
      },
      {
        "question": "In what year did World War II begin?",
        "options": [
          "1914",
          "1939",
          "1945",
          "1929"
        ],
        "answer": "1939"
      },
      {
        "question": "Who painted the Mona Lisa?",
        "options": [
          "Michelangelo",
          "Raphael",
          "Leonardo da Vinci",
          "Donatello"
        ],
        "answer": "Leonardo da Vinci"
      }
    ]
  }
}
        '''
        "Respond using JSON only.\n\n"
        f"Content:\n{content}"
    )

    try:
        # Generate content with Gemini
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                candidate_count=1,
                max_output_tokens=1024,
                temperature=0.8
            )
        )
        
        print("Resonse fro genrated quiz",response)

        # Extract only the JSON part from the response
        response_text = response.text.strip()

        # Locate the JSON start and end
        json_start = response_text.find("{")
        json_end = response_text.rfind("}") + 1

        if json_start == -1 or json_end == -1:
            raise ValueError("Valid JSON structure not found in response.")

        # Extract the JSON substring and parse it
        json_content = response_text[json_start:json_end]
        quiz = json.loads(json_content)

        return quiz

    except json.JSONDecodeError as e:
        print(f"Error parsing Gemini response: {e}.")
        return {'error': 'Error parsing Gemini response', 'details': str(e)}
    except Exception as e:
        print(f"Error generating quiz: {e}")
        return {'error': 'Error generating quiz', 'details': str(e)}


def save_quiz_to_json(quiz_data, output_file):
    """
    Save the quiz data to a JSON file.
    Args:
        quiz_data (dict): The generated quiz data.
        output_file (str): Path to the output JSON file.
    """
    with open(output_file, "w") as file:
        json.dump(quiz_data, file, indent=4)
    st.success(f"Quiz saved to {output_file}")

def generate_name_quiz_with_gemini(prompt):
    """
    Generate a one-word topic name from a given prompt using Gemini.
    
    Args:
        prompt (str): The input prompt.
    
    Returns:
        str: A single-word topic name.
    """
    try:
        topic_prompt = (
            f"Extract a single-word topic name that best represents the following prompt. "
            f"The topic should be strictly one word and highly relevant to the given text.\n\n"
            f"Prompt: {prompt}\n\n"
            "Output should be only one word with no explanation."
        )

        response = model.generate_content(
            topic_prompt,
            generation_config=genai.types.GenerationConfig(
                candidate_count=1,
                max_output_tokens=10,
                temperature=0.5
            )
        )

        topic_name = response.text.strip().split()[0]  # Ensuring a single-word output
        
        return topic_name

    except Exception as e:
        print(f"Error generating topic name: {e}")
        return "Error"

def find_similar_topic_list(topic, topicList):
    """
    Find topics similar to the given topic using Gemini.

    Args:
        topic (str): The topic to find similarities for.
        topicList (list): A list of topic strings to compare against.

    Returns:
        list: A list of topics that are most similar to the given topic.
    """
    try:
        # Construct the prompt for Gemini
        prompt = (
            f"Given the topic '{topic}', find the most similar topics from the following list:\n\n"
            f"{topicList}\n\n"
            "Return only the most relevant topics in a Python list format. "
            "Do not include any explanations, just the list of topics."
        )

        # Generate content using Gemini
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                candidate_count=1,
                max_output_tokens=100,
                temperature=0.3
            )
        )

        # Extract and process the response
        response_text = response.text.strip()
        
        # Convert the response text into a Python list
        similar_topics = json.loads(response_text.replace("'", "\""))

        return similar_topics

    except json.JSONDecodeError as e:
        print(f"Error parsing Gemini response: {e}.")
        return []
    except Exception as e:
        print(f"Error finding similar topics: {e}")
        return []
    
    
def get_user_topic_list(user_email):
    url = f"http://localhost:5000/getUserData/{user_email}"
    print(url)
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for HTTP errors
        
        data = response.json()
        topics = [item['topic'] for item in data]
        print(f"\n✅ User data fetched successfully for {user_email}: \n", data)
        print(f"\n✅ User topics fetched successfully for {user_email}: \n", topics)
        return topics

    except requests.exceptions.RequestException as e:
        print(f"\n🚨 Error fetching user data: {e}")
        
def get_user_data(user_email):
    url = f"http://localhost:5000/getUserData/{user_email}"
    print(url)
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for HTTP errors
        
        data = response.json()
        print(f"\n✅ User data fetched successfully for {user_email}: \n", data)
        return data

    except requests.exceptions.RequestException as e:
        print(f"\n🚨 Error fetching user data: {e}")
            
def generate_personalized_quiz_with_gemini(content, level, question_type, no_of_questions):
    prompt = (
        f"Generate a {level} level quiz with {no_of_questions} questions based on the following content. "
        f"The questions should be of type '{question_type}' and should include four options with the correct answer. "
        "And json file should strictly look like "
        ''' 
           {
  "quiz": {
    "title": "Sample Quiz with Multiple Choice and True/False",
    "questions": [
      {
        "question": "What is the capital of France?",
        "options": [
          "Berlin",
          "Madrid",
          "Paris",
          "Rome"
        ],
        "answer": "Paris"
      },
      {
        "question": "Which planet is known as the 'Red Planet'?",
        "options": [
          "Jupiter",
          "Mars",
          "Venus",
          "Saturn"
        ],
        "answer": "Mars"
      },
      {
        "question": "What is the largest mammal in the world?",
        "options": [
          "African Elephant",
          "Blue Whale",
          "Polar Bear",
          "Giraffe"
        ],
        "answer": "Blue Whale"
      },
      {
        "question": "In what year did World War II begin?",
        "options": [
          "1914",
          "1939",
          "1945",
          "1929"
        ],
        "answer": "1939"
      },
      {
        "question": "Who painted the Mona Lisa?",
        "options": [
          "Michelangelo",
          "Raphael",
          "Leonardo da Vinci",
          "Donatello"
        ],
        "answer": "Leonardo da Vinci"
      }
    ]
  }
}
        '''
         "\nFollow the difficulty levels as shown in the examples below"
        "\n\nExample questions for each difficulty level:"
        "\n\nEASY LEVEL (0-25 score):"
        '''{
            "quiz": {
                title: "Sample easy level quiz",
                "questions": [
                    {
                        "question": "What is the definition of a set?",
                        "options": [
                            "A collection of well-defined objects",
                            "A list of numbers only",
                            "A group of letters only",
                            "A sequence of operations"
                        ],
                        "answer": "A collection of well-defined objects"
                    },
                    {
                        "question": "What is 2 to the power of 3?",
                        "options": [
                            "4",
                            "6",
                            "8",
                            "10"
                        ],
                        "answer": "8",
                    }
                ]
            }
        }'''
        
        "\n\nMEDIUM LEVEL (25-75 score):"
        '''{
            "quiz": {
                "title": "Sample medium level quiz",
                "questions": [
                    {
                        "question": "In how many ways can 4 different books be arranged on a shelf?",
                        "options": [
                            "16",
                            "24",
                            "12",
                            "4"
                        ],
                        "answer": "24"
                    },
                    {
                        "question": "What is the contrapositive of 'If it rains, then the ground is wet'?",
                        "options": [
                            "If the ground is wet, then it rains",
                            "If it doesn't rain, then the ground isn't wet",
                            "If the ground isn't wet, then it doesn't rain",
                            "If it rains, then the ground isn't wet"
                        ],
                        "answer": "If the ground isn't wet, then it doesn't rain"
                    }
                ]
            }
        }'''
        
        "\n\nHARD LEVEL (75%+ historical score):"
        '''{
            "quiz": {
                "title": "Sample hard level quiz",
                "questions": [
                    {
                        "question": "In a complete graph with n vertices, what is the total number of edges?",
                        "options": [
                            "n(n-1)",
                            "n(n-1)/2",
                            "n²",
                            "2n"
                        ],
                        "answer": "n(n-1)/2"
                    },
                    {
                        "question": "Using the Principle of Inclusion-Exclusion, if |A| = 50, |B| = 40, |A∩B| = 20, what is |A∪B|?",
                        "options": [
                            "90",
                            "70",
                            "60",
                            "80"
                        ],
                        "answer": "70"
                    }
                ]
            }
        }'''
        
        "\n\nDifficulty Level Guidelines:"
        "\n- Easy: Focus on basic definitions, simple calculations, and direct recall questions"
        "\n- Medium: Include application of concepts, multi-step calculations, and basic problem solving"
        "\n- Hard: Complex problem solving, proofs, theoretical concepts, and advanced applications"
        "\n\nRespond using JSON only.\n\n"
        f"Content:\n{content}"
        
        "Respond using JSON only.\n\n"
        f"Content:\n{content}"
    )
    
    try:
        # Generate content with Gemini
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                candidate_count=1,
                max_output_tokens=1024,
                temperature=0.8
            )
        )
        
        print("Resonse fro genrated quiz",response)

        # Extract only the JSON part from the response
        response_text = response.text.strip()

        # Locate the JSON start and end
        json_start = response_text.find("{")
        json_end = response_text.rfind("}") + 1

        if json_start == -1 or json_end == -1:
            raise ValueError("Valid JSON structure not found in response.")

        # Extract the JSON substring and parse it
        json_content = response_text[json_start:json_end]
        quiz = json.loads(json_content)

        return quiz

    except json.JSONDecodeError as e:
        print(f"Error parsing Gemini response for personalized: {e}.")
        return {'error': 'Error parsing Gemini response', 'details response for personalized' : str(e)}
    except Exception as e:
        print(f"Error generating quiz: {e}")
        return {'error': 'Error generating quiz', 'details response for personalized': str(e)}  

    
def main():
    """
    Streamlit app for PDF Quiz Generator with optional topic-based generation.
    """
    st.title("PDF Quiz Generator with Gemini")
    st.write("Upload PDF files to extract text and generate quizzes.")

    # File uploader for PDFs
    uploaded_files = st.file_uploader(
        "Upload PDF Files", accept_multiple_files=True, type="pdf"
    )

    # Input for topic
    topic = st.text_input("Enter a topic to generate the quiz (leave blank for general quiz):")

    # Select quiz difficulty level
    quiz_level = st.selectbox("Select Quiz Difficulty Level", ["easy", "medium", "hard"])

    if st.button("Generate Quiz"):
        if not uploaded_files:
            st.warning("Please upload at least one PDF file.")
            return

        # Extract and process text from uploaded PDFs
        combined_text = ""
        for uploaded_file in uploaded_files:
            text = extract_text_from_pdf(uploaded_file)
            if text:
                combined_text += text + "\n"
                store_text_in_chromadb(text, uploaded_file.name)

        if not combined_text.strip():
            st.warning("No text could be extracted from the uploaded files.")
            return

        if topic.strip():
            # Use topic-based content for quiz generation
            relevant_content = search_chromadb_for_topic(topic)

            if not relevant_content.strip():
                st.warning("No relevant content found for the given topic.")
                return

            with st.spinner("Generating topic-specific quiz..."):
                quiz_data = generate_quiz_with_gemini(relevant_content, quiz_level)
        else:
            # Use general content for quiz generation
            with st.spinner("Generating general quiz..."):
                quiz_data = generate_quiz_with_gemini(combined_text, quiz_level)

        # Display and save quiz data
        if quiz_data:
            st.json(quiz_data)
            save_quiz_to_json(quiz_data, "quiz_output.json")

def get_text_from_image(image_path):
    """
    Extracts a detailed description of the image for quiz generation using Gemini AI.

    Args:
        image_path (str): Path to the image file.

    Returns:
        str: Detailed description of the image or an error message.
    """
    try:
        # Read and encode the image in base64
        with open(image_path, "rb") as img_file:
            b64_image = base64.b64encode(img_file.read()).decode('utf-8')

        # Initialize Gemini Model
        model = genai.GenerativeModel(model_name="gemini-2.0-flash-exp")

        # Prepare the image in the required format
        image_data = {
            "mime_type": "image/png",  # Adjust if using a different image format
            "data": b64_image
        }

        # Send the request with prompt and image
        response = model.generate_content(
            [
                {"text": "From this image describe the image such that we can generate a quiz from this. Make a detailed description of the image."},
                {"inline_data": image_data}
            ]
        )

        # Extract and return the description
        return response.text.strip()

    except FileNotFoundError:
        return f"Error: The file '{image_path}' was not found."

    except genai.GenerativeAIError as e:
        return f"API Error: {str(e)}"

    except Exception as e:
        return f"An unexpected error occurred: {str(e)}"



if __name__ == "__main__":
    main()