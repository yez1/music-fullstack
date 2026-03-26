import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
import { getSongDetail, getSongLyric } from "../service/player";
import { parseLyric, ILyric } from "@/utils/parse-lyric";
import type { IrootState } from "@/store";

const META_LYRIC_REG =
  /^\s*(演唱|作词|作曲|词|曲|编曲|制作人|混音|母带|出品人|出品公司|录音|人声录音|后期执行|监制|统筹|策划)\s*[:：]/

type LyricTimeMode = 'start' | 'end'

function computeLyricTimingConfig(lyricString: string, firstLyricTime: number) {
  // Some LRC files contain "pure timestamp lines" like `[00:19.444][00:01.422]`.
  // In certain cases, those extra timestamps can act like "lyric start markers",
  // while the timestamps on text lines feel more like "line end times" (user hears a one-line lag).
  const pureTimeLineReg = /^(?:\[\d{2}:\d{2}\.\d{2,3}\])+\s*$/
  const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g

  let mode: LyricTimeMode = 'start'
  let startTime = 0
  const candidates: number[] = []

  const lines = lyricString.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!pureTimeLineReg.test(trimmed)) continue

    const matches = Array.from(trimmed.matchAll(timeRegExp))
    if (matches.length < 2) continue

    mode = 'end'
    for (const m of matches) {
      const time1 = Number(m[1]) * 60 * 1000
      const time2 = Number(m[2]) * 1000
      const time3 = m[3].length === 3 ? Number(m[3]) : Number(m[3]) * 10
      candidates.push(time1 + time2 + time3)
    }
  }

  if (mode === 'end' && firstLyricTime > 0 && candidates.length) {
    for (const t of candidates) {
      if (t < firstLyricTime && t > startTime) startTime = t
    }
  }

  return { mode, startTime }
}

interface IThunkState{
  state:IrootState
}
export const fetchCurrentSongAction = createAsyncThunk<void,number,IThunkState>(
  'currentSong',
  async (id:number,{dispatch,getState})=>{
    //准备播放某首歌，分成两个情况
    //1.从列表尝试是否可以获取这个歌
    //2.如果列表中没有，则获取播放信息
    const playSongList = getState().player.playSongList
    const findIndex = playSongList.findIndex(item=>item.id === id)
    // 切歌时先清空旧歌词，避免短暂出现上一首歌词
    dispatch(changeLyricsAction([]))
    dispatch(changeLyricTimeModeAction('start'))
    dispatch(changeLyricStartTimeAction(0))

    let song: any = null
    if (findIndex !== -1) {
      song = playSongList[findIndex]
      dispatch(changePlaySongIndexAction(findIndex))
      dispatch(changeCurrentSongAction(song))
    } else {
      try {
        const res = await getSongDetail(id)
        if (!res.songs?.length) return
        song = res.songs?.[0]
        dispatch(changeCurrentSongAction(song))
        dispatch(changePlaySongListAction([...playSongList, song]))
        dispatch(changePlaySongIndexAction(playSongList.length))
      } catch (err) {
        console.error('歌曲详情请求失败', err)
        return
      }
    }

    try {
      const res = await getSongLyric(id)
      const lyricString = res?.lrc?.lyric
      if (!lyricString) {
        console.warn('歌词接口未返回有效 lyric 字段', res)
        return
      }

      let lyrics = parseLyric(lyricString).filter((item) => {
        // 过滤开头的“演唱/作词/作曲/编曲...”等元信息行，避免影响歌词同步体验
        if (item.time > 15000) return true
        return !META_LYRIC_REG.test(item.text)
      })

      const timingConfig = computeLyricTimingConfig(lyricString, lyrics[0]?.time ?? 0)
      dispatch(changeLyricTimeModeAction(timingConfig.mode))
      dispatch(changeLyricStartTimeAction(timingConfig.startTime))

      // 个别歌曲的 LRC 可能存在“时间戳超过歌曲时长”的异常（会导致最后一句永远匹配不到）
      const maxTime = song?.dt
      if (typeof maxTime === 'number' && maxTime > 0 && lyrics.length) {
        const clampTime = Math.max(0, maxTime - 200)
        let changed = false
        lyrics = lyrics.map((item) => {
          if (item.time <= maxTime) return item
          changed = true
          return { ...item, time: clampTime }
        })
        if (changed) lyrics.sort((a, b) => a.time - b.time)
      }

      dispatch(changeLyricsAction(lyrics))
    } catch (err) {
      console.error('歌词请求失败', err)
    }
  }
)

