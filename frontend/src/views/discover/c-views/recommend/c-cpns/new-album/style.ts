import styled from 'styled-components'

export const NewAlbumWrapper = styled.div`
    margin-top: 20px;

    > .content{
        height: 186px;
        background-color: #f5f5f5;
        border: 1px solid #d3d3d3;
        margin: 20px 0 37px 0;
        padding: 0 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .arrow{
        width: 17px;
        height: 17px;
        cursor: pointer;
        }
        .arrow-left{
            background-position: -260px -75px;
            &:hover{
                background-position: -280px -175px;
            }
        }
        .arrow-right{
            background-position: -300px -75px;
            &:hover{
                background-position: -320px -175px;
            }
        }

        .banner{
            overflow: hidden;
            width: 645px;

            .album-list{
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 150px;
                padding: 0 10px;
            }
            .album-item{
                width: 110px;
                font-size: 12px;
                color: #000;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    
    
    

  
`