// src/components/NoticeBoard.jsx
import React, {useState, useEffect} from 'react';
import styles from '../../../css/mainPage/noticeBoard.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NoticeBoard = () => {

    const navigate = useNavigate();
    const [noticeList, setNoticeList] = useState([]);

    useEffect(()=>{
        axios.get('/api/community/getNoticeList')
        .then((result)=>{
            setNoticeList(result.data.noticeList);
        })
        .catch((err)=>{
            console.error(err);
        })
    },[]);

    return (
        <div className={styles.noticeBoard}>
            {noticeList.map(notice => (
                <div key={notice.noticeId} className={styles.noticeItem}
                    onClick={()=>{navigate(`/notice/${notice.noticeId}`)}}
                >
                    <h3>{notice.title}</h3>
                    <p>{notice.content}</p>
                    <small>{notice.indate.substring(0,10)}</small>
                    
                </div>
            ))}
        </div>
    );
};

export default NoticeBoard;
