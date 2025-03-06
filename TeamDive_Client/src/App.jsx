
import { useState } from 'react';
import './App.css'
import { MainHeader } from './components/frame/header';
import { Home } from './components/frame/home';
import { FooterPlayer } from './components/frame/FooterPlayer';
import FloatingButton from './components/FloatingButton';
import ChatModal from './components/ChatModal';
import Footer from './components/frame/footer';
import { PlayerContext, PlayerProvider } from './context/PlayerContext';

function App() {

    const [menubar, setMenubar] = useState(false);

    const toggleMenu = () => {
        setMenubar(!menubar);
        console.log(menubar)
    }

    const [mood, setMood] = useState('');
    const handleMoodSelect = (selectedMood) => {
        console.log('App에서 받은 기분:', selectedMood);
        setMood(selectedMood);
      };
    


    const [chatOpen, setChatOpen] = useState(false);

    const openChat = () => {
        setChatOpen(true);
    }

    const closeChat = () => {
        setChatOpen(false);
    }


        return (
            <PlayerProvider>
                <MainHeader toggleMenu={toggleMenu} onMoodSelect={handleMoodSelect}></MainHeader>

                <FloatingButton onClick={openChat} />
    
    {/* 채팅 모달 */}
                {chatOpen && <ChatModal onClose={closeChat} />}
                <Home menubar={menubar}  mood={mood} setMood={setMood}></Home>
                <Footer />
                <FooterPlayer />
            </PlayerProvider>
    )


}

export default App
