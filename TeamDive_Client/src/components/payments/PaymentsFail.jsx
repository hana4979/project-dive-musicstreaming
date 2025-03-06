import { useNavigate, useSearchParams } from "react-router-dom";
import jaxios from "../../util/JwtUtil";

import paymentsStyle from '../../css/membership/payments.module.css';
import { useEffect } from "react";

const PaymentsFail = () => {
    const [searchParams] = useSearchParams();
    const failReason = searchParams.get("code");
    const orderId = searchParams.get("orderId");
    const navigate = useNavigate();

    useEffect(() => {
        const insertErrorCode = async () => {
            console.log('orderId', orderId);
            try{
                const response = await jaxios.post('/api/payments/paymentFail', null, {params: { failReason, orderId }});
            }catch(error){
                console.error('결제 실패 데이터 저장 불가', error.response?.data || error.message);
            }
        }
        insertErrorCode();
    }, [failReason]);
    
    return (
        <div className={paymentsStyle.paymentContainer}>
            <div className={paymentsStyle.section}>
                <h2>결제 실패</h2>
                <div className={paymentsStyle.section}>
                    <span className={paymentsStyle.label}>
                        {`에러 코드: ${failReason}`}
                    </span>
                    <span className={paymentsStyle.label}>
                        {`실패 사유: ${searchParams.get("message")}`}
                    </span>
                </div>
                <button className={paymentsStyle.button}
                    onClick = { () => { navigate('/') } }>메인으로 이동
                </button>
            </div>
        </div>
    );
}

export default PaymentsFail;
