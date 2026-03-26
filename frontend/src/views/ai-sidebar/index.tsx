import React, { memo, useState, useRef, useEffect, useCallback } from 'react'
import type { FC } from 'react'
import { SidebarWrapper, AIToggleButton } from './style'
import { useAppSelector, useAppDispatch, shallowEqualApp } from '@/store'
import {
  toggleSidebar,
  closeSidebar,
  sendMessageAction,
  stopStreamingAction,
  setApiKey,
  clearMessages,
  setRagStatus,
  setRagProgress
} from './store/ai'
import { indexSong, initRAG } from './service/rag/knowledge-base'
import type { SongInfo } from './service/rag/knowledge-base'
import ChatMessage from './c-cpns/chat-message'
import ChatInput from './c-cpns/chat-input'
import QuickActions from './c-cpns/quick-actions'

const MOOD_TAGS = [
  '开心想蹦迪',
  '安静独处',
  '深夜emo',
  '运动燃脂',
  '下雨天发呆',
  '怀旧经典'
]

const AISidebar: FC = () => {
  const dispatch = useAppDispatch()
  const [showSettings, setShowSettings] = useState(false)
  const messageListRef = useRef<HTMLDivElement>(null)
  const ragInitRef = useRef(false)

  const {
    isOpen,
    messages,
    isStreaming,
    currentStreamText,
    apiKey,
    ragStatus,
    ragProgress,
    currentSong,
    lyrics
  } = useAppSelector(
    state => ({
      isOpen: state.ai.isOpen,
      messages: state.ai.messages,
      isStreaming: state.ai.isStreaming,
      currentStreamText: state.ai.currentStreamText,
      apiKey: state.ai.apiKey,
      ragStatus: state.ai.ragStatus,
      ragProgress: state.ai.ragProgress,
      currentSong: state.player.currentSong,
      lyrics: state.player.lyrics
    }),
    shallowEqualApp
  )

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages, currentStreamText])

  useEffect(() => {
    if (!isOpen || ragInitRef.current) return
    ragInitRef.current = true

    dispatch(setRagStatus('loading'))
    initRAG((done, total) => {
      if (total > 0) dispatch(setRagProgress(Math.round((done / total) * 100)))
    })
      .then(() => dispatch(setRagStatus('ready')))
      .catch(() => dispatch(setRagStatus('error')))
  }, [isOpen, dispatch])

  useEffect(() => {
    if (ragStatus !== 'ready' || !currentSong?.id) return
    const songInfo: SongInfo = {
      id: currentSong.id,
      songName: currentSong.name || '',
      artist: currentSong.ar?.map((a: any) => a.name).join(' / ') || '',
      album: currentSong.al?.name || '',
      lyrics: lyrics?.map((l: any) => l.text).filter(Boolean).join('\n') || ''
    }
    indexSong(songInfo).catch(() => {})
  }, [currentSong, lyrics, ragStatus])

  const handleSend = useCallback(
    (text: string) => {
      dispatch(sendMessageAction({ userInput: text, type: 'chat' }))
    },
    [dispatch]
  )

  const handleStop = useCallback(() => {
    dispatch(stopStreamingAction())
  }, [dispatch])

  const handleRecommend = useCallback(() => {
    const songName = currentSong?.name || ''
    const prompt = songName
      ? `我正在听「${songName}」，推荐几首类似风格的歌吧`
      : '推荐几首好听的歌给我吧'
    dispatch(
      sendMessageAction({ userInput: prompt, type: 'recommend', mood: prompt })
    )
  }, [dispatch, currentSong])

  const handleLyricsAnalysis = useCallback(() => {
    const songName = currentSong?.name || ''
    dispatch(
      sendMessageAction({
        userInput: songName
          ? `请深度解析「${songName}」的歌词`
          : '请帮我解析当前播放歌曲的歌词',
        type: 'lyrics'
      })
    )
  }, [dispatch, currentSong])

  const handleTranslate = useCallback(() => {
    const songName = currentSong?.name || ''
    dispatch(
      sendMessageAction({
        userInput: songName
          ? `请翻译「${songName}」的歌词并解释含义`
          : '请翻译当前播放歌曲的歌词',
        type: 'lyrics'
      })
    )
  }, [dispatch, currentSong])

  const handleMoodTag = useCallback(
    (mood: string) => {
      dispatch(
        sendMessageAction({
          userInput: `我现在想听${mood}的歌，帮我推荐几首`,
          type: 'recommend',
          mood
        })
      )
    },
    [dispatch]
  )

  const ragBadgeClass =
    ragStatus === 'ready'
      ? 'rag-badge ready'
      : ragStatus === 'loading'
      ? 'rag-badge loading'
      : 'rag-badge'

  const ragBadgeText =
    ragStatus === 'ready'
      ? 'RAG 就绪'
      : ragStatus === 'loading'
      ? `加载中${ragProgress > 0 ? ` ${ragProgress}%` : '...'}`
      : ''

  if (!isOpen) {
    return (
      <AIToggleButton onClick={() => dispatch(toggleSidebar())} title="AI 音乐助手">
        AI
      </AIToggleButton>
    )
  }

  return (
    <>
      <AIToggleButton onClick={() => dispatch(toggleSidebar())} title="关闭 AI 助手">
        ✕
      </AIToggleButton>
      <SidebarWrapper isOpen={isOpen}>
        <div className="sidebar-header">
          <div className="header-left">
            <div className="ai-icon">AI</div>
            <span className="header-title">音乐助手</span>
            <span className={ragBadgeClass}>{ragBadgeText}</span>
          </div>
          <div className="header-actions">
            <button
              className="header-btn"
              onClick={() => setShowSettings(prev => !prev)}
              title="设置"
            >
              ⚙
            </button>
            <button
              className="header-btn"
              onClick={() => dispatch(clearMessages())}
              title="清空对话"
            >
              🗑
            </button>
            <button
              className="header-btn"
              onClick={() => dispatch(closeSidebar())}
              title="关闭"
            >
              ✕
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="settings-panel">
            <div className="settings-title">MiniMax API Key</div>
            <input
              className="api-key-input"
              type="password"
              value={apiKey}
              onChange={e => dispatch(setApiKey(e.target.value))}
              placeholder="sk-api-..."
            />
            <div className="settings-hint">
              API Key 仅保存在本地浏览器中，不会上传到任何服务器
            </div>
            <button
              className="close-settings-btn"
              onClick={() => setShowSettings(false)}
            >
              收起设置
            </button>
          </div>
        )}

        <div className="message-list" ref={messageListRef}>
          {messages.length === 0 && !isStreaming ? (
            <div className="welcome-section">
              <div className="welcome-icon">🎧</div>
              <div className="welcome-title">AI 音乐助手</div>
              <div className="welcome-desc">
                我可以根据你的心境推荐歌曲、深度解析歌词、翻译外语歌词，
                或者聊聊任何音乐话题。试试下面的快捷标签吧！
              </div>
              <div className="mood-tags">
                {MOOD_TAGS.map(tag => (
                  <span
                    key={tag}
                    className="mood-tag"
                    onClick={() => handleMoodTag(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                />
              ))}
              {isStreaming && currentStreamText && (
                <ChatMessage
                  role="assistant"
                  content={currentStreamText}
                  isStreaming
                />
              )}
            </>
          )}
        </div>

        <QuickActions
          onRecommend={handleRecommend}
          onLyricsAnalysis={handleLyricsAnalysis}
          onTranslate={handleTranslate}
          disabled={isStreaming}
        />

        <ChatInput
          onSend={handleSend}
          onStop={handleStop}
          isStreaming={isStreaming}
          disabled={!apiKey}
        />
      </SidebarWrapper>
    </>
  )
}

export default memo(AISidebar)
