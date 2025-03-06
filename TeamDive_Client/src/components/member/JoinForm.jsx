import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import joinStyles from '../../css/joinForm.module.css';
import { SignUpStep1 } from '../member/SignUp1';
import { SignUpStep2 } from '../member/SignUp2';
import DaumPostcode from "react-daum-postcode";

const JoinForm = () => {

    
    const [step, setStep] = useState(1);
    


    const [step1Data, setStep1Data] = useState({
      memberId: '',
      password: '',
      passwordCheck: '',
      emailId: '',
      emailDomain: '',
      customDomain: '',
      name: '',
      nickname: '',
      birth: '',
      gender: '',
      phone: '',
    });
    


    return (
      <div className={joinStyles.joinPage}>
        <div className={joinStyles.container}>
          <h2>회원가입</h2>
        
          <div className={joinStyles.progressContainer}>
            <div className={joinStyles.progressText}>
              {step === 1
                ? 'Step 1 of 2 : 필수 정보 입력'
                : 'Step 2 of 2 : 선택 정보 입력'}
            </div>
            <div className={joinStyles.progressBarBackground}>
              <div
                className={joinStyles.progressBar}
                style={{ width: step === 1 ? '50%' : '100%' }}
              ></div>
            </div>
          </div>
          <form>         
              <div style={{ display: step === 1 ? 'block' : 'none' }}>
                  <SignUpStep1 
                    setStep={setStep} 
                    step1Data={step1Data} 
                    setStep1Data={setStep1Data} 
                  />
                </div>
                <div style={{ display: step === 2 ? 'block' : 'none' }}>
                  <SignUpStep2 
                    setStep={setStep} 
                    step1Data={step1Data} // Step1 데이터 전달
                  />
              </div>
          </form>
        </div>
      </div>
    );
};

export default JoinForm ;
