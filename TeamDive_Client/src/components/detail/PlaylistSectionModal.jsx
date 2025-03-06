// PlaylistSelectModal.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import jaxios from '../../util/JwtUtil';
import styles from '../../css/detail/playlistSectionModal.module.css';
import { Link, useNavigate } from 'react-router-dom';

function PlaylistSelectModal({ musicIdList, onClose }) {
  const loginUser = useSelector((state) => state.user); 
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  useEffect(() => {
    if (!loginUser?.memberId) {
      alert('로그인이 필요한 서비스입니다');
      navigate('/login');
      return;
    }


    jaxios
      .get('/api/music/getMemberPlaylist', {
        params: { memberId: loginUser.memberId },
      })
      .then((res) => {
        console.log('플레이리스트 API 응답:', res);

        if (res.data && res.data.playlist) {
          setPlaylists(res.data.playlist);
        } else {
          setPlaylists([]);
        }
      })
      .catch((err) => {
        console.error('플레이리스트 못 가져옴:', err);
        setPlaylists([]);
      });
  }, [loginUser, navigate]);

  const handleAddMusic = () => {
    if (!selectedPlaylistId) {
      alert('플레이리스트를 선택하세요.');
      return;
    }


    
    jaxios
      .post(`/api/music/updatePlaylistAddMusic?playlistId=${selectedPlaylistId}`, musicIdList) 
      .then((res) => {

        if (res.data && res.data.msg === 'yes') {
          alert('플레이리스트에 곡이 추가되었습니다.');
          onClose();
        } else {
          alert('추가 실패');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>플레이리스트 선택</h2>
        <button className={styles.closeButton} onClick={onClose}>X</button>

        <div className={styles.playlistList}>
            {
              (playlists && playlists.length > 0) ? (
                playlists.map((pl) => (
                  <div
                    key={pl.playlistId}
                    className={`${styles.playlistItem} ${
                      selectedPlaylistId === pl.playlistId ? styles.selected : ''
                    }`}
                    onClick={() => setSelectedPlaylistId(pl.playlistId)}
                  >
                    {pl.title}
                  </div>
                ))
              ) : (
                <div className={styles.smallContainer}>
                  <p className={styles.message}>
                    현재 플레이리스트가 없습니다.
                  </p>
                  <Link to="/storage/myPlaylist" className={styles.createLink}>
                    플레이리스트 만들기
                  </Link>
                </div>
              )
            }
          </div>


        <button className={styles.addButton} onClick={handleAddMusic}>
          선택한 플레이리스트에 추가
        </button>
      </div>
    </div>
  );
}

export default PlaylistSelectModal;
