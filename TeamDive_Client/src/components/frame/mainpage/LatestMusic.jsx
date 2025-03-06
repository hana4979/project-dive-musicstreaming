// src/components/LatestMusic.jsx
import React,{ useState, useEffect} from 'react';
import styles from '../../../css/mainPage/latestMusic.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LatestMusic = ({ music }) => {

    const navigate = useNavigate();
    const [latestMusicList, setLatestMusicList] = useState([]);

    useEffect(() => {
        const fetchLatestMusic = async () => {
            try {
                const result = await axios.get('/api/music/latestMusicList');
                setLatestMusicList(result.data.latestMusicList);
            } catch (err) {
                console.error(err);
            }
        };
    
        fetchLatestMusic();
    }, []);
    
    
    return (
        <div className={styles.latestMusic}>
            {
                (latestMusicList)?(
                    latestMusicList.map((music,idx) => {
                        return(
                            <div key={music.musicId} className={styles.songItem}
                                onClick={()=>{navigate(`/music/${music.musicId}`)}}
                            >
                                <img src={music.image}  className={styles.albumCover} />
                                <div className={styles.songDetails}>
                                    <h4>{music.title}</h4>
                                    <p>{music.artistName}</p>
                                </div>
                            </div>
                        )
                })
                ):(<div>최신 등록곡이 없습니다.</div>)
            }
        </div>
    );
};

export default LatestMusic;
