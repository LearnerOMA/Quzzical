import base64
import google.generativeai as genai

# Configure the API key
genai.configure(api_key="AIzaSyDxtipjq-0M7JJTC6XvTvy34_gdHAJA-iE")

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

# Example usage
description = get_text_from_image("home.png")
print(description)
