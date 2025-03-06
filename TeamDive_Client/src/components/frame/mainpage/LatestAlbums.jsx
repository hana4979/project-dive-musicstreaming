// src/components/LatestAlbums.jsx
import React, {useState, useEffect} from 'react';
import styles from '../../../css/mainPage/latestAlbums.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const LatestAlbums = ({ album }) => {

    const navigate = useNavigate();
    const [latestAlbumList, setLatestAlbumList] = useState([]);

    useEffect(()=>{
        const fetchLatestAlbum = async () => {
            try {
                const result = await axios.get('/api/music/latestAlbumList');
                setLatestAlbumList(result.data.latestAlbumList);
            } catch (err) {
                console.error(err);
            }
        };
    
        fetchLatestAlbum();
    },[]);


    return (
        <div className={styles.latestAlbums}>
            {
                (latestAlbumList)?(
                    latestAlbumList.map(album => (
                        <div key={album.albumId} className={styles.albumItem}
                            onClick={()=>{navigate(`/album/${album.albumId}`)}}
                        >
                            <img src={album.image} alt={album.title} className={styles.albumCover} />
                            <div className={styles.albumDetails}>
                                <h4>{album.title}</h4>
                                {/* <small>{album.indate.substring(0 ,10)}</small> */}
                            </div>
                        </div>
                    ))
                ):(<div>최신 등록앨범이 없습니다.</div>)
            
            }
        </div>
    );
};

export default LatestAlbums;
