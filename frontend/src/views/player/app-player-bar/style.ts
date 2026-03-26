import styled from 'styled-components'

export const PlayerBarWrapper = styled.div`
    position:fixed;
    z-index:99;
    left:0;
    right:0;
    bottom:0;
    height:52px;
    background-position:0 0;
    background-repeat:repeat;

    .lock{
        position: absolute;
        right: 15px;
        top: -14px;
        width: 52px;
        height: 67px;
        background-position: 0 -380px;
    }

    .lock-btn{
        display: block;
        position: absolute;
        left: 18px;
        top: 6px;
        width: 18px;
        height: 18px;
        background-position: -80px -380px;

        &:hover{
            background-position: -80px -400px;
        }
    }

    .lock-btn.locked{
        background-position: -100px -380px;
    }

    .lock-btn.locked:hover{
        background-position: -100px -400px;
    }
    

    .content{
        display:flex;
        align-items:center;
        justify-content:space-between;
        position:absolute;
        left:50%;
        transform:translateX(-50%);
        bottom:0;
        height:47px;
    }
`

interface IBarControl {
    isPlaying: boolean
}
export const BarControl = styled.div<IBarControl>`
    display:flex;
    align-items:center;

    .btn{
        cursor:pointer;
    }
    .prev,
    .next{
        width:28px;
        height:28px;
        cursor:pointer;
    }

    .prev{
        background-position:0 -130px;
    }
    
    .play{
        width:36px;
        height:36px;
        margin:0 8px; 
        background-position:0 -204px;
    }
    
    .pause{
        width:36px;
        height:36px;
        margin:0 8px;
        background-position:0 -165px;
    }

    .next{
        background-position:-80px -130px;
    }
`
export const BarPlayInfo = styled.div`
    display:flex;
    width:642px;
    align-items:center;

    .image{
        width:34px;
        height:34px;
        border-radius: 5px;
    }

    .info{
        flex:1;
        color:#a1a1a1;
        margin-left:10px;

        .song{
            color:#e1e1e1;
            position:relative;
            top:8px;
            left:8px;

            .singer-name{
                color:#a1a1a1;
                margin-left:10px;
            }
        }

        .progress{
            display:flex;
            align-items:center;

            .ant-slider{
                position:relative;
                top:-0.5px;
                width:493px;
                margin-right:10px;

                .ant-slider-rail{
                    height:9px;
                    background:url(${require('@/assets/img/progress_bar.png')}) right 0 ;
                }
                
                .ant-slider-track{
                    height:9px;
                    background:url(${require('@/assets/img/progress_bar.png')}) right -66px ;
                }

                .ant-slider-handle{
                    width:22px;
                    height:24px;
                    border:none;
                    background:url(${require('@/assets/img/sprite_icon.png')}) 0 -253px;
                    
                    &::before,
                    &::after{
                        display:none;
                    }
                }
            }
            
            .time{
                .current{
                    color:#fff;
                }
                .divider{
                    color:#a1a1a1;
                }
     
            }
        }

        
    }
    
`

interface IBarOperator {
    playMode:number
}
export const BarOperator = styled.div<IBarOperator>`
    display:flex;
    align-items:center;
    position:relative;
    top:3px;

    .btn{
        width:25px;
        height:25px;
    }
    
    .left{
        display:flex;
        align-items:center;

        .pip{
            background:url(${require('@/assets/img/pip_icon.png')}) no-repeat 0 0;
        }
        
        .favor{
            background-position:-88px -163px;
        }
        
        .share{
            background-position:-114px -163px;
        }
    }

    
    .right{
        display:flex;
        align-items:center;
        width:126px;
        padding-left:13px;
        background-position:-147px -248px;

        .volume{
            background-position:-2px -248px;
        }
        .loop{
            background-position:${props =>{
                switch(props.playMode){
                    case 0:
                        // 顺序播放（列表循环）
                        return '-3px -344px'
                    case 1:
                        // 随机播放
                        return '-66px -248px'
                    case 2:
                        // 单曲循环
                        return '-66px -344px'
                }
            }}
        }

        .playlist{
            padding-left:18px;
            text-align:center;
            color:#ccc;
            width:59px;
            background-position:-42px -68px;
        }
    }
    
    
    

`