export const changeMusicAction = createAsyncThunk<void,boolean,IThunkState>(
  'changeMusic',
  (isNext:boolean,{dispatch,getState})=>{
    //1.获取state中的数据
    const playMode = getState().player.playMode
    const songIndex = getState().player.playSongIndex
    const songList = getState().player.playSongList

    //2.根据playMode处理不同的逻辑
    let newIndex = songIndex
    if(playMode === 1){
      //随机播放
      if (songList.length <= 1) {
        newIndex = songIndex
      } else {
        // avoid repeating the same song (esp. important for auto-next)
        do {
          newIndex = Math.floor(Math.random() * songList.length)
        } while (newIndex === songIndex)
      }
    }else{
      //顺序播放和单曲循环
      newIndex = isNext ? songIndex + 1 : songIndex - 1
      if(newIndex < 0) newIndex = songList.length - 1
      if(newIndex >= songList.length) newIndex = 0
    }

    //3.获取歌曲
    const song = songList[newIndex]
    dispatch(changeCurrentSongAction(song))
    dispatch(changePlaySongIndexAction(newIndex))
    dispatch(fetchCurrentSongAction(song.id))
  }
)

interface IPlayerState {
    currentSong:any
    lyrics:ILyric[]
    lyricIndex:number
    lyricTimeMode: LyricTimeMode
    lyricStartTime: number
    playSongList:any[]
    playSongIndex:number
    playMode:number
}

