import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import jaxios from "../../util/JwtUtil";
import styles from "../../css/detail/playlistDetail.module.css";
import { PlayerContext } from "../../context/PlayerContext";
import axios from "axios";


import { HiOutlineHeart } from "react-icons/hi";
import { HiHeart } from "react-icons/hi";

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const loginUser = useSelector((state) => state.user);

  // 플레이리스트 정보
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  // 체크박스
  const [selectedItems, setSelectedItems] = useState([]);

  // 수정 
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedCoverImage, setEditedCoverImage] = useState(""); 
  const [coverFile, setCoverFile] = useState(null);       
  const [preview, setPreview] = useState("");         
  const [likeCount, setLikeCount] = useState(0);


  const [isLiked, setIsLiked] = useState(false);
  
  const handleLike = () => {
    jaxios.post('/api/community/insertLikes',null,{params:{entityId: playlistId, pagetype: 'PLAYLIST', memberId: loginUser.memberId}})
    .then((result)=>{
        setIsLiked(prevLike => !prevLike);
    }).catch((err)=>{console.error(err);})
  }
 
  // 좋아요 개수 불러오기
  const fetchLikeCount = async () => {
    await axios.get('/api/community/getLikeCount', {
        params: { pageType: 'PlAYLIST', entityId: playlistId }
    }).then((result) => {
        setLikeCount(result.data.likeCount);
    }).catch((error) => {
        console.error('좋아요 개수 불러오기 실패', error);
    })
  }


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
  
  // 플레이리스트 불러오기
  useEffect(() => {
    jaxios.get('/api/community/getLikes',{params:{pagetype: 'PLAYLIST',memberId: loginUser.memberId}})
    .then((result)=>{
        if(result.data.likesList?.some(likes => likes.playlistId == playlistId)){
          console.log('result.data.likesList',result.data.likesList)
          setIsLiked(true);
        }
    }).catch((err)=>{console.error(err);})

    fetchLikeCount();



    if (!playlistId) return;
    axios
      .get("/api/music/playlistDetail", { params: { playlistId } })
      .then((res) => {
        setPlaylist(res.data.playlist);
      })
      .catch((err) => {
        console.error("플레이리스트 정보 불러오기 실패:", err);
      })
      .finally(() => setLoading(false));
  }, [playlistId]);


  // 선택된 곡 삭제
  const handleDeleteMusic = () => {

    jaxios
      .post(
        "/api/music/updatePlaylistDeleteMusic",selectedItems,
        
        { params: { playlistId  } }  
      )
      .then((res) => {
        if (res.data.msg === "yes") {

          if(confirm("선택한 곡을 삭제하시겠습니까?")) {
              alert("선택된 곡이 플레이리스트에서 삭제되었습니다.");
          } else {
            return;
          }

          setPlaylist((prev) => {
            const filtered = prev.musicList.filter(
              (music) => !selectedItems.includes(music.musicId)
            );
            return { ...prev, musicList: filtered };
          });

          setSelectedItems([]);
        }
      })
      .catch((err) => {
        console.error("선택곡 삭제 실패:", err);
      });
  };


  useEffect(() => {
    if (playlist) {
      setEditedTitle(playlist.title || "");
      setEditedContent(playlist.content || "");
      setEditedCoverImage(playlist.coverImage || ""); 
      setPreview(playlist.coverImage || "");        
      setCoverFile(null);                          
    }
  }, [playlist]);

  if (loading) {
    return <p className={styles.loading}>로딩 중...</p>;
  }
  if (!playlist) {
    return <p className={styles.errorMsg}>플레이리스트를 찾을 수 없습니다.</p>;
  }

  
  const handleCoverFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if(playlist.coverImage){
        const response=await jaxios.delete('/api/music/deleteFile',{params:{file:playlist.coverImage}});
      }
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
      // setCoverFile(file);
     
      const formData = new FormData();
      formData.append("image", file);

      const res = await jaxios.post("/api/music/imageUpload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.image) {
     
        setEditedCoverImage(res.data.image);
        console.log("이미지 업로드 성공:", res.data.image);
      } else {
        console.error("이미지 업로드 실패:", res.data);
        alert("이미지 업로드 실패");
      }
    } catch (err) {
      console.error("이미지 업로드 에러:", err);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleSave = () => {
    if(!editedTitle.trim()) {
      alert('제목을 입력해주세요!');
      return;
    }

    jaxios
      .post("/api/music/updatePlaylist", {
        playlistId: Number(playlistId),
        title: editedTitle,
        coverImage: editedCoverImage, 
        content: editedContent,
      })
      .then((res) => {
        if (res.data.msg === "yes") {
          alert("플레이리스트가 수정되었습니다.");
          setPlaylist({
            ...playlist,
            title: editedTitle,
            coverImage: editedCoverImage,
            content: editedContent,
          });
          setIsEditing(false);
        }
      })
      .catch((err) => {
        console.error("플레이리스트 수정 실패:", err);
      });
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    
    if (playlist) {
      setEditedTitle(playlist.title || "");
      setEditedContent(playlist.content || "");
      setEditedCoverImage(playlist.coverImage || "");
      setPreview(playlist.coverImage || "");
      setCoverFile(null);
    }
  };

  // 플리삭제
  const deletePlaylist = () => {
    if (!confirm("플레이리스트를 삭제할까요?")) return;
    jaxios
      .delete("/api/music/deletePlaylist", { params: { PlaylistId: playlistId } })
      .then((res) => {
        if (res.data.msg === "yes") {
          alert("플레이리스트가 삭제되었습니다.");
          navigate("/storage/myPlaylist");
        }
      })
      .catch((error) => {
        console.log("플리 삭제 오류 : " + error);
      });
  };

  // 체크박스
  const handleCheckboxChange = (musicId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, musicId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== musicId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = playlist.musicList.map((m) => m.musicId);
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectedPlay = () => {
    handlePlay2(selectedItems);
  };

  const handleSelectedBuy = async () => {
    if (!loginUser?.memberId) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    if (selectedItems.length === 0) {
      alert('구매할 곡을 선택하세요.');
      return;
    }

    try {
      await jaxios.post('/api/cart/insertCart', {
        memberId: loginUser.memberId,
        musicIdList: selectedItems,
      });
      alert('선택된 곡들이 장바구니에 담겼습니다.');
      navigate('/mypage/mp3/pending');
    } catch (err) {
      console.error('장바구니 담기 실패', err);
    }
  };

  async function insertCart(mId) {
    if (!loginUser) {
      alert("로그인이 필요한 서비스입니다");
      navigate("/login");
    } else {
      try {
        const response = await jaxios.post("/api/cart/insertCart", {
          memberId: loginUser.memberId,
          musicIdList: [mId], // ★ 클릭된 곡의 ID만 전송
        });
        navigate('/mypage/mp3/pending');
      } catch (error) {
        console.error("장바구니 담기 실패", error);
      }
    }
  }
  
  


  // const handleBuy = async (music) => {
  //   if (!loginUser?.memberId) {
  //     alert('로그인이 필요한 서비스입니다.');
  //     navigate('/login');
  //     return;
  //   }

  //   try {
  //     await jaxios.post('/api/cart/insertCart', {
  //       memberId: loginUser.memberId,
  //       musicIdList: [music.musicId],
  //     });
  //     navigate('/storage/myMP3/pending');
  //   } catch (err) {
  //     console.error('장바구니 담기 실패', err);
  //   }
  // };

  const allChecked =
    playlist.musicList.length > 0 &&
    selectedItems.length === playlist.musicList.length;


  return (
    <div className={styles.container}>
      {/* 플레이리스트 헤더 */}
      <div className={styles.header}>
          {isEditing ? (
         
            <div className={styles.editCoverContainer} onClick={()=>document.getElementById("imageUpload").click()}>
      

              {preview ? (
                <img
                  src={preview}
                  className={styles.coverImage}
                  
                />
              ) : (
                <div className={styles.previewPlaceholder}></div>
              )}

              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleCoverFileChange}
                className={styles.editInput}
                style={{display:'none'}}
              />
            </div>
          ) : (
            // 보기 모드
            <img
              src={playlist.coverImage}
              className={styles.coverImage}
            />
          )}

          <div className={styles.info}>
            {isEditing ? (
              <div className={styles.editForm}>
                <label>제목</label>
        
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className={`${styles.editInput} ${styles.editTitleInput}`}
                />

                <label>내용</label>
       
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={4}
                  className={`${styles.editTextarea} ${styles.editContentTextarea}`}
                />
                <div className={styles.editButtonGroup}>
                  <button onClick={handleSave} className={styles.saveBtn}>저장</button>
                  <button onClick={handleCancelEdit} className={styles.cancelBtn}>취소</button>
                </div>
              </div>
            ) : (
              <>
              <div className={styles.headerInfo}>
                <h1 className={styles.title}>
                  {playlist.title}

                  <button
                      className={`${styles.likeButton}`}
                          onClick={handleLike}
                  >
                      { isLiked ? <HiHeart size={20}/> : <HiOutlineHeart size={20}/> }  &nbsp;{likeCount}
                  </button>
                </h1>

                {
                  (playlist.memberId === loginUser.memberId)
                  ?

                <div className={styles.editGroup}>
                  <span
                    className={styles.editIcon}
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️
                  </span>
                  <button className={styles.deleteBtn} onClick={deletePlaylist}>
                    삭제
                  </button>
                  </div>

                  :
                  null

                }
              </div>
              <span className={styles.writer}>작성자 : {playlist.nickname}</span>
                <p className={styles.content}>{playlist.content}</p>
                <p className={styles.trackCount}>
                  곡 : {playlist.musicList.length}곡
                </p>

              </>
            )}
          </div>
        </div>
        


      {/* 기본상태 노래리스트임 */}
      {!isEditing && (
        <>
          <div className={styles.actionBar}>
            <label className={styles.customCheckbox}>
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <span className={styles.checkmark}></span>
              전체선택
            </label>

            {selectedItems.length > 0 && (
              <div className={styles.selectedActions}>
                <button onClick={handleSelectedPlay}>선택곡 재생</button>
                <button onClick={handleSelectedBuy}>선택곡 구매</button>
                {(loginUser.memberId == playlist.memberId)?
                <button onClick={handleDeleteMusic} style={{  background: '#e74c3c'}}>선택곡 삭제</button>
                : null}
              </div>
            )}
          </div>

          <div className={styles.songList}>
            <div className={styles.songTable}>
                <span className={styles.thChk}>선택</span>
                <span className={styles.thTitle}>곡</span>
                <span className={styles.thArtist}>아티스트</span>
                <span className={styles.thActions}></span>
            </div>
            {playlist.musicList.map((music) => {
              const isChecked = selectedItems.includes(music.musicId);
              return (
                <div key={music.musicId} className={styles.songItem}>
                  <label className={styles.customCheckbox}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        handleCheckboxChange(music.musicId, e.target.checked)
                      }
                    />
                    <span className={styles.checkmark}></span>
                  </label>

                  <img src={music.image} className={styles.songImage} alt="" />
                  <div className={styles.songInfo}>
                    <p className={styles.songTitle}>
                      <span
                        onClick={() => navigate(`/music/${music.musicId}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {music.title}
                      </span>
                    </p>
                    <p className={styles.songArtist}>
                      <span
                        onClick={() => navigate(`/artist/${music.artistId}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {music.artistName}
                      </span>
                    </p>
                  </div>

                  <div className={styles.songActions}>
                    <button
                      className={styles.iconButton}
                      onClick={()=>{handlePlay(music.musicId)}}
                    >
                      듣기
                    </button>
                    <button
                      className={styles.iconButton}
                      onClick={()=>{handlePlay2(music.musicId)}}
                    >
                      재생목록+
                    </button>
                    <button
                      className={styles.iconButton}
                      onClick={() => insertCart(music.musicId)} 

                    >
                      MP3
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default PlaylistDetail;
