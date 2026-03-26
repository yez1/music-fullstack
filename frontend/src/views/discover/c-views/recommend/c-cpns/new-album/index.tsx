import React, { memo, useRef } from 'react'
import type { FC, ReactNode,ElementRef} from 'react'
import { NewAlbumWrapper } from './style'
import AreaHeaderV1 from '@/components/area-header-v1'
import SongsMenuItem from '@/components/songs-menu-item'
import { useAppSelector } from '@/store'
import { shallowEqualApp } from '@/store'
import { Carousel } from 'antd'
import NewAlbumItem from '@/components/new-album-item'


interface Iprops {
  children?: ReactNode
}

const NewAlbum: FC<Iprops> = () => {
  //从redux中获取数据
  const {newAlbums = []} = useAppSelector((state) => ({newAlbums:state.recommend.newAlbums}),shallowEqualApp)
  const bannerRef = useRef<ElementRef<typeof Carousel>>(null)
  
  function handlePrevClick(){
    bannerRef.current?.prev()
  }
  function handleNextClick(){
    bannerRef.current?.next()
  }
  return (
    <NewAlbumWrapper>
      <AreaHeaderV1
      title="新碟上架"
      moreText="更多"
      moreLink="/discover/album"
      />
      <div className='content'>
        <button className='sprite_02 arrow arrow-left' onClick={handlePrevClick}></button>
        <div className='banner'>
          <Carousel ref={bannerRef} dots={false} speed={1000}>
            {
              [0,1].map((item:any) => {
                return (
                  <div>
                    <div className='album-list' key={item}>
                      {
                        newAlbums.slice(item*5,item*5+5).map((album) => {
                          return (
                            <NewAlbumItem key={album.id} itemData={album}/>
                          )
                        })
                      }
                    </div>
                  </div>
                )
              })
            }
          </Carousel>
        </div> 
        <button className='sprite_02 arrow arrow-right' onClick={handleNextClick}></button>     
      </div>
    
    </NewAlbumWrapper>
  )
}

export default memo(NewAlbum)