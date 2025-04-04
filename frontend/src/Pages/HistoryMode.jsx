import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users } from 'lucide-react';

const Card = ({ title, icon: Icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-[#CCC2DC] p-12 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer border-2 border-[#FFC6E1] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#F2E6F3] w-80 h-80"
  >
    <Icon className="w-20 h-20 text-[#AD73B7] mb-6" />
    <h2 className="text-3xl font-bold text-[#494059]">{title}</h2>
  </div>
);

export default function HistoryMode() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8F5F7]">
      <div className="flex space-x-12">
        <Card title="Created Quiz" icon={FileText} onClick={() => navigate('/history')} />
        <Card title="Joined Quiz" icon={Users} onClick={() => navigate('/history-joined')} />
      </div>
    </div>
  );
}
