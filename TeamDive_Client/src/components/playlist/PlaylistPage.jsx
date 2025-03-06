import React, { useState, useEffect } from "react";
import styles from "../../css/playlistPage.module.css";
import axios from "axios";

const PlaylistPage = () => {
  const [divePick, setDivePick] = useState([]);
  const [hotPlaylist, setHotPlaylist] = useState([]);
  const [randomPlaylist, setRandomPlaylist] = useState([]);

  useEffect(() => {
    const playlistPage = async () => {
      try {
        const result = await axios.get("/api/music/getPlaylistPage");
        const data = result.data;
        setDivePick(data.divePick || []);
        setHotPlaylist(data.hotPlaylist || []);
        setRandomPlaylist(data.randomPlaylist || []);
      } catch (error) {
        console.error("오류 : ", error);
      }
    };

    playlistPage();
  }, []);

 
  const refreshRandomPlaylist = async () => {
    try {
      const result = await axios.get("/api/music/getPlaylistPage");
      const data = result.data;
      setRandomPlaylist(data.randomPlaylist || []);
    } catch (error) {
      console.error("오류 : ", error);
    }
  };


  const rotateGif = () => (
    <img
      src="/public/icon/rotate.gif"
      alt="rotate icon"
      className={styles.rotateIcon}
    />
  );

  return (
    <div className={styles.container}>
      {/* Dive PICK 섹션 */}
      <div className={styles.recommendPlaylist}>
        <div className={styles.sectionHeader}>
          <span className={styles.spanTitle}>Dive PICK</span>
        </div>
        <div className={styles.recommendSection}>
          {divePick.slice(0, 5).map((item, idx) => (
            <div
              key={idx}
              className={styles.recommendCard}
              style={{ backgroundImage: `url(${item.coverImage})` }}
            >
              <p className={styles.pTitle}>{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HOT 플레이리스트 섹션 */}
      <div className={styles.genrePlaylist}>
        <div className={styles.sectionHeader}>
          <span className={styles.spanTitle}>
            HOT<span style={{ color: "white" }}>🔥</span> 플리
          </span>
        </div>
        <div className={styles.genreSection}>
          {hotPlaylist.slice(0, 5).map((item, idx) => (
            <div
              key={idx}
              className={styles.genreCard}
              style={{ backgroundImage: `url(${item.coverImage})` }}
            >
              <p className={styles.pTitle}>{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 랜덤 추천 플레이리스트 섹션 */}
      <div className={styles.randomPlaylist}>
        <div className={styles.sectionHeader}>
          <span className={styles.spanTitle}>이런 플리는 어떨까요?</span>
          <span onClick={refreshRandomPlaylist}>
            {rotateGif()}
          </span>
        </div>
        <div className={styles.randomSection}>
          {randomPlaylist.map((item, idx) => (
            <div
              key={idx}
              className={styles.randomCard}
              style={{ backgroundImage: `url(${item.coverImage})` }}
            >
              <p className={styles.pTitle}>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { PlaylistPage };
