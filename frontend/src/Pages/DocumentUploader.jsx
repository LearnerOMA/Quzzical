import React, { useState, useEffect } from 'react';
import { AiOutlineCloudUpload, AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { MdOutlineSettings } from "react-icons/md";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DocumentUploader.css';
import axiosInstance from '../services/axiosInstance'; 
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import QuizEditor from './QuizEditor';
import { Title } from '@mui/icons-material';

const DocumentUploader = () => {
    const [files, setFiles] = useState([]); // State for multiple files
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(1); // Step 1: Upload, Step 2: Preferences, Step 3: Display quiz
    const [noOfQuestions, setNoOfQuestions] = useState('');
    const [questionType, setQuestionType] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState('');
    const [quiz, setQuiz] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false);
    const [formUrl, setFormUrl] = useState('');
    const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
    const [quizTitle, setQuizTitle] = useState('');
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const location = useLocation();
    // const API_BASE_URL = "http://localhost:5000";
    // if (token) {
    //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // } else {
    //   console.warn('No token found in localStorage.');
    // }
      
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
  
    // useEffect(() => {
    //   console.log('quizzzzzzzzzzzzz:', quiz);
    //   if (quiz) {
    //     axiosInstance.post('/generateGoogleForm', { formData: quiz })
    //       .then((response) => {
    //         console.log('quiz:', quiz);
    //         console.log('Google Form URL:', response.data.formUrl);
    //         setFormUrl(response.data.formUrl);
    //         setSpreadsheetUrl(response.data.spreadsheetUrl);
    //       })
    //       .catch((error) => {
    //         console.error('Error generating Google Form:', error);
    //       });
    //   }
    // }, [quiz]);

    const handleFileDrop = (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    };

    const toggleAnswers = () => {
      setShowAnswers((prev) => !prev);
    };

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    const handleDeleteFile = (fileToDelete) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToDelete));
    };

    const handleUploadClick = () => {
        document.getElementById('file-input').click();
    };

    const handleNoOfQuestionsChange = (event) => {
        setNoOfQuestions(event.target.value);
    };

    const handleQuestionTypeChange = (event) => {
        setQuestionType(event.target.value);
    };

    const handleDifficultyLevelChange = (event) => {
        setDifficultyLevel(event.target.value);
    };

    const handleProcessFiles = () => {
        setUploading(true);
        let progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setUploading(false);
                    setStep(2);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const handleGenerateQuiz = async () => {
      setGenerating(true);
      const formData = new FormData();
      files.forEach((file) => {
          formData.append('files[]', file);
      });
      formData.append('noOfQuestions', noOfQuestions);
      formData.append('questionType', questionType);
      formData.append('difficultyLevel', difficultyLevel);

      try {
          const response = await axiosInstance.post('/upload', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
          const generatedQuiz = response.data.quiz.questions;
          console.log("Quiz generation results:", response.data.quiz.questions);
          if (!isQuizValid(generatedQuiz)) {
            console.error("Generated quiz is invalid:", generatedQuiz);
            return;
          }
          console.log("Validated quiz:", generatedQuiz);
    
          setQuiz(generatedQuiz);
          setStep(3);
      } catch (error) {
          console.error('Error generating quiz:', error);
      } finally {
        setGenerating(false); // Stop loading state
      }
    };

    const handleQuizTitleChange = (event) => {
        setQuizTitle(event.target.value);
    };

    const handleSaveQuiz = () => {
        axiosInstance.post('/saveQuiz', {
            quizTitle,
            quiz,
            formUrl,
            spreadsheetUrl, 
        })
        .then((response) => {
            console.log('Quiz saved successfully:', response.data);
            toast.success(response.data.message); 
        })
        .catch((error) => {
            if (error.response && error.response.status === 409) {
                toast.info("Quiz already saved!"); 
            } else {
                console.error('Error saving quiz:', error);
                toast.error("Failed to save quiz. Please try again."); 
            }
        });
    };    

    const handelEditQuizClick = () => {
        if(quizTitle === '') {
            toast.error("Please enter quiz title to edit the quiz");
            return;
        }
        navigate('/QuizEditor', { state: { quiz : quiz , title : quizTitle } });
    }

    if (step === 3 && quiz) {
        // navigate('/QuizEditor', { state: { quiz } });
        // setQuiz(location.state?.quiz);
        
      return (

          <div className="quiz-display-container">
            <h2 className="quiz-title">Generated Quiz</h2>
            {/* <button onClick={handelEditQuizClick}> Edit Quix </button> */}
            <QuizEditor 
            prop_quiz={quiz} />
            {/* <TextField
                label="Enter Quiz Title"
                variant="outlined"
                value={quizTitle}
                onChange={handleQuizTitleChange}
                fullWidth
                margin="normal"
                InputProps={{
                    style: { height: '40px', padding: '0 14px' },
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        height: '80px', 
                    },
                }}
            /> */}
            {/* <div className='link-show-answer-container'>
                <div>
                <button
                    className="save-quiz"
                    onClick={handleSaveQuiz}
                    disabled={!quizTitle.trim() || !formUrl} 
                    style={{
                        cursor: !quizTitle.trim() || !formUrl ? 'not-allowed' : 'pointer', 
                    }}
                >
                    Save Quiz
                </button>
                <ToastContainer position="top-right" autoClose={3000} />
                </div>
                {formUrl && (
                    <a className='form-link' href={formUrl} target='_blank'>Google Form Link</a>
                )}

                <button className="toggle-answers-button" onClick={toggleAnswers}>
                    {showAnswers ? 'Hide Answers' : 'Show Answers'}
                </button>
            </div> */}
            
            {/* <div className="quiz-content">
                {quiz.map((question, index) => (
                    <div className="quiz-question" key={index}>
                        <h3>{index + 1}. {question.question}</h3>
                        <ul className="quiz-options">
                            {question.options.map((option, idx) => (
                                <li key={idx} className="quiz-option-item">
                                    <span className="option-label">{String.fromCharCode(97 + idx)}.</span> {option}
                                </li>
                            ))}
                        </ul>
                        {showAnswers && (
                            <p className="quiz-answer">
                                <strong>Answer:</strong> {question.answer}
                            </p>
                        )}
                    </div>
                ))}
            </div> */}
        </div>
      );
  }

    if (step === 2) {
        return (
            <div className="document-uploader-container">
                <div>
                    <h3 className="upload-doc-title">Uploaded Files</h3>
                    {files.map((file, index) => (
                        <div className="file-item" key={index}>
                            <span>{file.name}</span>
                            <AiOutlineClose
                                size={20}
                                color="#ff4d4d"
                                onClick={() => handleDeleteFile(file)}
                                className="delete-icon"
                            />
                        </div>
                    ))}
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
                        onChange={handleNoOfQuestionsChange}
                        sx={{
                            width: '500px',
                            '& .MuiInputBase-root': { height: '40px' },
                            '& .MuiInputLabel-root': { fontSize: '0.9rem' },
                        }}
                    />

                    <FormControl
                        variant="outlined"
                        margin="normal"
                        sx={{
                            width: '500px',
                            '& .MuiInputBase-root': { height: '40px' },
                            '& .MuiInputLabel-root': { fontSize: '0.9rem' },
                        }}
                    >
                        <InputLabel id="question-type-label">Pick a Question Type</InputLabel>
                        <Select
                            labelId="question-type-label"
                            id="question-type"
                            value={questionType}
                            onChange={handleQuestionTypeChange}
                            label="Pick a Question Type"
                        >
                            <MenuItem value="mcq">Multiple Choice Questions</MenuItem>
                            <MenuItem value="true-false">True/False</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl
                        variant="outlined"
                        margin="normal"
                        sx={{
                            width: '500px',
                            '& .MuiInputBase-root': { height: '40px' },
                            '& .MuiInputLabel-root': { fontSize: '0.9rem' },
                        }}
                    >
                        <InputLabel id="difficulty-level-label">Level of Difficulty</InputLabel>
                        <Select
                            labelId="difficulty-level-label"
                            id="difficulty-level"
                            value={difficultyLevel}
                            onChange={handleDifficultyLevelChange}
                            label="Level of Difficulty"
                        >
                            <MenuItem value="easy">Easy</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="hard">Hard</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <button className="generate-quiz-button" onClick={handleGenerateQuiz} disabled={generating}>
                  {generating ? "Generating..." : (
                    <>
                        <MdOutlineSettings className='generate-icon' />
                        Generate Quiz
                    </>
                  )}
                </button>
            </div>
        );
    }

    return (
        <div className="document-uploader-container">
            <h3 className="upload-doc-title">Upload Documents</h3>

            <div
                className="upload-box"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
            >
                <AiOutlineCloudUpload size={50} color="#6b46c1" />
                <p>Drag & Drop your files Here</p>
            </div>

            <div className="separator">
                <span>- - - - - - - - - OR - - - - - - - - -</span>
            </div>

            <div className="upload-options">
                <button className="upload-button" onClick={handleUploadClick}>
                    Upload from Device
                </button>
            </div>

            <input
                type="file"
                multiple
                id="file-input"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            <p className="supported-files">
                Supported formats: PDF, PPT, PPTX, DOC, DOCX, PNG, JPG, or Canvas QTI.zip <br />
                File size limit: up to 25 MB, no longer than 30 pages.
            </p>

            {files.map((file, index) => (
                <div className="file-item" key={index}>
                    <span>{file.name}</span>
                    <AiOutlineClose
                        size={20}
                        color="#ff4d4d"
                        onClick={() => handleDeleteFile(file)}
                        className="delete-icon"
                    />
                </div>
            ))}

            {!uploading && (
                <div className={`process-files ${files.length === 0 ? 'disabled' : ''}`}>
                    <AiOutlinePlus 
                        size={30} 
                        color="white" 
                        onClick={handleProcessFiles} 
                        className="plus-icon" 
                        style={{ cursor: files.length === 0 ? 'not-allowed' : 'pointer' }}
                    />
                </div>
            )}


            {uploading && (
                <div className="upload-progress">
                    <p>Processing files...</p>
                    <progress value={progress} max="100" />
                </div>
            )}
        </div>
    );
};

export default DocumentUploader;