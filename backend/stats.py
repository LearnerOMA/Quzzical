import PyPDF2
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer, util
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from bson import ObjectId

# MongoDB connection
client = MongoClient("mongodb+srv://harita28:harita28@cluster0.eoefb.mongodb.net/") 
db = client['Hackathon']  
collection = db['Quiz']  

# Fetch quiz using _id or other filters
quiz_data = collection.find_one({"_id": ObjectId("67de4c7a5948a17a840329fd")})

# Extract quiz array
quiz = quiz_data['quiz'] if quiz_data else []

# Step 1: Extract text from PDF and chunk by page
def extract_text_chunks_from_pdf(pdf_path):
    reader = PyPDF2.PdfReader(pdf_path)
    chunks = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            chunks.append(page_text)
    return chunks

document_chunks = extract_text_chunks_from_pdf('D:/Notes/Agile.pdf')

# Step 2: Initialize Sentence Transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Step 3: Embed chunks individually
chunk_embeddings = model.encode(document_chunks, convert_to_tensor=True)

# Step 4: Compute semantic relevance per QA pair
results = []
for q in quiz:
    combined = q['question'] + " " + q['answer']
    qa_embedding = model.encode(combined, convert_to_tensor=True)
    # Compare against all chunks, take max similarity
    scores = util.pytorch_cos_sim(qa_embedding, chunk_embeddings)
    max_score = scores.max().item()
    results.append({
        "question": q['question'], 
        "answer": q['answer'], 
        "score": max_score
    })

# Convert to DataFrame
df_results = pd.DataFrame(results)
df_results['q_len'] = df_results['question'].apply(lambda x: len(x.split()))
df_results['score_bin'] = pd.cut(df_results['score'], bins=[0,0.2,0.4,0.6,0.8,1.0])

# Seaborn Theme
sns.set(style="whitegrid")

# Plot 1: Barplot of all question scores
plt.figure(figsize=(10, 5))
sns.barplot(y="question", x="score", data=df_results, palette="mako")
plt.xlabel("Relevance Score (0 to 1)")
plt.ylabel("Quiz Questions")
plt.title("Quiz-Document Relevance Metrics")
plt.xlim(0, 1)
plt.tight_layout()
plt.show()

# Plot 2: Histogram of score distribution
plt.figure(figsize=(8, 4))
sns.histplot(df_results['score'], bins=10, kde=True, color="skyblue")
plt.title("Distribution of Relevance Scores")
plt.xlabel("Relevance Score")
plt.ylabel("Frequency")
plt.xlim(0, 1)
plt.tight_layout()
plt.show()

# Plot 3: Top 5 relevant questions
top_n = df_results.sort_values(by="score", ascending=False).head(5)
plt.figure(figsize=(8, 4))
sns.barplot(y="question", x="score", data=top_n, palette="viridis")
plt.title("Top 5 Most Relevant Questions")
plt.xlabel("Relevance Score")
plt.xlim(0, 1)
plt.tight_layout()
plt.show()

# Plot 4: Boxplot for spread
plt.figure(figsize=(6, 4))
sns.boxplot(data=df_results, x="score", color="salmon")
plt.title("Boxplot of Relevance Scores")
plt.xlabel("Relevance Score")
plt.xlim(0, 1)
plt.tight_layout()
plt.show()

# Plot 5: Countplot of score bins
plt.figure(figsize=(8, 5))
sns.countplot(data=df_results, x='score_bin', palette="coolwarm")
plt.title("Question Counts in Score Ranges")
plt.xlabel("Relevance Score Ranges")
plt.ylabel("Number of Questions")
plt.tight_layout()
plt.show()

# Plot 6: Violin plot
plt.figure(figsize=(6, 4))
sns.violinplot(data=df_results, x="score", color="lightgreen")
plt.title("Violin Plot of Relevance Scores")
plt.xlabel("Relevance Score")
plt.xlim(0, 1)
plt.tight_layout()
plt.show()

# Plot 7: Question Length vs Score
plt.figure(figsize=(8, 5))
sns.scatterplot(data=df_results, x="q_len", y="score", hue="score", palette="cool")
plt.title("Question Length vs Relevance Score")
plt.xlabel("Question Length (words)")
plt.ylabel("Relevance Score")
plt.xlim(0, df_results['q_len'].max() + 5)
plt.ylim(0, 1)
plt.tight_layout()
plt.show()

# Optional: Print summary insights
print("\nSummary Insights:")
print(f"- Total questions: {len(df_results)}")
print(f"- Average relevance score: {df_results['score'].mean():.3f}")
print(f"- Questions in 0.6+ score bin: {df_results[df_results['score'] >= 0.6].shape[0]}")
print(f"- Average question length: {df_results['q_len'].mean():.1f} words")
