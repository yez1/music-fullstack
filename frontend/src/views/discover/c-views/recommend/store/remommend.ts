import { createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import {getArtistList, getBanners, getNewAlbum} from '../service/recommend'
import {getHotRecommend} from '../service/recommend'
import {getPlayListDetail} from '../service/recommend'


export const fetchBannersDataAction = createAsyncThunk('banners',async(arg,{dispatch})=>{
    const res = await getBanners()
    dispatch(changeBannersAction(res.banners))
})

export const fetchHotRecommendDataAction = createAsyncThunk('hotRecommend',async(arg,{dispatch})=>{
    const res = await getHotRecommend(8)
    dispatch(changeHotRecommendAction(res.result))

})

export const fetchNewAlbumDataAction = createAsyncThunk('newAlbum',async(arg,{dispatch})=>{
    const res = await getNewAlbum()
    dispatch(changeNewAlbumAction(res.albums))
})

const rankingIds = [19723756,3779629,2884035]
export const fetchPlayListDataAction = createAsyncThunk('playList',async(arg,{dispatch})=>{
    //获取榜单数据
    //方法一：一个一个获取
    // for(const id of rankingIds){
    //     getPlayListDetail(id).then((res)=>{
    //         switch(id){
    //             case 19723756:
    //                 console.log(res)
    //                 break
    //             case 3779629:
    //                 console.log(res)
    //                 break
    //             case 2884035:
    //                 console.log(res)
    //                 break
    //         }
    //     })
    // }

    //方法二：三个获取后 统一放到一个数组
    //保障一：获取所有结果后，进行dispatch
    //保障二：获取的结果一定要有正确的顺序
    const promises:Promise<any>[] = []
    for(const id of rankingIds){
        promises.push(getPlayListDetail(id))
    }

    Promise.all(promises).then((res)=>{
        const playlists = res.map((item)=>item.playlist)
        dispatch(changeRankingsAction(playlists ))
    })
})

export const fetchArtistListDataAction = createAsyncThunk('artistList',async(arg,{dispatch})=>{
    const res = await getArtistList(5)
    dispatch(changeArtistListAction(res.artists))
})


interface IRcommendState{
    banners:any[]
    hotRecommends:any[]
    newAlbums:any[]
    // upRanking:any[]
    // newRanking:any[]
    // originRanking:any[]
    rankings:any[]
    settleSingers:any[]
}

const initialState:IRcommendState = {
    banners:[],
    hotRecommends:[],
    newAlbums:[],
    // upRanking:[],
    // newRanking:[],
    // originRanking:[],
    rankings:[],
    settleSingers:[]
}

const recommendSlice = createSlice({
    name:'recommend',
    initialState,
    reducers:{
        changeBannersAction(state,{payload}){
            state.banners = payload
        },
        changeHotRecommendAction(state,{payload}){
            state.hotRecommends = payload
        },
        changeNewAlbumAction(state,{payload}){
            state.newAlbums = payload
        },
        changeRankingsAction(state,{payload}){
            state.rankings = payload
        },
        changeArtistListAction(state,{payload}){
            state.settleSingers = payload
        },
        
    },
    // extraReducers:(builder)=>{
    //     builder.addCase(fetchBannersDataAction.pending,()=>{
    //         console.log('pending')
    //     }).addCase(fetchBannersDataAction.fulfilled,(state,{payload})=>{
    //         state.banners = payload
    //     }).addCase(fetchBannersDataAction.rejected,(state,action)=>{
    //         console.log('rejected')
    //     })
    // }
})

export const {changeBannersAction,changeHotRecommendAction,changeNewAlbumAction,changeRankingsAction,changeArtistListAction} = recommendSlice.actions
export default recommendSlice.reducer