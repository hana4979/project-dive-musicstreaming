import React, {useState} from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import updatePasswordStyle from '../../css/updatePasswordStyle.module.css';


const ForgottenPassword = () => {

    const navigate = useNavigate();

    const [memberId, setMemberId] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');

    const [email, setEmail] = useState('');
    const [emailCode, setEmailCode] = useState('');

 
    async function findByMemberId() {

        try {
            let result = await axios.get('/api/member/findByMemberId', { params: { memberId } });

            if (result.data.msg === 'yes') {
                alert('아이디가 확인되었습니다.');

                if (!window.confirm('패스워드를 초기화 하시겠습니까?')) {
                    return; // 사용자가 취소하면 함수 종료
                }

                result = await axios.post('/api/member/resetPassword', null,{ params: { memberId } });
                if (result.data.msg === 'yes') {
                    alert('비밀번호가 초기화 되었습니다.');
                } else {
                    alert('비밀번호 초기화에 실패했습니다.');
                }
            } else {
                alert('조회한 아이디는 없는 아이디입니다.');
                if (window.confirm('회원가입 하시겠습니까?')) {
                    navigate('/sign-up'); // 회원가입 페이지로 이동
                }
            }
        } catch (err) {
            alert('비밀번호 초기화 중 오류가 발생했습니다. 관리자에게 문의하세요.');
            console.error('비밀번호 초기화 오류:', err);
        }
    }

    function emailCheckForPassword(){
        if(!email){return alert('회원가입시 인증된 이메일을 입력해주세요.')}

        axios.get('/api/member/emailCheckForPassword', {params:{memberId, email}})
        .then((result)=>{
            if(result.data.msg === 'yes'){
                alert('인증되었습니다.');
                setEmail(result.data.email);
                console.log('email-1', email);
                sendEmailForPassword(email);
            }else{
                alert('입력하신 이메일은 회원가입시 입력한 이메일과 다릅니다.');
                setEmail('');
            }
        })
        .catch((err)=>{
            console.error(err);
        })
    }

    function sendEmailForPassword(email){
        console.log('email-2', email);
        if(!window.confirm('임시 비밀번호를 발급받으시겟습니까?')){
            return ;
        }
        axios.post('/api/member/sendEmailForPassword', null, {params:{memberId, email}})
        .then((result)=>{
            if(result.data.msg === 'yes'){
                
                alert('임시비밀번호가 발급되었습니다. 이메일을 확인하세요');
                navigate('/login');
            }else{
                alert('임시 비밀번호 발급에 실패했습니다.');
            }
        })
        .catch((err)=>{
            console.error(err);
            alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
        })
        
    };



    return (
        <div className={updatePasswordStyle.page}>
            <div>
                <h1>비밀번호를 잊으셧나요?</h1>
            </div>
            <div>
                <label>찾을 아이디</label>
                <input type='text' value={memberId} onChange={(e)=>{setMemberId(e.currentTarget.value)}} />
                <button onClick={()=>{findByMemberId();}}>찾기</button>
            </div>
            
            {/* 모달창 */}
            <div>
                <label>이메일 인증</label>
                <input type='text' value={email} onChange={(e)=>{
                    setEmail(e.currentTarget.value);
                }}/>
                <button onClick={()=>{
                    emailCheckForPassword();
                }}>이메일 체크</button>
                <button onClick={()=>{
                    sendEmailForPassword();
                }}> 임시비밀번호 발급 </button>
            </div>

            <div>
                <button onClick={()=>{
                    navigate('/login');
                }}>취소</button>
            </div>
        </div>
    )
}

export default ForgottenPassword
