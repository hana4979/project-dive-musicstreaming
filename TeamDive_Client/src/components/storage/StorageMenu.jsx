import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../../css/storage/storage.module.css";

const StorageMenu = () => {
  const location = useLocation();

  return (
    <div className={styles.tabMenu}>
      <Link
        to="/storage/likedMusic"
        className={`${styles.tabButton} ${
          location.pathname.includes("likedMusic") ? styles.active : ""
        }`}
      >
        노래
      </Link>

      <Link
        to="/storage/likedArtist"
        className={`${styles.tabButton} ${
          location.pathname.includes("likedArtist") ? styles.active : ""
        }`}
      >
        아티스트
      </Link>

      <Link
        to="/storage/likedAlbum"
        className={`${styles.tabButton} ${
          location.pathname.includes("likedAlbum") ? styles.active : ""
        }`}
      >
        앨범
      </Link>

      <Link
        to="/storage/myPlaylist"
        className={`${styles.tabButton} ${
          location.pathname.includes("myPlaylist") ? styles.active : ""
        }`}
      >
        플레이리스트
      </Link>

    </div>
  );
};

export default StorageMenu;
