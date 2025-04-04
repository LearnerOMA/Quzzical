import requests

json_data = {'questions': [{'answer': 'Recruitment', 'options': ['Employee Relations', 'Recruitment', 'Java Programming', 'Financial Analysis'], 'question': 'What training did Alice Johnson complete in May 2023?'}, {'answer': 'Bob Smith', 'options': ['Alice Johnson', 'Catherine Williams', 'Bob Smith', 'David Brown'], 'question': 'Who received training in Java Programming?'}, {'answer': 'May', 'options': ['April', 'May', 'June', 'July'], 'question': 'In which month did Catherine Williams have Financial Analysis training?'}, {'answer': 'Customer Relationship', 'options': ['Sales Strategies', 'Customer Relationship', 'Digital Marketing', 'Content Creation'], 'question': 'What skills did David Brown learn in June 2023?'}, {'answer': 'Content Creation', 'options': ['Digital Marketing', 'Content Creation', 'Sales Strategies', 'Budgeting'], 'question': 'Which training did Eva Green complete in July 2023?'}, {'answer': '10 days', 'options': ['1 week', '2 weeks', '1 month', '10 days'], 'question': 'What is the duration of each training session?'}, {'answer': 'Training', 'options': ['Alice Johnson', 'Bob Smith', 'Training', 'Catherine Williams'], 'question': "Who is the trainer for Bob Smith's trainings?"}, {'answer': 'Content Creation', 'options': ['Recruitment', 'Java Programming', 'Financial Analysis', 'Content Creation'], 'question': 'Which training did NOT happen in April 2023?'}, {'answer': '5', 'options': ['1', '2', '3', '5'], 'question': 'How many different trainers are mentioned in the data?'}, {'answer': '2023-04-30T18:30:00.000Z', 'options': ['2023-04-30T18:30:00.000Z', '2023-05-09T18:30:00.000Z', '2023-05-31T18:30:00.000Z', '2023-06-30T18:30:00.000Z'], 'question': 'What is the earliest start date mentioned for any training?'}]}
def genrateGoogleForm(data):
    apps_script_url = "https://script.google.com/macros/s/AKfycbyYaq2ctsg7YbBchHsbH3le3olu_yWqVlC8_2OMkE7mZwtk3jeveiaUy2vcD6i3LfhV/exec"
    response = requests.post(apps_script_url, json=data)
    if response.status_code == 200:
        print("Google Form created successfully!")
        print("Form URL:", response.json().get('formUrl'))
        return response.json().get('formUrl')
    else:
        print("Failed to create form:", response.text)

print()