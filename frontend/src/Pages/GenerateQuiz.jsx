import React, { useState } from 'react';
import './GenerateQuiz.css';
import { IoDocumentText } from "react-icons/io5";
import { BsChatSquareTextFill } from "react-icons/bs";
import DocumentUploader from './DocumentUploader';
import TextUploader from './TextUploader';
import { useNavigate } from 'react-router-dom';


const GenerateQuiz = () => {
    const [activeTab, setActiveTab] = useState('document');
    const navigate = useNavigate();

    return (
        <div className='generate-quiz-container'>
            <h1 className='generate-quiz-title'>Generate A Quiz</h1>
            <div className='material-input-box'>
                <h2 className='material-type-title'>Choose material type</h2>
                <div className="toggle-container">
                    <div className="button-group">
                        <button
                            className={`toggle-button ${activeTab === 'text' ? 'active' : ''}`}
                            onClick={() => setActiveTab('text')}
                        >
                            <span className='toggle-button-text'>Text / Prompt</span>
                            <span className='toggle-button-icon'><BsChatSquareTextFill /></span>
                        </button>
                        <button
                            className={`toggle-button ${activeTab === 'document' ? 'active' : ''}`}
                            onClick={() => setActiveTab('document')}
                        >
                            <span className='toggle-button-text'>Document</span>
                            <span className='toggle-button-icon'><IoDocumentText /></span>
                        </button>
                        <div className="slider" style={{ left: activeTab === 'text' ? '0%' : '50%' }} />
                    </div>
                    <div className="content">
                        {activeTab === 'text' && <TextUploader />}
                        {activeTab === 'document' && <DocumentUploader />}
                    </div>
                </div>
            </div>
            <button 
                className="home-btn" 
                onClick={() => navigate('/home')}
              >
                🏠
            </button>
        </div>
    );
};

export default GenerateQuiz;
