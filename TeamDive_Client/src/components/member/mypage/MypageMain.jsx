import React, { useState, useEffect } from 'react'
import mypageStyle from '../../../css/mypage/mypage.module.css'
import axios from 'axios';
import jaxios from '../../../util/JwtUtil';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Userdefault from '../../../../public/image/user.png'

const MypageMain = () => {
  const [memberShipUserList, setMemberShipUserList] = useState([]);
  const loginUser = useSelector(state => state.user);

  useEffect(() => {
    jaxios
      .get('/api/membership/getActiveMembership', { params: { memberId: loginUser.memberId } })
      .then((result) => {
        console.log('memberShipUserList', result.data);
        setMemberShipUserList(result.data.memberShipUserList);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [loginUser]);

  return (
    <section className={mypageStyle.mypageSection}>
      <h2>회원 정보</h2>
      <div className={mypageStyle.mypageInfo}>
        <div className={mypageStyle.mypageProfile}>
          <img
            className={mypageStyle.mypageProfileImage}
            src={loginUser.image||Userdefault}
          />
          <div className={mypageStyle.mypageProfileDetails}>
            <div className={mypageStyle.mypageField}>
              <label>아이디</label>
              <div>{loginUser.memberId}</div>
            </div>
            <div className={mypageStyle.mypageField}>
              <label>닉네임</label>
              <div>{loginUser.nickname}</div>
            </div>
            <div className={mypageStyle.mypageField}>
              <label>이메일</label>
              <div>{loginUser.email}</div>
            </div>
            <div className={mypageStyle.mypageField}>
              <label>소개</label>
              <div>{loginUser.introduction}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={mypageStyle.mypageMembership}>
        <h2>사용 중인 멤버십</h2>
        <div>
          {memberShipUserList && memberShipUserList.length > 0 ? (
            memberShipUserList.map((memberShipUser, idx) => (
              <section className={mypageStyle.mypageMembershipUser} key={idx}>
                <div className={mypageStyle.mypageField}>
                  <label>멤버십 이름</label>
                  <div>{memberShipUser.membershipName}</div>
                </div>
                <div className={mypageStyle.mypageField}>
                  <label>기간</label>
                  {memberShipUser.startDate.substring(0, 10) +
                    ' ~ ' +
                    memberShipUser.endDate.substring(0, 10)}
                </div>
                {memberShipUser.membershipCategory === 'download' ? (
                  <div className={mypageStyle.mypageField}>
                    <label>남은 횟수</label>
                    <div>{memberShipUser.downloadCount + ' 회'}</div>
                  </div>
                ) : (
                  <div className={mypageStyle.mypageField}>
                    <label>남은 횟수</label>
                    <div>-</div>
                  </div>
                )}
                {/* <button>멤버십 해지</button> */}
              </section>
            ))
          ) : (
            <div>구독한 멤버십이 없습니다.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MypageMain;
