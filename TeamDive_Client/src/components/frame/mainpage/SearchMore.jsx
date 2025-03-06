import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../../css/mainPage/searchMore.module.css';

function SearchMore() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const query = queryParams.get('query') || '';

  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/music/getSearch', { params: { key: query } })
      .then(res => {
        const data = res.data;
        if (type === 'music') {
          setList(data.music);
        } else if (type === 'artist') {
          setList(data.artist);
        } else if (type === 'album') {
          setList(data.album);
        } else if (type === 'playlist') {
          setList(data.playlist);
        } else if (type === 'lyrics') {
          setList(data.music);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('전체 목록 에러:', err);
        setLoading(false);
      });
  }, [type, query]);

  if (loading) return <div>로딩중...</div>;
  if (!list || list.length === 0) return <div>결과가 없습니다.</div>;

  return (
    <div className={styles.searchMorePage}>
      <h3>{type}</h3> 
      <h1>' {query} ' 검색결과   </h1>

      {/* music */}
      {type === 'music' && (
        <div className={styles.searchSection}>


          {/* 결과 목록 컨테이너 */}
          <div className={styles.resultContainer_music}>
            {list.map((music, i) => (
              <div key={i} className={styles.searchResult_music}>
                <img
                  src={music.image}
                  className={styles.imageCard_music}
                />
                <div className={styles.musicInfo}>
                  <p onClick={()=>{navigate(`/music/${music.musicId}`)}}>{music.title}</p>
                  <p onClick={()=>{navigate(`/artist/${music.artistId}`)}}>{music.artistName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* artist */}
      {type === 'artist' && (
        <div className={styles.searchSection}>
          <div className={styles.resultContainer_artist}>
            {list.map((artist, i) => (
              <div key={i} className={styles.searchResult_artist}  onClick={()=>{navigate(`/artist/${artist.artistId}`)}}>
                <img
                  src={artist.image}
                  className={styles.imageCard_artist}
                />
                <p>{artist.artistName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* album */}
      {type === 'album' && (
        <div className={styles.searchSection}>


          <div className={styles.resultContainer_album}>
            {list.map((album, i) => (
              <div key={i} className={styles.searchResult_album}>
                <img
                  src={album.image}
                  className={styles.imageCard_album}
                />
                <div className={styles.albumInfo}>
                    <p onClick={()=>{navigate(`/album/${album.albumId}`)}}>{album.title}</p>
                    <p onClick={()=>{navigate(`/artist/${album.artistId}`)}}>{album.artistName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* playlist */}
      {type === 'playlist' && (
        <div className={styles.searchSection}>


          <div className={styles.resultContainer_playlist}>
            {list.map((pl, i) => (
              <div key={i} className={styles.searchResult_playlist} onClick={()=>{navigate(`/playlist/${pl.playlistId}`)}}>
                <img
                  src={pl.coverImage}
                  className={styles.imageCard_playlist}
                />
                <p>{pl.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

        {type === 'lyrics' && (
          <div className={styles.searchSection}>
            <div className={styles.resultContainer_lyrics}>
              {list.map((item, i) => {
     
                const limitLyrics =
                  item.lyrics && item.lyrics.length > 40
                    ? item.lyrics.substring(0, 40) + '...'
                    : item.lyrics;

                return (
                  <div className={styles.searchResult_lyrics} key={i}>
           
                    <div className={styles.lyricsTop}>
                      <img
                        src={item.image}
                        className={styles.imageCard_lyrics}
                      />
                      <div className={styles.musicInfo}>
                        <p onClick={() => navigate(`/music/${item.musicId}`)}>
                          {item.title}
                        </p>
                        <p onClick={() => navigate(`/artist/${item.artistId}`)}>
                          {item.artistName}
                        </p>
                      </div>
                    </div>

          
                    <div className={styles.lyricsText}>
                      {limitLyrics}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}




    </div>
  );
}

export default SearchMore;
