<template>
  <div class="loading">
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.loading{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100vw;
    height: 100vh;
    background-color: rgba(126, 119, 119, 0.5);
    ul{
        position: absolute;
        top: 35%;
        left: 50%;
        transform: translate(-50%,-50%);
        margin: 0;
        padding: 0;
        display: flex;
        border-bottom: 2px solid @startColor;
        &::after{
            content: "加载中,请销等";
            display: block;
            position: absolute;
            top: 100%;
            padding-top: 10px;
            width: 100%;
            letter-spacing: 1rem;
            color: @startColor;
            text-align: center;
            font-size: 1.7rem;
        }
        li{
            list-style: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin: 0 10px;
            background-color: @startColor;
            animation: animate .8s linear infinite;
            &:nth-of-type(1){
                animation-delay: .45s;
            }
            &:nth-of-type(2){
                animation-delay: .6s;
            }
            &:nth-of-type(3){
                animation-delay: .3s;
            }
            &:nth-of-type(4){
                animation-delay: 0s;
            }
            &:nth-of-type(5){
                animation-delay: .1s;
            }
        }
    }
}
@keyframes animate {
    0%{
        transform: translateY(0);
    }
    30%{
        transform: translateY(-90px);
    }
    50%{
        transform: translateY(-150px);
    }
    70%{
        transform: translateY(-90px);
    }
    100%{
        transform: translateY(0);
    }
}
</style>