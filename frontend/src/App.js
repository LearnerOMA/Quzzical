import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import CreateQuizPage from './Pages/CreateQuizPage';
import GenerateQuiz from './Pages/GenerateQuiz';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import ForgetPass from './Pages/ForgetPass';
import History from './Pages/History';
import LandingPage from './Pages/LandingPage';
import HomePage from './Pages/HomePage';
import JoinQuiz from './Pages/JoinQuiz';
import QuizPage from "./Pages/QuizPage";
import ResultPage from "./Pages/ResultPage";
import QuizEditor from './Pages/QuizEditor';
import PersonalizedQuizAttempt from './Pages/PersonalizedQuizAttempt';
import PersonalizeScore from './Pages/PersonalizeScore';
import HistoryMode from './Pages/HistoryMode'
import HistoryJoined from './Pages/HistoryJoined';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/history' element={<History />} />
        <Route path='/SignUp' element={<SignupPage />} />
        <Route path='/forgot-password' element={<ForgetPass />} />
        <Route path='/CreateQuiz' element={<CreateQuizPage />} />
        <Route path='/generate-quiz' element={<GenerateQuiz />} />
        <Route path='/join-quiz' element={<JoinQuiz />} />
        <Route path="/quiz/:quizCode" element={<QuizPage />} />
        <Route path="/result/:quizCode" element={<ResultPage />} />
        <Route path="/results" element={<PersonalizeScore />} />
        <Route path= "/QuizEditor" element={<QuizEditor />} />
        <Route path="/personalized-quiz" element={<PersonalizedQuizAttempt />} />
        <Route path="/history-mode" element={<HistoryMode />} />
        <Route path="/history-joined" element={<HistoryJoined />} />
      </Routes>
    </Router>
  )
}

export default App
