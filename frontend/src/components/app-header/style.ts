import styled from 'styled-components';

export const HeaderWrapper = styled.div`
    height: 75px;
    background-color: #242424;
    font-size: 14px;
    color: #fff;

    .content{
      display: flex;
      justify-content: space-between;
    }
      
    .divider{
      height: 5px;
      background-color: #C20C0C;
    } 
`

export const HeaderLeft = styled.div`
    display: flex;

    .logo{
      display: block;
      width: 176px;
      height: 70px;
      background-position: center;
      background-size: contain;
      text-indent: -9999px;
    }

    .title-list{
      display:flex;
      line-height:70px;

      .item{
        position:relative;

        a{
          display:block;
          padding:0 20px;
          color:#ccc;
        }
        
        :list-of-type a {
          position:relative;
          ::after{
            postion:absolute;
            content:'';
            width:28px;
            height:19px;
            background-image:url('@/assets/img/sprite_01.png');
            background-position:-190px 0;
            top:20px;
            right:-15px;
          }
        }
        
        &:hover a{
        .active{
          color:#fff;
          background-color:#000;
          text-decoration:none;
        }
        }

        .active .icon{
          position:absolute;
          display:inline-block;
          width:12px;
          height:7px;
          bottom:-1px;
          left:50%;
          transform:translateX(-50%,0);
          background-position:-226px 0;
        }
      }
    }

`
export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  color:#787878;
  font-size: 12px;

  > .search{
    width: 158px;
    height: 32px;
    border-radius: 16px;
    background-color: #363636;
    border: none;
    
    input{
      background-color: transparent;
      color: #9b9b9b;
      
      &::placeholder{
        font-size: 12px;
        color: #9b9b9b;
      }
    }
    
    .ant-input-prefix{
      color: #9b9b9b;
    }
    
    &:hover, &:focus, &:focus-within{
      background-color: #fff;
      
      input{
        color: #333;
        
        &::placeholder{
          color: #9b9b9b;
        }
      }
      
      .ant-input-prefix{
        color: #999;
      }
    }
  }
  
  .center{
    width: 90px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border: 1px solid #666;
    border-radius: 16px;
    color:#aaa;
    margin: 0 16px;
    cursor: pointer;

    &:hover{
      color:#fff;
      border-color:#fff;
    }
  }
  


`