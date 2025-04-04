import React, {useState} from 'react';
import { useEffect } from 'react';
import { TextField, MenuItem, FormControl, InputLabel, Select, IconButton } from '@mui/material';
import { MdOutlineSettings } from "react-icons/md";
import { Search } from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuizEditor from './QuizEditor';
import './DocumentUploader.css';

const TextUploader = () => {
  const [textInput, setTextInput] = useState('');
  const [noOfQuestions, setNoOfQuestions] = useState('');
  const [questionType, setQuestionType] = React.useState('');
  const [difficultyLevel, setDifficultyLevel] = React.useState('');
  const [step, setStep] = useState(1); // Step 1: enter prompt and preferences, Step 2: Display quiz
  const [quiz, setQuiz] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [formUrl, setFormUrl] = useState('');
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const token = localStorage.getItem("token");
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage.');
    }

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
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

  const toggleAnswers = () => {
    setShowAnswers((prev) => !prev);
  };

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

  const handleQuizTitleChange = (event) => {
    setQuizTitle(event.target.value);
  };

  useEffect(() => {
    console.log('quizzzzzzzzzzzzz:', quiz);
    if (quiz) {
      axios.post('http://localhost:5000/generateGoogleForm', { formData: quiz })
        .then((response) => {
          console.log('quiz:', quiz);
          console.log('Google Form URL:', response.data.formUrl);
          setFormUrl(response.data.formUrl);
          setSpreadsheetUrl(response.data.spreadsheetUrl);
        })
        .catch((error) => {
          console.error('Error generating Google Form:', error);
        });
    }
  }, [quiz]);

  const handleGenerateQuiz = async () => {
    setGenerating(true);
  
    const payload = {
      noOfQuestions,
      questionType,
      difficultyLevel,
      text: textInput,
    };
  
    console.log("Payload: ", payload);
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/genrateQuizWithTopic', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const generatedQuiz = response.data.quiz.quiz.questions;
      console.log("Quiz generation results:", response.data.quiz.quiz.questions);
  
      if (!isQuizValid(generatedQuiz)) {
        console.error("Generated quiz is invalid:", generatedQuiz);
        return;
      }
  
      setQuiz(generatedQuiz);
      setStep(2);
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveQuiz = () => {
    axios.post('http://localhost:5000/saveQuiz', {
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

  if (step === 2 && quiz) {
        return (
          <QuizEditor prop_quiz={quiz} />
          //   <div className="quiz-display-container">
          //     <h2 className="quiz-title">Generated Quiz</h2>
          //     <TextField
          //         label="Enter Quiz Title"
          //         variant="outlined"
          //         value={quizTitle}
          //         onChange={handleQuizTitleChange}
          //         fullWidth
          //         margin="normal"
          //         InputProps={{
          //             style: { height: '40px', padding: '0 14px' },
          //         }}
          //         sx={{
          //             '& .MuiOutlinedInput-root': {
          //                 height: '80px', 
          //             },
          //         }}
          //     />
          //     <div className='link-show-answer-container'>
          //         <div>
          //         <button
          //             className="save-quiz"
          //             onClick={handleSaveQuiz}
          //             disabled={!quizTitle.trim() || !formUrl} 
          //             style={{
          //                 cursor: !quizTitle.trim() || !formUrl ? 'not-allowed' : 'pointer', 
          //             }}
          //         >
          //             Save Quiz
          //         </button>
          //         <ToastContainer position="top-right" autoClose={3000} />
          //         </div>
          //         {formUrl && (
          //             <a className='form-link' href={formUrl} target='_blank'>Google Form Link</a>
          //         )}
  
          //         <button className="toggle-answers-button" onClick={toggleAnswers}>
          //             {showAnswers ? 'Hide Answers' : 'Show Answers'}
          //         </button>
          //     </div>
              
          //     <div className="quiz-content">
          //         {quiz.map((question, index) => (
          //             <div className="quiz-question" key={index}>
          //                 <h3>{index + 1}. {question.question}</h3>
          //                 <ul className="quiz-options">
          //                     {question.options.map((option, idx) => (
          //                         <li key={idx} className="quiz-option-item">
          //                             <span className="option-label">{String.fromCharCode(97 + idx)}.</span> {option}
          //                         </li>
          //                     ))}
          //                 </ul>
          //                 {showAnswers && (
          //                     <p className="quiz-answer">
          //                         <strong>Answer:</strong> {question.answer}
          //                     </p>
          //                 )}
          //             </div>
          //         ))}
          //     </div>
          // </div>
        );
    }
  
  return (
    <div className="document-uploader-container">
      <div>
        <h3 className="upload-doc-title">Enter quiz topic or paste content to generate using AI</h3>
        <div className="text-input-container">
            <TextField
              id="text-input"
              placeholder="Enter your text. This could be a quiz topic, custom prompt, paste content..."
              multiline
              rows={4}
              value={textInput}
              onChange={handleTextInputChange}
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
            onChange={handleNoOfQuestionsChange}
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

          <FormControl variant='outlined' margin="normal"
           sx={{
              width: '500px', 
              '& .MuiInputBase-root': {
                height: '40px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.9rem', 
              },
            }}>
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

          <FormControl variant='outlined' margin="normal"
           sx={{
              width: '500px', 
              '& .MuiInputBase-root': {
                height: '40px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.9rem', 
              },
            }}>
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
  )
}

export default TextUploader