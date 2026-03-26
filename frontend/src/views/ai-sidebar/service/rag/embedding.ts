let extractor: any = null
let loadingPromise: Promise<any> | null = null

async function getExtractor(): Promise<any> {
  if (extractor) return extractor
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    const { pipeline } = await import('@huggingface/transformers')
    // @ts-ignore - pipeline() produces a union type too complex for TS
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'fp32'
    })
    return extractor
  })()

  try {
    await loadingPromise
  } finally {
    loadingPromise = null
  }
  return extractor
}

let ready = false

export async function warmupEmbedding(): Promise<void> {
  await getExtractor()
  ready = true
}

export async function embed(text: string): Promise<number[]> {
  const ext = await getExtractor()
  const output = await ext(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data as Float32Array)
}

export function isEmbeddingReady(): boolean {
  return ready
}
