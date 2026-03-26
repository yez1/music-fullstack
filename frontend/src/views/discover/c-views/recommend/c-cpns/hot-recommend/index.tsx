import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { HotRecommendWrapper } from './style'
import AreaHeaderV1 from '@/components/area-header-v1'
import { useAppSelector } from '@/store'
import { shallowEqualApp } from '@/store'
import SongsMenuItem from '@/components/songs-menu-item/index'

interface Iprops {
  children?: ReactNode
}

const HotRecommend: FC<Iprops> = () => {
  const hotRecommends = useAppSelector(state => state.recommend.hotRecommends,shallowEqualApp) ?? []

  return (
  <HotRecommendWrapper>
    <AreaHeaderV1 
    title="热门推荐" 
    keywords={["华语","流行","摇滚","民谣","电子"]} 
    moreText="更多" 
    moreLink="/discover/songs" 
    />
    
    <div className='recommend-list'>
      {
        hotRecommends.map((item:any) => {
          return (
            <SongsMenuItem key={item.id} itemData={item}/>
          )
        })
      }
    </div>
    </HotRecommendWrapper>
  )
}

export default memo(HotRecommend)