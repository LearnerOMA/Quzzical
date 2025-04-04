import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTrash, FaPlus, FaArrowUp, FaArrowDown } from "react-icons/fa";
import axios from "axios";
import "./QuizEditor.css";
import { toast } from "react-toastify";
import { Modal, Button, Select, MenuItem, FormControl, InputLabel, OutlinedInput, Chip, Box } from "@mui/material";
import axiosInstance from "../services/axiosInstance";
import { TextField} from '@mui/material';
// const [quizTitle, setQuizTitle] = useState("");

const QuizEditor = ({prop_quiz}) => {
  const [formUrl, setFormUrl] = useState("");
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const stepsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userMail = JSON.parse(localStorage.getItem("user")).email;
  
  // Initialize with data from previous page or default template
  //const quizTitle = location.state?.title || "";
  const initialData = location.state?.quiz || [
    {
      // id: Date.now(),
      question: "",
      options: ["", "", "", ""],
      answer: "",
      score: 1,
      selected: false
    }
  ];
  const [quiz, setQuiz] = useState([initialData || prop_quiz]);

  const [questions, setQuestions] = useState(prop_quiz);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedQuestionsToSend, setSelectedQuestionsToSend] = useState([]);
  const [quizTitle, setQuizTitle] = useState(location.state?.title || "");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [quizCode, setQuizCode] = useState("JKHQR8");
  const [emailList, setEmailList] = useState([]);        
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [selectedEmails, setSelectedEmails] = useState([]); 
  const token = localStorage.getItem("token");

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

  useEffect(() => {
    // Fetch emails from MongoDB
    const fetchEmails = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:5000/getUserEmails`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log("Emails:", response.data.emails);
        setEmailList(response.data.emails || []);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };
    fetchEmails();
  }, []);

  const handleShareClick = () => {
    setIsModalOpen(true);
    console.log("emailList",emailList);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEmailChange = (event) => {
    setSelectedEmails(event.target.value || []);
  };


useEffect(() => {
  const filteredQuestions = questions
    .filter(q => q.selected) // Only include selected questions
    .map(({ score, selected, ...rest }) => rest); // Remove `score` and `selected`
  console.log("filteredQuestions",filteredQuestions)
  console.log("krofhseruoghlerug : ",prop_quiz)
  setSelectedQuestionsToSend(filteredQuestions);
  console.log("selectedQuestionsToSend",selectedQuestionsToSend)
}, [questions]);

  // Handle select all functionality
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    const updatedQuestions = questions.map(question => ({
      ...question,
      selected: newSelectAll
    }));
    setQuestions(updatedQuestions);
  };

  // Update selectAll state when individual questions are selected/deselected
  useEffect(() => {
    console.log("genarted quiz for quiz editior ",initialData)
    const allSelected = questions.every(q => q.selected);
    setSelectAll(allSelected);
  }, [questions]);

  useEffect(() => {
    console.log("new genarted quiz for quiz editior ",questions)

  }, [questions]);

  const handleSendEmails = async () => {
    if (selectedEmails.length === 0) {
      toast.error("Please select at least one email.");
      return;
    }
    
    try {
      await axiosInstance.post("/send-mails", {  // Ensure this matches the backend
        emails: selectedEmails,
        custom_text: "Here is your quiz link: FORM_URL_HERE " + formUrl + " and quiz code: " + quizCode,

      },  {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      toast.success("Emails sent successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error("Failed to send emails.");
    }
  };
  
  // Handle movement of questions
  const moveQuestionUp = (index) => {
    if (index > 0) {
      const newQuestions = [...questions];
      [newQuestions[index - 1], newQuestions[index]] = [newQuestions[index], newQuestions[index - 1]];
      setQuestions(newQuestions);
    }
  };

  const moveQuestionDown = (index) => {
    if (index < questions.length - 1) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
      setQuestions(newQuestions);
    }
  };

  // Handle question changes
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  // Handle option changes
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Handle answer changes
  const handleAnswerChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].answer = value;
    setQuestions(updatedQuestions);
  };

  // Handle score changes
  const handleScoreChange = (index, value) => {
    const updatedQuestions = [...questions];
    const numValue = Number(value) || 1;
    updatedQuestions[index].score = Math.max(1, numValue); // Ensure minimum score of 1
    setQuestions(updatedQuestions);
  };

  // Handle checkbox changes
  const handleCheckboxChange = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].selected = !updatedQuestions[index].selected;
    setQuestions(updatedQuestions);
  };

  // Handle question deletion
  const handleDeleteQuestion = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (confirmDelete) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  // Add new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        //id: Date.now(),
        question: "",
        options: ["", "", "", ""],
        answer: "",
        score: 1,
        selected: false
      }
    ]);
  };

  // Validate quiz before saving
  const validateQuiz = () => {
    const selectedQuestions = questions.filter(q => q.selected);
    
    if (selectedQuestions.length === 0) {
      setError("Please select at least one question to save.");
      stepsRef.current?.scrollIntoView({ behavior: 'smooth' });
      return false;
    }

    for (const q of selectedQuestions) {
      if (!q.question.trim()) {
        setError("Each selected question must have content.");
        return false;
      }

      if (q.options.some(option => !option.trim())) {
        setError("All options in selected questions must be filled.");
        return false;
      }

      if (!q.answer.trim()) {
        setError("Each selected question must have an answer.");
        return false;
      }

      if (!q.options.includes(q.answer)) {
        setError("The answer must match one of the options for each selected question.");
        return false;
      }
    }

    setError("");
    return true;
  };
  const saveQuiz = async () => {
    if (!validateQuiz()) {
        return;
    }
    // console.log("Clicked start quiz ////")
    try {

      setIsSaving(true);
        // Ensure generateGoogleForm is completed before proceeding
        const response = await axiosInstance.post('/generateGoogleForm', { formData: selectedQuestionsToSend });
        
        console.log('Google Form URL:', response.data.formUrl);
        console.log('Google Spreadsheet URL:', response.data.spreadsheetUrl);

        // Set state AFTER receiving data
        setFormUrl(response.data.formUrl);
        setSpreadsheetUrl(response.data.spreadsheetUrl);

        // Now, call handleSaveQuiz with updated URLs
        await handleSaveQuiz(response.data.formUrl, response.data.spreadsheetUrl);
        setIsSaving(false);
        toast.success("Quiz saved successfully!");
    } catch (error) {
        console.error('Error generating Google Form:', error);
        toast.error("Failed to generate Google Form.");
    }
};

const handleSaveQuiz = async (generatedFormUrl, generatedSpreadsheetUrl) => {
    console.log('quiz:', questions);
    console.log('formUrl:', generatedFormUrl);
    console.log('spreadsheetUrl:', generatedSpreadsheetUrl);
    console.log('quizTitle:', quizTitle);

    const startDateTime = new Date(`${startDate}T${startTime}:00Z`).toISOString();
    const endDateTime = new Date(`${startDate}T${endTime}:00Z`).toISOString();

    try {
        const response = await axiosInstance.post('/saveQuiz', {
            email: userMail,
            quizTitle,
            quiz : selectedQuestionsToSend,
            formUrl: generatedFormUrl,  // Use the updated values
            spreadsheetUrl: generatedSpreadsheetUrl,
            startDate,
            startDateTime,
            endDateTime
        });
        console.log("Gettign link link lik link linnk link link link",response.data['quiz_code'])
        setQuizCode(response.data['quiz_code'])
        console.log('Quiz saved successfully:', response.data);
        toast.success(response.data.message);
    } catch (error) {
        if (error.response && error.response.status === 409) {
            toast.info("Quiz already saved!");
        } else {
            console.error('Error saving quiz:', error);
            toast.error("Failed to save quiz. Please try again.");
        }
    }
};

  // Save quiz
  // const saveQuiz = async () => {
  //   if (!validateQuiz()) {
  //     return;
  //   }
  //   await gerateGoogleForm();
  //   // Save quiz to backend
  //   await handleSaveQuiz();
  //   //navigate(-1, { state: { quiz: questions } });
  //   toast.success("Quiz saved successfully!");
  //   // setIsSaving(true);
  //   // const finalQuiz = questions
  //   //   .filter((q) => q.selected)
  //   //   .map((q, index) => ({
  //   //     ...q,
  //   //     questionNumber: index + 1
  //   //   }));

  //   // try {
  //   //   const response = await axios.post("http://localhost:5000/save_quiz", {
  //   //     quiz: finalQuiz,
  //   //     metadata: {
  //   //       timestamp: new Date().toISOString(),
  //   //       totalQuestions: finalQuiz.length,
  //   //       totalScore: finalQuiz.reduce((sum, q) => sum + q.score, 0)
  //   //     }
  //   //   });
      
  //   //   setMessage("Quiz saved successfully!");
      
  //   //   // Navigate after successful save
  //   //   setTimeout(() => {
  //   //     navigate("/quiz-list", { 
  //   //       state: { message: "Quiz saved successfully!" }
  //   //     });
  //   //   }, 1500);
  //   // } catch (error) {
  //   //   console.error("Error saving quiz:", error);
  //   //   setError(error.response?.data?.message || "Failed to save quiz. Please try again.");
  //   // } finally {
  //   //   setIsSaving(false);
  //   // }
  // };

  return (
    <div className="container" ref={stepsRef}>
      {/* <h2 className="title">Edit Quiz</h2> */}
      
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      
      <TextField
        label="Enter Quiz Title"
        variant="outlined"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
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
      />

      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="Start Time"
          type="time"
          InputLabelProps={{ shrink: true }}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <TextField
          label="End Time"
          type="time"
          InputLabelProps={{ shrink: true }}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>


      <div className="select-all-container">
        <label className="select-all-label">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="select-all-checkbox"
          />
          Select All Questions
        </label>
        <span className="selected-count">
          {questions.filter(q => q.selected).length} of {questions.length} selected
        </span>
      </div>
      
      {questions.map((q, qIndex) => (
        <div key={q.id} className="question-box">
          <div className="question-header">
            <input
              type="checkbox"
              checked={q.selected}
              onChange={() => handleCheckboxChange(qIndex)}
              className="question-checkbox"
            />
            <div className="question-controls">
              <FaArrowUp 
                className={`move-icon ${qIndex === 0 ? 'disabled' : ''}`}
                onClick={() => moveQuestionUp(qIndex)}
                title="Move question up"
              />
              <FaArrowDown 
                className={`move-icon ${qIndex === questions.length - 1 ? 'disabled' : ''}`}
                onClick={() => moveQuestionDown(qIndex)}
                title="Move question down"
              />
              <FaTrash
                className={`delete-icon ${q.selected ? "delete-active" : "delete-inactive"}`}
                onClick={() => q.selected && handleDeleteQuestion(qIndex)}
                title="Delete question"
              />
            </div>
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="question-input"
              placeholder="Enter question text"
            />
            <span className="score-label">Score:</span>
            <input
              type="number"
              value={q.score}
              onChange={(e) => handleScoreChange(qIndex, e.target.value)}
              className="score-input"
              min="1"
              title="Question score"
            />
          </div>
          
          <div className="options-container">
            {q.options.map((option, oIndex) => (
              <input
                key={oIndex}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                className="option-input"
                placeholder={`Option ${oIndex + 1}`}
              />
            ))}
          </div>
          
          <div className="answer-container">
            <label className="answer-label">Answer:</label>
            <input
              type="text"
              value={q.answer}
              onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
              className="answer-input"
              placeholder="Enter the correct answer"
            />
          </div>
        </div>
      ))}
      
      <div className="button-container">
        <button 
          onClick={() => navigate("/generate-quiz")} 
          className="back-btn"
          title="Go back to quiz generation"
        >
          Back
        </button>
        <button 
          onClick={addQuestion} 
          className="add-btn"
          title="Add new question"
        >
          <FaPlus /> Add Question
        </button>
        <button 
          onClick={saveQuiz} 
          className="save-btn"
          disabled={isSaving}
          title="Save quiz"
        >
          {isSaving ? "Saving..." : "Save Quiz"}
        </button>

        <Button variant="contained" color="primary" onClick={handleShareClick} disabled={isSaving}>
        Share Quiz
      </Button>

      {/* Small, Centered Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal} aria-labelledby="email-modal">
        <Box 
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <h3>Select Emails to Share</h3>
          <FormControl fullWidth>
            <InputLabel>Select Emails</InputLabel>
            <Select
              multiple
              value={selectedEmails}
              onChange={handleEmailChange}
              input={<OutlinedInput label="Select Emails" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((email) => (
                    <Chip key={email} label={email} />
                  ))}
                </Box>
              )}
            >
              {emailList.map((email) => (
                <MenuItem key={email} value={email}>
                  {email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <Button variant="contained" color="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSendEmails}>
              Send
            </Button>
          </div>
        </Box>
      </Modal>
      </div>
    </div>
  );
};

export default QuizEditor;