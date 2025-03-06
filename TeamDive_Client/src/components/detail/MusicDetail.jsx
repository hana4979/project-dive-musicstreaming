import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import axios from 'axios';
import jaxios from '../../util/JwtUtil';

import { PlayerContext } from '../../context/PlayerContext';
import PlaylistSelectModal from './PlaylistSectionModal';

import styles from '../../css/detail/musicDetail.module.css';

/* 아이콘 */
import { MdLibraryMusic } from "react-icons/md";
import { BsFileEarmarkMusicFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { MdQueueMusic } from "react-icons/md";
import { HiOutlineHeart } from "react-icons/hi";
import { HiHeart } from "react-icons/hi";

const MusicDetail = () => {
    const { musicId } = useParams();
    const [musicDetail, setMusicDetail] = useState(null);
    const [expandedLyrics, setExpandedLyrics] = useState(false);

    const [nickname, setNickname] = useState('');
    const [content, setContent] = useState('');
    const [replyMusicList, setReplyMusicList] = useState([]);
    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const loginUser = useSelector((state) => state.user);
    const navigate = useNavigate();

    // 플리 추가 모달
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const {setAddPlaylist,setAddAndPlay}= useContext(PlayerContext);

    // 재생목록에 추가 후 즉시 재생 (musicId 또는 musicId 배열)
    const handlePlay = (musicId) => {
        const musicArray = Array.isArray(musicId) ?
            musicId.map(num => ({ musicId: num })) : [{ musicId: musicId }];
        setAddAndPlay(musicArray);
    };

    // 재생목록에 추가만
    const handlePlay2 = (musicId) => {
        const musicArray = Array.isArray(musicId) ?
            musicId.map(num => ({ musicId: num })) : [{ musicId: musicId }];
        setAddPlaylist(musicArray);
    };
    
    // 음악 정보 초기 데이터
    useEffect(() => {
        // 음악 정보 불러오기
        const fetchMusicDetail = async() => {
            await axios.get('/api/music/getMusic', {
                params: { musicId }
            }).then((result)=>{
                setMusicDetail(result.data.music);
            }).catch((err)=>{ console.error(err); })
        }
        fetchMusicDetail();
        fetchLikeCount(); // 좋아요 개수 불러오기
        fetchReply(); // 댓글 정보 불러오기

        // 좋아요 상태 설정
        if(loginUser.memberId){
            jaxios.get('/api/community/getLikes', {
                params: { pagetype: 'MUSIC', memberId: loginUser.memberId }
            }).then((result)=>{
                if(result.data.likesList?.some(likes => likes.musicId == musicId)){
                    setLike(true);
                }
            }).catch((err)=>{ console.error(err); })
        }
    }, [musicId]);

    // 좋아요 개수 불러오기
    const fetchLikeCount = async () => {
        await axios.get('/api/community/getLikeCount', {
            params: { pageType: 'MUSIC', entityId: musicId }
        }).then((result) => {
            setLikeCount(result.data.likeCount);
        }).catch((error) => {
            console.error('좋아요 개수 불러오기 실패', error);
        })
    }

    // 좋아요 추가, 취소
    const handleLike = async () => {
        if(!loginUser.memberId){
            alert('로그인이 필요한 서비스입니다');
        }else{
            await jaxios.post('/api/community/insertLikes', null, {
                params: {entityId: musicId, pagetype: 'MUSIC', memberId: loginUser.memberId} })
            .then((result)=>{
                console.log(result.data.msg)
                setLike(prevLike => !prevLike);
                fetchLikeCount(); // 좋아요 총 개수 조회
            }).catch((err)=>{console.error(err);})
        }
    }

    // 플리 추가 모달 열기
    const handleAddToPlaylist = () => {
        setShowPlaylistModal(true);
    };

    // 장바구니 담기
    async function insertCart(){
        if(!loginUser.memberId){
            alert('로그인이 필요한 서비스입니다');
            navigate('/login');
        }else{
             try{
                const response = await jaxios.post('/api/cart/insertCart', {
                    memberId: loginUser.memberId,
                    musicIdList: [musicId]
                });
                navigate('/mypage/mp3/pending');
            }catch(error){
                console.error('장바구니 담기 실패', error)
            }
        }
    }

    // 가사 더보기
    const toggleLyrics = () => {
        setExpandedLyrics((prev) => !prev);
    };

    // Reply UI를 재조회하여 댓글추가후 재 조회하는 함수

    const fetchReply = async () => {
        await axios.get('/api/community/getReplyList', {
            params: { pagetype:'MUSIC', entityId: musicId }
        })
        .then((result) => {
            // 서버로부터 받은 댓글 데이터로 상태 업데이트
            setReplyMusicList([...result.data.replyList]);
        })
        .catch((err) => { console.error(err); });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        // 로그인 여부 확인
        if (!loginUser.memberId){ alert("로그인하세요"); return; }

        // 빈칸 return
        if (!content.trim()){ alert('내용을 입력해주세요'); return; }

        setNickname(loginUser.nickname);

        jaxios.post('/api/community/insertReply', {nickname, content}, {
            params: { pagetype:'MUSIC', entityId: musicId, memberId: loginUser.memberId}
        }).then((result)=>{
            if(result.data.msg === 'yes'){
                alert('댓글이 추가되었습니다.');
                setContent('');
                fetchReply();
                navigate(`/music/${musicId}`);
            }
        }).catch((err)=>{ console.error(err); })
    };

    if (!musicDetail) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            {/* 음악 상세 정보 */}
            <div className={styles.detailHeader}>
                <img src={musicDetail.image} alt={musicDetail.title} className={styles.image} />
                <div className={styles.info}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.title}>{musicDetail.title}</h1>
                        <button
                            className={styles.likeButton}
                            onClick={handleLike}>
                            { like ? <HiHeart size={20}/> : <HiOutlineHeart size={20}/> }
                            &nbsp;{likeCount}
                        </button>
                    </div>
                    <p className={styles.artist} 
                        onClick={
                            ()=>{ navigate(`/artist/${musicDetail.artistId}`) }
                        }>By&nbsp; 
                        <span style={{cursor: "pointer"}}>
                            {musicDetail.artistName}
                        </span>
                    </p>
                    <p className={styles.genre}>장르: {musicDetail.genre}</p>

          
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.playButton}
                            onClick={()=>{handlePlay(musicDetail.musicId)}}>
                                <FaPlay size={14}/>&nbsp;재생
                        </button>
                        <button
                            className={styles.addButton}
                            onClick={()=>{handlePlay2(musicDetail.musicId)}}>
                                <MdQueueMusic size={22}/>&nbsp;다음곡 추가
                        </button>
                        <button
                            className={styles.addButton}
                            onClick={handleAddToPlaylist}>
                                <MdLibraryMusic size={20}/>&nbsp;플레이리스트 추가
                        </button>
                        <button
                            className={styles.purchaseButton}
                            onClick={insertCart}>
                                <BsFileEarmarkMusicFill size={16}/>&nbsp;구매
                        </button>
                    </div>
                </div>
            </div>

            {/* 가사 영역 */}
            <div className={styles.lyricsSection}>
                <h3>가사</h3>
                <div className={styles.lyrics}>
                {expandedLyrics
                    ? musicDetail.lyrics
                    : musicDetail.lyrics.slice(0, 200) + (musicDetail.lyrics.length > 200 ? "..." : "")}
                </div>
                {musicDetail.lyrics.length > 200 && (
                <button className={styles.toggleButton} onClick={toggleLyrics}>
                    {expandedLyrics ? "가사 접기" : "더보기"}
                </button>
                )}
            </div>

            <div className={styles.albumSection}>
                <h3>수록 앨범</h3>
                <div className={styles.album}>
                    <div><img src={musicDetail.image}  className={styles.albumImage} 
                        onClick={()=>{navigate(`/album/${musicDetail.albumId}`)}} style={{cursor:'pointer'}}/></div>
                    <div className={styles.albumTitle}
                        onClick={()=>{navigate(`/album/${musicDetail.albumId}`)}} style={{cursor:'pointer'}}
                    >{musicDetail.albumTitle}</div>
                    <div className={styles.albumArtist}
                        onClick={()=>{navigate(`/artist/${musicDetail.artistId}`)}} style={{cursor:'pointer'}}
                    >{musicDetail.artistName}</div>
                </div>
            </div>

            {/* 댓글 영역 */}
            <div className={styles.commentsSection}>
                <h2>댓글</h2>
                <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="댓글을 입력하세요..."
                        className={styles.commentInput}
                    />
                    <button type="submit" className={styles.submitButton}> 댓글 작성
                    </button>
                </form>
                <div className={styles.commentsList}>
                    {                    
                        (replyMusicList && replyMusicList.length > 0) ? (
                            replyMusicList.map((replyMusic, idx)=>{
                                return(
                                    <div className={styles.commentItem} key={idx}>
                                        <p className={styles.commentAuthor}>{replyMusic.member.memberId}</p>
                                        <p className={styles.commentContent}>{replyMusic.content}</p>
                                        <small className={styles.commentDate}>{replyMusic.indate.substring(0, 10)}</small>
                                    </div>
                                )
                            })
                        ):(<div>댓글이 없습니다.</div>)
                    }
                </div>
            </div>

            {/* 플레이리스트 선택 모달 */}
            {showPlaylistModal && (
                <PlaylistSelectModal
                    musicIdList={[musicId]}
                    onClose={() => setShowPlaylistModal(false)}
                />
            )}
        </div>
    );
};

export default MusicDetail;
