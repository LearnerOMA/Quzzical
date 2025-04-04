import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./History.css";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoCopyOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";

const HistoryJoined = () => {
  const [joinedQuizzes, setJoinedQuizzes] = useState([]);
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate(); 
  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchJoinedQuizzes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/get-joined-history`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem("token");
          navigate("/login"); 
          return;
        }

        const data = await response.json();
        console.log("Fetched joined quizzes:", data);

        if (Array.isArray(data)) {
          setJoinedQuizzes(data);  // ✅ Directly using API response
        } else {
          console.error("Unexpected API response format:", data);
          setJoinedQuizzes([]);
        }
      } catch (error) {
        console.error("Error fetching joined quizzes:", error);
      }
    };

    fetchJoinedQuizzes();
  }, [navigate, token]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert("Quiz code copied to clipboard!"))
      .catch(err => console.error("Error copying text: ", err));
  };

  return (
    <div className="history-container">
      <div className="history-title-container">
        <HiOutlineDocumentText size={40} color="white" style={{ marginTop: "9px" }} />
        <div className="history-title">Joined Quizzes</div>
      </div>

      <div className="history-card-container">
        {joinedQuizzes.length > 0 ? (
          joinedQuizzes.map((quiz, index) => (
            <div key={index} className="history-card">
              <div className="history-info-container">
                <h2 className="history-quiz-title">{quiz.quiz_title}</h2>
                
                <div className="history-links-container">
                <p className="quiz-score">Score: {quiz.score !== undefined ? quiz.score : "Not Available"}</p>
                </div>

                {quiz.quiz_code && (
                  <div className="quiz-code-container">
                    <span>Quiz Code: <strong>{quiz.quiz_code}</strong></span>
                    <IoCopyOutline 
                      size={15} 
                      onClick={() => copyToClipboard(quiz.quiz_code)} 
                      style={{ cursor: "pointer", marginLeft: "10px", marginTop: "5px" }} 
                    />
                  </div>
                )}
              </div>

              <p className="quiz-date">
                Joined At: {quiz.joined_at ? new Date(quiz.joined_at).toLocaleString() : "N/A"}
              </p>
            </div>
          ))
        ) : (
          <p>No joined quizzes available.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryJoined;
