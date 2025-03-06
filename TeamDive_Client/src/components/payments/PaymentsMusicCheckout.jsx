import React, { useState, useEffect } from 'react';
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import jaxios from '../../util/JwtUtil';
import paymentsStyle from '../../css/membership/payments.module.css';

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const PaymentsMusicCheckout = ({
    cartIdList, 
    musicIdList,
    giftToId,
    payCount,
    membershipCount,
    membershipUserId
}) => {
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();

    const customerKey = loginUser.memberKey;
    const [amount, setAmount] = useState({
        currency: "KRW",
        value: payCount * 770
    });
    const [orderId, setOrderId] = useState(`m${payCount}-${Date.now()}`);
    const [orderName, setOrderName] = useState(`mp3 ${cartIdList.length}곡`);
    const [ready, setReady] = useState(false);
    const [widgets, setWidgets] = useState(null);

    /* state 값이 없다면 홈으로 이동 */
    useEffect(() => {
        if (!cartIdList || !loginUser) {
            alert("잘못된 접근입니다.");
            navigate("/"); // 홈으로 리다이렉트
        }
    }, [cartIdList, loginUser, navigate]);


    /* 결제위젯 초기화 */
    useEffect(
        () => {
            async function fetchPaymentWidgets() {
                const tossPayments = await loadTossPayments(clientKey);
                // 회원 결제
                const widgets = tossPayments.widgets({
                    customerKey,
                });
                console.log('customerKey', customerKey);
                // 비회원 결제
                // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

            setWidgets(widgets); // 결제위젯 객체 생성
        }

        fetchPaymentWidgets();
    }, [clientKey, customerKey]);

    /* 결제 위젯 렌더링 */
    useEffect(() => {
        async function renderPaymentWidgets() {
            if (widgets == null) { return; }

            await widgets.setAmount(amount); // 주문 금액 설정

            await Promise.all([
                // ------  결제 UI 렌더링 ------
                widgets.renderPaymentMethods({
                    selector: "#payment-method",
                    variantKey: "DEFAULT",
                }), // 결제 UI 렌더링

                // ------  이용약관 UI 렌더링 ------
                widgets.renderAgreement({
                    selector: "#agreement",
                    variantKey: "AGREEMENT",
                }), // 이용 약관 UI 렌더링
            ]);
            
            setReady(true);
        }

        renderPaymentWidgets();
    }, [widgets]);

    /* 서버에 결제 요청 정보 저장 */
    const handlePaymentRequest = async () => {
        const confirm = window.confirm('선택한 곡이 장바구니에서 삭제됩니다. 계속하시겠습니까?');
        if(confirm){
            try {
                console.log('결제데이터전달', loginUser);
    
                // 결제 정보를 백엔드에 저장
                const response = await jaxios.post("/api/payments/orderMusicRequest", {
                    orderId,
                    amount: amount.value,
                    orderName,
                    giftToId,
                    memberId: loginUser.memberId,
                    payCount,
                    membershipCount,
                    membershipUserId,
                    cartIdList,
                    musicIdList
                });
    
                if (response.status === 200) {
                    const { orderId } = response.data; // 백엔드에서 반환된 orderId
    
                    // 토스 결제창 실행
                    await widgets.requestPayment({
                        orderId: orderId,
                        orderName,
                        successUrl: `${window.location.origin}/success`,
                        failUrl: `${window.location.origin}/fail`,
                        customerEmail: loginUser.email,
                        customerName: loginUser.name,
                    });
                }
            } catch (error) {
                console.error("결제 요청 중 오류 발생:", error);
                alert("결제 요청에 실패했습니다.");
            }
        }
    };

    return (
        <div className={paymentsStyle.container}>
            <div id="payment-method" className={paymentsStyle.method}>
                <p>결제금액</p>
            </div>
            <div id="agreement" className={paymentsStyle.agreement}></div>
            {/* 결제하기 버튼 */}
            <button className={paymentsStyle.button} disabled={!ready} onClick={handlePaymentRequest}>
                결제하기
            </button>
        </div>
    );
}

export default PaymentsMusicCheckout;