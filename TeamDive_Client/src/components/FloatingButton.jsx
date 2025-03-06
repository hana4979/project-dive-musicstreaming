// src/components/FloatingButton.jsx
import React, { useState, useRef, useEffect } from 'react';
import styles from '../css/FloatingButton.module.css';
import ChatIcon from '@mui/icons-material/Chat';

const FloatingButton = ({ onClick }) => {
  const buttonRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // 이동 거리가 threshold를 넘었는지 여부
  const [didMove, setDidMove] = useState(false);

  // 현재 버튼 위치
  const [position, setPosition] = useState({
    x: window.innerWidth - 120,
    y: window.innerHeight - 170,
  });

  // 드래그 시작점과의 상대 위치
  const offset = useRef({ x: 0, y: 0 });
  
  // 마우스가 눌린 시작 좌표(드래그 거리 계산용)
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      // 현재 마우스 위치에서 offset 뺀 값으로 위치 계산
      const newX = e.clientX - offset.current.x;
      const newY = e.clientY - offset.current.y;
      setPosition({ x: newX, y: newY });

      // 마우스 이동 거리 계산 (시작점 대비)
      const moveX = Math.abs(e.clientX - dragStartPos.current.x);
      const moveY = Math.abs(e.clientY - dragStartPos.current.y);
      const distance = Math.sqrt(moveX ** 2 + moveY ** 2);

      // threshold 예: 5px 이상 움직이면 드래그로 판정
      if (distance > 5) {
        setDidMove(true);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);

    // 버튼과 클릭 지점 차이 저장
    const rect = buttonRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    // 드래그 시작점 기록
    dragStartPos.current = { x: e.clientX, y: e.clientY };

    // 마우스 다운 시점엔 아직 이동 안 했으므로 false
    setDidMove(false);
  };

  // 클릭 이벤트
  const handleClick = () => {
    // 드래그로 판정(didMove = true)이면 클릭 무시
    if (!isDragging && !didMove && typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <div
      ref={buttonRef}
      className={styles.floatingButton}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <ChatIcon fontSize='large'/>
    </div>
  );
};

export default FloatingButton;
