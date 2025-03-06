import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../../../css/mainPage/top100Section.module.css';
import { PlayerContext } from '../../../context/PlayerContext';
const Top100Section = () => {
  const navigate = useNavigate();
  const [monthlyCharts, setMonthlyCharts] = useState([]);


  const displayItems = monthlyCharts.slice(0, 15);

  useEffect(() => {
    axios.get('/api/music/getMusicChart')
      .then((result) => {
        console.log(result.data);
        setMonthlyCharts(result.data.Top100Month);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const {setAddPlaylist,setAddAndPlay}=useContext(PlayerContext);
  //재생목록에 추가후 즉시재생 
  //musicId 또는 musicId 배열
  const handlePlay = (musicId) => {
    const musicArray = Array.isArray(musicId) 
  ? musicId.map(num => ({ musicId: num })) 
  : [{ musicId: musicId }];
    setAddAndPlay(musicArray);
  };
  //재생목록에 추가만
  const handlePlay2 = (musicId) => {
    const musicArray = Array.isArray(musicId) 
  ? musicId.map(num => ({ musicId: num })) 
  : [{ musicId: musicId }];
    setAddPlaylist(musicArray);
  };



  return (
    <div className={styles.top100Section}>
      <div className={styles.top100Header}>
        <h2 className={styles.top100Title}>오늘 Top 100</h2>
        <Link to="/top100">
          <button className={styles.moreButtonTop100}>전체보기</button>
        </Link>
      </div>

      <div className={styles.top100Grid}>
        {displayItems.map((item, index) => (
          <div key={item.music.musicId} className={styles.top100Card}>
            <div className={styles.rowLayout}>

              <img
                src={item.music.image}
                // alt={item.music.title}
                className={styles.top100Image}
                onClick={() => handlePlay(item.music.musicId)}
              />  <div className={styles.playIcon} >▶</div>
              <p className={styles.top100Rank}>{index + 1}</p>
              <div className={styles.titleArea}>
                <p
                  className={styles.top100SongTitle}
                  onClick={() => navigate(`/music/${item.music.musicId}`)}
                >
                  {item.music.title}
                </p>
                <p 
                  className={styles.top100Artist} style={{cursor: 'pointer'}}
                  onClick={()=> navigate(`/artist/${item.music.artistId}`)}  
                >{item.music.artistName}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top100Section;
