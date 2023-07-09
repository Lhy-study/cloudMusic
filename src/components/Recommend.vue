<template>
  <div id="Rec">
    <div v-if="userInfo.userId"
    >
      <router-link :to="'/dailyMusic'">
        <div class="tubiao">
          <span class="iconfont icon-w_rili"></span>
        </div>
        <div class="introduce">
          <p>每日推荐</p>
          <p>{{ate}}</p>
        </div>
        <img :src="calendarImg" alt="" @error="dealImgError"/>
      </router-link>
      <span class="iconfont icon-shipinbofangshibofang" @click.stop="get()"></span>
    </div>
    <div>
      <router-link to="/playlistpage/3136952023/songs">
        <div class="tubiao">
          <span class="iconfont icon-leidatu"></span>
        </div>
        <div class="introduce">
          <p>私人雷达</p>
        </div>
        <img :src="radarImg" alt="" @error="dealImgError"/>
      </router-link>
      <span class="iconfont icon-shipinbofangshibofang"></span>
    </div>
    <!-- <div>
        <router-link to="">
        <div class="tubiao">
          <span class="iconfont icon-w_rili"></span>
        </div>
        <div class="introduce">
          <p>每日推荐</p>
          <p>02-11</p>
        </div>
        <img :src="calendarImg" alt="" @error="dealImgError"/>
      </router-link>
      <span class="iconfont icon-shipinbofangshibofang"></span>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useStore } from "../store/user";
import {ref,onMounted} from "vue";
import {getDaySongs} from "../api/user";
import {playAllMusic} from "../api/playing"
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { dealImgError } from "../baseconfig";
import calendarImg from "../assets/rili.jpg";
import radarImg from "../assets/leida.jpg"


const {userInfo}=storeToRefs(useStore());
let ate=ref("");
onMounted(()=>{
    let date=new Date()
    let mounth=date.toLocaleDateString()
    ate.value=mounth.replaceAll("/","-");
    // console.log(mounth.replaceAll("/","-"));
});

async function get(){
  try {
        let { data } = await getDaySongs();
        let arr:number[]=[];
        if (data.data.dailySongs) {
            for (let index = 0; index < data.data.dailySongs.length; index++) {
                arr.push(data.data.dailySongs[index].id);
            }
        }
        playAllMusic(arr);
    } catch (error) {
        ElMessage({
            type: "error",
            message: "获取每日推荐失败,请稍后再试"
        });
    }
}

</script>

<style lang="less" scoped>
@bRadius: 14px;
@size:47px;
#Rec {
  &::after{
    content: "";
    display: block;
    clear: left;
  }
  background-color: @modeBgColor;
//   background-color: aliceblue;
  & > div {
    position: relative;
    float: left;
    width: 360px;
    margin-right: 20px;
    // max-width: 300px;
    height: 80px;
    background-color: @bgColor;
    border-radius: @bRadius;
    overflow: hidden;
    cursor: pointer;
    &:hover{
        box-shadow: 1px 1px 3px 0px black;
    }
    &>span{
        position: absolute;
        top: 16.5px;
        right: -50px;
        display: block;
        border-radius: 50%;
        background-color: @buttonColor;
        width: @size;
        height: @size;
        text-align: center;
        line-height: @size;
        font-size: 2rem;
        color: whitesmoke;
        transition: .2s;
        &:hover{
            opacity: .95;
        }
    }
    &:hover span{
       right: 16.5px;
    }
    a {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // justify-self: center;
      .tubiao {
        // width: 130px;
        padding-left: 10px;
        color: white;
      }
      .introduce {
        box-sizing: border-box;
        padding-left: 15px;
        display: flex;
        flex-direction: column;
        flex: 1;
        p {
          height: 25px;
          line-height: 25px;
          font-family: "Google Sans", sans-serif !important;
          font-size: 1.5rem !important;
          font-weight: 550;
          color: #73776b;
          &:nth-of-type(2) {
            font-size: 1.3rem !important;
          }
        }
      }
      span {
        display: block;
        border-radius: 50%;
        width: @size;
        height: @size;
        background-color: @buttonColor;
        line-height: @size;
        text-align: center;
        font-size: 2.5rem;
      }
      img {
        width: 80px;
        height: 100%;
        border-top-right-radius: @bRadius;
        border-bottom-right-radius: @bRadius;
      }
    }
  }
}
@media screen and (max-width: 1280px) {
  #Rec>div{
    width: 230px;
  }
}
</style>
