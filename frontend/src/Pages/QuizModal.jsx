import React from "react";
import "./QuizModal.css"; // Add styles for modal

const QuizModal = ({ isOpen, onClose, quizTitle, questions }) => {
  if (!isOpen) return null; // If the modal isn't open, return nothing.

  return (
    <div className="quiz-modal-overlay">
      <div className="quiz-modal">
        <div className="modal-header">
          <h2>{quizTitle}</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="quiz-questions">
          {questions.map((question, index) => (
            <div key={index} className="quiz-question">
              <p className="question-number">Question {index + 1}:</p>
              <p className="question-text">{question.question}</p>
              <ul className="options-list">
                {question.options.map((option, idx) => (
                  <li 
                    key={idx} 
                    className={`option ${option === question.answer ? 'correct-answer' : ''}`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
