import React, { memo, useCallback } from 'react'
import type { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MessageWrapper } from './style'
import { useAppDispatch } from '@/store'
import { fetchCurrentSongAction } from '@/views/player/store/player'
import { searchSong } from '@/views/player/service/player'

interface IProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

const ChatMessage: FC<IProps> = ({ role, content, isStreaming }) => {
  const isUser = role === 'user'
  const dispatch = useAppDispatch()

  const handleSongClick = useCallback(
    async (songName: string, artist?: string) => {
      try {
        const keywords = artist ? `${songName} ${artist}` : songName
        const res: any = await searchSong(keywords, 1)
        const songId = res?.result?.songs?.[0]?.id
        if (songId) {
          dispatch(fetchCurrentSongAction(songId))
        }
      } catch (err) {
        console.warn('搜索歌曲失败:', err)
      }
    },
    [dispatch]
  )

  const makeSongsClickable = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (typeof child === 'string') {
        const parts = child.split(/(《[^》]+》)/g)
        if (parts.length === 1) return child
        return parts.map((part, i) => {
          const match = part.match(/^《([^》]+)》$/)
          if (match) {
            return (
              <span key={i} className="song-link" onClick={() => handleSongClick(match[1])}>
                {part}
              </span>
            )
          }
          return part
        })
      }
      return child
    })
  }

  const extractText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node
    if (typeof node === 'number') return String(node)
    if (Array.isArray(node)) return node.map(extractText).join('')
    if (React.isValidElement(node)) return extractText((node.props as any)?.children)
    return ''
  }

  const songComponents: Record<string, React.FC<any>> = {
    a: ({ href, children }: any) => {
      const songName = extractText(children).replace(/[《》]/g, '')
      return (
        <span
          className="song-link"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (songName) handleSongClick(songName)
          }}
        >
          {children}
        </span>
      )
    },
    p: ({ children }: any) => <p>{makeSongsClickable(children)}</p>,
    li: ({ children }: any) => <li>{makeSongsClickable(children)}</li>,
    h1: ({ children }: any) => <h1>{makeSongsClickable(children)}</h1>,
    h2: ({ children }: any) => <h2>{makeSongsClickable(children)}</h2>,
    h3: ({ children }: any) => <h3>{makeSongsClickable(children)}</h3>,
    h4: ({ children }: any) => <h4>{makeSongsClickable(children)}</h4>,
    strong: ({ children }: any) => <strong>{makeSongsClickable(children)}</strong>,
    em: ({ children }: any) => <em>{makeSongsClickable(children)}</em>,
  }

  const renderContent = () => {
    if (isUser) {
      return <span>{content}</span>
    }

    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={songComponents}>
        {content}
      </ReactMarkdown>
    )
  }

  return (
    <MessageWrapper isUser={isUser}>
      <div className="message-label">{isUser ? '你' : 'AI 助手'}</div>
      <div className="message-bubble">
        {renderContent()}
        {isStreaming && <span className="streaming-cursor" />}
      </div>
    </MessageWrapper>
  )
}

export default memo(ChatMessage)
