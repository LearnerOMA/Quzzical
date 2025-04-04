import React, { useEffect, useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import { MdOutlineSettings } from "react-icons/md";
import { Search } from '@mui/icons-material';
import axiosInstance from '../services/axiosInstance'; 
import { useNavigate } from 'react-router-dom'; 
import './DocumentUploader.css';

const PersonalizeGenerate = () => {
  const [noOfQuestions, setNumQuestions] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizLoad , setQuizLoad] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState(null);
  const [topic, setTopic] = useState('');
  const navigate = useNavigate();
  const userMail = JSON.parse(localStorage.getItem("user")).email;

  const isQuizValid = (quiz) => {
    if (!Array.isArray(quiz)) return false; // Ensure it's an array
    return quiz.every((q) =>
      typeof q === "object" &&
      q !== null &&
      typeof q.question === "string" &&
      typeof q.answer === "string" &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.options.every((option) => typeof option === "string")
    );
  };


  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      prompt,
      userMail,
      noOfQuestions,
    }
    console.log("my payload: ", payload);

    try {
      const quizResponse = await axiosInstance.post('http://localhost:5000/generate-topic-name', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      const generatedQuiz = quizResponse.data.quiz.quiz.questions;
      const generatedTopic = quizResponse.data.topic;
      console.log("Topic response:", generatedQuiz);
      console.log("Generated topic: ", generatedTopic);
      setTopic(generatedTopic);
      setLoading(false);
      if (!isQuizValid(generatedQuiz)) {
        console.error("Generated quiz is invalid:", generatedQuiz);
        return;
      }
      
      setQuiz(generatedQuiz);
      setQuizLoad(true);
    } catch (error) {
      console.log("Payload : ",payload)
      console.error('Error generating topic name:', error);
    }
  };

  const handleQuizSubmit = (answers) => {
    setUserAnswers(answers);
    // Send submission data to the backend if needed
  };

  const handleRestart = () => {
    setQuiz(null);
    setUserAnswers(null);
    setPrompt('');
  };

  return (
    <>
      <h1 className='personalized-generate-quiz-title'>Generate Personalized Quiz</h1>
      <div className='personalized-material-input-box'>
        <div className="personalized-document-uploader-container">
          <div>
            <h3 className="upload-doc-title">Enter quiz topic or paste content to generate using AI</h3>
            <div className="text-input-container">
                <TextField
                  id="text-input"
                  placeholder="Enter your text. This could be a quiz topic, custom prompt, paste content..."
                  multiline
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <IconButton>
                        <Search />
                      </IconButton>
                    ),
                  }}
                  sx={{
                    width: '500px',
                    '& .MuiInputBase-root': {
                      borderRadius: '10px',
                      overflow: 'auto', // Ensures vertical scrolling
                    },
                    '& .MuiOutlinedInput-root': {
                      paddingRight: '8px',
                    },
                  }}
                />
            </div>
          </div>
          <h3 className="preferences-title">Preferences</h3>
            <div className="preferences-form">
              <TextField
                id="no-of-questions"
                label="No of Questions"
                type="number"
                variant="outlined"
                margin="normal"
                value={noOfQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                sx={{
                  width: '500px', 
                  '& .MuiInputBase-root': {
                    height: '40px', 
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.9rem', 
                  },
                }}
              />
            </div>
            <button className="generate-quiz-button" onClick={handleGenerateQuiz} disabled={loading}>
                {loading ? "Generating..." : (
                    <>
                        <MdOutlineSettings className='generate-icon' />
                        Generate Quiz
                    </>
                )}
            </button>
              
            {quizLoad ? (
              navigate('/personalized-quiz', {
                state: { initialQuiz: quiz, topic: topic }
              })
            ) : (
              <></>   // Render only when quiz is ready
            )}
        </div>
      </div>
    </>
  );
};

export default PersonalizeGenerate;
