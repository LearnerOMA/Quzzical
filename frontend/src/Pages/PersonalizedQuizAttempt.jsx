import React from 'react'
import QuizPage from './QuizPage';
import { useLocation, useNavigate } from 'react-router-dom';

const PersonalizedQuizAttempt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { initialQuiz, topic } = location.state || {};

  return (
    <>
      <QuizPage 
        initialQuiz={initialQuiz} 
        topic={topic}
      />
    </>
  )
}

export default PersonalizedQuizAttempt