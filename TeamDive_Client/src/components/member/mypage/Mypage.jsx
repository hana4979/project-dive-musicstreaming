import React,{ useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import MypageMenu from './MypageMenu'
import MypageMain from './MypageMain';
import UpdateMemberForm from './UpdateMemberForm';
import ReplyListForm from './ReplyListForm';
import Gift from './Gift';
import MyMP3 from './MyMP3';

import mypageStyle from '../../../css/mypage/mypage.module.css'

const Mypage = () => {
    const loginUser = useSelector(state=>state.user);
    const navigate = useNavigate();
    const {mypageCategory} = useParams();
   
    useEffect(()=>{
        if(!loginUser.memberId){
            alert('로그인이 필요한 서비스 입니다.');
            navigate('/login');
        }
    }, []);

    return (
        <div className={mypageStyle.mypageContainer}>
            <MypageMenu />
            {/* 마이페이지 카테고리별로 표시할 컴포넌트를 설정 */}
            {
                mypageCategory && (
                    <div className={mypageStyle.container}>
                        {/* 조건부 렌더링 */}
                        {mypageCategory === "myPageMain" && <MypageMain />}
                        {mypageCategory === "updateMemberForm" && <UpdateMemberForm />}
                        {mypageCategory === "likeListForm" && <LikeListForm />}
                        {mypageCategory === "mp3" && <MyMP3 />}
                        {mypageCategory === "replyListForm" && <ReplyListForm />}
                        {mypageCategory === "gift" && <Gift />}
                    </div>
                )
            }
        </div>
    )
}

export default Mypage
 