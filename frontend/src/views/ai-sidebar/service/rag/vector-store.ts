import { get, set, del, keys, createStore } from 'idb-keyval'

export interface SongVector {
  id: number
  songName: string
  artist: string
  album: string
  lyrics: string
  embedding: number[]
}

const vectorDB = createStore('music-rag-vectors', 'song-embeddings')

export async function upsertVector(song: SongVector): Promise<void> {
  await set(song.id, song, vectorDB)
}

export async function getVector(id: number): Promise<SongVector | undefined> {
  return get<SongVector>(id, vectorDB)
}

export async function deleteVector(id: number): Promise<void> {
  await del(id, vectorDB)
}

export async function getAllVectorIds(): Promise<number[]> {
  const allKeys = await keys(vectorDB)
  return allKeys as number[]
}

export async function getAllVectors(): Promise<SongVector[]> {
  const allIds = await getAllVectorIds()
  const results: SongVector[] = []
  for (const id of allIds) {
    const vec = await get<SongVector>(id, vectorDB)
    if (vec) results.push(vec)
  }
  return results
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  return denominator === 0 ? 0 : dotProduct / denominator
}

export interface SearchResult {
  id: number
  songName: string
  artist: string
  album: string
  similarity: number
}

export async function searchByEmbedding(
  queryEmbedding: number[],
  topK: number = 5,
  excludeIds: number[] = []
): Promise<SearchResult[]> {
  const allVectors = await getAllVectors()
  const excludeSet = new Set(excludeIds)

  const scored = allVectors
    .filter(v => !excludeSet.has(v.id))
    .map(v => ({
      id: v.id,
      songName: v.songName,
      artist: v.artist,
      album: v.album,
      similarity: cosineSimilarity(queryEmbedding, v.embedding)
    }))

  scored.sort((a, b) => b.similarity - a.similarity)
  return scored.slice(0, topK)
}

export async function getVectorCount(): Promise<number> {
  const allIds = await getAllVectorIds()
  return allIds.length
}
