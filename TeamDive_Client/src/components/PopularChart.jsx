// src/components/PopularChartsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import styles from '../css/popularChart.module.css';

const PopularChartsPage = () => {
  const navigate = useNavigate();

  // 각 인기 차트 카테고리의 데이터를 저장하는 상태들
  const [weeklyCharts, setWeeklyCharts] = useState([]);
  const [monthlyCharts, setMonthlyCharts] = useState([]);
  const [domesticCharts, setDomesticCharts] = useState([]);
  const [foreignCharts, setForeignCharts] = useState([]);

  useEffect(() => {
    axios.get('/api/music/getMusicChart')
    .then((result)=>{
      console.log(result.data);
      setMonthlyCharts(result.data.Top100Month);
      setWeeklyCharts(result.data.Top100Week);
      setDomesticCharts(result.data.Top100MonthKor);
      setForeignCharts(result.data.Top100MonthnoKor);
    }).catch((err)=>{ console.error(err);})
  }, []);

  const navigateToCategory = (category) => {
    navigate(`/charts/${category}`);
  };

  const renderCards = (items) => {
      const displayItems = items.slice(0, 5);

      return (
          <div className={styles.chartGrid}>
          {displayItems.map((item, index) => (
              <div
              key={item.music.musicId}
              className={styles.card}
              style={{ backgroundImage: `url(${item.music.image})` }}
              onClick={() => navigate(`/music/${item.music.musicId}`)}
              >
              
              <div className={styles.rank}>{index + 1}</div>
              
              <div className={styles.overlay}>
                  <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.music.title}</h3>
                  <p className={styles.cardArtist}>{item.music.artistName}</p>
                  <p className={styles.cardPlayCount}>{item.totalPlayCount}회</p>
                  </div>
              </div>
              </div>
          ))}
          </div>
      );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>인기 차트</h1>
      
      {/* 주간 인기 차트 */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>주간 인기 차트</h2>
          {weeklyCharts.length > 5 && (
            <button className={styles.moreButton} onClick={() => navigateToCategory('weekly')}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </button>
          )}
        </div>
        {renderCards(weeklyCharts, 'song')}
      </section>
      
      {/* 월간 인기 차트 */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>월간 인기 차트</h2>
          {monthlyCharts.length > 5 && (
            <button className={styles.moreButton} onClick={() => navigateToCategory('monthly')}>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
            </button>
          )}
        </div>
        {renderCards(monthlyCharts, 'song')}
      </section>
      
      {/* 국내 인기 차트 */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>국내 인기 차트</h2>
          {domesticCharts.length > 5 && (
            <button className={styles.moreButton} onClick={() => navigateToCategory('domestic')}>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
            </button>
          )}
        </div>
        {renderCards(domesticCharts, 'song')}
      </section>
      
      {/* 해외 인기 차트 */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>해외 인기 차트</h2>
          {foreignCharts.length > 5 && (
            <button className={styles.moreButton} onClick={() => navigateToCategory('foreign')}>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
            </button>
          )}
        </div>
        {renderCards(foreignCharts, 'song')}
      </section>
    </div>
  );
};

export default PopularChartsPage;
