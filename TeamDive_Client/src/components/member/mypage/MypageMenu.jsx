import React from 'react'
import { Link } from 'react-router-dom'
import mypageStyle from '../../../css/mypage/mypage.module.css'

const MypageMenu = () => {
  return (
    <div className={mypageStyle.mypageMenu}>
      <Link to="/mypage/myPageMain" className={mypageStyle.mypageMenuLink}>
        홈
      </Link>
      <Link to="/mypage/updateMemberForm" className={mypageStyle.mypageMenuLink}>
        개인정보 수정
      </Link>
      <Link to="/mypage/mp3" className={mypageStyle.mypageMenuLink}>
        MP3
      </Link>
      <Link to="/mypage/gift" className={mypageStyle.mypageMenuLink}>
        선물함
      </Link>
      <Link to="/mypage/replyListForm" className={mypageStyle.mypageMenuLink}>
        댓글 리스트
      </Link>
    </div>
  )
}

export default MypageMenu
