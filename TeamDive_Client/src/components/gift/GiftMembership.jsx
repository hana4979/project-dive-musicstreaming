import React from 'react';
import { useSelector } from 'react-redux';
import jaxios from '../../util/JwtUtil';

import giftStyle from '../../css/membership/gift.module.css';

const GiftMembership = ({ membership, giftToId, setGiftToId, onProceedToPayment }) => {
    const loginUser = useSelector(state => state.user);

    async function checkValid(){
        if(!giftToId){
            alert('받는 사람의 ID를 입력해주세요');
        }else if(giftToId === loginUser.memberId){
            alert('자기 자신에게 선물할 수 없습니다');
        }else{
            try{
                let respone = await jaxios.get('/api/member/getMember', { params: {giftToId} })
                if(respone.data.message === 'yes'){
                    respone = await jaxios.get('/api/membership/checkActiveMembership',
                        { params: {memberId: giftToId, category: 'streaming'} })
                    if(respone.data.message === 'no' && !respone.data.activeMembership){
                        setGiftToId(giftToId);
                        onProceedToPayment();
                    }else{
                        alert('멤버십을 이용중인 사용자에게는 선물할 수 없습니다');
                    }
                }else{
                    alert('받는 사람의 ID 가 존재하지 않습니다');
                }
            }catch(error){ console.error('선물하기 오류', error); }
        }
    }

    return (
        <div className={giftStyle.giftContainer}>
            <h1>멤버십 선물하기</h1>
            <h2>받는 사람</h2>
            <div className={giftStyle.field}>
                <input
                    type='text'
                    placeholder='받는 사람의 ID 를 입력해주세요'
                    value={giftToId}
                    onChange={(e) => { setGiftToId(e.target.value) }}
                />
            </div>

            <h2>보내는 사람</h2>
            <div className={giftStyle.field}>
                <input type='text' value={loginUser.nickname} readOnly/>
            </div>

            <div className={giftStyle.productInfo}>
                <img className={giftStyle.productImage} src="https://via.placeholder.com/48" alt="상품 이미지" />
                <div className={giftStyle.productDetails}>
                    <div className={giftStyle.productName}>{membership.name}</div>
                    <div className={giftStyle.price}>{membership.price}원 (VAT 포함)</div>
                    <div className={giftStyle.period}>이용기한 : {membership.period}개월</div>
                </div>
            </div> 

            <button
                className={giftStyle.paymentButton}
                onClick={() => { checkValid() }}>
                {membership.price}원 결제하기
            </button>
        </div>
    )
}

export default GiftMembership;
