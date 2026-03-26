import styled from "styled-components";

export const TopRankingItemWrapper = styled.div`
    width:230px;

    &:last-child{
        width: 228px;
    }

    .header{
        height:100px;
        display:flex;
        padding:20px 0 0 19px;

        .image{
            width:80px;
            height:80px;
            position:relative;

            img{
                width:80px;
                height:80px;
            }

            .sprite_cover{
                position: absolute;
                top: 0;
                left: 0;
                width: 80px;
                height: 80px;
                background-position: -145px -57px;
                text-indent: -9999px;
            }
        }
        
        .info{
            margin:6px 0 0 10px;

            .name{
                font-size:14px;
                color:#333;
                font-weight:700;
            }

            a{
                font-size:14px;
                color:#333;
                font-weight:700;
            }
            
            .btn{
            display: inline-block;
            width: 22px;
            height: 22px;
            text-indent: -9999px;
            margin:8px 10px 0 0;
            cursor: pointer;
            }

            .play{
                background-position: -267px -205px;

                &:hover{
                background-position: -267px -235px
                }
            }

            .favor{
                background-position: -300px -205px;

                &:hover{
                background-position: -300px -235px
                }
            }
        }
    }

    .list{
        .item{
            position: relative;
            display: flex;
            align-items: center;
            height: 32px;
        }

        .item:nth-child(-n+3) .index{
            color: #c10d0c;
        }

        .index{
            width: 35px;
            text-align: center;
            font-size: 16px;
        }
        
        .info{
            flex: 1;
            height: 32px;
            color: #000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 0;
        }

        .name{
            flex: 1;
            min-width: 0;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-wrap: normal;
            cursor: pointer;

            &:hover{
                text-decoration: underline;
            }
        }

        .operator{
            display: none;
            align-items: center;
            width: 82px;
            flex-shrink: 0;

            .btn{
                width: 17px;
                height: 17px;
                margin-right: 8px;
                cursor: pointer;
            }

            .play{
                background-position: -267px -268px;
                &:hover{
                    background-position: -267px -268px;
                }
            }

            .add{
                background-position: 0px -699px;
                &:hover{
                    background-position: -22px -699px;
                }
            }

            .favor{
                background-position: -297px -268px;
                &:hover{
                    background-position: -267px -268px;
                }
            }
        }

        .item:hover .operator{
            display: flex;
        }
    }

    .footer{
        padding-right:20px;
        text-align: right;
        line-height: 32px;
    }
    
    
    
`