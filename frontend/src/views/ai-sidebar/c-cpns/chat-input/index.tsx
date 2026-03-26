import React, { memo, useState, useRef, useCallback } from 'react'
import type { FC, KeyboardEvent } from 'react'
import { ChatInputWrapper } from './style'

interface IProps {
  onSend: (text: string) => void
  onStop: () => void
  isStreaming: boolean
  disabled?: boolean
}

const ChatInput: FC<IProps> = ({ onSend, onStop, isStreaming, disabled }) => {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming || disabled) return
    onSend(trimmed)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [text, isStreaming, disabled, onSend])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleInput = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [])

  return (
    <ChatInputWrapper>
      <div className="input-row">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="输入你想聊的音乐话题..."
          rows={1}
          disabled={disabled}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!text.trim() || isStreaming || disabled}
          title="发送"
        >
          ↑
        </button>
      </div>
      {isStreaming && (
        <button className="stop-btn" onClick={onStop}>
          停止生成
        </button>
      )}
    </ChatInputWrapper>
  )
}

export default memo(ChatInput)
