import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import './QuizPage.css';

const QuizPage = () => {
    const { quizCode } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timer, setTimer] = useState(600); // 10 mins timer
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [countdown, setCountdown] = useState(null); // Initially null

    useEffect(() => {
        checkTokenExpiry();
        fetchQuiz();
    }, []);

    useEffect(() => {
        let interval;
        if (isQuizStarted && countdown === 0) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        handleSubmit();
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isQuizStarted, countdown]);

    useEffect(() => {
        if (countdown === null || countdown <= 0) return;
        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    setIsQuizStarted(true); // Start quiz after countdown reaches 0
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [countdown]);

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

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchQuiz = () => {
        axios.get(`http://localhost:5000/api/quiz/${quizCode}`, getAuthHeaders())
            .then(res => setQuiz(res.data))
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    handleLogout();
                }
            });
    };

    const handleLogout = () => {
        alert("Session expired. Please log in again.");
        localStorage.removeItem('token');
        navigate('/login');
    };

    const startQuizConfirmation = () => {
        const confirmStart = window.confirm("Are you sure you want to start the quiz?");
        if (confirmStart) {
            setCountdown(3); // Start countdown
        }
    };

    const handleAnswerChange = (index, answer) => {
        setAnswers(prev => ({ ...prev, [index]: answer }));
    };

    const handleNext = () => setCurrentQuestion(prev => prev + 1);
    const handlePrev = () => setCurrentQuestion(prev => prev - 1);

    const handleSubmit = () => {
        if (Object.keys(answers).length === quiz.quiz.length) {
            axios.post('http://localhost:5000/api/submit', { quizCode, answers }, getAuthHeaders())
            .then(() => {
                setIsSubmitted(true);
                navigate(`/result/${quizCode}`);
            }).catch(err => {
                if (err.response && err.response.status === 401) {
                    handleLogout();
                }
            });
        }
    };

    const handleExit = () => {
        const confirmExit = window.confirm("Are you sure you want to quit? Your progress will be lost.");
        if (confirmExit) {
            navigate('/home');
        }
    };

    const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${('0' + seconds % 60).slice(-2)}`;

    if (!quiz) return <div>Loading...</div>;

    return (
        <div className="quiz-page-container">
            {!isQuizStarted ? (
                countdown !== null ? (
                    <div className="countdown-container">
                        <h1>{countdown}</h1>
                    </div>
                ) : (
                    <div className="quiz-info-container">
                        <h1 className="quiz-title">{quiz.quiz_title}</h1>
                        <p>Total Questions: {quiz.quiz.length}</p>
                        <p>Total Marks: {quiz.quiz.length} (1 mark per question)</p>
                        <p>Total Time: {Math.floor(timer / 60)} minutes</p>
                        <button className="start-quiz-button" onClick={startQuizConfirmation}>Start Quiz</button>
                    </div>
                )
            ) : (
                <div className="quiz-page-quiz-container">
                    <div className="quiz-page-quiz-header">
                        <div className="quiz-page-timer">⏱ {formatTime(timer)}</div>
                        <div className="quiz-page-question-tracker">Question {currentQuestion + 1}/{quiz.quiz.length}</div>
                        <button className="quiz-page-exit-button" onClick={handleExit}>Exit</button>
                    </div>

                    <h1 className="quiz-page-quiz-title">{quiz.quiz_title}</h1>

                    <div className="quiz-page-question-section">
                        <h3>{quiz.quiz[currentQuestion].question}</h3>
                        <div className="quiz-page-options-container">
                            {quiz.quiz[currentQuestion].options.map((option, idx) => (
                                <label key={idx} className="quiz-page-option">
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion}`}
                                        value={option}
                                        checked={answers[currentQuestion] === option}
                                        onChange={() => handleAnswerChange(currentQuestion, option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                        
                    <div className="quiz-page-navigation-buttons">
                        <button onClick={handlePrev} disabled={currentQuestion === 0}>
                            <FaArrowLeft /> Previous
                        </button>
                        <button onClick={handleNext} disabled={currentQuestion === quiz.quiz.length - 1}>
                            Next <FaArrowRight />
                        </button>
                    </div>
                        
                    <button
                        className="quiz-page-submit-button"
                        disabled={Object.keys(answers).length !== quiz.quiz.length}
                        onClick={handleSubmit}
                    >
                        Submit Quiz
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
