import hyRequest from "@/service"

export function getSongPlayer(id:number){
    return hyRequest.get({
        url:'/song/url',
        params:{
            id,
            br: 320000
        }
    })
}

export function getSongDetail(ids:number){
    return hyRequest.get({
        url:'/song/detail',
        params:{
            ids
        }
    })
}

export function getSongLyric(id:number){
    return hyRequest.get({
        url:'/lyric',
        params:{
            id
        }
    })
}

export function searchSong(keywords:string, limit:number = 5){
    return hyRequest.get({
        url:'/search',
        params:{
            keywords,
            limit
        }
    })
}
