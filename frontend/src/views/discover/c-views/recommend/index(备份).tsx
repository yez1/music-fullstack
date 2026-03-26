import hyRequest from '@/service'
import React, { memo ,useEffect, useState} from 'react'
import type { FC, ReactNode } from 'react'

interface Iprops {
  children?: ReactNode
}

export interface IBannerData {
  targetId: number
  bigImageUrl: string
  imageUrl: string
  targetType: number
  typeTitle: string
  s_ctrp: string
  url: string
}

const Recommend: FC<Iprops> = () => {
  const [banners,setBanners] = useState<IBannerData []>([])

  useEffect(()=>{
    hyRequest.get({
      url:'/banner'
    })
    .then((res)=>{
      setBanners(res.banners)
    })
  },[])


  return (
    <div>
      {
        banners.map((item,index)=>{
          return (
            <div key={index}>{item.typeTitle}</div>
          )
        })
      }
    </div>

  )
}

export default memo(Recommend)
