import React, { useEffect, useState } from "react";
import styles from "../css/chatModal.module.css";
import { askChatbot } from "./ChatService";

import { useSelector } from "react-redux";

import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';

const ChatModal = ({ onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);


  const loginUser = useSelector(state => state.user);
  // const userAvatar = loginUser.image;    이거 나중에 aws 하면 바꿔야한다는듯?


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const botReply = await askChatbot(input);
    const botMessage = { sender: "bot", text: botReply };

    setMessages((prev) => [...prev, botMessage]);
    setInput("");
  };


  // 채팅기록 로컬s에서 가져오기
  useEffect(()=>{

    const saveMsg = JSON.parse(localStorage.getItem("chatMsg"));
    if (saveMsg) {
      setMessages(saveMsg);
    } else {
      setMessages([{sender: "bot", text:"안녕! 다이브에 온걸 환영해! "}])
    }

  },[])



  // 채팅기록 로컬S에 저장하기
  useEffect(()=>{
   
      localStorage.setItem("chatMsg", JSON.stringify(messages));

  },[messages])


  // 채팅기록 초기화하기

  const refreshMsg = () => {
      const check = confirm('새로운 채팅할?');

      if(check) {
          localStorage.removeItem("chatMsg");
          setMessages([{sender: "bot", text:"안녕! 다이브에 온걸 환영해! "}]);
      } else {
          return ;
      }

  }
  








  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.chatModal} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className={styles.chatHeader}>
          <h2>다이브</h2>
          <span className={styles.refreshBtn} onClick={refreshMsg}><RefreshIcon /></span>
          <button className={styles.closeButton} onClick={onClose}>✖</button>
        </div>

        
        <div className={styles.chatContent}>
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender === "user" ? styles.userMessageWrapper : styles.botMessageWrapper}>
              {/* AI */}
              {msg.sender === "bot" && <img src={"https://d9k8tjx0yo0q5.cloudfront.net/icon/chatbot.png"}  className={styles.avatar} />}
              
              {/* 말풍선 */}
              <div className={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
                  <span dangerouslySetInnerHTML={{ __html: msg.text }} />
              </div>
              
             {/* 사용자 */}
              {msg.sender === "user" && (
                loginUser?.image  && loginUser.image !== "" ? (
                  <img
                    src={`${loginUser.image}`}
                    alt="사용자"
                    className={styles.avatar}
                  />
                ) : (
                  <PersonIcon className={styles.avatarIcon}/>
                )
              )}
            </div>
          ))}
        </div>

        {/* 입력창 */}
        <div className={styles.chatInputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className={styles.chatInput}
          />
          <button className={styles.sendButton} onClick={handleSend}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
