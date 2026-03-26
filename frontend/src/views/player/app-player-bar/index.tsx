import React,{memo, useState} from "react";
import type {FC,ReactNode} from 'react'
import { BarControl, PlayerBarWrapper, BarPlayInfo, BarOperator } from './style'
import { Link } from "react-router-dom";
import { Slider,message } from "antd";
import { useAppSelector,shallowEqualApp } from "@/store";
import { getSongPlayer } from "../service/player";
import { getImageSize } from "@/utils/format";
import { useRef } from "react";
import { useEffect } from "react";
import { formatTime } from "@/utils/format";
import { useAppDispatch } from "@/store";
import { changeLyricIndexAction, changeMusicAction,changePlayModeAction } from "../store/player";


interface Iprops {
    children?: ReactNode
}

const AppPlayerBar: FC<Iprops> = () => {
    const audioRef = useRef<HTMLAudioElement>(null)
    const currentLyricIndexRef = useRef(-1)
    const [isLocked, setIsLocked] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress,setProgress] = useState(0)
    const [duration,setDuration] = useState(0)
    const [sliding,setSliding] = useState(false)

    const localUrl = encodeURI("/audio/刻在我心底的名字.mp3");

    //从redux获取数据
    const {currentSong,lyrics,lyricIndex,playMode,lyricTimeMode,lyricStartTime} = useAppSelector(state=>({
        currentSong:state.player.currentSong,
        lyrics:state.player.lyrics,
        lyricIndex:state.player.lyricIndex,
        playMode:state.player.playMode,
        lyricTimeMode:state.player.lyricTimeMode,
        lyricStartTime:state.player.lyricStartTime
    }),shallowEqualApp)

    const dispatch = useAppDispatch()

    useEffect(()=>{
        const audio = audioRef.current
        if (!audio) return

        // 切歌时先重置进度与歌词索引
        setProgress(0)
        setSliding(false)
        currentLyricIndexRef.current = -1
        dispatch(changeLyricIndexAction(-1))

        // 如果没有歌曲信息，回退本地音频
        if (!currentSong?.id) {
            setDuration(0)
            setIsPlaying(false)
            audio.src = localUrl
            return
        }

        // 设置时长：优先使用详情里的 dt（最终以 onLoadedMetadata 为准）
        const totalTime = currentSong?.dt
        if (totalTime) setDuration(totalTime / 1000)

        const songId = currentSong.id
        let canceled = false

        // 先暂停并重置，避免切歌瞬间继续播放上一首的尾巴
        audio.pause()
        audio.currentTime = 0
        setIsPlaying(false)

        getSongPlayer(songId).then((res: any) => {
            if (canceled) return
            const url = res?.data?.[0]?.url
            audio.src = url || localUrl
            if (!url) {
                message.warning('暂无可用播放地址，已回退到本地音乐')
                throw new Error('No playable url')
            }
            return audio.play()
        }).then(() => {
            if (canceled) return
            setIsPlaying(true)
        }).catch((err) => {
            if (canceled) return
            setIsPlaying(false)
            console.warn('播放失败:', err)
        })

        return () => {
            canceled = true
        }
    },[currentSong, dispatch, localUrl])

    function handleLoadedMetadata() {
        const audio = audioRef.current
        if (!audio) return
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            setDuration(audio.duration)
        }
    }

    //音乐播放进度的处理
    function handleTimeUpdate(){
        if (sliding) return
    
        //1.获取当前播放时间
        const audio = audioRef.current
        if (!audio) return
        const currentPlayTime = audio.currentTime || 0

        //2.计算当前音乐进度
       if(!sliding){
        const progress = duration > 0 ? (currentPlayTime / duration) * 100 : 0;
        setProgress(progress)
       }

       //3.根据当前时间匹配对应的歌词
       if (!lyrics.length) return

       const currentTimeMs = Math.max(0, currentPlayTime * 1000)
       if (lyricTimeMode === 'end') {
         // end-mode: show the lyric whose end time hasn't passed yet (fix "lag one line" feeling)
         if (currentTimeMs < lyricStartTime) return
       } else {
         // start-mode: show the lyric whose start time has been reached
         if (currentTimeMs < lyrics[0].time) return
       }

       let left = 0
       let right = lyrics.length - 1
       while (left <= right) {
         const mid = (left + right) >> 1
         const midTime = lyrics[mid].time
         if (midTime <= currentTimeMs) {
           left = mid + 1
         } else {
           right = mid - 1
         }
       }

       let index = lyricTimeMode === 'end' ? left : right
       if (index < 0) return
       if (index >= lyrics.length) index = lyrics.length - 1
       if (index === currentLyricIndexRef.current) return
       currentLyricIndexRef.current = index
       const currentLyric = lyrics[index]
       if (currentLyric?.text) console.log(currentLyric.text)
      
       //4，匹配上对应歌词的index
       if(lyricIndex === index || index === -1) return
       dispatch(changeLyricIndexAction(index))
         
       //5.展示对应的歌词
       message.open({
         content:lyrics[index]?.text,
         key:'lyric',
         duration:0
       })
    }

    
    function handleLockClick(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault()
        setIsLocked(prev => !prev)
    }

    function handleSliderChange(value: number) {
        //目前是拖拽状态
        setSliding(true)
        setProgress(value)
    }

    //滑动条拖动完成
    function handleSliderChangeComplete(progress:number){
        setSliding(false)
        if(audioRef.current && duration){
            audioRef.current.currentTime = (progress / 100) * duration
        }
    }

    //组件事件处理
    function handlePlayClick(){
       //控制播放/暂停
        if(isPlaying){
            audioRef.current?.pause()
            setIsPlaying(false)
        }else{
            audioRef.current?.play()
                .then(() => {
                    console.log('播放成功')
                    setIsPlaying(true)
                })
                .catch(() => {
                    console.log('播放失败')
                    setIsPlaying(false)
                })
        }
    }

    //改变歌曲模式
    function handleChangeMusic(isNext=true){
        dispatch(changeMusicAction(isNext))
    }
    //改变播放模式
    function handleChangePlayMode(){
        let newPlayMode = playMode + 1
        if(newPlayMode > 2) newPlayMode = 0
        dispatch(changePlayModeAction(newPlayMode))
    }

    function handleEnded() {
        const audio = audioRef.current
        if (!audio) return

        // 单曲循环：直接从头再播当前歌曲
        if (playMode === 2) {
            audio.currentTime = 0
            audio.play().then(() => {
                setIsPlaying(true)
            }).catch(() => {
                setIsPlaying(false)
            })
            return
        }

        // 顺序/随机：切到下一首
        dispatch(changeMusicAction(true))
    }

    return(
        <PlayerBarWrapper className="sprite_playbar">
            <div className="lock sprite_playbar">
                <a
                    className={`lock-btn sprite_playbar${isLocked ? ' locked' : ''}`}
                    href="#"
                    onClick={handleLockClick}
                    aria-pressed={isLocked}
                ></a>
            </div>
            <div className="content wrap-v2">
                <BarControl isPlaying={isPlaying}>
                    <button
                        className="btn sprite_playbar prev"
                        onClick={() => handleChangeMusic(false)}
                    ></button>
                    <button 
                        className={`btn sprite_playbar ${isPlaying ? 'pause' : 'play'}`}
                        onClick={handlePlayClick}
                    ></button>
                    <button
                        className="btn sprite_playbar next"
                        onClick={() => handleChangeMusic(true)}
                    ></button>
                </BarControl>
                <BarPlayInfo>
                    <Link to="/discover/player">
                        <img 
                        className="image"
                        src={currentSong?.al?.picUrl ? getImageSize(currentSong.al.picUrl, 50) : ""}
                        alt=""/>
                    </Link>
                    <div className="info">
                        <div className="song">
                            <span className="song-name">{currentSong?.name}</span>
                            <span className="singer-name">{currentSong?.ar?.[0]?.name}</span>
                        </div>
                        <div className="progress">
                            <Slider 
                                value={progress}
                                min={0}
                                max={100}
                                step={0.1}
                                tooltip={{ open: false }}
                                onChange={handleSliderChange}
                                onChangeComplete={handleSliderChangeComplete}
                            />
                            <div className="time">
                                <span className="current">{formatTime(audioRef.current?.currentTime || 0)}</span>
                                <span className="divider">/</span>
                                <span className="total">{formatTime(duration)}</span>
                            </div>
                        </div>
                    </div>
                   
                </BarPlayInfo>
                <BarOperator playMode={playMode}>
                    <div className="left">
                        <button className="btn pip"></button>
                        <button className="btn sprite_playbar favor"></button>
                        <button className="btn sprite_playbar share"></button>
                    </div>
                    <div className="right sprite_playbar">
                        <button className="btn sprite_playbar volume"></button>
                        <button className="btn sprite_playbar loop" onClick={handleChangePlayMode}></button>
                        <button className="btn sprite_playbar playlist"></button>
                    </div>
                </BarOperator>
            </div>
            <audio
                ref={audioRef}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
            ></audio>
        </PlayerBarWrapper>
    )
}

export default memo(AppPlayerBar)
