import React, { useState, useEffect } from 'react';
import { LayoutGrid, Clock, FileText, Settings, LogOut, Brain, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import PersonalizeGenerate from './PersonalizeGenerate';

const FeatureCard = ({ icon: Icon, title }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleGenerateClick = () => {
    navigate('/generate-quiz');
  };

  const handleJoinClick = () => {
    navigate('/join-quiz');
  };

  return (
    <div
      onClick={title === 'Generate A Quiz' ? handleGenerateClick : handleJoinClick}
      className={`bg-[#CCC2DC] p-8 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer border-2 border-image-1 border-[#FFC6E1] transition-all duration-300 mt-40 align-center ${
        isHovered ? 'transform scale-105 shadow-xl bg-[#F2E6F3] -translate-y-2' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`mb-6 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
        <Icon className="w-16 h-16 text-[#AD73B7]" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-[#494059]">{title}</h2>
      <p className={`text-[#494059] transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
        {title === 'Generate A Quiz' ? '=====' : '==='}
      </p>
    </div>
  );
};

const MenuOption = ({ icon: Icon, label, count, onClick }) => (
  <div
    className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-[#E2CCE1]"
    onClick={onClick}
  >
    <Icon size={20} className="text-[#494059]" />
    <span className="text-[#494059]">{label}</span>
    {count && (
      <span
        className="ml-4 bg-[#AD73B7] text-white text-xs flex items-center justify-center w-8 h-8 rounded-full"
        style={{
          padding: '0.5rem',
          textAlign: 'center',
          lineHeight: '1.5rem',
        }}
      >
        {count}
      </span>
    )}
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [quizCount, setQuizCount] = useState(0);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const [personalize, setPersonalize] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));
  const API_BASE_URL = "http://localhost:5000";

  // Fetch quiz count
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/get-quiz-count`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched data:', data);
        if (data.quiz_count !== undefined) {
          setQuizCount(data.quiz_count);
        }
      })
      .catch((error) => console.error('Error fetching quiz count:', error));
  }, []);

  // Monitor user authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName || 'User',
          email: currentUser.email,
        });
      }  else {
        try {
          console.log(token);
          console.log("All the data: ", userData);
          // Fetch user details from MongoDB if not authenticated via Firebase
          const response = await fetch(`http://localhost:5000/get-user`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`,},
            credentials: "include", // Ensure cookies are sent
          });
          const data = await response.json();
          console.log("all fetched user data: ", data);

          if (data && data.email) {
            setUser({
              displayName: data.name || "User",
              email: data.email,
            });
            console.log("My name: ", data.name);
            console.log("My email: ", data.email);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          setUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Navigation Handlers
  const handleHomeClick = () => navigate('/home');
  const handleCreateQuizClick = () => navigate('/generate-quiz');
  const handleMyQuizClick = () => navigate('/history-mode');
  const handleSettingsClick = () => navigate('/settings');

  const handleLogOut = () => {
    const auth = getAuth();
    auth.signOut();
    localStorage.removeItem("token");
    navigate('/login');
  };

  const handleAboutUsClick = () => navigate('/about-us');

  return (
    <div className="min-h-screen bg-[#F8F5F7]">
      <nav className="bg-[#65558F] text-white p-4 flex justify-between items-center relative">
        <div className="flex items-center space-x-2">
          <span className="text-xl">▼</span>
          <span className="font-bold text-xl">QUIZZICAL</span>
        </div>

        <div className="flex space-x-6 relative">
          <div
            className={`font-bold hover:text-[#21005d] transition-colors duration-200 cursor-pointer ${activeTab === 'home' ? 'text-white' : ''}`}
            onClick={handleHomeClick}
          >
            Home
          </div>
          <div
            className={`font-bold hover:text-[#21005d] transition-colors duration-200 cursor-pointer ${activeTab === 'create-quiz' ? 'text-[#9F8AD1]' : ''}`}
            onClick={handleCreateQuizClick}
          >
            Create Quiz
          </div>
          <div
            className={`font-bold hover:text-[#21005d] transition-colors duration-200 cursor-pointer ${activeTab === 'my-quiz' ? 'text-[#9F8AD1]' : ''}`}
            onClick={handleMyQuizClick}
          >
            My Quizz
          </div>
          <div
            className={`font-bold hover:text-[#21005d] transition-colors duration-200 cursor-pointer ${activeTab === 'about-us' ? 'text-[#9F8AD1]' : ''}`}
            onClick={handleAboutUsClick}
          >
            About Us
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm">Personalize Mode</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={personalize} onChange={() => setPersonalize(!personalize)}/>
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <div className="w-8 h-8 bg-[#9F8AD1] rounded-full" />
      </nav>

      <div className="flex">
        <aside className="w-64 min-h-screen bg-[#CCC2DC] p-4">
          <div className="mb-8">
            <p className="text-[#494059] font-bold mb-4">Menu</p>
            <div className="space-y-2 text-[#494059] font-bold">
              <MenuOption icon={LayoutGrid} label="HOME" onClick={handleHomeClick} />
              <MenuOption icon={Clock} label="CREATE QUIZZ" onClick={handleCreateQuizClick} />
              <MenuOption icon={FileText} label="MY QUIZZ" count={quizCount} onClick={handleMyQuizClick} />
              <MenuOption icon={Settings} label="Settings" onClick={handleSettingsClick} />
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-[#494059] font-bold mb-4">Profile</p>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#FFD700] rounded-full" />
              <div>
                <p className="font-medium text-[#494059]">{user?.displayName || 'User'}</p>
                <p className="text-sm text-[#494059]">{user?.email || 'example@example.com'}</p>
              </div>
            </div>
            <button
              className="w-full flex items-center justify-center space-x-2 bg-white p-2 rounded-md text-[#494059] hover:bg-[#F2E6F3]"
              onClick={handleLogOut}
            >
              <LogOut size={20} />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {personalize ? (
            <PersonalizeGenerate />
          ) : (
            <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
              <FeatureCard icon={Brain} title="Generate A Quiz" />
              <FeatureCard icon={Users} title="Join a Quiz" />
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
}