const initialState:IPlayerState = {
    currentSong:{},
    lyrics:[],
    lyricIndex:-1,
    lyricTimeMode:'start',
    lyricStartTime:0,
    playSongList:[{
      "name": "耶（Yeah）",
      "mainTitle": "耶",
      "additionalTitle": "（Yeah）",
      "id": 3342254848,
      "pst": 0,
      "t": 0,
      "ar": [
        {
          "id": 1203045,
          "name": "艾热 AIR",
          "tns": [],
          "alias": []
        },
        {
          "id": 12236125,
          "name": "王以太",
          "tns": [],
          "alias": []
        }
      ],
      "alia": [],
      "pop": 100,
      "st": 0,
      "rt": "",
      "fee": 8,
      "v": 38,
      "crbt": null,
      "cf": "",
      "al": {
        "id": 359380756,
        "name": "艾·思集",
        "picUrl": "https://p1.music.126.net/No3gJsAF04qHhevLDqa2HQ==/109951172631283845.jpg",
        "tns": [],
        "pic_str": "109951172631283845",
        "pic": 109951172631283840
      },
      "dt": 233106,
      "h": {
        "br": 320002,
        "fid": 0,
        "size": 9326445,
        "vd": -73625,
        "sr": 48000
      },
      "m": {
        "br": 192002,
        "fid": 0,
        "size": 5595885,
        "vd": -71102,
        "sr": 48000
      },
      "l": {
        "br": 128002,
        "fid": 0,
        "size": 3730605,
        "vd": -69636,
        "sr": 48000
      },
      "sq": {
        "br": 1101825,
        "fid": 0,
        "size": 32109645,
        "vd": -73613,
        "sr": 48000
      },
      "hr": {
        "br": 1871944,
        "fid": 0,
        "size": 54549644,
        "vd": -73613,
        "sr": 48000
      },
      "a": null,
      "cd": "01",
      "no": 4,
      "rtUrl": null,
      "ftype": 0,
      "rtUrls": [],
      "djId": 0,
      "copyright": 0,
      "s_id": 0,
      "mark": 17716748288,
      "originCoverType": 0,
      "originSongSimpleData": null,
      "tagPicList": null,
      "resourceState": true,
      "version": 4,
      "songJumpInfo": null,
      "entertainmentTags": null,
      "awardTags": null,
      "displayTags": null,
      "markTags": [],
      "single": 0,
      "noCopyrightRcmd": null,
      "mv": 0,
      "rtype": 0,
      "rurl": null,
      "mst": 9,
      "cp": 4588658,
      "publishTime": 1766246400000
    },{
      "name": "起风了",
      "mainTitle": null,
      "additionalTitle": null,
      "id": 1330348068,
      "pst": 0,
      "t": 0,
      "ar": [
        {
          "id": 12085562,
          "name": "买辣椒也用券",
          "tns": [],
          "alias": []
        }
      ],
      "alia": [
        "原曲：《ヤキモチ》—高桥优"
      ],
      "pop": 100,
      "st": 0,
      "rt": "",
      "fee": 8,
      "v": 82,
      "crbt": null,
      "cf": "",
      "al": {
        "id": 74715426,
        "name": "起风了",
        "picUrl": "https://p1.music.126.net/diGAyEmpymX8G7JcnElncQ==/109951163699673355.jpg",
        "tns": [],
        "pic_str": "109951163699673355",
        "pic": 109951163699673360
      },
      "dt": 325868,
      "h": {
        "br": 320000,
        "fid": 0,
        "size": 13037236,
        "vd": -77525,
        "sr": 44100
      },
      "m": {
        "br": 192000,
        "fid": 0,
        "size": 7822359,
        "vd": -74987,
        "sr": 44100
      },
      "l": {
        "br": 128000,
        "fid": 0,
        "size": 5214920,
        "vd": -73491,
        "sr": 44100
      },
      "sq": {
        "br": 986139,
        "fid": 0,
        "size": 40168924,
        "vd": -77539,
        "sr": 44100
      },
      "hr": {
        "br": 2832352,
        "fid": 0,
        "size": 115371677,
        "vd": -77476,
        "sr": 88200
      },
      "a": null,
      "cd": "1",
      "no": 1,
      "rtUrl": null,
      "ftype": 0,
      "rtUrls": [],
      "djId": 0,
      "copyright": 0,
      "s_id": 0,
      "mark": 17716740096,
      "originCoverType": 1,
      "originSongSimpleData": null,
      "tagPicList": null,
      "resourceState": true,
      "version": 48,
      "songJumpInfo": null,
      "entertainmentTags": null,
      "awardTags": null,
      "displayTags": null,
      "markTags": [],
      "single": 0,
      "noCopyrightRcmd": null,
      "mv": 0,
      "rtype": 0,
      "rurl": null,
      "mst": 9,
      "cp": 1415923,
      "publishTime": 1543766400000
    }
  ],
    playSongIndex:-1,

    playMode:0 //0:顺序播放 1:随机播放 2:单曲循环
}

const playerSlice = createSlice({
    name:'player',
    initialState,
    reducers:{
      changeCurrentSongAction(state,{payload}){
        state.currentSong = payload
      },
      changeLyricsAction(state,{payload}){
        state.lyrics = payload
      },
      changeLyricIndexAction(state,{payload}){
        state.lyricIndex = payload
      },
      changeLyricTimeModeAction(state, { payload }) {
        state.lyricTimeMode = payload
      },
      changeLyricStartTimeAction(state, { payload }) {
        state.lyricStartTime = payload
      },
      changePlaySongListAction(state,{payload}){
        state.playSongList = payload
      },
      changePlaySongIndexAction(state,{payload}){
        state.playSongIndex = payload
      },
      changePlayModeAction(state,{payload}){
        state.playMode = payload
      },
      
    }
})

export const {
  changeCurrentSongAction,
  changeLyricsAction,
  changeLyricIndexAction,
  changeLyricTimeModeAction,
  changeLyricStartTimeAction,
  changePlaySongListAction,
  changePlaySongIndexAction,
  changePlayModeAction,
  
  } = playerSlice.actions
export default playerSlice.reducer
