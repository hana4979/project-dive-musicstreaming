import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginAction } from '../../store/UserSlice'
import { Cookies } from 'react-cookie'
import axios from 'axios'

const KakaoLogin = () => {

    const {memberId} = useParams();
    const navigate = useNavigate();
    const cookies = new Cookies();
    const dispatch = useDispatch();
    
    useEffect(()=>{
        axios.post('/api/member/login', null, {params:{username:memberId, password:'kakao1234'}})
        .then((result)=>{
            if(result.data.error==='ERROR_LOGIN'){
                return alert('이메일 또는 패스워드 오류입니다.');
            }else{
                console.log('kakaoLoginUser',result.data);
                dispatch( loginAction(result.data));
                cookies.set('user', JSON.stringify(result.data));
                navigate('/');
            }

        })
        .catch((err)=>{
            console.error(err);
        })
    },[]);

    return (
        <div>
        
        </div>
    )
}

export default KakaoLogin
