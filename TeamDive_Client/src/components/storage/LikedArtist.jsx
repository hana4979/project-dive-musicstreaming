import React, { useState, useEffect } from "react";
import styles from "../../css/storage/likedArtist.module.css";
import jaxios from "../../util/JwtUtil";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LikedArtist = () => {

  const [likeArtistList, setLikeArtistList] = useState([]);
  const loginUser = useSelector(state=>state.user);
  const navigate=useNavigate();
  useEffect(()=>{
    jaxios.get('/api/community/getLikes', {params:{pagetype:'ARTIST', memberId: loginUser.memberId}})
    .then((result)=>{
      setLikeArtistList(result.data.likesList||[]);
      console.log(result.data.likesList);
    })
    .catch((err)=>{
      console.error(err);
    })
  },[]);

  // 좋아요 취소
  const handleUnlike = (artistId) => {
    if (window.confirm("좋아요를 취소할까요?")) {
      jaxios.post('/api/community/insertLikes', null, {
        params: { entityId: artistId, pagetype: 'ARTIST', memberId: loginUser.memberId } 
      }).then((result)=>{
      }).catch((err)=>{console.error(err);});
      setLikeArtistList((prev) =>
        prev.filter((artist) => artist.artistId !== artistId)
      );
    }
  };

  // 목록이 비어 있을 때
  if (!likeArtistList || likeArtistList.length === 0) {
    return (
      <div className={styles.emptyMessage}>
        <h2>좋아하는 가수가 없습니다</h2>
        <p>내가 좋아하는 가수들을 추가해보세요</p>
      </div>
    );
  }

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.artistGrid}>
        {likeArtistList.map((likeArtist, idx) => (
          <div className={styles.artistCard} key={idx} >
            
            <div className={styles.imageOverlay}>
              <img
                src={likeArtist.image}
                alt={likeArtist.image}
                className={styles.artistImage}
                onClick={()=>navigate(`/artist/${likeArtist.artistId}`)}
              />
              
              <div className={styles.overlayGradient} />
              {/* 좋아요 버튼 (하트) */}
                <button
                  className={styles.heartBtn}
                  onClick={() => handleUnlike(likeArtist.artistId)}
                >
                  ❤️
                </button>
              </div>

              {/* 가수 정보 */}
              <div className={styles.artistInfo} onClick={()=>navigate(`/artist/${likeArtist.artistId}`)}>
                <h3 className={styles.artistName}>{likeArtist.artistName}</h3>
                <p className={styles.debut}>데뷔일: {likeArtist.debut}</p>
                <p className={styles.country}>국가: {likeArtist.country}</p>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedArtist;
