import axios from "axios";
import { Cookies } from "react-cookie";

const jaxios=axios.create();
const cookies=new Cookies();

const beforeReq= async (config)=>{
    let user=cookies.get('user');
    const accessToken = user.accessToken;
    const Header = { headers:{ 'Authorization':`Bearer ${accessToken}`} , params:{refreshToken:user.refreshToken } };
    // axios 로 토큰 검증을 요청합니다. 이때 헤더에는  accessToken 이 있고,
    // 파라미터로  refreshToken 이 전송됩니다
    const result = await axios.get(`/api/member/refresh`, Header );
    // 검증마치고 돌아온 두개토큰을 현재유저의 사용자정보에 추가하고
    user.accessToken = result.data.accessToken;
    user.refreshToken = result.data.refreshToken;
    // 이를 다시 쿠키에 저장
    cookies.set( 'user', JSON.stringify(user),{ path:"/"});
    // accessToken만 따로 다시 헤더에 조립시켜 config 를 완성하고
    config.headers.Authorization = `Bearer ${user.accessToken}`;
    // config 를 리턴합니다
    return config;
}

const beforeRes= (res)=>{
    return res;
}
const requestFail = (error) => {
    console.error("요청 실패:", error);
    return Promise.reject(error);
};

const responseFail = (error) => {
    console.error("응답 실패:", error);
    return Promise.reject(error);
};

jaxios.interceptors.request.use(beforeReq,requestFail);
jaxios.interceptors.response.use(beforeRes,responseFail);

export default jaxios;