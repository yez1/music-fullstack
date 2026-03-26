export interface ILyric {
    time: number
    text: string
}

// Parse LRC time tags like [mm:ss.xx] or [mm:ss.xxx]
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g
export function parseLyric(lyricString: string) {
    const lines: string[] = lyricString.split('\n')

    const lyrics: ILyric[] = []
    let offset = 0

    for (const line of lines) {
        if (!line) continue

        // handle [offset:xxx]
        if (line.startsWith('[offset:')) {
            const match = line.match(/\[offset:([+-]?\d+)\]/)
            if (match) offset = Number(match[1])
            continue
        }

        // Collect all time tags in this line
        const matches = Array.from(line.matchAll(timeRegExp))
        if (!matches.length) continue

        // Text is line with all time tags removed
        const text = line.replace(timeRegExp, '').trim()
        if (!text) continue

        const times = matches.map((m) => {
            const time1 = Number(m[1]) * 60 * 1000
            const time2 = Number(m[2]) * 1000
            const time3 = m[3].length === 3 ? Number(m[3]) : Number(m[3]) * 10
            return time1 + time2 + time3 + offset
        })
        for (const time of times) {
            lyrics.push({ time, text })
        }
    }

    lyrics.sort((a, b) => a.time - b.time)
    return lyrics
}
