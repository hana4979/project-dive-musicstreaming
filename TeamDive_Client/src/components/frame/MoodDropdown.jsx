// MoodDropdown.jsx
import React, { useState } from 'react';
import styles from '../../css/moodDropdown.module.css';

const MoodDropdown = ({ onMoodSelect }) => {
  const moodOptions = ['happy', 'sad', 'angry', 'boring', 'normal'];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectMood = (mood) => {
    setSelectedMood(mood);
    setIsOpen(false);
    console.log('무드드랍다운에서 선택된 기분:', mood);

    // 2) 부모(App)까지 전달
    if (onMoodSelect) {
      onMoodSelect(mood);

    }
  };

  return (
    <div className={styles.moodDropdownContainer}>
      <button className={styles.moodButton} onClick={toggleDropdown}>
        오늘 기분이 어떠세요? {selectedMood && `(${selectedMood})`}
      </button>

      {isOpen && (
        <div className={styles.moodDropdown}>
          {moodOptions.map((m) => (
            <div
              key={m}
              className={styles.moodOption}
              onClick={() => handleSelectMood(m)}
            >
              {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodDropdown;
