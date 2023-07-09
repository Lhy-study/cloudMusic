<template>
    <!-- <div id="loader">
        <div class="loading" v-if="time<15">
        <div class="loading-item"></div>
        <div class="loading-item"></div>
        <div class="loading-item"></div>
    </div>
    <div v-else class="error">
        <span class="iconfont icon-wangluo"></span>
        <p>网络不好请重试</p>
    </div>
    </div> -->
 <div id="loader">
    <div class="loading" v-if="time<15">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
    <div v-else class="error">
        <span class="iconfont icon-wangluo"></span>
        <p>网络不好请重试</p>
    </div>
 </div>
  
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
let time=ref(0);
onMounted(()=>{
    let timer=setInterval(()=>{
        time.value++;
    },1000);
    if(time.value>=15){
        clearInterval(timer);
    }
})
</script>

<!-- <style scoped lang="less">
#loader{
    position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            width: 100px;
            height: 100px;
            /* background-color: aqua; */
            border-radius: 50%;
            perspective: 800;
    .error{
        span{
            font-size: 8rem;
        }
        p{
            font-size: 2rem;
            color: @modeTextColor;
        }
    }
}
.loading {
            /* position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            width: 100px;
            height: 100px; */
            /* background-color: aqua; */
            /* border-radius: 50%;
            perspective: 800; */
            width: 100%;
            height: 100%;
        }

        .loading .loading-item {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }

        .loading .loading-item:nth-of-type(1) {
            border-bottom: 6px solid rgb(45, 134, 217);
            transform: rotateX(35deg) rotateY(-45deg);
            animation: one 1s infinite linear;
        }

        .loading .loading-item:nth-of-type(2) {
            border-left: 6px solid rgb(45, 217, 119);
            transform: rotateX(50deg) rotateY(10deg);
            animation: two 1s infinite linear;
        }

        .loading .loading-item:nth-of-type(3) {
            border-top: 6px solid rgb(216, 216, 80);
            transform: rotateX(35deg) rotateY(55deg);
            animation: three 1s infinite linear;
        }
        @keyframes one{
            to{
                transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
            }
        }
        @keyframes two{
            to{
                transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
            }
        }

        @keyframes three{
            to{
                transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
            }
        }
</style> -->
<style lang="less" scoped>

#loader{
    position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            width: 100px;
            height: 100px;
            /* background-color: aqua; */
            border-radius: 50%;
            perspective: 800;
    .error{
        span{
            font-size: 8rem;
        }
        p{
            font-size: 2rem;
            color: @modeTextColor;
        }
    }
}

.loading{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%) rotate(45deg);
      width: 9rem;
      height: 9rem;
      border: 0.5rem solid @textColor;
    }
    span{
      width: 3rem;
      height: 3rem;
      background-color: @textColor;
      float: left;
      animation: animate 1s linear infinite;
    }
    span:nth-of-type(3){
      animation-delay: .8s;
    }
    span:nth-of-type(2),
    span:nth-of-type(6){
      animation-delay: .6s;
    }
    span:nth-of-type(4),
    span:nth-of-type(8){
      animation-delay: .2s;
    }
    span:nth-of-type(1),
    span:nth-of-type(5),
    span:nth-of-type(9){
      animation-delay: .4s;
    }
    @keyframes animate {
      0%{
        transform: scale(1);
      }
      30%{
        transform: scale(0);
      }
      50%{
        transform: scale(0);
      }
      75%{
        transform: scale(1);
      }
      100%{
        transform: scale(1);
      }
    }
</style>