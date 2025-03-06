import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/member/loginPage";
import KakaoLogin from "./components/member/KakaoLogin";
import JoinForm from "./components/member/JoinForm";
import Membership from "./components/membership/Membership";
import MainPage from "./components/frame/mainpage/MainPage";
import MusicDetail from "./components/detail/MusicDetail";
import AlbumDetail from "./components/detail/AlbumDetail";
import PopularChart from "./components/PopularChart";
import Storage from "./components/storage/storage";
import { PlaylistPage } from "./components/playlist/PlaylistPage";


import PaymentsCheckout from "./components/payments/PaymentsCheckout";
import PaymentsSuccess from "./components/payments/PaymentsSuccess";
import PaymentsFail from "./components/payments/PaymentsFail";

import Mypage from "./components/member/mypage/Mypage";

import Top100 from "./components/chartmore/Top100";
import Weekly from "./components/chartmore/Weekly";
import Monthly from "./components/chartmore/Monthly";
import Domestic from "./components/chartmore/Domestic";
import Foreign from "./components/chartmore/Foreign";
import ArtistDetail from "./components/detail/ArtistDetail";
import PlaylistDetail from "./components/detail/PlaylistDetail";
import SearchResults from "./components/frame/mainpage/SearchResult";
import SearchMore from "./components/frame/mainpage/SearchMore";

import NoticeBoard from "./components/frame/mainpage/NoticeBoard";


function AppRoutes({mood, setMood}) {
    return (
        <Routes>
            <Route path="/" element={<MainPage mood={mood} setMood={setMood}/>} />
            <Route path="/charts" element={<PopularChart />} />
            <Route path="/playList" element={<PlaylistPage />} />
            <Route path="/membership/:category" element={<Membership />} />
            <Route path="/storage" element={<Storage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/kakaoLogin/:memberId" element={<KakaoLogin />} />
            <Route path="/sign-up" element={<JoinForm />} />

            <Route path="/music/:musicId" element={<MusicDetail />} />
            <Route path="/album/:albumId" element={<AlbumDetail />} />
            <Route path="/artist/:artistId" element={<ArtistDetail />}/>
            <Route path="/playlist/:playlistId" element={<PlaylistDetail />}/>


            {/* 토스 페이먼트 api */}
            <Route path="/payments" element={<PaymentsCheckout />} />
            <Route path="/success" element={<PaymentsSuccess />} />
            <Route path="/fail" element={<PaymentsFail />} />

            {/* 마이페이지 */}
            <Route path="/mypage/:mypageCategory" element={<Mypage />} />
            <Route path="/mypage/:mypageCategory/:mp3Category" element={<Mypage />} />

            {/* 스토리지 */}
            <Route path="/storage/:storageCategory" element={<Storage />}/>


            {/* 차트 더보기 */}
            <Route path="/top100" element={<Top100 />}/>
            <Route path="/charts/weekly" element={<Weekly />}/>
            <Route path="/charts/monthly" element={<Monthly />}/>
            <Route path="/charts/domestic" element={<Domestic />}/>
            <Route path="/charts/foreign" element={<Foreign />}/>

            {/* 검색 */}
            <Route path="/search" element={<SearchResults />}/>
            <Route path="/searchMore" element={<SearchMore />} /> 

            {/* 공지 */}
            <Route path="/notice" element={<NoticeBoard />} /> 



        </Routes>
    );
}

export default AppRoutes;
