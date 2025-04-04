import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { PieChart, Pie, Cell, Legend } from "recharts";
import "./ResultPage.css";

const COLORS = ["#00C49F", "#FF4F42"];

const ResultPage = ({email}) => {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const mail = location.state?.email || ""; 

  useEffect(() => {
    checkTokenExpiry();
    console.log("email: ", mail);
    if(mail){
        axios
  .post(`http://localhost:5000/get_quiz_score`, 
    { email: mail }, 
    getAuthHeaders()
  )
  .then((response) => setResult(response.data))
  .catch((error) => {
    if (error.response && error.response.status === 401) {
      handleLogout();
    } else {
      console.error("Error fetching quiz score:", error);
    }
  });
    } else {
      console.log("Nothing to show");
    }
  }, []);

  const checkTokenExpiry = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        handleLogout();
      }
    } else {
      navigate("/login");
    }
  };

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//   const fetchResult = () => {
//     axios
//       .get(`http://localhost:5000/api/result/${quizCode}`, getAuthHeaders())
//       .then((response) => setResult(response.data))
//       .catch((error) => {
//         if (error.response && error.response.status === 401) {
//           handleLogout();
//         }
//       });
//   };

  const handleLogout = () => {
    alert("Session expired. Please log in again.");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!result) return <p>Loading...</p>;

  const data = [
    { name: "Correct", value: result.score },
    { name: "Incorrect", value: result.total - result.score },
  ];

  return (
    <div className="result-container">
      <h1 className="result-title">Quiz Result</h1>
      <div className="score-summary">
        <PieChart width={400} height={400} className="pie-chart">
          <Pie
            data={data}
            cx={200}
            cy={200}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
        <p>
          You scored <strong>{result.score}</strong> out of <strong>{result.total}</strong>.
        </p>
      </div>
      <button 
        className="home-btn" 
        onClick={() => navigate('/home')}
      >
        🏠
      </button>
    </div>
  );
};

export default ResultPage;
