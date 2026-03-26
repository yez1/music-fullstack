import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IrootState } from '@/store'
import { streamChat, getStoredApiKey, storeApiKey } from '../service/deepseek'
import type { ChatMessage } from '../service/deepseek'
import {
  buildRecommendMessages,
  buildLyricsAnalysisMessages,
  buildFreeChatMessages
} from '../service/prompts'
import type { SongContext, RAGMatch } from '../service/prompts'
import { searchSimilar } from '../service/rag/knowledge-base'

export interface UIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  type?: 'recommend' | 'lyrics' | 'chat'
}

interface IAIState {
  isOpen: boolean
  messages: UIMessage[]
  isStreaming: boolean
  currentStreamText: string
  apiKey: string
  ragStatus: 'idle' | 'loading' | 'ready' | 'error'
  ragProgress: number
}

const initialState: IAIState = {
  isOpen: false,
  messages: [],
  isStreaming: false,
  currentStreamText: '',
  apiKey: getStoredApiKey() || 'sk-cp-EqkBDU9DPrHRfVOAd7Xt64j2NAOHQ0GZLver6QQpT_pyKv0haxiIC4DLo05udGktSgPZcPxtQCztHi1Ai_kmv3dJLjuSBTqIXvC8GbCwdrWcDl_RqjCS8Xs',
  ragStatus: 'idle',
  ragProgress: 0
}

let currentAbortController: AbortController | null = null

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function getSongContext(state: IrootState): SongContext | null {
  const { currentSong, lyrics } = state.player
  if (!currentSong?.name) return null
  return {
    songName: currentSong.name,
    artist: currentSong.ar?.map((a: any) => a.name).join(' / ') || '',
    album: currentSong.al?.name || '',
    lyrics: lyrics.map((l: any) => l.text).filter(Boolean).join('\n')
  }
}

interface SendMessagePayload {
  userInput: string
  type?: 'recommend' | 'lyrics' | 'chat'
  mood?: string
}

export const sendMessageAction = createAsyncThunk<void, SendMessagePayload, { state: IrootState }>(
  'ai/sendMessage',
  async ({ userInput, type = 'chat', mood }, { dispatch, getState }) => {
    const state = getState()
    const apiKey = state.ai.apiKey
    if (!apiKey) {
      dispatch(addMessage({
        id: generateId(),
        role: 'assistant',
        content: '请先在设置中配置 MiniMax API Key 后再使用 AI 功能。',
        timestamp: Date.now(),
        type
      }))
      return
    }

    dispatch(addMessage({
      id: generateId(),
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
      type
    }))

    const songCtx = getSongContext(state)
    let messages: ChatMessage[]

    if (type === 'recommend') {
      let ragMatches: RAGMatch[] = []
      try {
        const results = await searchSimilar(
          mood || userInput,
          5
        )
        ragMatches = results.map(r => ({
          songName: r.songName,
          artist: r.artist,
          similarity: r.similarity
        }))
      } catch {
        // RAG not ready, proceed without
      }
      messages = buildRecommendMessages(songCtx, mood || userInput, ragMatches)
    } else if (type === 'lyrics') {
      messages = buildLyricsAnalysisMessages(songCtx)
    } else {
      const history: ChatMessage[] = state.ai.messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))
      messages = buildFreeChatMessages(songCtx, history, userInput)
    }

    if (currentAbortController) {
      currentAbortController.abort()
    }
    currentAbortController = new AbortController()

    dispatch(setStreaming(true))
    dispatch(setCurrentStreamText(''))

    let fullText = ''

    await streamChat(
      messages,
      apiKey,
      (token) => {
        fullText += token
        dispatch(setCurrentStreamText(fullText))
      },
      () => {
        const cleanedText = fullText.replace(/^💭 \*正在思考\.\.\.\*\n\n/, '')
        dispatch(addMessage({
          id: generateId(),
          role: 'assistant',
          content: cleanedText || fullText,
          timestamp: Date.now(),
          type
        }))
        dispatch(setStreaming(false))
        dispatch(setCurrentStreamText(''))
        currentAbortController = null
      },
      (err) => {
        const errorContent = fullText
          ? fullText + '\n\n---\n⚠️ 生成中断: ' + err.message
          : '请求失败: ' + err.message
        dispatch(addMessage({
          id: generateId(),
          role: 'assistant',
          content: errorContent,
          timestamp: Date.now(),
          type
        }))
        dispatch(setStreaming(false))
        dispatch(setCurrentStreamText(''))
        currentAbortController = null
      },
      currentAbortController.signal
    )
  }
)

export const stopStreamingAction = createAsyncThunk(
  'ai/stopStreaming',
  (_, { dispatch }) => {
    if (currentAbortController) {
      currentAbortController.abort()
      currentAbortController = null
    }
    dispatch(setStreaming(false))
    dispatch(setCurrentStreamText(''))
  }
)

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isOpen = !state.isOpen
    },
    openSidebar(state) {
      state.isOpen = true
    },
    closeSidebar(state) {
      state.isOpen = false
    },
    addMessage(state, { payload }: { payload: UIMessage }) {
      state.messages.push(payload)
    },
    setStreaming(state, { payload }: { payload: boolean }) {
      state.isStreaming = payload
    },
    setCurrentStreamText(state, { payload }: { payload: string }) {
      state.currentStreamText = payload
    },
    setApiKey(state, { payload }: { payload: string }) {
      state.apiKey = payload
      storeApiKey(payload)
    },
    setRagStatus(state, { payload }: { payload: IAIState['ragStatus'] }) {
      state.ragStatus = payload
    },
    setRagProgress(state, { payload }: { payload: number }) {
      state.ragProgress = payload
    },
    clearMessages(state) {
      state.messages = []
    }
  }
})

export const {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  addMessage,
  setStreaming,
  setCurrentStreamText,
  setApiKey,
  setRagStatus,
  setRagProgress,
  clearMessages
} = aiSlice.actions

export default aiSlice.reducer
