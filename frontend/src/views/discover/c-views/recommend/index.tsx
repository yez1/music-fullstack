import { useAppDispatch } from '@/store'
import React, { memo ,useEffect, useState} from 'react'
import type { FC, ReactNode } from 'react'
import { fetchBannersDataAction, fetchHotRecommendDataAction, fetchNewAlbumDataAction, 
  fetchPlayListDataAction, fetchArtistListDataAction } from './store/remommend'
import TopBanner from './c-cpns/top-banner'
import { RecommendWrapper } from './style'
import HotRecommend from './c-cpns/hot-recommend'
import NewAlbum from './c-cpns/new-album'
import TopRanking from './c-cpns/top-ranking'
import UserLogin from './c-cpns/user-login'
import SettedSinger from './c-cpns/setted-singer'
import HotAnchor from './c-cpns/hot-anchor'


interface Iprops {
  children?: ReactNode
}

const Recommend: FC<Iprops> = () => {
  /*发起action获取数据*/
  const dispatch = useAppDispatch()
  useEffect(()=>{
    dispatch(fetchBannersDataAction())
    dispatch(fetchHotRecommendDataAction())
    dispatch(fetchNewAlbumDataAction())
    dispatch(fetchPlayListDataAction())
    dispatch(fetchArtistListDataAction())
  },[])

  //render函数的返回jsx
  return (
    <RecommendWrapper>
      <TopBanner />
      <div className='content wrap-v2' >
        <div className='left'>
          <HotRecommend/>
          <NewAlbum/>
          <TopRanking/>
        </div>
        <div className='right'>
          <UserLogin/>
          <SettedSinger/>
          <HotAnchor/>
        </div>
      </div>
    </RecommendWrapper>
  )
}

export default memo(Recommend)
