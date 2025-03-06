import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; 

import axios from "axios";
import jaxios from "../../util/JwtUtil";

import PlaylistSelectModal from "./PlaylistSectionModal";
import { PlayerContext } from "../../context/PlayerContext";

import styles from "../../css/detail/artistDetail.module.css";

/* 아이콘 */
import { MdLibraryMusic } from "react-icons/md";
import { BsFileEarmarkMusicFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { MdQueueMusic } from "react-icons/md";
import { HiOutlineHeart } from "react-icons/hi";
import { HiHeart } from "react-icons/hi";

const ArtistDetail = () => {
    const loginUser = useSelector((state) => state.user);
    const navigate = useNavigate();

    const { artistId } = useParams();
    const [artistDetail, setArtistDetail] = useState(null);
    const [artistReplyList, setArtistReplyList] = useState([]);
    const [content, setContent] = useState("");
    const [nickname, setNickname] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const [selectedMusicId, setSelectedMusicId] = useState(null);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    
    useEffect(() => {
        // 아티스트 정보 불러오기
        axios.get("/api/music/getArtist", {
            params: { artistId }
        }).then((res) => {
            setArtistDetail(res.data.artist);
        }).catch((err) => console.error(err));

        // 댓글 정보 불러오기
        fetchReply();
        // 좋아요 총 개수 불러오기
        fetchLikeCount();

        // 로그인한 유저의 좋아요 정보 가져오기
        if(loginUser.memberId){
            jaxios.get('/api/community/getLikes', {
                params: {pagetype: 'ARTIST', memberId: loginUser.memberId}
            }).then((result)=>{
                if(result.data.likesList.some(likes => likes.artistId == artistId)){
                    setIsLiked(true);
                }
            }).catch((err)=>{console.error(err);});
        }
    }, [artistId]);


    // 재생목록에 추가
    const handleAddToPlaylist = (musicId) => {
        setSelectedMusicId(musicId);
        setShowPlaylistModal(true);
    };

    // 좋아요 개수 불러오기
    const fetchLikeCount = async () => {
        await axios.get('/api/community/getLikeCount', {
            params: { pageType: 'ARTIST', entityId: artistId }
        }).then((result) => {
            setLikeCount(result.data.likeCount);
        }).catch((error) => {
            console.error('좋아요 개수 불러오기 실패', error);
        })
    }

    // 좋아요 추가 / 취소
    const handleLike = () => {
        if(!loginUser.memberId){
            alert('로그인이 필요한 서비스입니다');
        }else{
            jaxios.post('/api/community/insertLikes',null,{params:{entityId: artistId, pagetype: 'ARTIST', memberId: loginUser.memberId}})
            .then((result)=>{
                console.log(result.data.msg)
                setIsLiked(prevLike => !prevLike);
                fetchLikeCount(); // 좋아요 총 개수 조회
            }).catch((err)=>{console.error(err);})
        }
    };

    // 장바구니에 추가
    async function insertCart(musicId) {
        if(!loginUser){
            alert("로그인이 필요한 서비스입니다");
            navigate("/login");
        }else{
            try{
                const response = await jaxios.post("/api/cart/insertCart", {
                    memberId: loginUser.memberId,
                    musicIdList: [musicId], // ★ 클릭된 곡의 ID만 전송
                });
                navigate('/mypage/mp3/pending');
            }catch(error){
                console.error("장바구니 담기 실패", error);
            }
        }
    }
  
    const { setAddPlaylist, setAddAndPlay } = useContext(PlayerContext);
    //재생목록에 추가후 즉시재생 
    //musicId 또는 musicId 배열
    const handlePlay = (musicId) => {
        const musicArray = Array.isArray(musicId) ?
            musicId.map(num => ({ musicId: num })) : [{ musicId: musicId }];
        setAddAndPlay(musicArray);
    };

    //재생목록에 추가만
    const handlePlay2 = (musicId) => {
        const musicArray = Array.isArray(musicId) ?
            musicId.map(num => ({ musicId: num })) : [{ musicId: musicId }];
        setAddPlaylist(musicArray);
    };

    // 댓글 불러오기
    const fetchReply = () => {
      axios.get("/api/community/getReplyList", {
          params: { pagetype: "ARTIST", entityId: artistId },
        }).then((result) => {
            setArtistReplyList(result.data.replyList);
        }).catch((err) => { console.error(err); });
    };

    // 댓글 추가하기
    const handleCommentSubmit = (e) => {
      e.preventDefault();

      if (!loginUser?.memberId) {
          alert("로그인이 필요한 서비스입니다.");
          return;
      }

      if (!content.trim()) {
          alert("댓글을 입력해주세요.");
          return;
      }

      setNickname(loginUser.nickname);

      // 댓글 추가
      jaxios.post('/api/community/insertReply', {nickname, content}, {
          params: { pagetype: "ARTIST", entityId: artistId, memberId: loginUser.memberId }
        }).then((result) => {
            if (result.data.msg === 'yes') {
                alert('댓글이 추가되었습니다.');
                setContent('');
                fetchReply(); 
            }
        }).catch((err) => { console.error(err); });
    };

    // 불러온 아티스트 정보가 없다면
    if (!artistDetail) {
        return <div className={styles.loading}>Loading...</div>;
    }

    // 데뷔일 날짜 형식 포맷
    const formattedDebut = artistDetail.debut ?
        new Date(artistDetail.debut).toISOString().slice(0, 10).replace(/-/g, ".") : "";

    return (
        <div className={styles.container}>
            <div className={styles.artistHeader}>
                <img
                  src={artistDetail.image}
                  alt={artistDetail.artistName}
                  className={styles.artistImage}
                />
                <div className={styles.artistInfo}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.artistName}>
                            {artistDetail.artistName}
                        </h1>
                        <button
                            className={styles.likeButton}
                            onClick={handleLike}>
                            { isLiked ? <HiHeart size={20}/> : <HiOutlineHeart size={20}/> }
                            &nbsp;{likeCount}
                        </button>
                    </div>
                    
                    <p className={styles.content}>
                        데뷔 { formattedDebut || "정보 없음" }
                    </p>
                    <p className={styles.content}>
                        {artistDetail.country ? `국가: ${artistDetail.country}` : ""}
                    </p>
                    <p className={styles.content}>
                        {artistDetail.content}
                    </p>
                </div>
            </div>

            {/* 노래 목록 섹션 */}
            <div className={styles.musicSection}>
                <h2 className={styles.sectionTitle}>노래</h2>
                {artistDetail.musicList && artistDetail.musicList.length > 0 ? (
                    <table className={styles.musicTable}>
                        <tbody>
                            {artistDetail.musicList.map((music, index) => (
                                <tr key={music.musicId} className={styles.trackRow}>
                                    <td className={styles.thNumber}>
                                        <img src={music.image} style={{width:'50px', height: '50px' }}/>
                                    </td>
                                    <td
                                        className={styles.thTitle}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigate(`/music/${music.musicId}`)}
                                    >
                                        {music.title}
                                    </td>
                                    <td className={styles.thAlbum}
                                        onClick={
                                          ()=>{navigate(`/album/${music.albumId}`)}
                                        }>
                                        <span style={{cursor:"pointer"}}>
                                            {music.albumTitle || ""}
                                        </span>
                                    </td>
                                    <td className={styles.thActions}>
                                        <button
                                            className={styles.iconButton}
                                            onClick={()=>{handlePlay(music.musicId)}}
                                        >
                                            <FaPlay size={16}/>
                                        </button>
                                        <button
                                            className={styles.iconButton}
                                            onClick={()=>{handlePlay2(music.musicId)}}
                                        >
                                            <MdQueueMusic size={22}/>
                                        </button>
                                        <button
                                            className={styles.iconButton}
                                            onClick={() => handleAddToPlaylist(music.musicId)}
                                        >
                                            <MdLibraryMusic size={20}/>
                                        </button>
                                        <button
                                            className={styles.iconButton}
                                            onClick={() => insertCart(music.musicId)} 
                                        >
                                            <BsFileEarmarkMusicFill size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>등록된 노래가 없습니다.</p>
                )}
            </div>

            {/* 앨범 목록 섹션 */}
            <div className={styles.albumSection}>
                <h2 className={styles.sectionTitle}>앨범</h2>
                {artistDetail.albums && artistDetail.albums.length > 0 ? (
                    <div className={styles.albumList}>
                        {artistDetail.albums.map((album) => (
                            <div
                                key={album.albumId}
                                className={styles.albumCard}
                                onClick={() => navigate(`/album/${album.albumId}`)}>
                                <img
                                    src={album.image}
                                    alt={album.title}
                                    className={styles.albumImage}
                                />
                                <div className={styles.albumInfo}>
                                    <p className={styles.albumTitle}>
                                        {album.title}
                                    </p>
                                    <p className={styles.albumIndate}>
                                        {album.indate?.substring(0, 10)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>등록된 앨범이 없습니다.</p>
                )}
            </div>

            {/* ===== 댓글 섹션 ===== */}
            <div className={styles.commentsSection}>
                <h2>댓글</h2>
                <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="댓글을 입력하세요..."
                      className={styles.commentInput}
                    />
                    <button type="submit" className={styles.submitButton}>
                      댓글 작성
                    </button>
                </form>
                <div className={styles.commentsList}>
                    {artistReplyList && artistReplyList.length > 0 ? (
                        artistReplyList.map((replyData, idx) => (
                            <div className={styles.commentItem} key={idx}>
                                <p className={styles.commentAuthor}>
                                  {replyData.member.memberId}
                                </p>
                                <p className={styles.commentContent}>{replyData.content}</p>
                                <small className={styles.commentDate}>
                                  {replyData.indate.substring(0, 10)}
                                </small>
                            </div>
                        ))
                    ) : (
                        <div>댓글이 없습니다.</div>
                    )}
                </div>
            </div>

            {showPlaylistModal && (
                <PlaylistSelectModal
                    musicIdList={[selectedMusicId]}  
                    onClose={() => setShowPlaylistModal(false)}
                />
            )}
        </div>
    );
};

export default ArtistDetail;
