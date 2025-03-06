import React, { useState } from 'react';
import loginStyles from '../../css/login.module.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { loginAction } from '../../store/UserSlice';


const LoginPage =() => {

    const [messageId, setMessageId] = useState('');
    const [messageEmail, setMessageEmail] = useState('');

    const [memberId, setMemberId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const cookies = new Cookies();
    const dispatch = useDispatch();
    const loginUser = useSelector(state=>state.user)

    async function loginLocal(){
       
        if(!memberId){return alert('아이디를 입력하세요');};
        if(!password){return alert('비밀번호를 입력하세요');};
        
        try{
            const result = await axios.post('/api/member/login', null, {params:{username: memberId, password: password}});

            if(result.data.error === 'ERROR_LOGIN'){
                alert('아이디와 비밀번호를 확인하세요.');
                setPassword('');
                navigate('/login');
            }
            else{
                alert('로그인이 되었습니다.')
                console.log('result.data ',result.data)
                cookies.set('user', JSON.stringify(result.data), {path:'/'});
                dispatch( loginAction(result.data));
                //console.log(result.data);
                navigate('/');
            }
        }catch(err){
            console.log(err);
        }
       
    }

    function handleKakaoLogin() {
        window.location.href='/api/member/kakaoStart'
      }

    return (
        <div className={loginStyles.loginPage}>
            <div className={loginStyles.container}>
                <h1>로그인</h1>
                <form>
                    <div className={loginStyles.formGroup}>
                        <label htmlFor="memberId">ID</label>
                        <input type="text" id="memberId" value={memberId} onChange={(e)=>{
                            setMemberId(e.currentTarget.value);
                        }} placeholder="아이디를 입력하세요" />
                    </div>
                    <div className={loginStyles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e)=>{
                            setPassword(e.currentTarget.value);
                        }} placeholder="비밀 번호를 입력하세요" />
                    </div>
                    <button type="button" className={loginStyles.button} onClick={()=>{loginLocal();}}>Login</button>
                    <div className={loginStyles.kakaoLoginContainer}>
                        <button type="button" className={loginStyles.kakaoButton} onClick={handleKakaoLogin}>
                        <img src="/image/kakao_lion.png" alt="Kakao Logo"  className={loginStyles.kakaoLogo} />
                        <span>카카오로 로그인하기</span>
                        </button>
                    </div>
                </form>
                <Link to='/forgottenPassword' className={loginStyles.forgotPassword}>비밀번호를 잊으셨나요?</Link>
            </div>
        </div>
      );
}

export default LoginPage;
