import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { TopRankingItemWrapper } from './style'
import { getImageSize } from '@/utils/format'
import { useAppDispatch } from '@/store'
import { changeCurrentSongAction, fetchCurrentSongAction } from '@/views/player/store/player'

interface Iprops {
  children?: ReactNode
  itemData:any
}

const TopRankingItem: FC<Iprops> = (props) => {
    const {itemData} = props
    const {tracks=[]} = itemData
    
    const dispatch = useAppDispatch()
    function handlePlayClick(id:number){
        dispatch(fetchCurrentSongAction(id))
    }

    return (
        <TopRankingItemWrapper>
            <div className='header'>
                <div className="image">
                    <img src={getImageSize(itemData.coverImgUrl,80)} alt=""/>
                    <a href="" className="sprite_cover"></a>
                </div>
                <div className='info'>
                    <div className="name" >{itemData.name}</div>
                    <div>
                      <button className='sprite_02 btn play'>播放</button>
                      <button className='sprite_02 btn favor'>收藏</button>
                    </div>
                    
                </div>
            </div>

            <div className='list'>
                {tracks.slice(0,10).map((item:any,index:number)=>{

                    return (
                        <div className="item" key={item.id}>
                            <div className="index">{index+1}</div>

                            <div className="info">
                                <div className="name">{item.name}</div>
                                <div className='operator'>
                                    <button 
                                        className='sprite_02 btn play'
                                        onClick={()=>handlePlayClick(item.id)}
                                    ></button>
                                    <button className='sprite_icon2 btn add'></button>
                                    <button className='sprite_02 btn favor'></button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className='footer'>
                <a href="#/discover/ranking" className='more'>查看全部&gt;</a>
            </div>
        </TopRankingItemWrapper>
    )
}

export default memo(TopRankingItem)