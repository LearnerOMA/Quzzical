import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinQuiz.css';
import { GoCodeOfConduct } from "react-icons/go";
import { TextField} from '@mui/material';
import { MdOutlineSettings } from "react-icons/md";

const JoinQuiz = () => {
  const [quizCode, setQuizCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkTokenExpiry();
  }, []);

  const checkTokenExpiry = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        handleLogout();
      }
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    alert("Session expired. Please log in again.");
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCodeInputChange = (e) => {
    setQuizCode(e.target.value);
  };

  const handleTakeQuiz = () => {
      if (quizCode.trim() === '') {
        alert("Please enter a valid quiz code!");
        return;
    }
    console.log("Quiz code : ",quizCode)
    navigate(`/quiz/${quizCode}`);
  }

  return (
      <div className='join-quiz-container'>
          <h1 className='join-quiz-title'>Join A Quiz</h1>
          <div className='material-input-box'>
              <div className='join-quiz-code-container'>
                  <h1 className='join-quiz-code-title'>Welcome to Quizzical!<GoCodeOfConduct style={{ color: '#514372', marginTop: '4px', marginLeft: '5px', fontWeight: 'bolder' }}/></h1>
                  <div className="code-input-container">
                      <TextField
                        id="code-input"
                        placeholder="Enter a code to start quiz."
                        value={quizCode}
                        onChange={handleCodeInputChange}
                        variant="outlined"
              
                        sx={{
                          width: '250px',
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
                  
                  <button className="take-quiz-button" onClick={handleTakeQuiz}>
                    <>
                      <MdOutlineSettings className='generate-icon' />
                      Take Quiz
                    </>
                  </button>
              </div>
          </div>
      </div>
  );
}

export default JoinQuiz;
