import styled from 'styled-components'

export const RecommendWrapper = styled.div`
  > .content{
    border: 1px solid #d3d3d3;
    background-image:url(${require('@/assets/img/wrap_bg.png')});
    display: flex;
  }
  > .content > .left{
    padding:20px;
    width:729px;
  }

  > .content > .right{
    margin-left: 1px;
    width:250px;
  }

`
