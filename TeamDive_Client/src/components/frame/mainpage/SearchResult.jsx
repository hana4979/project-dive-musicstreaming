import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../../css/mainPage/searchResult.module.css';

function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';

  const navigate = useNavigate();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/music/getSearch', { params: { key: query } })
      .then(result => {
        setResults(result.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('검색 에러:', error);
        setLoading(false);
      });
  }, [query]);

  if (loading) return <div>로딩중...</div>;
  if (!results) {
    
    return <div>검색 결과가 없습니다.</div>;
  }
  
  
  const noMusic = !results.music || results.music.length === 0;
  const noArtist = !results.artist || results.artist.length === 0;
  const noAlbum = !results.album || results.album.length === 0;
  const noPlaylist = !results.playlist || results.playlist.length === 0;
  
  
  const allEmpty = noMusic && noArtist && noAlbum && noPlaylist;
  
  if (allEmpty) {
    return <div>검색 결과가 없습니다.</div>;
  }



  const searchMore = (category) => {
        navigate(`/searchMore?type=${category}&query=${encodeURIComponent(query)}`);
  }

  return (
    <div>
      <h1>' {query} ' 검색 결과 </h1>

    
      {results.music && results.music.length > 0 && (
        <div className={styles.searchSection}>
            <div className={styles.sectionHeader}>
                <h2>노래</h2> <button onClick={()=>searchMore('music')}>더보기</button> 
            </div>
          <div className={styles.resultContainer_music}>
            {results.music.slice(0, 8).map((music, i) => (
              <div key={i} className={styles.searchResult_music}>
                <img
                  src={music.image}
                  className={styles.imageCard_music}

                />
                <div className={styles.musicInfo}>
                  <p onClick={() => navigate(`/music/${music.musicId}`)}>
                    {music.title}
                  </p>
                  <p onClick={() => navigate(`/artist/${music.artistId}`)}>
                    {music.artistName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.artist && results.artist.length > 0 && (
        <div className={styles.searchSection}>
            <div className={styles.sectionHeader}>
                <h2>아티스트</h2> <button onClick={()=>searchMore('artist')}>더보기</button> 
            </div>
          <div className={styles.resultContainer_artist}>
            {results.artist.slice(0, 6).map((artist, i) => (
              <div
                key={i}
                className={styles.searchResult_artist}
                onClick={() => navigate(`/artist/${artist.artistId}`)}
              >
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

      {results.album && results.album.length > 0 && (
        <div className={styles.searchSection}>
            <div className={styles.sectionHeader}>
                <h2>앨범</h2> <button onClick={()=>searchMore('album')}>더보기</button> 
            </div>
          <div className={styles.resultContainer_album}>
            {results.album.slice(0, 6).map((album, i) => (
              <div key={i} className={styles.searchResult_album} onClick={() => navigate(`/album/${album.albumId}`)}>
                <img
                  src={album.image}
                  className={styles.imageCard_album}

                />
                <p>{album.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

   
      {results.playlist && results.playlist.length > 0 && (
        <div className={styles.searchSection}>
            <div className={styles.sectionHeader}>
                <h2>플레이리스트</h2> <button onClick={()=>searchMore('playlist')}>더보기</button> 
            </div>
          <div className={styles.resultContainer_playlist}>
            {results.playlist.slice(0, 6).map((playlist, i) => (
              <div key={i} className={styles.searchResult_playlist} onClick={() => navigate(`/playlist/${playlist.playlistId}`)}>
                <img
                  src={playlist.coverImage}
                  className={styles.imageCard_playlist}

                />
                <p>{playlist.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {results.music && results.music.length > 0 && (
        <div className={styles.searchSection}>
        <div className={styles.sectionHeader}>
          <h2>가사</h2>
          <button onClick={() => searchMore('lyrics')}>더보기</button>
        </div>
      
        <div className={styles.resultContainer_lyrics}>
          {results.music.slice(0, 3).map((music, i) => {

            const limitLyrics =
              music.lyrics && music.lyrics.length > 30
                ? music.lyrics.substring(0, 30) + '...'
                : music.lyrics;
      
            return (
              <div key={i} className={styles.searchResult_lyrics}>

                <div className={styles.lyricsTop}>
                  <img
                    src={music.image}
                    className={styles.imageCard_lyrics}
                  />
                  <div className={styles.musicInfo}>
                    <p onClick={() => navigate(`/music/${music.musicId}`)}>
                      {music.title}
                    </p>
                    <p onClick={() => navigate(`/artist/${music.artistId}`)}>
                      {music.artistName}
                    </p>
                  </div>
                </div>
      
                {/* 하단: 가사 */}
                <div className={styles.lyricsText}>{limitLyrics}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      )}
    </div>
  );
}

export default SearchResults;
