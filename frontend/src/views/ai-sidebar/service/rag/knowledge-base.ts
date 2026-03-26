import { embed, warmupEmbedding, isEmbeddingReady } from './embedding'
import {
  upsertVector,
  getVector,
  searchByEmbedding,
  getVectorCount
} from './vector-store'
import type { SearchResult } from './vector-store'

export type { SearchResult }

export interface SongInfo {
  id: number
  songName: string
  artist: string
  album: string
  lyrics: string
}

function buildTextForEmbedding(song: SongInfo): string {
  const parts = [song.songName, song.artist]
  if (song.album) parts.push(song.album)
  if (song.lyrics) {
    const lyricsSnippet = song.lyrics.length > 500
      ? song.lyrics.slice(0, 500)
      : song.lyrics
    parts.push(lyricsSnippet)
  }
  return parts.join(' ')
}

export async function indexSong(song: SongInfo): Promise<void> {
  const existing = await getVector(song.id)
  if (existing) return

  const text = buildTextForEmbedding(song)
  const embedding = await embed(text)

  await upsertVector({
    id: song.id,
    songName: song.songName,
    artist: song.artist,
    album: song.album,
    lyrics: song.lyrics,
    embedding
  })
}

export async function indexSongsBatch(
  songs: SongInfo[],
  onProgress?: (done: number, total: number) => void
): Promise<void> {
  const total = songs.length
  let done = 0

  for (const song of songs) {
    try {
      await indexSong(song)
    } catch (err) {
      console.warn(`Failed to index song ${song.id}:`, err)
    }
    done++
    onProgress?.(done, total)
  }
}

export async function searchSimilar(
  query: string,
  topK: number = 5,
  excludeIds: number[] = []
): Promise<SearchResult[]> {
  if (!isEmbeddingReady()) {
    return []
  }
  const queryEmbedding = await embed(query)
  return searchByEmbedding(queryEmbedding, topK, excludeIds)
}

export async function initRAG(
  onProgress?: (done: number, total: number) => void
): Promise<void> {
  await warmupEmbedding()
  onProgress?.(0, 0)
}

export async function getIndexedCount(): Promise<number> {
  return getVectorCount()
}
