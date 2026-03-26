import React, { memo } from 'react'
import type { FC, ReactNode ,ElementRef} from 'react'
import { Carousel } from 'antd'
import { useAppSelector } from '@/store'
import { shallowEqualApp } from '@/store'
import { BannerWrapper, BannerLeft, BannerRight, BannerControl } from './style'
import { useRef } from 'react'
import { useState } from 'react'
import classNames from 'classnames'

interface Iprops {
  children?: ReactNode
}


const TopBanner: FC<Iprops> = () => {
  const bannerRef = useRef<ElementRef<typeof Carousel>>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

    /*从store中获取数据*/
    // const {banners} = useAppSelector((state:any)=>({
    //     banners:state.recommend.banners
    // }),shallowEqualApp)
    const { banners } = useAppSelector(
        (state: any) => ({
          // 最小改动：recommend reducer 未注册时，state.recommend 为 undefined；这里兜底成空数组避免页面崩溃
          banners: state?.recommend?.banners ?? []
        }),
        shallowEqualApp
      )

      function handleAfterChange(current:number){
        setCurrentIndex(current)
      }
      function handlePrevClick(){
        bannerRef.current?.prev()
      }

      function handleNextClick(){
        bannerRef.current?.next()
      }

      let bgImageUrl = banners[currentIndex]?.imageUrl
      if(bgImageUrl){
        bgImageUrl = bgImageUrl+'?imageView&blur=40x20'
      }

  return (
    <BannerWrapper 
    style={{background:`url('${bgImageUrl}') center center/6000px`}}
    >
     <div className='banner wrap-v2'>
     <BannerLeft>
      <Carousel autoplay effect='fade' ref={bannerRef}  dots={false} afterChange={handleAfterChange}>
       {
        banners.map((item:any) =>{
          return (
            <div className='banner-item' key={item.imageUrl}>
              <img className='image' src={item.imageUrl} alt={item.typeTitle} />
            </div>
          )
        })
       }
      </Carousel>
      <ul className="dots">
        {
          banners.map((item:any,index:number)=>{
            return(
              <li key={item.imageUrl}>
                <span className={classNames('item',{
                  active:index === currentIndex
                })}></span>
              </li>
            )
          })
        }
      </ul>
      </BannerLeft>

      <BannerRight>
        
      </BannerRight>

      <BannerControl>
       <button className='btn left' onClick={handlePrevClick} ></button>
       <button className='btn right' onClick={handleNextClick}></button>
      </BannerControl>
     </div>
    </BannerWrapper>
  )
}

export default memo(TopBanner)