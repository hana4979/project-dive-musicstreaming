import React, { useState, useEffect } from "react";
import styles from "../../css/storage/likedAlbum.module.css";
import jaxios from '../../util/JwtUtil'
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const LikedAlbum = () => {
  // const [likedAlbums, setLikedAlbums] = useState([
  //   {
  //     albumId: 101,
  //     albumName: "테스트 앨범1",
  //     coverImage: "/public/image/album/album1.jpg",
  //     indate: "2023-01-01",
  //     artist: {
  //       artistId: 1,
  //       artistName: "아이유",
  //       image: "/public/image/artist/artist1.jpg"
  //     },
  //     musicList: [
  //       { musicId: 11, title: "첫 번째 곡", trackNumber: 1 },
  //       { musicId: 12, title: "두 번째 곡", trackNumber: 2 },
  //     ]
  //   },
  //   {
  //     albumId: 102,
  //     albumName: "테스트 앨범2",
  //     coverImage: "/public/image/album/album2.jpg",
  //     indate: "2023-02-15",
  //     artist: {
  //       artistId: 2,
  //       artistName: "뉴진스",
  //       image: "/public/image/artist/artist2.jpg"
  //     },
  //     musicList: [
  //       { musicId: 21, title: "A Ditto", trackNumber: 1 },
  //       { musicId: 22, title: "B OMG", trackNumber: 2 },
  //     ]
  //   },
  // ]);

  const [likeAlbumList, setLikeAlbumList] = useState([]);
  
  const loginUser = useSelector(state=>state.user);
  const navigate= useNavigate();
  useEffect(()=>{
    jaxios.get('/api/community/getLikes', {params:{pagetype:'ALBUM', memberId: loginUser.memberId}})
    .then((result)=>{
      setLikeAlbumList(result.data.likesList||[]);
      console.log('result.data.LikesList',result.data.likesList);
    })
    .catch((err)=>{
      console.error(err);
    })
  },[]);


  // 좋아요 취소
  const handleUnlike = (albumId) => {
    if (window.confirm("앨범 좋아요를 취소할까요?")) {
      jaxios.post('/api/community/insertLikes', null, {
        params: { entityId: albumId, pagetype: 'ALBUM', memberId: loginUser.memberId } 
      }).then((result)=>{
      }).catch((err)=>{console.error(err);});
      setLikeAlbumList((prev) => prev.filter((album) => album.albumId !== albumId));
    }
  };

  if (!likeAlbumList || likeAlbumList.length === 0) {
    return (
      <div className={styles.emptyMessage}>
        <h2>좋아하는 앨범이 없습니다</h2>
        <p>내가 좋아하는 앨범들을 추가해보세요</p>
      </div>
    );
  }

  return (
    <div className={styles.albumContainer}>
      <div className={styles.albumGrid}>
        {likeAlbumList.map((likeAlbum, idx) => (
          <div className={styles.flipCard} key={idx}>
            <div className={styles.flipCardInner}>

              {/* 앞면: 앨범 커버 */}
              <div className={styles.flipCardFront}>
                <img
                  src={likeAlbum.image}
                  alt={likeAlbum.albumName}
                  className={styles.coverImage}
                />
              </div>

              {/* 뒷면: 앨범 타이틀 + 가수 이름 + 좋아요 + 상세보기 */}
              <div className={styles.flipCardBack} style={{ backgroundImage: `url(${likeAlbum.image})` }}>
                <div className={styles.flipCardContent}>
                  <h3 className={styles.albumTitle}>{likeAlbum.albumName}</h3>

                  {likeAlbum.artist && (
                    <p className={styles.artistName}>{likeAlbum.artist.artistName}</p>
                  )}

                  <div className={styles.buttonRow}>
                    <button
                      className={styles.heartBtn}
                      onClick={() => handleUnlike(likeAlbum.albumId)}
                    >
                      ♥
                    </button>

                    <button
                      className={styles.detailBtn}
                      onClick={() => navigate(`/album/${likeAlbum.albumId}`)}
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedAlbum;
