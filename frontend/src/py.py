# import requests

# # Flask server URL
# BASE_URL = "http://127.0.0.1:5000"  # Change this if your Flask server runs on a different port

# # User email
# user_email = "harita@gmail.com"

# # API endpoint
# url = f"{BASE_URL}/getUserData/{user_email}"

# try:
#     # Sending GET request
#     response = requests.get(url)
#     print("Response status code:", response)
#     # Checking response status
#     if response.status_code == 200:
#         #print("User Data:", response.json())  # Print user data    
#         topics = {quiz['topic'].lower() for quiz in response.json()}  # Extract topics from user data
        
#         percentage = sum(int(quiz.get('percentage', 0)) for quiz in response.json())

#         print("Topics:", topics)  # Print topics
#     else:
#         print("Error:", response.json())  # Print error message

# except requests.exceptions.RequestException as e:
#     print("Request failed:", e)

import requests

url = "http://localhost:5000/generate-topic-name"
payload = {
    "prompt": "lotus",
    "userMail": "harita@gmail.com"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")  # Check status

    # Check if response is JSON
    if response.headers.get('Content-Type') == 'application/json':
        print(response.json())
    else:
        print("❌ Response is not JSON:", response.text)  # Print raw response for debugging

except requests.exceptions.RequestException as e:
    print(f"🚨 Request Error: {e}")

