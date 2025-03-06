import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import styles from '../../css/home.module.css';
import AppRoutes from '../../routes';
import { useDispatch, useSelector } from 'react-redux';
import { Cookies } from 'react-cookie';
import { useEffect } from 'react';
import { logoutAction } from '../../store/UserSlice';


function Home({ menubar, mood, setMood}) {

    const loginUser = useSelector( state => state.user );
    const dispatch = useDispatch(); 
    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(
        () => {
            console.log('loginUser', loginUser)
            //console.log(document.cookie);

        }
    )

    function onLogout(){
        cookies.remove('user',{path:'/'});
        localStorage.removeItem("chatMsg");
        dispatch( logoutAction() );
        alert('로그아웃 되었습니다.');
        navigate('/')
    }

    return (
        <div className={styles.container}>
            
          
            <div className={`${styles.sidebar} ${menubar ? styles.open : ''}`}>
                <Link to='/' className={styles.link}>
                <img src='https://d9k8tjx0yo0q5.cloudfront.net/icon/home1.gif' className={styles.menuImg} alt="메인아이콘"/>
                <span className={styles.linkText}>홈</span>
                </Link>< br/>
                <Link to='/charts' className={styles.link}>
                <img src='https://d9k8tjx0yo0q5.cloudfront.net/icon/chart.gif' className={styles.menuImg} alt="인기차트 아이콘"/>
                <span className={styles.linkText}>인기차트</span>
                </Link>< br/>
                <Link to='/playList' className={styles.link}>
                <img src='https://d9k8tjx0yo0q5.cloudfront.net/icon/playlist.gif' className={styles.menuImg} alt="플레이리스트 아이콘"/>
                <span className={styles.linkText}>플레이리스트</span>
                </Link>< br/>
                <Link to='/storage' className={styles.link}>
                <img src='https://d9k8tjx0yo0q5.cloudfront.net/icon/storage.gif' className={styles.menuImg} alt="보관함 아이콘"/>
                <span className={styles.linkText}>보관함</span>
                </Link>< br/>
                <Link to='/membership/all' className={styles.link}>
                <img src='https://d9k8tjx0yo0q5.cloudfront.net/icon/membership2.gif' className={styles.menuImg} alt="멤버십 아이콘"/>
                <span className={styles.linkText}>멤버십</span>
                </Link>< br/>
                <Link to='/mypage/myPageMain' className={styles.link}>
                <img src='https://d9k8tjx0yo0q5.cloudfront.net/icon/mypage.gif' className={styles.menuImg} alt="마이페이지 아이콘"/>
                <span className={styles.linkText}>마이페이지</span>
                </Link>

                <div className={styles.sidebarEnd}>
                    {
                        (loginUser.memberId)?(
                            <div className={styles.userInfo}>
                                <div className={styles.userDetails}>
                                    <span className={styles.nickname}>{loginUser.nickname}</span>
                                    &nbsp;&nbsp;
                                    <span className={styles.memberId}>({loginUser.memberId})</span>
                                </div>
                                    <button onClick={onLogout} className={styles.logoutButton}>로그아웃</button>
                                </div>
                        ) : (
                            <>
                                <Link to='/login' className={styles.authLink}>로그인</Link><br />
                                <Link to='/sign-up' className={styles.authLink}>회원가입</Link><br />        
                            </>
                        )
                    }
                    

                    {
                        loginUser?.memberRoleList?.includes("ADMIN") && (
                        <a href="http://13.209.123.104/admin/" target="_blank" rel="noopener noreferrer">
                            Admin
                        </a>
                    )}


                </div>
            </div>

            <div className={`${styles.main} ${menubar ? styles.move : ""}`}>
                <AppRoutes mood={mood} setMood={setMood}/>  
            </div>
        </div>
    );
}

export { Home };
