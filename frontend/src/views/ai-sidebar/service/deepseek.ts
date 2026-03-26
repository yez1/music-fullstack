export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const MINIMAX_API_URL = 'https://api.minimax.chat/v1/text/chatcompletion_v2'
const MODEL = 'MiniMax-M2.5'

function checkMiniMaxError(parsed: any): void {
  const base = parsed?.base_resp
  if (base && base.status_code !== 0 && base.status_code !== undefined) {
    throw new Error(`MiniMax API 错误 (${base.status_code}): ${base.status_msg || '未知错误'}`)
  }
}

export async function streamChat(
  messages: ChatMessage[],
  apiKey: string,
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: Error) => void,
  signal?: AbortSignal
): Promise<void> {
  try {
    const response = await fetch(MINIMAX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 4096
      }),
      signal
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '')
      throw new Error(
        `MiniMax API HTTP 错误 (${response.status}): ${errorBody || response.statusText}`
      )
    }

    const contentType = response.headers.get('content-type') || ''

    if (!contentType.includes('text/event-stream')) {
      const text = await response.text()
      try {
        const parsed = JSON.parse(text)
        checkMiniMaxError(parsed)
        const content = parsed.choices?.[0]?.message?.content
        if (content) {
          onToken(content)
        } else if (!parsed.choices) {
          throw new Error(`MiniMax 返回异常: ${text.slice(0, 200)}`)
        }
      } catch (e) {
        if (e instanceof Error && e.message.startsWith('MiniMax')) throw e
        throw new Error(`解析响应失败: ${text.slice(0, 200)}`)
      }
      onDone()
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('响应体不可读')
    }

    const decoder = new TextDecoder()
    let buffer = ''
    let firstChunkChecked = false
    let hasContent = false
    let isThinking = false

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      if (!firstChunkChecked) {
        firstChunkChecked = true
        const trimmedBuf = buffer.trim()
        if (trimmedBuf.startsWith('{') && !trimmedBuf.startsWith('data:')) {
          try {
            const parsed = JSON.parse(trimmedBuf)
            checkMiniMaxError(parsed)
          } catch (e) {
            if (e instanceof Error && e.message.startsWith('MiniMax')) {
              reader.cancel()
              throw e
            }
          }
        }
      }

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue

        const data = trimmed.slice(6)
        if (data === '[DONE]') {
          onDone()
          return
        }

        try {
          const parsed = JSON.parse(data)
          checkMiniMaxError(parsed)
          const delta = parsed.choices?.[0]?.delta
          const content = delta?.content
          const reasoning = delta?.reasoning_content

          if (content) {
            if (isThinking && !hasContent) {
              onToken('\n\n')
            }
            onToken(content)
            hasContent = true
          } else if (reasoning && !hasContent && !isThinking) {
            isThinking = true
            onToken('💭 *正在思考...*\n\n')
          }
        } catch (e) {
          if (e instanceof Error && e.message.startsWith('MiniMax')) {
            reader.cancel()
            throw e
          }
        }
      }
    }

    if (buffer.trim()) {
      const lines = buffer.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue
        const data = trimmed.slice(6)
        if (data === '[DONE]') continue
        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content
            || parsed.choices?.[0]?.message?.content
          if (content) onToken(content)
        } catch { /* skip */ }
      }
    }

    onDone()
  } catch (err: any) {
    if (err.name === 'AbortError') return
    onError(err instanceof Error ? err : new Error(String(err)))
  }
}

const API_KEY_STORAGE_KEY = 'minimax_api_key'

export function getStoredApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || ''
}

export function storeApiKey(key: string): void {
  if (key) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key)
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY)
  }
}
