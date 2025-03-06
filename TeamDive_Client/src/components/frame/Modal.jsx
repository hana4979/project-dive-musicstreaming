import React from 'react';
import modalStyle from '../../css/modal.module.css';

const Modal = ({ isOpen, closeModal, children }) => {
    if (!isOpen) return null;

  return (
        <div className={modalStyle.modalOverlay} onClick={closeModal}>
        <div className={modalStyle.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={modalStyle.closeButton} onClick={closeModal}>X</button>
            {children}
        </div>
        </div>
    );
};

export default Modal;
