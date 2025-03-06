import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../css/storage/likedMusic.module.css";
import { useSelector } from "react-redux";
import jaxios from "../../util/JwtUtil";
import { PlayerContext } from "../../context/PlayerContext";

const LikedMusic = () => {
    

    const [likeMusicList, setLikeMusicList] = useState([]);
    const loginUser = useSelector(state=>state.user);
    const navigate=useNavigate();
    useEffect(()=>{
      jaxios.get('/api/community/getLikes', {params:{pagetype:'MUSIC', memberId: loginUser.memberId}})
      .then((result)=>{
        setLikeMusicList(result.data.likesList||[]);
        console.log('result.data.likesList',result.data.likesList);
      })
      .catch((err)=>{
        console.error(err);
      })
    },[]);

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
    async function insertCart(id){
      if(!loginUser.memberId){
          alert('로그인이 필요한 서비스입니다');
          navigate('/login');
      }else{
           try{
              const response = await jaxios.post('/api/cart/insertCart', {
                  memberId: loginUser.memberId,
                  musicIdList: id? [id] : selectedIds
              });
              navigate('/mypage/mp3/pending');
          }catch(error){
              console.error('장바구니 담기 실패', error)
          }
      }
    }
    

    // 체크박스 선택 상태 (musicId 배열)
    const [selectedIds, setSelectedIds] = useState([]);

    // "전체선택" 체크박스 토글
    const toggleSelectAll = (checked) => {
      if (checked) {
        setSelectedIds(likeMusicList.map((music) => music.musicId));
      } else {
        setSelectedIds([]);
      }
    };

    // 개별 곡 체크박스 토글
    const toggleSelect = (id) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    };

    // 좋아요 취소 -> confirm 후 제거
    const handleUnlike = (id) => {
        jaxios.post('/api/community/insertLikes', null, {
          params: { entityId: id, pagetype: 'MUSIC', memberId: loginUser.memberId }
        }).then((result)=>{
        }).catch((err)=>{console.error(err);});

        setLikeMusicList((prev) => prev.filter((music) => music.musicId !== id));
        // 혹시 선택 목록에도 있으면 제거
        setSelectedIds((prev) => prev.filter((x) => x !== id));
    };

    // "전체 재생" 버튼 클릭
    const handlePlayAll = () => {
      handlePlay2(selectedIds);
    };

    // "전체 구매" 버튼 클릭
    const handleBuyAll = () => {
      insertCart();
    };

    // 곡별 MP3 구매 버튼
    const handleBuyOne = (id) => {
      insertCart(id);
    };

    const isAllSelected =
    likeMusicList.length > 0 && selectedIds.length === likeMusicList.length;
    const isSomeSelected = selectedIds.length > 0;

    return (
      <div className={styles.sectionContainer}>

        {/* 노래가 하나도 없을 때 */}
        {likeMusicList.length === 0 ? (
          <div className={styles.emptyMessage}>
            <h2>좋아하는 노래가 없어요!</h2>
            <p>내가 좋아하는 노래들을 추가해보세요.</p>
          </div>
        ) : (
          <>
            {/* 상단: 전체선택, 전체재생, 전체구매 */}
            <div className={styles.topBar}>
              <label className={styles.checkAllLabel}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
                전체선택
              </label>

              <button
                className={styles.topBtn}
                onClick={handlePlayAll}
                disabled={!isSomeSelected}
              >
                선택재생
              </button>
              <button
                className={styles.topBtn}
                onClick={handleBuyAll}
                disabled={!isSomeSelected}
              >
                선택구매
              </button>
            </div>

            <div className={styles.songList}>
              {likeMusicList.map((likeMusic) => (
                <div className={styles.songRow} key={likeMusic.musicId}>
                  {/* 개별 체크박스 */}
                  <input
                    type="checkbox"
                    className={styles.rowCheckbox}
                    checked={selectedIds.includes(likeMusic.musicId)}
                    onChange={() => toggleSelect(likeMusic.musicId)}
                  />

                  {/* 앨범 커버 */}
                  <div className={styles.coverWrapper}>
                    <img
                      src={likeMusic.image}
                      alt={likeMusic.title}
                      className={styles.coverImage}
                    />
                  </div>

                  {/* 제목 */}
                  <div className={styles.title}>
                    <Link to={`/music/${likeMusic.musicId}`} className={styles.titleLink}>
                      {likeMusic.title}
                    </Link>
                  </div>

                  {/* 가수 */}
                  <div className={styles.artist}>{likeMusic.artistName}</div>

                  {/* 장르 */}
                  <div className={styles.genre}>{likeMusic.genre}</div>

                  {/* MP3 구매 버튼 */}
                  <button
                    className={styles.buyBtn}
                    onClick={() => handleBuyOne(likeMusic.musicId)}
                  >
                    MP3구매
                  </button>

                  {/* 좋아요(하트) 버튼 */}
                  <button
                    className={styles.heartBtn}
                    onClick={() => handleUnlike(likeMusic.musicId)}
                  >
                    ♥
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
};

export default LikedMusic;
