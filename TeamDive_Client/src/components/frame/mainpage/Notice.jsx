
import React, { useState, useEffect } from 'react';
import styles from '../../../css/mainPage/notice.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function NoticeRotator() {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [noticeList, setNoticeList] = useState([]);

  useEffect(()=>{
      axios.get('/api/community/getNoticeList')
      .then((result)=>{
          setNoticeList(result.data.noticeList || []);
      })
      .catch((err)=>{
          console.log(err);
      })
  },[]);

  
  useEffect(() => {
      const intervalId = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % noticeList.length);
      }, 1500);
      return () => clearInterval(intervalId);
  }, [noticeList]);

  
  const TextCut = (text, maxLength) => {
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
      <div className={styles.noticeContainer}>
          <span className={styles.noticeLabel}>
              <Link to='/notice'>공지사항</Link> 
          </span>
          <span className={styles.noticeText} key={currentIndex}>
              {noticeList.length > 0 
                  ? TextCut(noticeList[currentIndex]?.title || "공지 없음", 13) 
                  : "공지사항이 없습니다."}
          </span>
      </div>
  );
}

export default NoticeRotator;
