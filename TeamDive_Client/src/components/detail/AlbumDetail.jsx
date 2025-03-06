import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import axios from 'axios';
import jaxios from '../../util/JwtUtil';

import PlaylistSelectModal from './PlaylistSectionModal';

import styles from '../../css/detail/albumDetail.module.css';

/* 아이콘 */
import { MdLibraryMusic } from "react-icons/md";
import { BsFileEarmarkMusicFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { MdQueueMusic } from "react-icons/md";
import { HiOutlineHeart } from "react-icons/hi";
import { HiHeart } from "react-icons/hi";
import { PlayerContext } from '../../context/PlayerContext';

const AlbumDetail = () => {
    const { albumId } = useParams();
    const navigate = useNavigate();
    const loginUser = useSelector((state) => state.user);

    const [albumDetail, setAlbumDetail] = useState(null);
    const [albumReplyList, setAlbumReplyList] = useState([]);
    const [content, setContent] = useState('');
    const [nickname, setNickname] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);



    useEffect(() => {
        // 앨범 상세 정보 조회
        axios.get('/api/music/getAlbum', {
            params: { albumId }
        }).then((res) => {
            console.log(res.data.album);
            setAlbumDetail(res.data.album);
        }).catch((err) => console.error(err));

        fetchReply(); // 댓글 조회
        fetchLikeCount(); // 좋아요 총 개수 조회

        // 로그인 유저의 좋아요 여부 확인
        if (loginUser.memberId) {
            jaxios.get('/api/community/getLikes', {
                params: { pagetype: 'ALBUM', memberId: loginUser.memberId }
            }).then((result)=>{
                if(result.data.likesList.some(likes => likes.albumId == albumId)){
                    setIsLiked(true);
                }
            }).catch((err)=>{console.error(err);})
        }
    }, [albumId]);


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
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedMusicId, setSelectedMusicId] = useState(null);
    const [musicIdList, setMusicIdList] = useState([selectedMusicId]);
    const handleAddToPlaylist = (musicId) => {
        setSelectedMusicId(musicId);
        setShowPlaylistModal(true);
    };
     // 장바구니 추가
    async function insertCart(musicId) {
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
            }catch (error) {
                console.error('장바구니 담기 실패', error);
            }
        }
    }





    // 좋아요 개수 불러오기
    const fetchLikeCount = async () => {
        await axios.get('/api/community/getLikeCount', {
            params: { pageType: 'ALBUM', entityId: albumId }
        }).then((result) => {
            setLikeCount(result.data.likeCount);
        }).catch((error) => {
            console.error('좋아요 개수 불러오기 실패', error);
        })
    }

    // 좋아요 추가 / 취소
    const handleLike = async () => {
        if (!loginUser || !loginUser.memberId) {
            alert('로그인이 필요한 서비스입니다.');
        }else{
            await jaxios.post('/api/community/insertLikes', null, {
              params: { entityId: albumId, pagetype: 'ALBUM', memberId: loginUser.memberId } 
            }).then((result)=>{
                console.log(result.data.msg)
                setIsLiked(prevLike => !prevLike);
                fetchLikeCount();
            }).catch((err)=>{console.error(err);})
        }
    }

    // 댓글 불러오기
    const fetchReply = () => {
        axios.get('/api/community/getReplyList', {
            params: { pagetype: 'ALBUM', entityId: albumId },
        }).then((result) => {
            setAlbumReplyList(result.data.replyList);
        }).catch((err) => { console.error(err); });
    };

    // 댓글 등록
    const handleCommentSubmit = (e) => {
        e.preventDefault();

        if (!loginUser?.memberId) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }

        if (!content.trim()) {
            alert('댓글을 입력해주세요.');
            return;
        }

        setNickname(loginUser.nickname);
    
        jaxios.post('/api/community/insertReply', {nickname, content}, {
          params: {pagetype: 'ALBUM', entityId: albumId, memberId: loginUser.memberId}
        }).then((result) => {
            if (result.data.msg === 'yes') {
                alert('댓글이 추가되었습니다.');
                setContent('');
                fetchReply(); 
            }
        }).catch((err) => { console.error(err); });
    };


  
    // 음악 상세보기로 이동
    const handleTrackClick = (musicId) => {
        navigate(`/music/${musicId}`);
    };

    // 앨범 상세정보가 없을 경우
    if (!albumDetail) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            {/* 앨범 상단 영역 */}
            <div className={styles.albumHeader}>
                <div className={styles.cover}>
                    <img
                      src={albumDetail.image}

                      className={styles.albumImage}
                    />
                </div>
                <div className={styles.info}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.albumTitle}>{albumDetail.title}</h1>
                        <button
                            className={`${styles.likeButton}`}
                            onClick={handleLike}>
                            { isLiked ? <HiHeart size={20}/> : <HiOutlineHeart size={20}/> }
                            &nbsp;{likeCount}
                        </button>
                    </div>
                    
                    <p className={styles.artistName}>
                        <span
                            onClick={() => {
                              navigate(`/artist/${albumDetail.artistId}`);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            {albumDetail.artistName}
                        </span>
                    </p>
                    {/* 발매일, 추가 정보 */}
                    <p className={styles.albumMeta}>
                        {albumDetail.indate.substring(0, 10)}
                        <span className={styles.divider}>|</span>
                        {/* 필요한 추가 정보 */}
                    </p>

                    {/* 버튼들 */}
                    <div className={styles.buttonGroup}>
                        <button className={styles.playButton} onClick={()=>{handlePlay(albumDetail.musicList.map(id => id.musicId))}}>
                            <FaPlay size={14}/>&nbsp;전체재생
                        </button>
                    </div>
                </div>
            </div>

            {/* 수록곡 목록 테이블 */}
            <div className={styles.trackListSection}>
                <table className={styles.trackTable}>
                    <thead>
                        <tr>
                            <th className={styles.thNumber}>#</th>
                            <th className={styles.thTitle}>곡</th>
                            <th className={styles.thArtist}>아티스트</th>
                            <th className={styles.thActions}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {albumDetail.musicList.map((track, index) => (
                            <tr key={track.musicId} className={styles.trackRow}>
                                <td className={styles.thNumber}>
                                    {index + 1}
                                </td>
                                <td
                                    className={styles.thTitle}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleTrackClick(track.musicId)}>
                                    {track.title}
                                </td>
                                <td className={styles.thArtist}>
                                    <span
                                        onClick={() => {
                                            navigate(`/artist/${track.artistId}`);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {albumDetail.artistName}
                                    </span>
                                </td>
                                <td className={styles.thActions}>
                                    <button
                                        className={styles.iconButton}
                                        onClick={()=>{handlePlay(track.musicId)}}
                                    >
                                        <FaPlay size={16}/>
                                    </button>
                                    <button
                                        className={styles.iconButton}
                                        onClick={()=>{handlePlay2(track.musicId)}}
                                    >
                                        <MdQueueMusic size={22}/>
                                    </button>
                                    <button
                                        className={styles.iconButton}
                                        onClick={() => handleAddToPlaylist(track.musicId)}
                                    >
                                        <MdLibraryMusic size={20}/>
                                    </button>
                                    <button
                                        className={styles.iconButton}
                                        onClick={() => insertCart(track.musicId)} 
                
                                    >
                                        <BsFileEarmarkMusicFill size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                    <button type="submit" className={styles.submitButton}>
                        댓글 작성
                    </button>
                </form>
                <div className={styles.commentsList}>
                    {albumReplyList && albumReplyList.length > 0 ? (
                        albumReplyList.map((replyData, idx) => (
                            <div className={styles.commentItem} key={idx}>
                                <p className={styles.commentAuthor}>{replyData.member.memberId}</p>
                                <p className={styles.commentContent}>{replyData.content}</p>
                                <small className={styles.commentDate}>
                                    {replyData.indate.substring(0, 10)}
                              </small>
                          </div>
                      ))
                    ) : (
                      <div className={styles.commentsList}>댓글이 없습니다.</div>
                    )}
                </div>
            </div>

            {/* 플레이리스트 선택 모달 */}
            {showPlaylistModal && (
                <PlaylistSelectModal
                    musicIdList={[selectedMusicId]}
                    onClose={() => setShowPlaylistModal(false)}
                />
            )}
        </div>
    );
};

export default AlbumDetail;
