// src/components/TodayWhatToListen.jsx
import React from 'react';
import styles from '../../../css/mainPage/todayWhatToListen.module.css';
import { useNavigate } from 'react-router-dom';


const TodayWhatToListen = ({ music }) => {

    const navigate = useNavigate();
  
    if (!music) return null;
    return (
        <div className={styles.todayContainer}
            onClick={()=>{navigate(`/music/${music.musicId}`)}}
        >
            <img src={music.image} alt={music.title} className={styles.albumCover} />
            <div className={styles.songInfo}>
                <h3>{music.title}</h3>
                <p>{music.artist}</p>
            </div>
        </div>
    );
};

export default TodayWhatToListen;
