import React, { useRef } from 'react';
import { Upload, Pen, FileText } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    title: "1. Upload Your File",
    description: "Start by uploading the PDF file you want to convert into a quiz.",
    icon: Upload,
  },
  {
    title: "2. Generate your Quiz",
    description: "Our advanced AI analyzes your PDF content to create topic-specific difficulty-graded questions.",
    icon: Pen,
  },
  {
    title: "3. Quiz Ready to Take!",
    description: "Your interactive quiz is now ready to take or export.",
    icon: FileText,
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  const stepsRef = useRef(null);

  const scrollToSteps = () => {
    stepsRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-[#5D4B8C] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-xl flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4L20 20M20 20V8M20 20H8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            QUIZZCAL
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-white font-bold hover:text-gray-200 cursor-pointer">Home</div>
            <div className="text-white font-bold hover:text-gray-200 cursor-pointer" onClick={() => navigate('/login')}>My Quizz</div>
            <div className="text-white font-bold hover:text-gray-200 cursor-pointer" onClick={scrollToSteps}>About Us</div>
            <button className="bg-[#2D1B69] text-white hover:bg-[#231553] flex items-center gap-2 px-4 py-2 rounded" onClick={() => navigate('/login')}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a.5.5 0 0 1 .5.5V7h5.5a.5.5 0 0 1 0 1H8.5V13a.5.5 0 0 1-1 0V8H1.5a.5.5 0 0 1 0-1H7.5V1.5A.5.5 0 0 1 8 1z"/>
              </svg>
              Create Quiz
            </button>
            <button className="bg-transparent text-white border border-white hover:bg-white/10 px-4 py-2 rounded" onClick={() => navigate('/SignUp')}>
              SignUp
            </button>
            <button className="bg-transparent text-white border border-white hover:bg-white/10 px-4 py-2 rounded" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="text-[#7C5DFA]">Transform Your</span> PDF{" "}
          <span className="text-[#7C5DFA]">into</span>
          <br />
          <span className="text-[#7C5DFA]">Smart,</span> Adaptive Quizzes
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
          Upload your PDF and let our AI create engaging quizzes instantly.
          Perfect for teachers, trainers, and educators.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
          <button className="bg-[#5D4B8C] hover:bg-[#4A3D70] text-white px-8 py-6 text-lg flex items-center gap-2 rounded">
            Create Now! 
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-plus"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a.5.5 0 0 1 .5.5V7h5.5a.5.5 0 0 1 0 1H8.5V13a.5.5 0 0 1-1 0V8H1.5a.5.5 0 0 1 0-1H7.5V1.5A.5.5 0 0 1 8 1z"/>
            </svg>
          </button>
          <button className="border-[#5D4B8C] text-[#5D4B8C] hover:bg-[#5D4B8C] hover:text-white px-8 py-6 text-lg flex items-center gap-2 rounded">
            Learn More 
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-plus"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a.5.5 0 0 1 .5.5V7h5.5a.5.5 0 0 1 0 1H8.5V13a.5.5 0 0 1-1 0V8H1.5a.5.5 0 0 1 0-1H7.5V1.5A.5.5 0 0 1 8 1z"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Steps Section */}
      <section ref={stepsRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Quick & Smart Quiz Generation</h2>
          <p className="text-center text-gray-600 mb-16">
            Turn your PDFs into interactive quizzes in three simple steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-purple-400 to-indigo-500 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-white"
              >
                <div className="text-center">
                  <step.icon className="w-16 h-16 mx-auto mb-4 text-white" />
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-100">{step.description}</p>
                </div>

                {/* Hover Effect Section */}
                <div className="mt-6 hidden hover:block">
                  <h4 className="font-bold mb-2">Why Choose Our AI Quiz Maker?</h4>
                  <ul className="text-gray-100 space-y-2">
                    <li>Instant Quiz Creation</li>
                    <li>Save time with AI that understands your file content and creates relevant and challenging questions instantly.</li>
                    <li>Designed for All Subjects</li>
                    <li>Create quizzes on any topic… grammar, technology, science, and more!</li>
                    <li>Customization at Your Fingertips</li>
                    <li>You can also adjust difficulty levels and what type of questions you wish to have. You can edit the questions in the quiz.</li>
                    <li>Monitor Student Grades</li>
                    <li>Gain insights into quiz performance with detailed grades and feedback options.</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
