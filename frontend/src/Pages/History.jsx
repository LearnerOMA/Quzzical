import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./History.css";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoCopyOutline } from "react-icons/io5";
import QuizModal from "./QuizModal"; 
import { FaUsers } from "react-icons/fa";

const History = () => {
  const [history, setHistory] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); 
  const API_BASE_URL = "http://localhost:5000";
  const userEmail = JSON.parse(localStorage.getItem('user'))?.email;

  useEffect(() => {
    const fetchQuizHistory = async () => {
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/get-history`, {
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
        //console.log("Fetched data:", response.json());

        // Filter quizzes where the user is either the creator or has joined
        const filteredQuizzes = data.filter(quiz => quiz.email === userEmail);

        setHistory(filteredQuizzes);
        
      } catch (error) {
        console.error("Error fetching quiz history:", error);
      }
    };
    
    fetchQuizHistory();
  }, []);

  const handleCardClick = async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/get-quiz-details/${quizId}`, {
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
      if (response.ok) {
        setSelectedQuiz(data);
        setIsModalOpen(true);
      } else {
        console.error("Error fetching quiz details:", data);
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert("Quiz code copied to clipboard!"))
      .catch(err => console.error("Error copying text: ", err));
  };

  const handleUserClick = () => {};

  return (
    <div className="history-container">
      <div className="history-title-container">
        <HiOutlineDocumentText size={40} color="white" style={{ marginTop: "9px" }} />
        <div className="history-title">My Quizzes</div>
      </div>

      <div className="history-card-container">
        {history.length > 0 ? (
          history.map((quiz, index) => (
            <div key={index} className="history-card" onClick={() => handleCardClick(quiz._id)}>
              <div className="history-info-container">
                <h2 className="history-quiz-title">{quiz.quiz_title}</h2>
                
                <div className="history-links-container">
                  <a href={quiz.formUrl} target="_blank" rel="noopener noreferrer" className="links-of-quiz">
                    Google Form
                  </a>
                  <a href={quiz.spreadsheetUrl} target="_blank" rel="noopener noreferrer" className="links-of-quiz">
                    Google Spreadsheet
                  </a>
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
              <div className="participants-container">
                <FaUsers
                  size={20}
                  onClick={handleUserClick}
                  style={{ cursor: "pointer", marginLeft: "10px", color: "#514372"}} 
                />
              </div>
              <p className="quiz-date">
                Created At: {new Date(quiz.created_at).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No quizzes available in history.</p>
        )}
      </div>

      {/* Modal to show quiz questions */}
      {selectedQuiz && (
        <QuizModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          quizTitle={selectedQuiz.quiz_title}
          questions={selectedQuiz.questions}
        />
      )}
    </div>
  );
};

export default History;
