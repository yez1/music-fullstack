import styled from 'styled-components'

export const NavBarWrapper = styled.div`
    height:30px;
    background-color: #C20C0C;
    
    
    .nav{
        display: flex;
        /* Align the first tab text under "发现音乐" in the top header */
        padding-left: 166px;
        position: relative;
        top: -4px;

        .item{
            a{
                display: inline-block;
                height: 20px;
                line-height: 20px;
                padding: 0 13px;
                margin: 7px 17px 0; 
                color: #fff;
                font-size: 12px;

                &:hover,
                &.active{
                    border-radius: 20px;
                    background-color: #9B0909;
                    text-decoration: none;
                }
            }
        }
    }
`
