from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

# Configuration - replace with your details
SENDER_EMAIL = "janhavi.22210173@viit.ac.in"
SENDER_PASSWORD = "fakx skvq plys hrex"

def send_email(recipient, subject, body):
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = recipient
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient, msg.as_string())

        return True
    except Exception as e:
        print(f"Failed to send email to {recipient}: {e}")
        return False

@app.route('/send-mails', methods=['POST'])
def send_mails():
    data = request.json
    emails = data.get('emails')
    custom_text = data.get('custom_text', '')

    if not emails:
        return jsonify({'error': 'No emails provided'}), 400

    subject = "Your Predefined Subject"
    predefined_body = "Hello,\n\nThis is the predefined part of the email.\n\n"
    
    results = {}
    for email in emails:
        body = predefined_body + f"Custom Message: {custom_text}\n\nBest Regards,\nYour Name"
        success = send_email(email, subject, body)
        results[email] = 'Sent' if success else 'Failed'

    return jsonify(results)


# Call the function directly when running the script
if __name__ == '__main__':
    # Sample data to test the function directly
    sample_data = {
        'emails': ['pranav.22210551@viit.ac.in', 'janhavi.22210173@viit.ac.in'],
        'custom_text': 'This is your personalized message!'
    }

    with app.test_request_context('/send-mails', method='POST', json=sample_data):
        response = send_mails()
        print(response.get_json())  # Prints the result in the console

    # Uncomment the following line if you still want the server to run for API calls
    # app.run(debug=True)
