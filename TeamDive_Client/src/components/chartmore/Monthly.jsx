import React, { useContext, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import axios from "axios";
import jaxios from "../../util/JwtUtil";
import Pagination from "../Pagination";

import styles from "../../css/chartMore.module.css";
import { PlayerContext } from "../../context/PlayerContext";
import PlaylistSelectModal from "../detail/PlaylistSectionModal";

const Monthly = () => {
  const loginUser = useSelector(state => state.user);
  const navigate = useNavigate();

  // 체크된 곡들을 저장할 상태
  const [selectedItems, setSelectedItems] = useState([]);
  const [monthlyCharts,setMonthlyCharts]=useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = monthlyCharts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(
    ()=>{
      axios.get('/api/music/getMusicChart')
        .then((result)=>{
        console.log(result.data);
        setMonthlyCharts(result.data.Top100Month);
      }).catch((err)=>{ console.error(err);})
    },[]
  );

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
  //플레이리스트 모달
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedMusicId, setSelectedMusicId] = useState(null);
  const handleAddToPlaylist = (musicIds) => {
      const musicArray=Array.isArray(musicIds)? musicIds : [musicIds]
      setSelectedMusicId(musicArray);
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

  // 체크박스 변경 처리
  const handleCheckboxChange = (musicId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, musicId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== musicId));
    }
  };

  const handleSelectedListen = () => {
    handlePlay2(selectedItems);
  };


  // 선택한 곡들 장바구니
  const handleSelectedBuy = async () => {
    if (!loginUser?.memberId) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    
    try {
      await jaxios.post('/api/cart/insertCart', {
        memberId: loginUser.memberId,
        musicIdList: selectedItems,
      });
      navigate('/mypage/mp3/pending');
    } catch (err) {
      console.error('장바구니 담기 실패', err);
    }
  };

  return (
    <div className={styles.container}>
      {/* 상단 영역 */}
      <div className={styles.header}>
        <h1 className={styles.title}>국내 인기차트</h1>
        <div className={styles.buttonGroup}>
          {selectedItems.length === 0 ? (
            // 선택된 곡이 없으면 기존 버튼들
            <>
              <button className={styles.actionBtn} onClick={()=>handlePlay2(currentData.map(item=>item.music.musicId))}>전체듣기</button>
              <button className={styles.actionBtn} onClick={()=>handleAddToPlaylist(currentData.map(item=>item.music.musicId))}>플리 추가</button>
            </>
          ) : (
            // 하나라도 체크되면 보이는 버튼들
            <>
              <button className={styles.actionBtn} onClick={()=>handleSelectedListen()}>
                선택 듣기
              </button>
              <button className={styles.actionBtn} onClick={()=>handleAddToPlaylist(selectedItems)}>
                선택 플리에 추가
              </button>
              <button className={styles.actionBtn} onClick={()=>handleSelectedBuy()}>
                선택 구매
              </button>
            </>
          )}
        </div>
      </div>
      {/* 테이블 영역 */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th className={styles.rankColumn}>순위</th>
            <th>곡</th>
            <th>아티스트</th>
            <th>듣기</th>
            <th>재생목록</th>
            <th>플레이리스트</th>
            <th>MP3</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((music, index) => {
            const isChecked = selectedItems.includes(music.music.musicId);
            return (
              <tr key={music.music.musicId}>
                <td>
                    <label className={styles.customCheckbox}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handleCheckboxChange(music.music.musicId, e.target.checked)
                          }
                        />
                        <span className={styles.checkmark}></span>
                    </label>
                </td>
                <td className={styles.rankColumn}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td onClick={()=>{navigate(`/music/${music.music.musicId}`)}} style={{cursor: "pointer"}}>{music.music.title}</td>
                <td onClick={()=>{navigate(`/artist/${music.music.artistId}`)}} style={{cursor: "pointer"}}>{music.music.artistName}</td>
                <td>
                  <button
                    className={styles.optionBtn}
                    onClick={() => handlePlay(music.music.musicId)}
                  >
                    듣기
                  </button>
                </td>
                <td>
                  <button
                    className={styles.optionBtn}
                    onClick={() => handlePlay2(music.music.musicId)}
                  >
                    추가
                  </button>
                </td>
                <td>
                  <button
                    className={styles.optionBtn}
                    onClick={() => handleAddToPlaylist(music.music.musicId)}
                  >
                    플레이리스트
                  </button>
                </td>
                <td>
                  <button
                    className={styles.optionBtn}
                    onClick={() => insertCart(music.music.musicId)}
                  >
                    구매
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        totalCount={monthlyCharts.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {/* 플레이리스트 선택 모달 */}
      {showPlaylistModal && (
          <PlaylistSelectModal
              musicIdList={selectedMusicId}
              onClose={() => setShowPlaylistModal(false)}
          />
      )}
    </div>
  );
};
export default Monthly;