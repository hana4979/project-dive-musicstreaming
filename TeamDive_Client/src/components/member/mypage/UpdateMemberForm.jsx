import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import jaxios from '../../../util/JwtUtil'
import { useSelector, useDispatch } from 'react-redux'
import Modal from 'react-modal'
import DaumPostcode from 'react-daum-postcode'
import { Cookies } from 'react-cookie'
import { loginAction, logoutAction } from '../../../store/UserSlice'
import Userdefault from '../../../../public/image/user.png'

import updateStyles from '../../../css/mypage/mypageUpdate.module.css'

const UpdateMemberForm = () => {
  const navigate = useNavigate()
  const loginUser = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const cookies = new Cookies()

  const [preview, setPreview] = useState('')
  const [image, setImage] = useState('');

  const [memberId, setMemberId] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [phone, setPhone] = useState('')
  const [nickname, setNickname] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [address, setAddress] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [addressExtra, setAddressExtra] = useState('')
  const [introduction, setIntroduction] = useState('')

  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  const customStyles = {
    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    content: {
      left: '0',
      margin: 'auto',
      width: '500px',
      height: '600px',
      padding: '0',
      overflow: 'hidden',
    },
  }

  useEffect(() => {
    setMemberId(loginUser.memberId)
    setPhone(loginUser.phone)
    setNickname(loginUser.nickname)
    setZipCode(loginUser.zipCode)
    setAddress(loginUser.address)
    setAddressDetail(loginUser.addressDetail)
    setAddressExtra(loginUser.addressExtra)
    setIntroduction(loginUser.introduction)
    setImage(loginUser.image)

    if (loginUser.provider === 'kakao') {
      setPassword('kakao1234')
      setPasswordCheck('kakao1234')
    }
  }, [loginUser])

  const completeHandler = (data) => {
    setZipCode(data.zonecode)
    setAddress(data.address)
    if (data.buildingName !== '') {
      setAddressExtra(`(${data.buildingName})`)
    } else if (data.bname !== '') {
      setAddressExtra(`(${data.bname})`)
    }
    setIsOpen(false)
  }

  // 이미지 업로드
    const onImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);
      try {
          if(image){
              const response=await axios.delete('/api/music/deleteFile',{params:{file:image}});
          }
          let response = await axios.post("/api/music/imageUpload", formData, {
              headers: { "Content-Type": "multipart/form-data" },
          });
         setImage(response.data.image);
      } catch (error) {
          console.error("이미지 업로드 실패:", error);
          alert("이미지 업로드 실패");
      }
  };

  // 회원정보 수정
  async function onSubmit() {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    try {
      if (!password) {
        return alert('비밀번호를 입력해주세요')
      }
      if (!passwordRegex.test(password)) {
        return alert('비밀번호는 최소 8자 이상이며, 영문과 숫자를 포함해야 합니다.')
      }
      if (password !== passwordCheck) {
        return alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
      }

      const res = await jaxios.post('/api/member/updateMember', {
        memberId,
        password,
        phone,
        nickname,
        zipCode,
        address,
        addressDetail,
        addressExtra,
        introduction,
        image,
      })

      if (res.data.msg === 'yes') {
        alert('회원정보가 수정되었습니다.')

        const result = await axios.post('/api/member/login', null, {
          params: { username: memberId, password },
        })
        cookies.set('user', JSON.stringify(result.data), { path: '/' })
        dispatch(loginAction(result.data))
        navigate('/')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 회원 탈퇴
  function deleteMember() {
    if (!window.confirm('정말 회원 탈퇴 하시겠습니까?')) {
      return
    }
    jaxios
      .delete(`/api/member/deleteMember/${memberId}`)
      .then((result) => {
        if (result.data.msg === 'yes') {
          alert('회원탈퇴 되었습니다.')
          cookies.remove('user',{path:'/'});
          dispatch(logoutAction());
          navigate('/')
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <div className={updateStyles.updateContainer}>
      <h2 className={updateStyles.updateTitle}>회원 정보 수정</h2>

     
      <div className={updateStyles.imageSection}>
          <label htmlFor="image">프로필 이미지 (선택)</label>
          <input type="file" id="imageUpload" accept="image/*" onChange={onImageUpload} style={{ display: "none" }} />
          <img
              src={ image || Userdefault} 
              alt="아티스트 이미지"
              className={updateStyles.profilePreview}
              onClick={() => document.getElementById("imageUpload").click()}
          />
      </div>


      <div className={updateStyles.formSection}>
   
        <div className={updateStyles.formColumns}>
    
          <div className={updateStyles.formColumn}>
            {/* 아이디 */}
            <div className={updateStyles.formGroup}>
              <label>아이디</label>
              <input type="text" value={memberId} readOnly />
            </div>

            {/* 비밀번호 */}
            <div className={updateStyles.formGroup}>
              <label>패스워드</label>
              {loginUser.provider === 'kakao' ? (
                <input type="password" value={passwordCheck} readOnly />
              ) : (
                <input
                  type="password"
                  value={password}
                  placeholder="새 비밀번호"
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}

              {loginUser.provider === 'kakao' ? (
                <input type="password" value={passwordCheck} readOnly />
              ) : (
                <input
                  type="password"
                  value={passwordCheck}
                  placeholder="비밀번호 확인"
                  onChange={(e) => setPasswordCheck(e.target.value)}
                />
              )}
            </div>

            {/* 전화번호 */}
            <div className={updateStyles.formGroup}>
              <label>전화번호</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* 닉네임 */}
            <div className={updateStyles.formGroup}>
              <label>닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
          </div>

      
          <div className={updateStyles.formColumn}>
            {/* 우편번호 */}
            <div className={updateStyles.formGroup}>
              <label>우편번호</label>
              <div className={updateStyles.zipcodeRow}>
                <input type="text" value={zipCode} readOnly />
                <button type="button" onClick={toggle}>
                  검색
                </button>
              </div>
            </div>

            {/* 주소 검색 모달 */}
            <Modal isOpen={isOpen} ariaHideApp={false} style={customStyles}>
              <DaumPostcode onComplete={completeHandler} />
              <button onClick={() => setIsOpen(false)}>닫기</button>
            </Modal>

            {/* 주소 */}
            <div className={updateStyles.formGroup}>
              <label>주소</label>
              <input type="text" value={address} readOnly />
            </div>

            {/* 상세주소 */}
            <div className={updateStyles.formGroup}>
              <label>상세주소</label>
              <input
                type="text"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
              />
            </div>

            {/* 추가주소 */}
            <div className={updateStyles.formGroup}>
              <label>추가주소</label>
              <input
                type="text"
                value={addressExtra}
                readOnly
                onChange={(e) => setAddressExtra(e.target.value)}
              />
            </div>

            {/* 소개 */}
            <div className={updateStyles.formGroup}>
              <label>소개</label>
              <textarea
                rows="5"
                placeholder="자기소개를 입력해주세요."
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 버튼들 (하단) */}
        <div className={updateStyles.buttonGroup}>
          <button
            className={updateStyles.submitButton}
            onClick={onSubmit}
          >
            수정
          </button>
          <button
            className={updateStyles.deleteButton}
            onClick={()=>deleteMember()}
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateMemberForm
