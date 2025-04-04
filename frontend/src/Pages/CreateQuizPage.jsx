import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateQuizPage.css';
import { RiAiGenerateText } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";

const CustomButton = ({ text, icon, onClick}) => {
    return (
      <button className="custom-button" onClick={onClick}>
        <span className="custom-button-icon">{icon}</span>
        <span className="custom-button-text">{text}</span>
      </button>
    );
  };

const CreateQuizPage = () => {
    const navigate = useNavigate();

    const handleGenerateClick = () => {
        navigate('/generate-quiz');
    }

    const handleJoinClick = () => {
        navigate('/join-quiz');
    }

    return (
      <div className='create-quiz-container'>
        <CustomButton
          text="Generate a Quiz"
          icon={<RiAiGenerateText />}
          onClick={handleGenerateClick}
        />
        <CustomButton
          text="Join a Quiz"
          icon={<SiGoogleclassroom />}
          onClick={handleJoinClick}
        />
      </div>
    )
}

export default CreateQuizPage