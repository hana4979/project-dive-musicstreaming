import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import jaxios from "../../util/JwtUtil";

import paymentsStyle from '../../css/membership/payments.module.css';

const PaymentsSuccess = () => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [searchParams] = useSearchParams();
    const [countdown, setCountdown] = useState(3); // 3초 카운트다운 초기화
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const navigate = useNavigate();

    useEffect(() => {
        const confirmPayment = async () => {
            try {
                const response = await jaxios.post('/api/payments/paymentSuccess', null, {
                    params: { paymentKey, orderId, amount },
                });
                console.log("결제 승인 성공", response.data);
                setIsConfirmed(true);

                // 1초마다 카운트다운 감소
                const countdownInterval = setInterval(() => {
                    setCountdown((prev) => prev - 1);
                }, 1000);

                // 3초 후 홈으로 이동
                setTimeout(() => {
                    clearInterval(countdownInterval); // 인터벌 정리
                    navigate("/");
                }, 3000);
            } catch (error) {
                console.error("결제 승인 실패:", error.response?.data || error.message);
                setTimeout(() => {
                    console.log("재시도 중...");
                    confirmPayment();  // 재시도
                }, 1000);  // 2초 후 재시도
            }
        };
        confirmPayment();
    }, [navigate, paymentKey, orderId, amount]);

    return (
        <div className={paymentsStyle.paymentContainer}>
            {isConfirmed ? (
                <div>
                    <img
                        src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
                        width="120"
                        height="120"
                    />
                    <h2 className={paymentsStyle.title}>결제를 완료했어요</h2>
                    <div className={paymentsStyle.section}>
                        <span className={paymentsStyle.label}>주문번호&nbsp;{paymentKey}</span>
                        <span className={paymentsStyle.label}>결제 금액&nbsp;{amount}</span>
                    </div>
                    <p className={paymentsStyle.redirectMessage}>{countdown}초 뒤에 홈으로  이동합니다...</p>
                </div>
            ) : (
                <div>
                    <img
                        src="https://static.toss.im/lotties/loading-spot-apng.png"
                        width="120"
                        height="120"
                    />
                    <h2 className={paymentsStyle.title}>결제가 진행중입니다</h2>
                </div>
            )}
        </div>
    );
}

export default PaymentsSuccess;