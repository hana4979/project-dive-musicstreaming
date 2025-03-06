import { Cookies } from "react-cookie";

const cookies = new Cookies();

// 추천 목록을 쿠키에 저장 (4KB 이하만 쿠키에 저장할수 있음음)
export const setRecommendedListToCookie = (recommendList) => {
    if (!recommendList) {
        console.warn('저장할 추천 목록이 없습니다.');
        return;
    }

    cookies.set('recommendList', JSON.stringify(recommendList), {
        path: '/',
        sameSite: 'Lax',
        secure: window.location.protocol === 'https:' // HTTPS이면 true
    });
};

// 쿠키에서 추천 목록 가져오기
export const getRecommendedListFromCookie = () => {
    const jsonRecommendList = cookies.get('recommendList');
    
    if (!jsonRecommendList) {
        console.warn('쿠키에서 추천 목록을 찾을 수 없음');
        return [];
    }

    try {
        return JSON.parse(jsonRecommendList);
    } catch (error) {
        console.error('쿠키 데이터 JSON 파싱 오류:', error);
        return [];
    }
};


// 추천 목록을 localStorage에 저장
export const setRecommendedListToStorage = (recommendList) => {
    if (!recommendList) return;
    localStorage.setItem('recommendList', JSON.stringify(recommendList));
};

// localStorage에서 추천 목록 가져오기
export const getRecommendedListFromStorage = () => {
    const jsonRecommendList = localStorage.getItem('recommendList');
    return jsonRecommendList ? JSON.parse(jsonRecommendList) : [];
};
