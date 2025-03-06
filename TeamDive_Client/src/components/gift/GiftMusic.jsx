import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import jaxios from '../../util/JwtUtil';

import giftStyle from '../../css/membership/gift.module.css';

const GiftMusic = ({
    musicIdList,
    giftToId,
    setGiftToId,
    payCount,
    membershipCount,
    onProceedToPayment,
    payOnlyMembership
}) => {
    const loginUser = useSelector(state => state.user);
    const [purchaseMusicList, setPurchaseMusicList] = useState([]);

    /* 구매할 곡에 대한 정보 추출 */
    useEffect(
        ()=>{
            const getPurchaseMusicList = async () => {
                try{
                    const response = await jaxios.post('/api/mp3/getPurchaseMusicList', musicIdList);
                    if(response.data.message === 'yes'){
                        setPurchaseMusicList(response.data.purchaseMusicList);
                    }
                }catch(error){
                    console.error('구매할 곡에 대한 정보 추출 실패', error);
                }
            }
            
            getPurchaseMusicList();
        }, []
    );

    /* 선물 받는 유저 확인 및 선물 대상의 구매한 곡과 중복되는지 확인 */
    async function checkValid(){
        console.log('구매할 음악 정보', purchaseMusicList);
        if(!giftToId){
            alert('받는 사람의 ID를 입력해주세요');
        }else if(giftToId === loginUser.memberId){
            alert('자기 자신에게 선물할 수 없습니다');
        }else{
            try{
                let response = await jaxios.get('/api/member/getMember', { params: {giftToId} })
                if(response.data.message === 'yes'){
                    checkPurchasedMusic();
                }else{
                    alert('받는 사람의 ID 가 존재하지 않습니다');
                }
            }catch(error){ console.error('선물하기 오류', error); }
        }
    }

    /* 선물 대상이 이미 구매한 곡인지 확인 */
    const checkPurchasedMusic = async () => {
        try{
            const response = await jaxios.post('/api/mp3/checkPurchasedMusic', musicIdList, {
                params: {giftToId}
            });
            if(response.data.message === 'no'){
                if(payCount === 0 && membershipCount !== 0){
                    payOnlyMembership();
                }else{
                    onProceedToPayment();
                }
            }else{
                alert('선물 대상이 이미 구매한 곡이 있습니다');
            }
        }catch(error){
            console.error('구매한 노래 목록 불러오기 실패', error);
        }
    }

    return (
        <div className={giftStyle.giftContainer}>
            <h1>곡 선물하기</h1>
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
            {
                (purchaseMusicList && purchaseMusicList.length !== 0) ? (
                    purchaseMusicList.map((music, idx) => {
                        return (
                            <div key={idx} className={giftStyle.productInfo}>
                                <img className={giftStyle.productImage} alt="곡 이미지" src={music.image} />
                                <div className={giftStyle.productDetails}>
                                    <div className={giftStyle.productName}>{music.title}</div>
                                    <div className={giftStyle.productName}>{music.artistName}</div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={giftStyle.productInfo}>
                        <div className={giftStyle.productName}>Loading...</div>
                    </div>
                )
            }

            <button
                className={giftStyle.paymentButton}
                onClick={() => { checkValid() }}>
                {payCount * 770}원 결제하기
            </button>
        </div>
    )
}

export default GiftMusic;
