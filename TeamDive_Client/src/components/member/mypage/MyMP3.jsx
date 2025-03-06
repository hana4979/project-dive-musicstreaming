import React, { useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";

import PurchasedMp3 from "./PurchasedMp3";
import PendingMp3 from "./PendingMp3";

import styles from "../../../css/storage/storage.module.css";

const MyMP3 = () => {
  const { mp3Category } = useParams(); // purchased or pending
  const location = useLocation();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!mp3Category) {
      navigate("/mypage/mp3/purchased");
    }
  }, [mp3Category, navigate]);

  return (
    <div>
      <nav className={styles.subTabMenu}>
        <Link
          to="/mypage/mp3/purchased"
          className={`${styles.tabButton} ${
            location.pathname.includes("purchased") ? styles.active : ""
          }`}
        >
          구매한 MP3
        </Link>
        <Link
          to="/mypage/mp3/pending"
          className={`${styles.tabButton} ${
            location.pathname.includes("pending") ? styles.active : ""
          }`}
        >
          구매할 MP3
        </Link>
      </nav>

      <div className={styles.mp3ContentArea}>

        {mp3Category === "purchased" && <PurchasedMp3 />}
        {mp3Category === "pending" && <PendingMp3 />}
        
      </div>
    </div>
  );
};

export default MyMP3;
