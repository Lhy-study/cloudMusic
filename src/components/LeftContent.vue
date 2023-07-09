<template>
  <div class="left">
      <div id="leftNavSlider">
        <ul>
          <li :class="{ show:  route.path=='/'  }">
            <router-link to="/"
              ><span class="iconfont icon-yooxi"></span>
            </router-link>
          </li>
          <li :class="{ show:  (/^\/explore/).test($route.fullPath) }">
            <router-link to="/explore/personalityRecommendation"
              ><span class="iconfont icon-icon-test"></span
            ></router-link>
          </li>
          <li
            :class="{ show: (/^\/personal/).test($route.fullPath) }"
            v-if="userInfo.userId"
          >
            <router-link to="/personal/follows"
              ><span class="iconfont icon-cangku"></span
            ></router-link>
          </li>
        </ul>
      </div>
    </div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router"
import { useStore } from "../store/user";
import {storeToRefs} from "pinia";
const user = useStore();
let { userInfo } = storeToRefs(user);

const route=useRoute();//route是一个响应式对象
// let isTrue=computed(()=>{
//   return window.location.pathname
// })
// console.log(window.location.pathname);
// let isTrue = ref(true);
</script>

<style scoped lang="less">
.show {
  background-color: @bgColor;
}
.left {
    position: sticky;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 8rem;
    top: 40%;
    //最新
    // height: (100vh-10rem);
    min-height: 80vh;
    // height: 100%;
    // background-color: #83a183;
    #leftNavSlider {
      width: 8rem;
      height: 100%;
      ul {
        position: sticky;
        top: 40%;
        left: 10px;
        height: 15rem !important;
        // left: 60px;
        li {
          margin: auto;
          display: flex;
          justify-content: center;
          border-radius: 50%;
          width: 5rem;
          height: 5rem;
          cursor: pointer;
          // &:visited{
          //   background-color: @bgColor;
          // }
          &:hover a {
            animation: one 0.7s;
            // color: red;
          }
          span {
            line-height: 5rem;
            text-align: center;
            font-size: 2.5rem;
            color: @textColor;
          }
          @keyframes one {
            0% {
              transform: translateY(0px);
            }
            30% {
              transform: translateY(-8px);
            }
            50% {
              transform: translateY(0px);
            }
            70% {
              transform: translateY(-5px);
            }
            80% {
              transform: translateY(0px);
            }
            90% {
              transform: translateY(-3px);
            }
            100% {
              transform: translateY(0px);
            }
          }
        }
      }
    }
  }
//   @media screen and (max-width: 1280px) {
//   #leftNavSlider {
//     li {
//       transform: scale(0.8); //设置图标
//     }
//   }
// }
  @media screen and (max-width: 1400px) {
    .left {
      width: 100px !important;
      height: 100vh;
    }
  }
  @media screen and (min-width: 2561px) {
    .left {
      #leftNavSlider {
        height: 100%;
      }
    }
  }
</style>