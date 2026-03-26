import styled from 'styled-components'

export const UserLoginWrapper = styled.div`
    .content{
        background-position: 0px 0px;
        position: relative;
        width: 250px;
        
        .dis-vip-card{
            width: 100%;
            
            img{
                display: block;
                width: 100%;
                height: auto;
                cursor: pointer;
            }
            
        }
        
        .desc{
            background-position: 0px 0px;
            background-repeat: no-repeat;
            height: 126px;
            padding-top: 0px;

            .desc-content{
                padding: 16px 20px 0 20px;
            }

            .text{
                width: 205px;
                margin: 0 auto;
                line-height: 22px;

                color: rgb(102, 102, 102);
                font-size: 12px;
            
            }

            a{
                background-position: 0px -195px;
                margin: 10px auto 0;
                display: block;
                width: 100px;
                height: 31px;
                line-height: 31px;
                text-align: center;
                color:#fff;
                text-decoration: none;
                text-shadow: 0 1px 0 #8a060b;

                &:hover{
                    background-position: -110px -195px;
            }
            }
        }
    }
`