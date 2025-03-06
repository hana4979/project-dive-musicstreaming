// src/components/Footer.jsx
import React from 'react';
import styles from '../../css/footer.module.css'; // CSS 모듈 사용 (선택)

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.companyInfo}>
        {/* 첫 줄: 회사명, 사업자등록번호, 대표자명 */}
        <p>
          <strong>(주) 예시회사</strong> | 사업자등록번호: 000-00-00000 | 대표: 홍길동
        </p>

        {/* 둘째 줄: 주소, 연락처 */}
        <p>
          주소: 서울특별시 어딘가구 무슨동 123-45 | 전화: 02-123-4567 | 이메일: info@example.com
        </p>

        {/* 셋째 줄: 통신판매업 신고번호 등 */}
        <p>
          통신판매업 신고: 2023-서울-0000 | 호스팅 제공자: (주)예시호스팅
        </p>

        {/* 넷째 줄: 저작권 표시 등 */}
        <p>
          COPYRIGHT © 2023 <strong>예시회사</strong>. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
