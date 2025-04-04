import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineCloudUpload, AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { MdOutlineSettings } from "react-icons/md";
import './DocumentUploader.css';

const Document = () => {
    const [file, setFile] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);    
    const [step, setStep] = useState(1); // Step 1: Upload, Step 2: Preferences
    const [noOfQuestions, setNoOfQuestions] = useState('');
    const [questionType, setQuestionType] = React.useState('');
    const [difficultyLevel, setDifficultyLevel] = React.useState('');

    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };  

    const handleFileDrop = (event) => {
        event.preventDefault();
        const uploadedFiles = Array.from(event.dataTransfer.files);
        setFiles([...files, ...uploadedFiles]);
        console.log("my files::", files);
    };  

    // const handleDeleteFile = (index) => {
    //     setFiles(files.filter((_, i) => i !== index));
    // };  

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
    const handleGenerateQuiz = async () => {
      const formData = new FormData();
      formData.append('file', file);    
      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Generated quiz:', response.data.quiz);
        setQuiz(response.data.quiz);
      } catch (error) {
        console.error('Error generating quiz:', error);
      }
    };

    const handleProcessFiles = () => {
        setUploading(true);
        let progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setUploading(false);
                    setStep(2);
                    alert('Files processed successfully!');
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };
    
    return (
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleGenerateQuiz}>Generate Quiz</button>
        {quiz && (
          <div>
            <h2>Generated Quiz</h2>
            <ul>
              {quiz.map((q, index) => (
                <li key={index}>
                  <strong>Question:</strong> {q.question}
                  <br />
                  <strong>Answer:</strong> {q.answer}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
};

export default Document;