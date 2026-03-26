import React,{memo} from "react";
import type { FC, ReactNode } from 'react'
import { SettedSingerWrapper } from './style'
import AreaHeaderV2 from '@/components/area-header-v2'
import { useAppSelector } from "@/store"
import { shallowEqualApp } from "@/store"
import { getImageSize } from "@/utils/format"

interface Iprops {
    children?: ReactNode
}

const SettedSinger: FC<Iprops> = () => {
    const settleSingers = useAppSelector(state =>state.recommend.settleSingers,shallowEqualApp) ?? []
    return(
        <SettedSingerWrapper>
            <AreaHeaderV2  title="入驻歌手" moreText="查看全部" moreLink="/discover/artist"/>
            <div className="artists">
                {
                    settleSingers.map(item=>{
                        return(
                            <a href='#/discover/artist' className="item" key={item.id}>
                                <img src={getImageSize(item.picUrl,62)} alt="" />
                                <div className="info">
                                    <div className="name">{item.name}</div>
                                    <div className="alias">{item.alias.join(' ')}</div>
                                </div>
                            </a>
                        )
                    })
                }
            </div>
            <div className="apply-for">
                <a href="#/discover/artist">申请成为网易音乐人</a>
            </div>
        </SettedSingerWrapper>
    )
}

export default memo(SettedSinger);