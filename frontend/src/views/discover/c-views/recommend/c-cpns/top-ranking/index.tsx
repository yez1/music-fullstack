import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import AreaHeaderV1 from '@/components/area-header-v1'
import { TopRankingWrapper } from './style'
import { useAppSelector } from '@/store'
import TopRankingItem from '../top-ranking-item'

interface Iprops {
  children?: ReactNode
}

const TopRanking: FC<Iprops> = () => {
  const {rankings = []} = useAppSelector((state:any ) => ({
    rankings:state.recommend.rankings
  }))
  return (
    <TopRankingWrapper>
      <AreaHeaderV1
        title="榜单"
        moreText="更多"
        moreLink="/discover/ranking"
      />
      <div className='content'>
        {rankings.filter(Boolean).map((item:any) => (
          <TopRankingItem key={item.id} itemData={item}/>
        ))}
      </div>
    </TopRankingWrapper>
  )
}

export default memo(TopRanking)