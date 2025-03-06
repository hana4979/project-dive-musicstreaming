import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import styles from '../../../css/mainPage/likeRankingSection.module.css';
import axios from 'axios';

const LikeRankingSection = () => {
  const [activeTab, setActiveTab] = useState('artist');


  const [artistRanking, setArtistRanking] = useState([]);
  const [albumRanking, setAlbumRanking] = useState([]);
  const [musicRanking, setMusicRanking] = useState([]);

  useEffect(() => {

   

    axios.get('/api/music/getTop3')
    .then((result)=>{
      console.log(result.data);
      setArtistRanking(result.data.artist);
      setAlbumRanking(result.data.album);
      setMusicRanking(result.data.music);
    }).catch((err)=>{console.error(err)})    


  
  }, []);

  const getActiveData = () => {
    switch (activeTab) {
      case 'artist': return artistRanking;
      case 'album': return albumRanking;
      case 'music': return musicRanking;
      default: return [];
    }
  };


  const handleItemClick = (item) => {
    if (activeTab === 'artist') {
      window.location.href = `/artist/${item.artistId}`;
    } else if (activeTab === 'album') {
      window.location.href = `/album/${item.albumId}`;
    } else if (activeTab === 'music') {
      window.location.href = `/music/${item.musicId}`;
    }
  };

  return (
    <div className={styles.likeRankingSection}>
      <h2 className={styles.sectionTitle}>Top 3</h2>

      {/* 탭 버튼 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'artist' ? styles.active : ''}`}
          onClick={() => setActiveTab('artist')}
        >
          아티스트
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'album' ? styles.active : ''}`}
          onClick={() => setActiveTab('album')}
        >
          앨범
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'music' ? styles.active : ''}`}
          onClick={() => setActiveTab('music')}
        >
          노래
        </button>
      </div>

      {/* 탭 내용 */}
      <div className={styles.rankList}>
        {getActiveData().map((item, index) => (
          <div
            key={index}
            className={styles.rankItem}
            onClick={() => handleItemClick(item)}
          >
            <span className={styles.rank}>{index + 1}위</span>
            <img
              src={item.image}
              className={styles.rankImage}
            />
            <div className={styles.infoArea}>
          
              {activeTab === 'music' ? (
                <p className={styles.title}>
                  {item.title} 
                  <span className={styles.artistRight}> - {item.artistName}</span>
                </p>
              ) : (
            
                <p className={styles.title}>{ item.title || item.artistName }</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikeRankingSection;
