import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import jaxios from '../../util/JwtUtil';

import MembershipMenu from './MembershipMenu';
import Modal from '../frame/Modal'; // 모달 컴포넌트
import GiftMembership from '../gift/GiftMembership'; // 결제 컴포넌트 임포트
import PaymentsCheckout from '../payments/PaymentsCheckout'; // 결제 컴포넌트

import membershipStyle from '../../css/membership/membership.module.css';

const Membership = () => {
    const loginUser = useSelector(state => state.user);
    const [membershipList, setMembershipList] = useState([]);
    const { category } = useParams(); // 표시할 membership 의 category
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState(null); // 선택된 멤버십 정보
    const [modalStep, setModalStep] = useState(''); // 모달의 현재 단계
    const [giftToId, setGiftToId] = useState('');
    const navigate = useNavigate();

    /* 멤버십 정보 불러오기 */
    useEffect(
        () => {
            axios.get('/api/membership/getMembershipByCategory', {params: {category}})
            .then((result) => {
                setMembershipList([...result.data.membershipList]);
            }).catch((err) => { console.error('멤버십 불러오기 실패', err); })
        }, [category]
    )

    /* 멤버십 구매 여부 확인 */
    async function checkActiveMembership(memberId, membership){
        if(!loginUser || loginUser.memberKey === ''){
            alert('로그인이 필요한 서비스입니다');
            navigate('/login');
        }else{
            try{
                const result = await jaxios.get('/api/membership/checkActiveMembership', {params: {memberId, category: membership.category}})
                if(result.data.message === 'no'){ // 구독한 멤버십이 없다면
                    openModal(membership);
                }else{
                    // 날짜를 포맷팅하여 출력
                    const startDate = new Date(result.data.activeMembership.startDate);
                    const formattedStartDate = startDate.toLocaleDateString(); // 날짜 포맷 : 2025-02-28

                    alert(`${formattedStartDate} 부터 활성화된 멤버십이 있습니다`);
                }
            }catch(err){
                alert('멤버십 조회가 불가능합니다. 관리자에게 문의하세요');
                console.error('멤버십 조회가 불가능', err);
            }
        }   
    }

    /* 선물하기를 위한 로그인 여부 확인 */
    function checkLogin(membership){
        if(!loginUser || loginUser.memberKey === ''){
            alert('로그인이 필요한 서비스입니다');
            navigate('/login');
        }else{
            openModal(membership);
        }
    }

    /* 모달 열기 */
    const openModal = async (membership) => {
        setSelectedMembership(membership); // 선택한 멤버십 정보 설정
        await new Promise((resolve) => setTimeout(resolve, 0)); // 상태 업데이트 대기
        setModalStep(membership.category === "gift" ? "gift" : "payment");
        setIsModalOpen(true); // 모달 열기
    };

    /* 모달 닫기 */
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={membershipStyle.membershipPage}>
            <MembershipMenu/>
            <div className={membershipStyle.container}>
                {
                    (membershipList.length > 0) ? (
                        membershipList.map((membership, idx) => {
                                return (
                                    <div className={membershipStyle.item} key={idx}>
                                        <div className={membershipStyle.title}>
                                            {membership.name}
                                        </div>
                                        <div className={membershipStyle.content}>
                                            {membership.content}
                                        </div>
                                        <div className={membershipStyle.subscribe}>
                                            <div className={membershipStyle.priceBox}>
                                                <span className={membershipStyle.discount}>
                                                    월 {new Intl.NumberFormat().format(membership.price * (1-(membership.discount/100)))}원&nbsp;
                                                </span>
                                                <span className={membershipStyle.original}>
                                                    월 {new Intl.NumberFormat().format(membership.price)}원
                                                </span>
                                            </div>
                                            {
                                                (membership.category === 'gift') ? (
                                                    <button onClick={() => { checkLogin(membership) }}>선물하기</button>
                                                ) : (
                                                    <button onClick={() => { checkActiveMembership(loginUser.memberId, membership) }}>구독하기</button>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        )
                    ) : (
                        <div className={membershipStyle.item}>
                            <span>Loading...</span>
                        </div>
                    )
                }
            </div>

            {/* 결제 모달 */}
            <Modal isOpen={isModalOpen} closeModal={closeModal}>
                {selectedMembership && (
                    modalStep === "gift" && selectedMembership.category === "gift" ? (
                        <GiftMembership
                            membership={selectedMembership}
                            giftToId={giftToId}
                            setGiftToId={setGiftToId}
                            onProceedToPayment={() => setModalStep("payment")}
                        />
                    ) : (
                        <PaymentsCheckout
                            membership={selectedMembership}
                            giftToId={giftToId}
                        />
                    )
                )}
            </Modal>
        
        </div>
    )
}

export default Membership;
