import React,{memo} from "react";
import type { FC, ReactNode } from 'react'
import { UserLoginWrapper } from './style'
import disVipCard from '@/assets/img/dis_vip_card.png'

interface Iprops {
    children?: ReactNode
}

const UserLogin: FC<Iprops> = () => {
    return(
       <UserLoginWrapper >
         <div className="content sprite_02">
          <div className="dis-vip-card">
            <img className="dis-vip" src={disVipCard} alt="VIP" />
          </div>
          <div className="desc sprite_02">
            <div className="desc-content ">
              <p className="text">登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机</p>
              <a href="#/login" className="btn sprite_02">用户登录</a>
            </div>
          </div>
         </div>
       </UserLoginWrapper>
    ) 
}

export default memo(UserLogin)
