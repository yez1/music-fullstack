import styled from "styled-components";

export const HotAnchorWrapper = styled.div`
    padding: 20px;

    .anchors{
       margin-top:20px;

        .item{
            display:flex;
            margin-top:10px;
            width:210px;
            
            img{
                width:40px;
                height:40px;
            }

            .info{
                width:160px;
                margin-left:8px;
                

                .name{
                    font-size:12px;
                    color:#000;
                    margin-top:5px;
                    margin-bottom:5px;

                    &:hover{
                    text-decoration:underline;
                    }
                }

                .position{
                    font-size:12px;
                    color:#666;                   
                    white-space:nowrap;
                    text-overflow:ellipsis;
                    overflow:hidden;
                }
            }

            
        }

    }
`