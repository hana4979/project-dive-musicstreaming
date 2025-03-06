// src/components/MyPlaylistSection.jsx
import React, { useContext, useEffect, useState } from 'react';
import styles from '../../../css/mainPage/mainPage.module.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../../util/JwtUtil';
import { PlayerContext } from '../../../context/PlayerContext';

const MyRecentMusicSection = () => {

    const navigate = useNavigate();


    const loginUser = useSelector(state => state.user);


    const [music, setMusic]=useState([]);
    useEffect(
      ()=>{
        jaxios.get('/api/music/getMemberRecentMusics',{params:{memberId:loginUser.memberId}})
        .then((result)=>{
          console.log(result.data.musics);
          setMusic(result.data.musics);
        }).catch((err)=>{console.error(err);})
        
      },[]
    );
    
    const [visibleCount, setVisibleCount] = useState(8);

    const displayItems = music.slice(0,visibleCount);

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
    <div className={styles.recentMusicSection}>
      <h2>
        <span style={{ fontSize: '30px' }}>
          {loginUser.nickname}
        </span> 님의 자주 듣는 노래
      </h2>
  
    
      {music.length === 0 ? (
         <div className={styles.noMusicMessage}> 아직 즐겨듣는 곡이 없어요. 하나씩 채워볼까요❓</div>
      ) : (
        <div className={styles.recentMusicGrid}>
          {displayItems.map((item, index) => (
            <div key={index} className={styles.recentMusicCard}>
              <div
                className={styles.recentMusicInfo}
                onClick={() => handlePlay2(item.musicId)}
              >
                <img
                  src={item.image}
                  className={styles.image}
                  style={{ cursor: 'pointer' }}
                />
                <div className={styles.playIcon}>▶</div>
              </div>
              <div className={styles.musicInfo}>
                <p
                  style={{ cursor: 'pointer' }}
                  className={styles.recentMusictitle}
                  onClick={() => {
                    navigate(`/music/${item.musicId}`);
                  }}
                >
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default MyRecentMusicSection;
