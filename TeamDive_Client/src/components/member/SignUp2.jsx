import React, { useState } from "react";
import joinStyles from "../../css/joinForm.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import DaumPostcode from "react-daum-postcode";
const SignUpStep2 = ({ setStep, step1Data }) => {
    const [image, setImage] = useState("https://d9k8tjx0yo0q5.cloudfront.net/image/user.png"); // 업로드할 파일 저장
    const [preview, setPreview] = useState(""); // 이미지 미리보기 URL
    const [profileImage, setProfileImage] = useState(""); // 서버에서 반환된 이미지 URL 저장
    const [address, setAddress] = useState("");
    const [addressDetail, setAddressDetail] = useState("");
    const [addressExtra, setAddressExtra] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [isOpen, setIsOpen]=useState(false);

    console.log("step1Data:", step1Data);
   

    function toggle(){
        setIsOpen( !isOpen )
    }

    const customStyles = {
        overlay: { backgroundColor: "rgba( 0 , 0 , 0 , 0.5)", },
        content: {
            left: "0",
            margin: "auto",
            width: "500px",
            height: "600px",
            padding: "0",
            overflow: "hidden",
        },
    };

    const completeHandler=(data)=>{
        console.log(data)
        setZipCode(data.zonecode)
        setAddress(data.address)
        if( data.buildingName !== ''){
            setAddressExtra('(' + data.buildingName + ')')
        }else if( data.bname !== ''){
            setAddressExtra('(' + data.bname + ')')
        }
        setIsOpen(false);
    }

    // // 파일 업로드 및 미리보기 핸들러
    // const fileUp = async (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     // 파일 객체 상태 저장
    //     setImage(file);

    //     // FileReader를 사용하여 미리보기 URL 생성
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //     setPreview(reader.result);
    //     };
    //     reader.readAsDataURL(file);

    //     // 서버 업로드 처리
    //     const formData = new FormData();
    //     formData.append("image", file);

    //     try {
    //     const result = await axios.post("/api/member/fileUp", formData);
    //     // 서버에서 반환된 이미지 URL 저장
    //     setProfileImage(`http://localhost:8070/profileImage/${result.data.image}`);
    //     setImage(result.data.image);
    //     console.log("image", image);
    //     } catch (error) {
    //     console.error("파일 업로드 실패:", error);
    //     alert("파일 업로드에 실패했습니다.");
    //     }
    // };

    
    const onImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file);
        try {
            if(image){
                const response=await axios.delete('/api/music/deleteFile',{params:{file:image}});
            }
            let response = await axios.post("/api/music/imageUpload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
           setImage(response.data.image);
        } catch (error) {
            console.error("이미지 업로드 실패:", error);
            alert("이미지 업로드 실패");
        }
    };


    const getFullEmail = (step1Data) => {
        if (!step1Data) return ""; // step1Data가 없으면 빈 문자열 반환
    
        const { emailId, emailDomain, customDomain } = step1Data;
        if (!emailId || !emailDomain) return ""; // 값이 없을 경우 빈 문자열 반환
    
        return emailDomain === "직접입력" ? `${emailId}@${customDomain}` : `${emailId}@${emailDomain}`;
    };
    
    

    // 최종 회원가입 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        // Step1 데이터 추가
        for (const key in step1Data) {
            formData.append(key, step1Data[key]);
        }
        
        const emailFull = getFullEmail(step1Data);
        console.log("Full Email:", emailFull);
        
        console.log("step1Data in SignUpStep1:", step1Data);
        
        formData.set('email', emailFull);
        // 이미지가 있을 경우 추가
        if (image) {
            formData.append("image", image);
        }
        formData.append("zipCode", zipCode);
        formData.append("address", address);
        formData.append("addressDetail", addressDetail);
        formData.append("addressExtra", addressExtra);
        formData.append("introduction", introduction);

        try {
            setLoading(true);
            console.log("image", image);
            await axios.post("/api/member/join", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("회원가입이 완료되었습니다!");
            navigate('/login');
        } catch (error) {
            console.error("회원가입 실패:", error);
            alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={joinStyles.stepTwo}>
            <div className={joinStyles.formGroup}>
                <span>선택사항</span>
            </div>

            {/* 프로필 이미지 업로드 */}
            <div className={joinStyles.formGroup}>
                <label htmlFor="image">프로필 이미지 (선택)</label>
                <input type="file" id="imageUpload" accept="image/*" onChange={onImageUpload} style={{ display: "none" }} />
                <img
                    src={ image || Userdefault} 
                    alt="아티스트 이미지"
                    className={joinStyles.profilePreview}
                    onClick={() => document.getElementById("imageUpload").click()}
                />
            </div>

            {/* 주소 입력 */}
            <div className={joinStyles.formGroup}>
                <label htmlFor="zipCode">우편번호 (선택)</label>
                <input
                    type="text"
                    id="zipCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                />
                <button type='button' onClick={()=>{
                    toggle();
                }}>주소 검색</button>
            </div>
            {/* 주소 검색을 위한 모달창 */}
            <div>   
                <Modal isOpen={isOpen}  ariaHideApp={false}  style={customStyles} >
                    <DaumPostcode onComplete={completeHandler} /><br />
                    <button onClick={()=>{ setIsOpen(false) }}>CLOSE</button>
                </Modal>
            </div>
            {/* ======================= */}
            <div className={joinStyles.formGroup}>
                <label htmlFor="address">주소 (선택)</label>
                <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>
            
            <div className={joinStyles.formGroup}>
                <label htmlFor="addressDetail">상세주소 (선택)</label>
                <input
                    type="text"
                    id="addressDetail"
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                />
            </div>
            
            <div className={joinStyles.formGroup}>
                <label htmlFor="addressExtra">추가주소 (선택)</label>
                <input
                    type="text"
                    id="addressExtra"
                    value={addressExtra}
                    onChange={(e) => setAddressExtra(e.target.value)}
                />
            </div>

            <div className={joinStyles.formGroup}>
                <label htmlFor="introduction">소개</label>
                <textarea
                    id="introduction"
                    value={introduction}
                    rows="5" 
                    cols="40" 
                    placeholder="자기소개를 입력해주세요."
                    onChange={(e) => setIntroduction(e.target.value)}
                >    
                </textarea>
            </div>

            {/* 버튼 그룹 */}
            <div className={joinStyles.buttonGroup}>
                <button onClick={handleSubmit} className={joinStyles.button} disabled={loading}>
                    {loading ? "가입 중..." : "가입하기"}
                </button>
                <button type="button" className={joinStyles.button} onClick={() => setStep(1)}>
                    이전
                </button>
            </div>
        </div>
    );
};

export { SignUpStep2 };
