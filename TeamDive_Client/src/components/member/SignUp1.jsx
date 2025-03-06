import React, {useState} from "react";
import joinStyles from '../../css/joinForm.module.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpStep1 = ({ setStep, step1Data, setStep1Data }) => {
    const navigate = useNavigate();
    const [messageId, setMessageId] = useState('');
    const [messageEmail, setMessageEmail] = useState('');
    const [emailCheckCode, setEmailCheckCode] = useState('');

    
    const { memberId, password, passwordCheck, emailId, emailDomain, customDomain, name, nickname, birth, gender, phone } = step1Data;

    // 정규식 정의
    const idRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,20}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const emailIdRegex = /^[a-zA-Z0-9_.+-]+$/;
    const nameRegex = /^[가-힣a-zA-Z\s]{2,}$/;
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 입력값 유효성 (입력 전엔 null)
    const isMemberIdValid = memberId ? idRegex.test(memberId) : null;
    const isPasswordValid = password ? passwordRegex.test(password) : null;
    const isPasswordCheckValid = passwordCheck ? (isPasswordValid && password === passwordCheck) : null;
    const isEmailIdValid = emailId ? emailIdRegex.test(emailId) : null;
    const isCustomDomainValid = emailDomain === '직접입력' && customDomain ? domainRegex.test(customDomain) : null;
    const isNameValid = name ? nameRegex.test(name) : null;
    const isNickNameValid = nickname ? (nickname.length >= 2 && nickname.length <= 10) : null;

    
    const getFullEmail = () => {
        if (emailDomain === '직접입력') {
            return `${emailId}@${customDomain}`;
        }
        return `${emailId}@${emailDomain}`;
    };
    const emailFull = getFullEmail();

    const nextStep = (e) => {
        e.preventDefault();
        if (!memberId){
            return alert('아이디를 입력해주세요');
        }
        if (!idRegex.test(memberId)){
            return alert('아이디는 4~20자의 영문 대소문자와 숫자로만 이루어져야 합니다.');
        }
        if (!password){
            return alert('비밀번호를 입력해주세요');
        }
        if (!passwordRegex.test(password)){
            return alert('비밀번호는 최소 8자 이상이며, 영문과 숫자를 포함해야 합니다.');
        }
        if (password !== passwordCheck){
            return alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        }
        if (!emailId){
            return alert('이메일 아이디를 입력해주세요.');
        }
        if (!emailDomain){
            return alert('이메일 도메인을 선택해주세요.');
        }
        if (emailDomain === '직접입력' && !customDomain){
            return alert('이메일 도메인을 직접 입력해주세요.');
        }
        const emailFull = getFullEmail();

        const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        if (!emailRegex.test(emailFull)){
            return alert('유효한 이메일 주소를 입력해주세요.');
        }
        if (!name){
            return alert('이름을 입력해주세요');
        }
        if (!nameRegex.test(name)){
            return alert('이름은 최소 2자 이상의 한글 또는 영문이어야 합니다.');
        }
        if (!nickname) return alert('닉네임을 설정해주세요');
        if (nickname.length < 2 || nickname.length > 10)
            return alert('닉네임은 2자 이상 10자 이하로 입력해주세요.');
        if (!birth) return alert('생년월일을 선택해주세요');
        if (!gender) return alert('성별을 선택해주세요');
        // 모든 조건 만족 시 부모의 setStep를 통해 다음 단계로 전환
        setStep(2);
    };

    async function checkid(){
      if(memberId === ""){
        setMessageId("사용할 아이디를 입력해주세요");
        return;
      }
      try{
          const result = await axios.post('/api/member/checkId', null, {params:{memberId}})
          console.log(result);
          
          if(result.data.msg === 'no'){
              setMessageId('중복된 아이디입니다.');
              setStep1Data(prevState => ({ ...prevState, memberId: '' }));
          }else if(result.data.msg ==='yes' && memberId.length <4){
              setMessageId('아이디는 4~20자의 영문과 숫자조합이 필요합니다.');
          }else{
              setMessageId('회원가입이 가능한 아이디입니다.');
          }
      }catch(err){
          console.error(err);
      }    
  }
  


  function sendMail(){
      // console.log(emailId,"@",emailDomain);
      // console.log(emailId,"@",customDomain);

      console.log("Generated Email:", emailFull);

      axios.post('/api/member/sendMail', null, {params:{email:emailFull}})
      .then((result)=>{
          if(result.data.msg === 'yes'){
              alert('인증코드가 발송되었습니다. 이메일을 확인하세요');
          }
      })
      .catch((err)=>{
          console.error(err);
      })
  };

  function emailCodeCheck() {
    if (!emailCheckCode) {
        setMessageEmail("인증 코드를 입력해주세요.");
        return;
    }

    axios.post('/api/member/emailCheck', null, { params: { emailCheckCode } })
    .then((result) => {
        if (result.data.msg === 'yes') {
            setMessageEmail('인증 되었습니다.');
        } else {
            setMessageEmail('인증 실패하였습니다. 다시 시도해주세요.');
        }
    })
    .catch((err) => {
        console.error(err);
    });
}


    const today = new Date();

    return (
        <div className={joinStyles.stepOne}>
          {/* ID */}
          <div className={joinStyles.formGroup}>
            <label htmlFor="memberId">
              ID
              <span
                className={joinStyles.inputCondition}
                style={{ color: isMemberIdValid === null ? '#ccc' : isMemberIdValid ? 'green' : 'red' }}
              >
                {isMemberIdValid === false ? '최소 4자이상 또는 20자 이하로 입력해주세요' : '(4~20자의 영문,숫자)'}
              </span>
            </label>
            <input
              type="text"
              id="memberId"
              value={memberId}
              onChange={(e) => setStep1Data({ ...step1Data, memberId: e.currentTarget.value })}
              required
              style={{ borderColor: isMemberIdValid === null ? '#ccc' : isMemberIdValid ? 'green' : 'red' }}
            />
            {/* =========================================================== */}
            <button type='button' onClick={()=>{
              checkid();
            }}>IDCHECK</button>
             <>{messageId}</>
            {/* =========================================================== */}
          </div>
          {/* 비밀번호 */}
          <div className={joinStyles.formGroup}>
            <label htmlFor="password">
              비밀번호
              <span
                className={joinStyles.inputCondition}
                style={{ color: isPasswordValid === null ? '#ccc' : isPasswordValid ? 'green' : 'red' }}
              >
                (최소 8자, 영문+숫자)
              </span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setStep1Data({ ...step1Data, password: e.target.value })}
              required
              style={{ borderColor: isPasswordValid === null ? '#ccc' : isPasswordValid ? 'green' : 'red' }}
            />
          </div>
          {/* 비밀번호 확인 */}
          <div className={joinStyles.formGroup}>
              <label htmlFor="passwordCheck">
                  비밀번호 확인
                  <span
                  className={joinStyles.inputCondition}
                  style={{ color: isPasswordCheckValid === null ? '#ccc' : isPasswordCheckValid ? 'green' : 'red' }}
              >
                  {isPasswordCheckValid === false ? '작성한 비밀번호와 일치하지 않습니다.' : '(비밀번호와 동일하게 작성)'}
              </span>
            </label>
            <input
                type="password"
                id="passwordCheck"
                value={passwordCheck}
                onChange={(e) => setStep1Data({ ...step1Data, passwordCheck: e.target.value })}
                required
                style={{ borderColor: isPasswordCheckValid === null ? '#ccc' : isPasswordCheckValid ? 'green' : 'red' }}
            />
          </div>
          {/* 이메일 */}
          <div className={joinStyles.formGroup}>
              <label htmlFor="emailId">이메일</label>
              <div className={joinStyles.emailInputGroup}>
              <input
                type="text"
                id="emailId"
                value={emailId}
                onChange={(e) => setStep1Data({ ...step1Data, emailId: e.target.value })}
                placeholder="예: user"
                required
                style={{ borderColor: isEmailIdValid === null ? '#ccc' : isEmailIdValid ? 'green' : 'red' }}
              />
              <span>@</span>
              <select
                  id="emailDomain"
                  value={emailDomain}
                  onChange={(e) => setStep1Data({ ...step1Data, emailDomain: e.target.value })}
                  style={{ color: 'black', borderColor: '#ccc' }}
                  required
              >
                  <option value="">선택</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="naver.com">naver.com</option>
                  <option value="daum.net">daum.net</option>
                  <option value="직접입력">직접입력</option>
              </select>
            </div>
            {emailDomain === '직접입력' && (
              <div className={joinStyles.formGroup}>
                <input
                  type="text"
                  id="customDomain"
                  value={customDomain}
                  onChange={(e) => setStep1Data({ ...step1Data, customDomain: e.target.value })}
                  placeholder="예: example.com"
                  required
                  style={{ borderColor: isCustomDomainValid === null ? '#ccc' : isCustomDomainValid ? 'green' : 'red' }}
                />
              </div>
            )}
              <span
                className={joinStyles.inputCondition}
                style={{ color: isEmailIdValid === null ? '#ccc' : isEmailIdValid ? 'green' : 'red' }}
              >
                (영문, 숫자, . _ + - 가능)
              </span>
              {/* =========================================================== */}
              <div>
                <button onClick={()=>{
                    sendMail();
                }}>인증코드 발송</button>
                <div>
                  <>{messageEmail}</>{/*여기가 이메일 체크 메세지나오는곳 */}
                  <input type='text' value={emailCheckCode} onChange={(e)=>{
                    setEmailCheckCode(e.currentTarget.value)
                  }}/>
                  <button 
                    onClick={emailCodeCheck} 
                    disabled={!emailCheckCode}
                  >
                    인증확인
                  </button>
                </div>
              </div>
              {/* =========================================================== */}


          </div>
          {/* 이름 */}
          <div className={joinStyles.formGroup}>
              <label htmlFor="name">
                  이름
                <span
                    className={joinStyles.inputCondition}
                    style={{ color: isNameValid === null ? '#ccc' : isNameValid ? 'green' : 'red' }}
                >
                {isNameValid === false ? '이름은 최소 2자 이상으로 입력해야 합니다.' : '(최소 2자 이상)'}
                </span>
            </label>
            <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setStep1Data({ ...step1Data, name: e.target.value })}
                required
                style={{ borderColor: isNameValid === null ? '#ccc' : isNameValid ? 'green' : 'red' }}
            />
          </div>
          {/* 전화번호 */}
          <div className={joinStyles.formGroup}>
              <label htmlFor="phone">
                  전화번호
              </label>
              <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setStep1Data({ ...step1Data, phone: e.target.value })}
                  required
              />
          </div>
          {/* 닉네임 */}
          <div className={joinStyles.formGroup}>
              <label htmlFor="nickName">
                  닉네임
              <span
                  className={joinStyles.inputCondition}
                  style={{ color: isNickNameValid === null ? '#ccc' : isNickNameValid ? 'green' : 'red' }}
              >
                  {isNickNameValid === false ? '닉네임은 2~10자여야 합니다' : '(2~10자)'}
              </span>
            </label>
            <input
                type="text"
                id="nickName"
                value={nickname}
                onChange={(e) => setStep1Data({ ...step1Data, nickname: e.target.value })}
                required
                style={{ borderColor: isNickNameValid === null ? '#ccc' : isNickNameValid ? 'green' : 'red' }}
                
            />
          </div>
          {/* 생년월일 */}
          <div className={joinStyles.formGroup}>
            <label htmlFor="birth">생년월일</label>
            <input
              type="date"
              id="birth"
              name="birth"
              value={birth}
              onChange={(e) => setStep1Data({ ...step1Data, birth: e.target.value })}
              required
              max={today.toISOString().split("T")[0]}
              style={{ borderColor: '#ccc' }}
            />
          </div>
          {/* 성별 */}
          <div className={joinStyles.formGroup}>
            <label htmlFor="gender">성별</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setStep1Data({ ...step1Data, gender: e.target.value })}
              style={{ color: 'black', borderColor: '#ccc' }}
              required
            >
              <option value="">선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
          <div className={joinStyles.buttonGroup}>
            <button onClick={nextStep} className={joinStyles.button}>
              다음
            </button>
            <button type="button" className={joinStyles.button} onClick={() => navigate('/')}>
              뒤로가기
            </button>
          </div>
        </div>
    );
};

export { SignUpStep1 };
