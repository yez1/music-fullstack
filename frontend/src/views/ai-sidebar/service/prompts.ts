import type { ChatMessage } from './deepseek'

export interface SongContext {
  songName: string
  artist: string
  album: string
  lyrics: string
}

export interface RAGMatch {
  songName: string
  artist: string
  similarity: number
}

function buildSongContextBlock(ctx: SongContext | null): string {
  if (!ctx || !ctx.songName) return '当前没有正在播放的歌曲。'

  const lyricsSnippet =
    ctx.lyrics.length > 300 ? ctx.lyrics.slice(0, 300) + '...' : ctx.lyrics

  return [
    `当前播放：「${ctx.songName}」 - ${ctx.artist}`,
    ctx.album ? `专辑：《${ctx.album}》` : '',
    lyricsSnippet ? `歌词摘要：\n${lyricsSnippet}` : ''
  ]
    .filter(Boolean)
    .join('\n')
}

function buildRAGBlock(matches: RAGMatch[]): string {
  if (!matches.length) return ''
  const list = matches
    .map((m, i) => `${i + 1}. ${m.songName} - ${m.artist} (相似度: ${(m.similarity * 100).toFixed(0)}%)`)
    .join('\n')
  return `\n\n以下是从用户曲库中检索到的相似歌曲，可作为推荐参考：\n${list}`
}

export function buildRecommendMessages(
  ctx: SongContext | null,
  mood: string,
  ragMatches: RAGMatch[] = []
): ChatMessage[] {
  const system: ChatMessage = {
    role: 'system',
    content: `你是一位专业的音乐推荐师，精通华语、欧美、日韩等各类音乐风格。
你需要根据用户当前正在听的歌曲和他描述的心境，推荐5首最合适的歌曲。
请用以下 Markdown 格式输出每首推荐歌曲，歌曲名必须使用链接格式以便用户点击播放：

### 1. [歌曲名](歌曲名) - 歌手
推荐理由（1-2句话）

例如：
### 1. [晴天](晴天) - 周杰伦
经典的青春回忆旋律，适合微微感伤的午后。

推荐理由应简洁但有深度，体现你对音乐风格和情感的理解。不要返回 JSON。`
  }

  const contextBlock = buildSongContextBlock(ctx)
  const ragBlock = buildRAGBlock(ragMatches)

  const user: ChatMessage = {
    role: 'user',
    content: `${contextBlock}${ragBlock}\n\n我现在的心情/想听的风格：${mood}\n\n请根据以上信息为我推荐5首歌曲。`
  }

  return [system, user]
}

export function buildLyricsAnalysisMessages(
  ctx: SongContext | null
): ChatMessage[] {
  const system: ChatMessage = {
    role: 'system',
    content: `你是一位精通多语言的音乐评论家和翻译专家。
用户会给你一首歌的完整歌词，请你进行深度解析，输出包含：
1. **逐段翻译**（如果是外语歌曲，翻译为中文；如果是中文歌曲则跳过翻译，直接解析）
2. **文化背景**：歌曲创作的时代背景、相关文化典故
3. **修辞手法**：歌词中使用的比喻、象征、押韵等手法
4. **情感分析**：逐段的情感走向与整体情感主题
5. **总结**：一段简短的总体评价

请用清晰的 Markdown 格式输出。`
  }

  if (!ctx || !ctx.lyrics) {
    return [
      system,
      { role: 'user', content: '当前没有正在播放的歌曲或歌词为空，无法进行歌词解析。' }
    ]
  }

  const user: ChatMessage = {
    role: 'user',
    content: `请深度解析以下歌曲的歌词：

歌曲：「${ctx.songName}」 - ${ctx.artist}
${ctx.album ? `专辑：《${ctx.album}》` : ''}

完整歌词：
${ctx.lyrics}`
  }

  return [system, user]
}

export function buildFreeChatMessages(
  ctx: SongContext | null,
  history: ChatMessage[],
  userInput: string
): ChatMessage[] {
  const system: ChatMessage = {
    role: 'system',
    content: `你是一位博学的音乐 AI 助手，了解各种音乐流派、乐理知识、音乐历史和艺术家故事。
你可以与用户聊任何和音乐相关的话题，也能根据用户当前的听歌状态给出建议。
回答风格：友好、专业、有趣，适当使用 Markdown 格式让回答更有条理。

${buildSongContextBlock(ctx)}`
  }

  const recentHistory = history.slice(-20)

  return [system, ...recentHistory, { role: 'user', content: userInput }]
}
