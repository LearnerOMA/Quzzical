import React, { useRef } from 'react';
import { Upload, Pen, FileText, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
// Import the image
import educationalImage from '../images/Image_2.png'; 
import QuizImage from '../images/Image_1.jpg';

const steps = [
  {
    title: "1. Upload Your File",
    description: "Start by uploading the PDF file you want to convert into a quiz.",
    icon: Upload,
  },
  {
    title: "2. Generate your Quiz",
    description: "Our advanced AI analyzes your PDF content to create topic-specific questions.",
    icon: Pen,
  },
  {
    title: "3. Quiz Ready to Take!",
    description: "Your interactive quiz is now ready to take or export.",
    icon: FileText,
  },
];

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>QUIZZCAL</h3>
          <p>Transform your educational content into engaging quizzes with our AI-powered platform. Perfect for educators, trainers, and students.</p>
          <div className="social-links">
            <Facebook className="social-icon" size={20} />
            <Twitter className="social-icon" size={20} />
            <Instagram className="social-icon" size={20} />
            <Linkedin className="social-icon" size={20} />
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#" onClick={() => navigate('/')}>Home</a></li>
            <li><a href="#" onClick={() => navigate('/login')}>Create Quiz</a></li>
            <li><a href="#" onClick={() => navigate('/login')}>My Quizzes</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Features</h3>
          <ul className="footer-links">
            <li><a href="#">AI Quiz Generation</a></li>
            <li><a href="#">Custom Templates</a></li>
            <li><a href="#">Analytics Dashboard</a></li>
            <li><a href="#">Multiple Formats</a></li>
            <li><a href="#">Smart Assessment</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="footer-links">
            <li>
              <Mail size={16} style={{ marginRight: '8px' }} />
              <a href="mailto:support@quizzcal.com">support@quizzcal.com</a>
            </li>
            <li>
              <Phone size={16} style={{ marginRight: '8px' }} />
              <a href="tel:+1234567890">+1 (234) 567-890</a>
            </li>
            <li>
              <MapPin size={16} style={{ marginRight: '8px' }} />
              <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                123 Education Street,
                Learning City, ED 12345
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} QUIZZCAL. All rights reserved.</p>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const stepsRef = useRef(null);

  const scrollToSteps = () => {
    stepsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-container">
      <nav className="nav-bar">
        <div className="nav-content">
          <div className="logo">
            <span>QUIZZCAL</span>
          </div>
          <div className="nav-links">
            <a href="#" className="nav-link" onClick={() => navigate('/login')}>Home</a>
            <a href="#" className="nav-link" onClick={() => navigate('/login')}>My Quizz</a>
            <a href="#" className="nav-link" onClick={scrollToSteps}>About Us</a>
            <button className="create-btn glass-effect" onClick={() => navigate('/login')}>
              Create Quiz
            </button>
            <button className="auth-btn signup glass-effect" onClick={() => navigate('/SignUp')}>Sign Up</button>
            <button className="auth-btn login glass-effect" onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title animate-text">
            Transform Your <span className="highlight">PDF</span> into
            <br />
            <span className="highlight">Smart</span>, Adaptive Quizzes
          </h1>
          <p className="hero-subtitle">
            Upload your PDF and let our AI create engaging quizzes instantly.
            Perfect for teachers, trainers, and educators.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn glass-effect" onClick={() => navigate('/login')}>
              Create Now! <Upload className="btn-icon" />
            </button>
            {/* Updated Learn More button with scroll functionality */}
            <button className="secondary-btn glass-effect" onClick={scrollToSteps}>
              Learn More <FileText className="btn-icon" />
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src={QuizImage} alt="Quiz creation illustration" className="floating" />
        </div>
      </section>

      <section ref={stepsRef} className="steps-section">
        <h2 className="section-title">Quick & Smart Quiz Generation</h2>
        <p className="section-subtitle">
          Turn your Documents into interactive quizzes in three simple steps
        </p>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card glass-effect">
              <div className="step-icon">
                <step.icon size={32} />
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              <div className="step-features">
                <ul>
                  <li>AI-Powered Analysis</li>
                  <li>Custom Difficulty Levels</li>
                  <li>Instant Generation</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section">
        <div className="features-content">
          <div className="features-grid-container">
            <div className="features-text">
              <h2 className="section-title">Why Choose Our AI Quiz Maker?</h2>
              <div className="features-grid">
                <div className="feature-card glass-effect">
                  <h3>Time-Saving</h3>
                  <p>Generate quizzes in seconds, not hours</p>
                </div>
                <div className="feature-card glass-effect">
                  <h3>Smart Analytics</h3>
                  <p>Track student progress with detailed insights</p>
                </div>
                <div className="feature-card glass-effect">
                  <h3>Customizable</h3>
                  <p>Adjust difficulty and question types</p>
                </div>
                <div className="feature-card glass-effect">
                  <h3>Easy Export</h3>
                  <p>Download quizzes in multiple formats</p>
                </div>
              </div>
            </div>
            <div className="features-illustration">
              <img 
                src={educationalImage}
                alt="Educational illustration" 
                className="education-illustration"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;