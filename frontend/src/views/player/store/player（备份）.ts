import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
import { getSongDetail, getSongLyric } from "../service/player";
import { parseLyric, ILyric } from "@/utils/parse-lyric";

export const fetchCurrentSongAction = createAsyncThunk(
  'currentSong',
  (id:number,{dispatch})=>{
    //1.获取播放信息
    getSongDetail(id).then(res=>{
      //获取歌曲信息
      if(!res.songs?.length) return
      const song = res.songs?.[0]
      console.log('获取到播放信息:', song);     

      //将song放入initialState的currentSong
      dispatch(changeCurrentSongAction(song))
    })

      //2.获取歌词信息
      getSongLyric(id).then(res=>{
        //获取歌词字符串
        const lyricString = res?.lrc?.lyric
        if(!lyricString){
          console.warn('歌词接口未返回有效 lyric 字段', res)
          return
        }

        //将歌词字符串解析 解析成一个个对象
        const lyrics = parseLyric(lyricString)

        //将歌词放到state中
        dispatch(changeLyricsAction(lyrics))

      }).catch(err=>{
        console.error('歌词请求失败', err)
      })
  }
)
interface IPlayerState {
    currentSong:any
    lyrics:ILyric[]
    lyricIndex:number
    playSongList:any[]
    playSongIndex:number
}

const initialState:IPlayerState = {
    currentSong:{},
    lyrics:[],
    lyricIndex:-1,
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
    playSongIndex:-1
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
      }
    }
})

export const {changeCurrentSongAction,changeLyricsAction,changeLyricIndexAction} = playerSlice.actions
export default playerSlice.reducer
