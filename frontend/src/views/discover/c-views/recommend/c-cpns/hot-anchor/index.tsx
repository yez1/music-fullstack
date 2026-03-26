import React,{memo} from "react";
import type {FC,ReactNode} from 'react'
import { HotAnchorWrapper } from './style'
import AreaHeaderV2 from '@/components/area-header-v2'
import { hotRadios } from '@/assets/data/local_data'
import { getImageSize } from '@/utils/format'

interface Iprops {
    children?: ReactNode
}

const HotAnchor: FC<Iprops> = () => {
    
    return(
        <HotAnchorWrapper>
            <AreaHeaderV2 title="热门主播" />
            <div className="anchors">
                {
                    hotRadios.map(item=>{
                        return(
                            <div className="item" key={item.name}>
                                <img src={getImageSize(item.picUrl,40)} alt="" />
                                <div className="info">
                                    <div className="name">{item.name}</div>
                                    <div className="position">{item.position}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </HotAnchorWrapper>
    )
}

export default memo(HotAnchor);