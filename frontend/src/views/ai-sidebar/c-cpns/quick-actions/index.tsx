import React, { memo } from 'react'
import type { FC } from 'react'
import { QuickActionsWrapper } from './style'

interface IProps {
  onRecommend: () => void
  onLyricsAnalysis: () => void
  onTranslate: () => void
  disabled?: boolean
}

const QuickActions: FC<IProps> = ({
  onRecommend,
  onLyricsAnalysis,
  onTranslate,
  disabled
}) => {
  return (
    <QuickActionsWrapper>
      <button
        className="action-btn"
        onClick={onRecommend}
        disabled={disabled}
      >
        <span className="action-icon">🎵</span>
        智能推荐
      </button>
      <button
        className="action-btn"
        onClick={onLyricsAnalysis}
        disabled={disabled}
      >
        <span className="action-icon">📝</span>
        歌词解析
      </button>
      <button
        className="action-btn"
        onClick={onTranslate}
        disabled={disabled}
      >
        <span className="action-icon">🌐</span>
        翻译歌词
      </button>
    </QuickActionsWrapper>
  )
}

export default memo(QuickActions)
