import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import jaxios from '../../../util/JwtUtil'

import giftStyle from '../../../css/mypage/gift.module.css' // 새로 만든 CSS

const Gift = () => {
  const loginUser = useSelector((state) => state.user)
  const [giftList, setGiftList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getGiftList()
  }, [])

  /* 선물 받은 미사용 목록 가져오기 */
  const getGiftList = async () => {
    try {
      const response = await jaxios.get('/api/membership/getGiftList', {
        params: { giftTo: loginUser.memberId },
      })
      setGiftList(response.data.giftList)
    } catch (error) {
      console.error('선물 리스트 불러오기 실패', error)
    }
  }

  /* 선물 받은 멤버십 활성화 */
  async function onActivateMembership(giftFrom, giftId, membershipCategory) {
    const check = window.confirm(`${giftFrom}님의 선물을 사용하겠습니까?`)
    if (check) {
      try {
        const response = await jaxios.post(
          '/api/membership/membershipActivate',
          null,
          { params: { giftId, membershipCategory } }
        )
        if (response.data.message === 'yes') {
          alert('멤버십이 활성화 되었습니다')
          getGiftList()
        } else {
          alert('이미 활성화된 멤버십이 있습니다')
        }
      } catch (error) {
        console.error('멤버십 활성화 오류', error)
      }
    }
  }

  return (
    <div className={giftStyle.giftContainer}>
      <h2 className={giftStyle.giftTitle}>선물함</h2>

      {giftList && giftList.length > 0 ? (
        <div className={giftStyle.giftGrid}>
          {giftList.map((gift, idx) => (
            <div className={giftStyle.giftRow} key={idx}>
              <div className={giftStyle.giftCell}>{gift.giftName}</div>
              <div className={giftStyle.giftCell}>{gift.membershipDownload}</div>
              <div className={giftStyle.giftCell}>
                {gift.giftDate.substring(0, 10)}
              </div>
              <div className={giftStyle.giftCell}>{gift.giftFrom}</div>
              <div className={giftStyle.giftCell}>
                <button
                  className={giftStyle.giftButton}
                  onClick={() =>
                    onActivateMembership(
                      gift.giftFrom,
                      gift.giftId,
                      gift.membershipCategory
                    )
                  }
                >
                  구독
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={giftStyle.giftNoData}>
          선물받은 구독권이 없습니다...
        </div>
      )}
    </div>
  )
}

export default Gift
