import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Link } from '@mui/material';
import { HiOutlineDocumentText} from "react-icons/hi";
import './History.css';

const History = () => {
    const [historyData, setHistoryData] = useState([]);

    return (
        <div className='history-container'>
            <HiOutlineDocumentText size={40} color='white' style={{ marginTop: '9px' }} />
            <div className='history-title'>My Quizzes</div>
        </div>
    )
}

export default History