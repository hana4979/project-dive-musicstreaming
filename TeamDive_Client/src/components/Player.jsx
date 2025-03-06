import React, { useState, useEffect, useRef, useContext } from 'react';

import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';

// ------------ ICONS -------------
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';

import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import DeleteIcon from '@mui/icons-material/Delete';
// ----------------------------------

import axios from 'axios';
import { useSelector } from 'react-redux';
import { PlayerContext } from '../context/PlayerContext';
import jaxios from '../util/JwtUtil';
// Custom Paper 스타일
const CustomPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'black',
  margin: theme.spacing(0),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  boxShadow: 'none',
}));

// 커스텀 슬라이더
const PSlider = styled(Slider)(({ theme, ...props }) => ({
  color: 'silver',
  height: 6,
  '&:hover': { cursor: 'pointer' },
  '& .MuiSlider-thumb': {
    width: '15px',
    height: '15px',
    display: props.thumbless ? 'none' : 'block',
    boxShadow: '0px 0px 8px rgba(255,255,255,0.8)',
  },
}));

// 유틸: 배열을 랜덤하게 섞는 함수
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Player() {
  const audioRef = useRef();

  // 재생 상태 관련
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [mute, setMute] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  // 반복, 셔플 관련
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [shuffleQueue, setShuffleQueue] = useState([]);
  const [shufflePos, setShufflePos] = useState(0);

  // 초기 playlist 상태
  const [playlist, setPlaylist] = useState([]);
  
  // 리스트 토글 상태 (플레이리스트 보이기/숨기기)
  const [showPlaylist, setShowPlaylist] = useState(false);

  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 200; // 한 페이지에 7곡씩 표시

  // 검색 기능 제거 → 전체 playlist 사용
  const filteredPlaylist = playlist;

  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = filteredPlaylist.slice(indexOfFirstSong, indexOfLastSong);

  // 현재 재생할 곡 결정
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    if (playlist.length > 0) {
      if (isShuffle && shuffleQueue.length > 0) {
        setCurrentSong(playlist[shuffleQueue[shufflePos]] || null);
      } else {
        setCurrentSong(playlist[index] || null);
      }
    }
  }, [playlist, index, isShuffle, shuffleQueue, shufflePos]); 

  const loginUser = useSelector(state => state.user);
  const [playCounts, setPlayCounts] = useState({});
  const [isPlayed, setIsplayed] = useState(false);
  const musicPlay = (songId) => {
    setPlayCounts(prev => ({
      ...prev,
      [songId]: (prev[songId] || 0) + 1
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(playCounts).length > 0) {
        axios.post("/api/music/addPlayCount", playCounts, { params: { memberId: loginUser.memberId } })
          .then(() => setPlayCounts({}))
          .catch(err => console.error("Error sending play counts:", err));
      }
    }, 600000);
    return () => clearInterval(interval);
  }, [playCounts]);


  const prevPlaylist=useRef([]);
  useEffect(
    ()=>{
      const fetchPlaylist = async () => {
        if(playlist.length != prevPlaylist.current.length){
          const result=await axios.post('/api/music/getCurrentPlaylist',playlist)
          setPlaylist(result.data.playlist);
          localStorage.setItem("playlist",JSON.stringify(result.data.playlist))
        }
        prevPlaylist.current=playlist;
        console.log(playlist);
      }
      fetchPlaylist();
    },[playlist]
  );
  //30초동안 재생하면 재생수 증가함수 
  const play30second = () => {
    const audio = audioRef.current;
    const interval = setInterval(() => {
      if (audio.currentTime >= 30 && !isPlayed) {
        musicPlay(currentSong.musicId);
        setIsplayed(true);
        clearInterval(interval);
      }
    }, 1000);
  };
  useEffect(() => {
    setIsplayed(false);
  }, [currentSong]);
  //다른 컴포넌트에서 재생할 음악데이터 받음  
  const { addPlaylist, setAddPlaylist } = useContext(PlayerContext);
  const {addAndPlay,setAddAndPlay} = useContext(PlayerContext);
  useEffect(() => {
    if (addPlaylist) {
      setPlaylist(prev => {
        const newPlaylist = [...prev];  // 배열 복사
        newPlaylist.splice(index+1, 0, ...addPlaylist);  // 복사한 배열에 splice 적용
        return newPlaylist;  // 새로운 배열 반환
      });
      setAddPlaylist(null);
    }
    if(addAndPlay){
      setPlaylist(prev => {
        const newPlaylist = [...prev];  // 배열 복사
        newPlaylist.splice(index+1, 0, ...addAndPlay);  // 복사한 배열에 splice 적용
        return newPlaylist;  // 새로운 배열 반환
      });
    }
  }, [addPlaylist, addAndPlay]);

  const recommend=useRef(false);
  useEffect(
    ()=>{
      if(playlist.length> 0 && playlist.every(song=>song.src) && addAndPlay && audioRef.current){
        setIndex(prevIndex => {
          let newIndex = prevIndex + 1;
          if(playlist.length==1) newIndex =0;
          handleAudioChange(newIndex, true);
          return newIndex;
        });
        setAddAndPlay(null);
      }

      if(index==playlist.length-1){
        jaxios.get('/api/AI/addRecommendList',{params:{mood:'normal',memberId: loginUser.memberId, signal: true}})
        .then((result)=>{
          localStorage.setItem('addRecommendList',JSON.stringify(result.data.addRecommendList));
          recommend.current=true;
        }).catch((err)=>{console.error(err);})
      }

      if(playlist.length> 0 && playlist.every(song=>song?.src) && recommend.current && audioRef.current){
        setIndex(prevIndex => {
          let newIndex = prevIndex + 1;
          if(playlist.length==1) newIndex =0;
          handleAudioChange(newIndex, true);
          return newIndex;
        });
        recommend.current=false;
      }
    },[playlist]
  );

  const lastSong = () => {
    if(index==playlist.length-1){
      try {
        const storedPlaylist = JSON.parse(localStorage.getItem("addRecommendList")) || []; // storedPlaylist가 null이면 빈 배열
        setPlaylist(prev => [...prev, ...storedPlaylist]); // 배열을 올바르게 병합
        recommend.current=true;
      } catch (error) {
        console.log('불러오기 실패', error);
      }
    }
  };


  const [membership,setMembership]=useState(false);
  //멤버십 조회, 처음 렌더링시 플레이리스트 스토리지에서 가져옴
  useEffect(
    ()=>{
      try {
        const storedPlaylist = JSON.parse(localStorage.getItem("playlist"));
        setPlaylist(storedPlaylist || []); // storedPlaylist가 null일 경우 빈 배열로 설정
      } catch (error) {
        setPlaylist([]); // 파싱 오류가 날 경우 빈 배열 설정
      }
      axios.get('/api/membership/checkActiveMembership',{params:{memberId:loginUser.memberId||"" , category: 'streaming'}})
      .then((result)=>{
        if(result.data.message=='yes'){
          setMembership(true)
        }
      }).catch((err)=>{console.error(err);})
    },[]
  );
  //멤버십없으면 60초 제한
  const [hasSkipped, setHasSkipped] = useState(false);

  useEffect(() => {
    if (!membership && elapsed >= 60 && !hasSkipped) {
      setHasSkipped(true); // 중복 실행 방지
  
      const timer = setTimeout(() => {
        toggleSkipForward();
      }, 200);
  
      return () => {
        setHasSkipped(false); 
        clearTimeout(timer);
      };
    }
  }, [elapsed, membership]);
  
  const removePlaylist=(i)=>{
    setPlaylist(prev => prev.filter((_,index)=> index!==i) )
  }

  const playlistRef = useRef(null);  // 전체 플레이리스트를 감싸는 요소의 ref
  const currentSongRef = useRef(null);  // 현재 재생 중인 곡을 가리킬 ref

  useEffect(() => {
    if (currentSongRef.current) {
      // 현재 재생 중인 곡이 화면에 보이도록 스크롤 이동
      currentSongRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center', 
      });
    }
    setElapsed(0);
    setHasSkipped(false);
  }, [index]);  // index가 변경될 때마다 실행되어 현재 곡에 스크롤 이동



  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = mute ? 0 : volume / 100;
    }
    if (isPlaying) {
      const intervalId = setInterval(() => {
        const _duration = Math.floor(audioRef.current?.duration);
        const _elapsed = Math.floor(audioRef.current?.currentTime);
        setDuration(_duration);
        setElapsed(_elapsed);
      }, 500);
      return () => clearInterval(intervalId);
    }
  }, [volume, mute, isPlaying]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    const handleEnded = () => {
      toggleSkipForward('auto');
    };
    audioEl.addEventListener('ended', handleEnded);
    return () => {
      audioEl.removeEventListener('ended', handleEnded);
    };
  }, [isShuffle, shuffleQueue, shufflePos, index, isRepeat]);

  // 재생/일시정지
  const togglePlay = () => {
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // 특정 곡으로 재생
  const handleAudioChange = (songIndex, autoPlay = true) => {
    const src = playlist[songIndex]?.src;
    if(audioRef.current){
      audioRef.current.src = src;
      audioRef.current.load();
      audioRef.current.onloadedmetadata = () => {
        const _duration = Math.floor(audioRef.current?.duration);
        const _elapsed = Math.floor(audioRef.current?.currentTime);
        setDuration(_duration);
        setElapsed(_elapsed);
        if (autoPlay && audioRef.current) {
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(err => console.error('Play error:', err));
        } else {
          if(audioRef.current){
            audioRef.current.pause();
            setIsPlaying(false);
            }
        }
      };
  
    }
  };

  // 이전 곡
  const toggleSkipBackward = () => {
    if (isShuffle) {
      setShufflePos(prevPos => {
        let newPos = prevPos - 1;
        if (newPos < 0) newPos = shuffleQueue.length - 1;
        handleAudioChange(shuffleQueue[newPos], true);
        return newPos;
      });
    } else {
      setIndex(prevIndex => {
        const newIndex = prevIndex <= 0 ? playlist.length - 1 : prevIndex - 1;
        handleAudioChange(newIndex, true);
        return newIndex;
      });
    }
  };

  // 다음 곡
  const toggleSkipForward = (skipType = 'manual') => {
    if (isRepeat && skipType === 'auto') {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error('Play error:', err));
      return;
    }
    if (isShuffle) {
      setShufflePos(prevPos => {
        let newPos = prevPos + 1;
        if (newPos >= shuffleQueue.length) {
          const newQueue = shuffleArray([...playlist.keys()]);
          setShuffleQueue(newQueue);
          newPos = 0;
        }
        if (skipType === 'auto' && newPos === 0) {
          handleAudioChange(shuffleQueue[newPos], false);
        } else {
          handleAudioChange(shuffleQueue[newPos], true);
        }
        return newPos;
      });
      return;
    }
    setIndex(prevIndex => {
      const newIndex = prevIndex >= playlist.length - 1 ? 0 : prevIndex + 1;
      if (skipType === 'auto' && newIndex === 0) {
        handleAudioChange(newIndex, false);
      } else {
        handleAudioChange(newIndex, true);
      }
      return newIndex;
    });
  };

  // 반복/셔플
  const toggleRepeat = () => {
    setIsRepeat(prev => !prev);
  };
  const toggleShuffle = () => {
    if (!isShuffle) {
      const newQueue = shuffleArray([...playlist.keys()]);
      setShuffleQueue(newQueue);
      setShufflePos(0);
      const currentIndex = isShuffle ? shuffleQueue[shufflePos] : index;
      const findPos = newQueue.findIndex(val => val === currentIndex);
      if (findPos !== -1) setShufflePos(findPos);
    }
    setIsShuffle(prev => !prev);
  };

  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
      const seconds = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);
      return `${minutes}:${seconds}`;
    }
    return '00:00';
  };

  // ===== 볼륨 아이콘 =====
  const VolumeBtns = () => {
    if (mute)
      return (
        <VolumeOffIcon
          sx={{ color: 'silver', '&:hover': { color: 'white', cursor: 'pointer' } }}
          onClick={() => setMute(!mute)}
        />
      );
    if (volume <= 20)
      return (
        <VolumeMuteIcon
          sx={{ color: 'silver', '&:hover': { color: 'white', cursor: 'pointer' } }}
          onClick={() => setMute(!mute)}
        />
      );
    if (volume <= 75)
      return (
        <VolumeDownIcon
          sx={{ color: 'silver', '&:hover': { color: 'white', cursor: 'pointer' } }}
          onClick={() => setMute(!mute)}
        />
      );
    return (
      <VolumeUpIcon
        sx={{ color: 'silver', '&:hover': { color: 'white', cursor: 'pointer' } }}
        onClick={() => setMute(!mute)}
      />
    );
  };

  if (playlist.length > 0) {
    // 선택한 곡으로 재생하고 리스트 숨김 처리
    const handleSelectSong = (i) => {
      setIndex(i);
      handleAudioChange(i, true);
      // setShowPlaylist(false);
    };

    // 페이지 변경 핸들러
    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    };

    return (
      <footer className="footer">
        <audio ref={audioRef} muted={mute} src={currentSong?.src || ""} onPlay={play30second} onEnded={()=>lastSong()}/>
        <CustomPaper>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'space-between' },
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100vw', sm: '100vw' },
              gap: 2,
            }}
          >
            {/* 왼쪽: 볼륨 컨트롤 */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                flex: { xs: 'unset', sm: 0.2 },
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 1.5,
                padding: '0 0 0 14px',
              }}
            >
              <VolumeBtns />
              <Slider
                min={0}
                max={100}
                value={volume}
                onChange={(e, v) => setVolume(v)}
                sx={{
                  color: 'silver',
                  width: { xs: '150px', sm: '100%' },
                }}
              />
            </Stack>

            {/* 가운데: 재생 진행바 */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                flex: { xs: 'unset', sm: 1 },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                width: { xs: '90vw', sm: 'auto' },
              }}
            >
              <Typography sx={{ color: 'silver' }}>{formatTime(elapsed)}</Typography>
              <PSlider
                min={0}
                max={duration}
                value={elapsed}
                onChange={(e, newValue) => setElapsed(newValue)}
                onChangeCommitted={(e, newValue) => {
                  if (audioRef.current) audioRef.current.currentTime = newValue;
                }}
              />
              <Typography sx={{ color: 'silver', padding: '0 20px 0 0' }}>
                {formatTime(duration - elapsed)}
              </Typography>
            </Stack>

            {/* 오른쪽: 컨트롤 버튼들 */}
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                flex: { xs: 'unset', sm: 0.5 },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2.5,
              }}
            >
              <SkipPreviousIcon
                sx={{ color: 'silver', '&:hover': { color: 'white', cursor: 'pointer' } }}
                onClick={toggleSkipBackward}
              />
              {!isPlaying ? (
                <PlayArrowIcon
                  fontSize="large"
                  sx={{
                    color: 'silver',
                    transform: 'scale(1.5)',
                    '&:hover': {
                      color: 'white',
                      cursor: 'pointer',
                      transform: 'scale(1.3)',
                      transition: '0.3s',
                    },
                  }}
                  onClick={togglePlay}
                />
              ) : (
                <PauseIcon
                  fontSize="large"
                  sx={{
                    color: 'silver',
                    transform: 'scale(1.5)',
                    '&:hover': {
                      color: 'white',
                      cursor: 'pointer',
                      transform: 'scale(1.3)',
                      transition: '0.3s',
                    },
                  }}
                  onClick={togglePlay}
                />
              )}
              <SkipNextIcon
                sx={{ color: 'silver', '&:hover': { color: 'white', cursor: 'pointer' } }}
                onClick={() => toggleSkipForward('manual')}
              />
              <RepeatIcon
                sx={{
                  color: isRepeat ? 'hotpink' : 'silver',
                  '&:hover': { color: 'white', cursor: 'pointer' },
                }}
                onClick={toggleRepeat}
              />
              <ShuffleIcon
                sx={{
                  color: isShuffle ? 'hotpink' : 'silver',
                  '&:hover': { color: 'white', cursor: 'pointer' },
                }}
                onClick={toggleShuffle}
              />
            </Stack>

            {/* 현재 노래 정보 및 리스트 버튼 */}
            <Stack
              direction="row"
              sx={{
                flex: { xs: 'unset', sm: 0.5 },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                paddingRight: '14px',
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ color: 'silver' }}>
                  {currentSong?.title||""}
                </Typography>
                <Typography variant="body2" sx={{ color: 'silver' }}>
                  {currentSong?.artist||""}
                </Typography>
              </Box>
              <PlaylistPlayIcon
                sx={{
                  color: 'silver',
                  '&:hover': { color: 'white', cursor: 'pointer' },
                }}
                onClick={() => setShowPlaylist(!showPlaylist)}
              />
            </Stack>
          </Box>
        </CustomPaper>

        {/* 플레이리스트 슬라이드 (오른쪽 하단에서 위로 올라감) */}
        <Slide direction="up" in={showPlaylist} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: 'fixed',
              right: 0,
              bottom: 70,
              width: '280px',
              maxHeight: '60%',
              overflowY: 'auto',
              background: 'linear-gradient(135deg, #222, #000)',
              borderTopLeftRadius: '12px',
              borderBottomLeftRadius: '12px',
              boxShadow: '0px 0px 20px rgba(0,0,0,0.8)',
              padding: 2,
              zIndex: 1300,
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': {
                background: '#555',
                borderRadius: '3px',
              },
            }}
            ref={playlistRef}
          >
            {/* 헤더 영역: 타이틀과 닫기 버튼 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 ,position:'sticky',top:0, background: 'linear-gradient(135deg, #222, #000)',
      padding: 2,
      zIndex: 10,}}>
              <Typography variant="h6" sx={{ color: 'silver' }}>
                Playlist
              </Typography>
              <DeleteIcon sx={{ position: 'relative', marginLeft: '-110px', cursor: 'pointer'}} onClick={()=>{setPlaylist([]);}}/>
              <IconButton size="small" onClick={() => setShowPlaylist(false)} sx={{ color: 'silver' }}>
                <CloseIcon />
              </IconButton>
            </Box>
            {currentSongs.map((song, i) => (
              <Box
              key={`${song.musicId}-${i}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingY: 1,
                paddingX: 1,
                borderRadius: '6px',
                mb: 1,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'scale(1.02)',
                },
              }}
              style={{border: (i==index)? 'white 1px solid' : null}}
              onClick={() => handleSelectSong(playlist.indexOf(song))}
              ref={i === index ? currentSongRef : null} // 현재 재생 중인 곡에 ref 설정
            >
              <Box>
                <Typography variant="subtitle1" sx={{ color: 'silver' }}>
                  {song.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray' }}>
                  {song.artist}
                </Typography>
              </Box>
              <IconButton size="small" sx={{ color: 'silver' }} onClick={(e)=>{e.stopPropagation(); removePlaylist(i);}}>
                <CloseIcon />
              </IconButton>
            </Box>
            ))}
            {filteredPlaylist.length > songsPerPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Pagination
                  count={Math.ceil(filteredPlaylist.length / songsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  size="small"
                  sx={{
                    '& .MuiPaginationItem-root': { color: 'silver' },
                  }}
                />
              </Box>
            )}
          </Box>
        </Slide>
      </footer>
    );
  }
}
