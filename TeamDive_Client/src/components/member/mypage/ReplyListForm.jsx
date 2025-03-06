import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import jaxios from '../../../util/JwtUtil'

import mypageReplyStyle from '../../../css/mypage/mypageReply.module.css'

const ReplyListForm = () => {
  const loginUser = useSelector((state) => state.user)
  const [replyList, setReplyList] = useState([])
  const [category, setCategory] = useState('artist')
  // const { replyId } = useParams
  const navigate = useNavigate()

  useEffect(() => {
    if (!loginUser) {
      alert('로그인이 필요한 서비스입니다.')
      navigate('/login')
      return
    }
    fetchCategory(category)
  }, [loginUser, category, navigate])

  function fetchCategory(selectedCategory) {
    jaxios
      .get('/api/community/getReplyListUser', {
        params: { pageType: selectedCategory, memberId: loginUser.memberId },
      })
      .then((result) => {
        setReplyList(result.data.replyList)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  function deleteReply(replyId) {
    if (!window.confirm('해당 댓글을 삭제하시겠습니까?')) {
      return
    }
    jaxios
      .delete(`/api/community/deleteReply/${replyId}`)
      .then((result) => {
        if (result.data.msg === 'yes') {
          alert('댓글이 삭제되었습니다.')
          // navigate('/mypage/replyListForm')
          setReplyList((prev) => prev.filter((reply) => reply.replyId !== replyId));

        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <section className={mypageReplyStyle.mypageReplyContainer}>
      <h1 className={mypageReplyStyle.mypageReplyTitle}>댓글 리스트</h1>

      {/* 카테고리 선택 */}
      <div className={mypageReplyStyle.mypageReplyCategoryButtons}>
        {['ARTIST', 'ALBUM', 'MUSIC'].map((type) => (
          <button
            key={type}
            onClick={() => setCategory(type)}
            className={
              category === type ? mypageReplyStyle.mypageReplyCategoryActive : ''
            }
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 테이블 헤더 */}
      <div className={mypageReplyStyle.mypageReplyHeader}>
        <div className={mypageReplyStyle.mypageReplyHeaderItem}>닉네임</div>
        <div className={mypageReplyStyle.mypageReplyHeaderItem}>내용</div>
        <div className={mypageReplyStyle.mypageReplyHeaderItem}>작성일</div>
        <div className={mypageReplyStyle.mypageReplyHeaderItem}>삭제</div>
      </div>

      {/* 댓글 목록 */}
      {replyList && replyList.length > 0 ? (
        replyList.map((reply, idx) => (
          <div className={mypageReplyStyle.mypageReplyRow} key={idx}>
            <div className={mypageReplyStyle.mypageReplyCell}>
              {reply.member.nickname}
            </div>
            <div className={mypageReplyStyle.mypageReplyCell}>
              {reply.content}
            </div>
            <div className={mypageReplyStyle.mypageReplyCell}>
              {reply.indate.substring(0, 10)}
            </div>
            <div className={mypageReplyStyle.mypageReplyCell}>
              <button onClick={()=>deleteReply(reply.replyId)}>삭제</button>
            </div>
          </div>
        ))
      ) : (
        <div className={mypageReplyStyle.mypageReplyNoData}>
          작성한 댓글이 없습니다.
        </div>
      )}
    </section>
  )
}

export default ReplyListForm
