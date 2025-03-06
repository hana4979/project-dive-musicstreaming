import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";


import StorageMenu from "./StorageMenu";
import LikedMusic from "./LikedMusic";
import LikedArtist from "./LikedArtist";
import LikedAlbum from "./LikedAlbum";
import MyPlaylist from "./MyPlaylist";


import styles from "../../css/storage/storage.module.css";

const Storage = () => {
  const loginUser = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { storageCategory } = useParams();

  // 로그인 체크
  useEffect(() => {
    if (!loginUser.memberId) {
      navigate("/login");
    }
  }, [loginUser, navigate]);


  useEffect(() => {
    if (!storageCategory) {
      navigate("/storage/likedMusic");
    }
  }, [storageCategory, navigate]);



  return (
    <div className={styles.storageContainer}>
      <h1 className={styles.pageTitle}>보관함</h1>

      <StorageMenu />


      {storageCategory && (
        <div className={styles.contentArea}>
          {storageCategory === "likedMusic" && <LikedMusic />}
          {storageCategory === "likedArtist" && <LikedArtist />}
          {storageCategory === "likedAlbum" && <LikedAlbum />}
          {storageCategory === "myPlaylist" && <MyPlaylist />}

        </div>
      )}
    </div>
  );
};

export default Storage;
