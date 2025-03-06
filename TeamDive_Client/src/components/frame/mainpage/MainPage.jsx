// src/components/MainPage.jsx
import React, { useContext,useEffect, useState } from 'react';
import Top100Section from './Top100Section';
import MyRecentMusicSection from './MyRecentMusicSection.jsx';
import LatestMusic from './LatestMusic.jsx';
import LatestAlbums from './LatestAlbums';
import RecommendedPlaylists from './RecommendedPlaylists';
import styles from '../../../css/mainPage/mainPage.module.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LikeRankingSection from './LikeRankingSection.jsx';
import RandomMusic from './RandomMusic.jsx';
import axios from 'axios';
import jaxios from '../../../util/JwtUtil.jsx';
import { setRecommendedListToCookie, getRecommendedListFromCookie, setRecommendedListToStorage, getRecommendedListFromStorage } from '../../../util/CookieUtil.jsx';
import { PlayerContext } from '../../../context/PlayerContext.jsx';
import { Margin } from '@mui/icons-material';



const MainPage = () => {
    const loginUser = useSelector(state => state.user);
    
    const [showAdModal, setShowAdModal] = useState(false); 

    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [recommendList, setRecommendList] = useState([]);

    



    const [moodMusic, setMoodMusic] = useState([]);
    const [selectMood, setSelectMood] = useState();
    const moodDisplayNames = {
        happy: "행복한 하루",
        sad: "슬픈 하루",
        angry: "짜증났던 하루",
        boring: "지루했던 하루",
        normal: "평범한 하루"
      };


    const handleMood = (mood) => {
        setSelectMood(mood);
        jaxios.get('/api/music/musicForMood', { params: { mood } })
          .then((result) => {
            
            if (result.data ) {
              setMoodMusic(result.data.music);
            } else {
              setMoodMusic([]);
            }
          })
          .catch((err) => {
            console.error("음악 조회 실패:", err);
            setMoodMusic([]);
          });
      };



    const closeMood = () => {
        setMoodMusic([]);
    }

    
  

    useEffect(() => {
        
        const timer = setTimeout(() => {
            setShowAdModal(true);
        }, 300);

        return () => clearTimeout(timer); 
    }, []);


    // 더미 데이터 (나중에 실제 API 호출로 대체)
    const [latestMusic, setLatestMusic] = useState([]);
    const [album, setAlbum] = useState([]);
    const [playList, setPlayList] = useState([]);



    function AdModal() {
        return (
        <div className={styles.adModalOverlay}>
            <div className={styles.adModal}>
            <button className={styles.closeButton} onClick={() => setShowAdModal(false)}>
                X
            </button>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link to={'/membership/all'}><img src='/public/image/adImage.png' style={{width: '100%', height: '100%'}}/></Link>
            </div>
            </div>
        </div>
        );
    }
    
    const {setAddPlaylist}=useContext(PlayerContext);
    const handlePlayAll = () => {
        setAddPlaylist(recommendList);
    };

  

    return (
        <div className={styles.mainPageContainer}>

            {!loginUser.memberId ? 
            <div className={styles.bannerGif}>
                <Link to={'/membership/all'}><img src='https://d9k8tjx0yo0q5.cloudfront.net/image/banner.gif' /></Link>
                </div> : ''}

        {loginUser.memberId ? ( <>
            <div className={styles.moodContainer}>
               <span className={styles.moodTitle}>
                    {loginUser.nickname}님 오늘 하루는 어떠셨나요 ?
                    <span onClick={()=> handleMood('happy')} className={styles.happy}><img className={styles.moodImg} src='https://d9k8tjx0yo0q5.cloudfront.net/icon/happy.gif'  /></span>
                    <span onClick={()=> handleMood('sad')} className={styles.sad}><img className={styles.moodImg} src='https://d9k8tjx0yo0q5.cloudfront.net/icon/sad.gif'  /></span>
                    <span onClick={()=> handleMood('angry')} className={styles.angry}><img className={styles.moodImg} src='https://d9k8tjx0yo0q5.cloudfront.net/icon/angry.gif'  /></span>
                    <span onClick={()=> handleMood('boring')} className={styles.boring}><img className={styles.moodImg} src='https://d9k8tjx0yo0q5.cloudfront.net/icon/boring.gif'  /></span>
                    <span onClick={()=> handleMood('normal')} className={styles.normal}><img className={styles.moodImg} src='https://d9k8tjx0yo0q5.cloudfront.net/icon/normal.gif'  /></span>
                </span>
            </div>
            {selectMood && moodMusic.length > 0 && (
                <div className={styles.moodSongList}>
                    <p onClick={closeMood} className={styles.closeButton}>닫기</p>
                    <h3 className={styles.moodSongTitle}>
                    {moodDisplayNames[selectMood]}에 어울리는 추천곡
                    </h3>
                    <div className={styles.songGrid}>
                    {moodMusic.slice(0, 5).map(music => (
                        <div key={music.musicId} className={styles.songCard}>
                        <Link to={`/music/${music.musicId}`}>
                            <img src={music.image} alt={music.title} className={styles.songImg} />
                            <div className={styles.songInfo}>
                            <p className={styles.songTitle}>{music.title}</p>
                            <p className={styles.songArtist}>{music.artist}</p>
                            </div>
                        </Link>
                        </div>
                    ))}
                    </div>
                </div>
                )}
           </> )
                :
                ''
        }

            {/* <div className={
            mood && mood !== ''
                ? styles.recommendActive
                : styles.recommendHidden
            }>
            <h3>추천 노래 목록</h3>
            {
                (recommendList) ? (
                    <div>
                        <button className={styles.moreButtonRecommend}onClick={() => handlePlayAll()}>
                            모두 듣기
                        </button>
                        <button className={styles.moreButtonRecommend} onClick={() => {
                            closeRecommendArea();
                        }}>닫기</button>   
                        <div className={styles.songObject}>
                            {recommendList.slice(0, 15).map((recommendMusic, idx) => (
                                <Link to={`/music/${recommendMusic.musicId}`} key={recommendMusic.id || idx}>
                                    <div className={styles.songCard}>
                                        <div className={styles.songTitle}>
                                            <img src={recommendMusic.image} alt="곡 이미지" />
                                        </div>
                                        <div className={styles.titleArea}>
                                            <p className={styles.songTitle}>
                                                {recommendMusic.title}
                                            </p>
                                            <p className={styles.songArtist}>
                                                {recommendMusic.artistName}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>추천곡이 없습니다.</div>
                )
                }

            </div> */}


            {/* {!loginUser.memberId ? (showAdModal && (<AdModal/>)) : ''} */}
            
            <div className={styles.topSection}>

                <div className={styles.topRow}>
                   
            
                    <section className={styles.conditionalSection1}>
                    { !loginUser.memberId ? 
                    <div className={styles.top}>
               
                    

                            <RandomMusic/>
                    </div>
                        :
                            <MyRecentMusicSection />  
                    }
                    </section>
                  

                </div>

                <section className={styles.conditionalSection}>
                        
                        <Top100Section />
                        
                    </section>
            </div>

        <section className={styles.section}>
            <h2>최신등록음악</h2>
            <LatestMusic music={latestMusic} />
        </section>

        <section className={styles.section}>
            <h2>최신등록앨범</h2>
            <LatestAlbums album={album} />
        </section>

        <section className={styles.section}>
            <h2>추천플레이리스트</h2>
            <RecommendedPlaylists playList={playList} />
        </section>
        
        </div>

    
    );
};

export default MainPage;
