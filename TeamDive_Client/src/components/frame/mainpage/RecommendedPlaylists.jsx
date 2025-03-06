// src/components/RecommendedPlaylists.jsx
import React, {useState, useEffect} from 'react';
import styles from '../../../css/mainPage/recommendedPlaylists.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecommendedPlaylists = ({ playList }) => {

    const navigate = useNavigate();
    const [latestPlayList, setLatestPlayList] = useState([]);
    
    useEffect(() => {
        const fetchLatestPlayList = async () => {
            try {
                const result = await axios.get('/api/music/latestPlayList');
                setLatestPlayList(result.data.latestPlayListList || []);
            } catch (err) {
                console.error(err);
            }
        };
    
        fetchLatestPlayList();
    }, []);

    return (
        <div className={styles.playlists}>
            {
                (latestPlayList)?(
                    latestPlayList.map((playList, idx) => (
                        <div key={idx} className={styles.playlistItem}
                            onClick={()=>{navigate(`/playList/${playList.playlistId}`)}}
                        >
                           
                            <img src={playList.coverImage} className={styles.playlistCover}/>
                            <div className={styles.playlistDetails}>
                                <h4>{playList.title}</h4>
                            </div>
                        </div>
                       
                    ))
                ):(<div>추천 플레이 리스트가 없습니다.</div>)
            
            }
        </div>
    );
};

export default RecommendedPlaylists;
