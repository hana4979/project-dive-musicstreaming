// src/components/Footer.jsx
import { useEffect, useRef, useState } from 'react';
import styles from '../../css/footerPlayer.module.css';
import jaxios from '../../util/JwtUtil';
import Player from '../Player';

const playList=[];

function FooterPlayer() {

    return (
        <div className={styles.footer}>
            <Player />
        </div>
    );
}

export { FooterPlayer };
