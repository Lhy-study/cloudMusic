<template>
  <div id="content">
    <TopContent v-show="!((/^\/personal/).test(route.path))"/>
    <div class="bottom">
      <LeftContent />
      <div id="right">
        <router-view></router-view>
      </div>
    </div>
    <MusicPlayer />
  </div>
</template>

<script setup lang="ts">
import MusicPlayer from "./components/MusicPlayer.vue"
import LeftContent from "./components/LeftContent.vue";
import TopContent from "./components/TopContent.vue";
import { onMounted,  onBeforeMount} from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { setTheme, setMode } from "./theme/theme";
import { styleStore } from "./store/setting";
import { useStore } from "./store/user";
import { likeList } from "./store/likeList";
import {getStatus} from "./api/login";
import { usdetail ,likelist} from "./api/user";
import {user} from "./type/index";
import { storeToRefs } from "pinia";

let route=useRoute()
const { userInfo } = storeToRefs(useStore());
let {setLikeList} = likeList();
const { setUserInfo } = useStore();
const { changeTheme, changeMode } = styleStore();
// const { userInfo } = storeToRefs(useStore());
// const {setPlayList} =musicListStore();
// console.log(userInfo);

changeMode("default");
changeTheme("default");
setTheme("default");
setMode("default");

onMounted(async () => {
  // console.log( window.localStorage.getItem("theme") as string);
  // console.log( window.localStorage.getItem("mode") as string);
  
  changeTheme(window.localStorage.getItem("theme") as string);//上一次本地存储的主题色的放到pinia
  changeMode(window.localStorage.getItem("mode") as string);
  setTheme(window.localStorage.getItem("theme") as string);
  setMode(window.localStorage.getItem("mode") as string);
  // setPlayList(JSON.parse(localStorage.getItem("playlist")));
});

// localStorage.setItem("playlist",JSON.stringify([423228325]));
// localStorage.setItem("playMusic",JSON.stringify({id:423228325,index:0}));



// new Promise((resolve, reject) => {
//   let res = getStatus();
//   // console.log(data.data.profile);
//   resolve(res);
//   // console.log(res);
// }).then((res: any) => {
//   console.log(res.data.data);
//   if (res.data.data.profile) {
//     let obj:user={
//       level:0,
//       listenSongs:0,
//       userId:NaN,
//       gender:0,
//       createTime:NaN,
//       nickname:"",
//       avatarUrl:"",
//       signature:"",
//       followeds:NaN,
//       follows:NaN,
//       userType:NaN,
//     }
//     obj.avatarUrl=res.data.data.profile.avatarUrl;
//     obj.userId=res.data.data.profile.userId;
//     obj.gender=res.data.data.profile.gender;
//     obj.nickname=res.data.data.profile.nickname;
//     obj.level;
//     obj.listenSongs
//     obj.signature=res.data.data.profile.signature;
//     obj.createTime=res.data.data.profile.createTime;
//     obj.followeds=res.data.data.profile.followeds;
//     obj.follows=res.data.data.profile.follows;
//     obj.userType=res.data.data.profile.userType;
//     setUserInfo(obj); //设置用户信息
//     // console.log(data.data);
//   } else {
//     setUserInfo({ userId: NaN })
//   }
// });

new Promise(async (resolve, reject) => {
  let res = await getStatus();
  console.log(res.data.data.profile);
  if (res.data.data.profile) {
    resolve(res.data.data.profile.userId);
  } else {
    reject(NaN);
  }
  // console.log(res);
}).then(async (data1: any) => {
  // console.log(data1);
  let { data } = await usdetail(data1);
  let obj: user = {
    level: 0,
    listenSongs: 0,
    userId: NaN,
    gender: 0,
    createTime: NaN,
    nickname: "",
    avatarUrl: "",
    signature: "",
    followeds: NaN,
    follows: NaN,
    userType: NaN,
  }
  obj.level = data.level;
  obj.createTime = data.createTime;
  obj.listenSongs = data.listenSongs;

  if (data.profile) {
    obj.avatarUrl = data.profile.avatarUrl;
    obj.userId = data.profile.userId;
    obj.gender = data.profile.gender;
    obj.nickname = data.profile.nickname;
    obj.signature = data.profile.signature;
    obj.followeds = data.profile.followeds;
    obj.follows = data.profile.follows;
    obj.userType = data.profile.userType;
    setUserInfo(obj); //设置用户信息
    // console.log(data.data);
  } else {
    setUserInfo({ userId: NaN })
  }
}).catch((e) => {
  if (e instanceof Error) {
    ElMessage({
      type: "error",
      message: e.message
    });
  }
});

onBeforeMount(async()=>{
  try {
    let {data} =await likelist(userInfo.value.userId);
    console.log(data);
    
    if(data.ids.length){
      setLikeList(data.ids);
    }else{
      setLikeList([]);
    }
  } catch (e) {
    ElMessage({
      type:"error",
      message:e as string
    })
  }
});
</script>

<style  lang="less">
// @background: #83b9b9;
body {
  // width: 100vw !important;
  // height: 100wh !important;
  background-color: @modeBgColor;
}

.show {
  background-color: @bgColor;
}

html {
  font-size: 62.5%; //1rem等于10px在这个前提下
}

// ::-webkit-scrollbar-track {
//   background: rgba(0, 0, 0, 0.1);
//   border-radius: 0;
// }

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 6px;
  height: 5px;
}

::-webkit-scrollbar-thumb {
  overflow-y: overlay;
  cursor: pointer;
  border-radius: 5px;
  background: @modeThumbColor;
  transition: color 0.2s ease;
}

* {
  padding: 0;
  margin: 0;
  list-style: none;
  text-decoration: none;
  scroll-behavior: smooth;
}

#app {
  position: relative;
  // border: .1px solid transparent;
  max-height: 100vh;
}

#content {
  position: relative;
  box-sizing: border-box;
  // position: absolute;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // top: 0;
  margin: auto;
  // display: flex;
  // flex-direction: column;
  // width: 1600px;
  // width: 90vw;
  max-width: 2300px;
  // box-sizing: border-box !important;
  padding-top: 2.5rem;
  // padding-right: 20px;
  padding-bottom: 2rem;
  // width: 95vw;
  // max-width: 2080px;
  // min-width: 980px;
  min-width: 800px;
  // height: 95vh;
  // min-height: 700px;
  // max-height: 1080px;
  background-color: @modeBgColor;

  .bottom {
    box-sizing: border-box;
    display: flex;
    width: 100% !important;
    padding-bottom: 12rem;
    
    // position: relative;
    // flex: 1;
    // width: 80%;
    #right {
      // width: 100%;
      flex: 1;
    }
  }
}

@media screen and (max-width: 1600px) {
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 2px;
    height: 2px;
  }

  #content {
    // width: 100vw;
    padding-right: 0px;
  }

  #leftNavSlider {
    li {
      transform: scale(0.8); //设置图标
    }
  }
}

@media screen and (min-width: 2080px) {

  html {
    font-size: 87.5% !important; //1rem等于11px在这个前提下
  }
}

@media screen and (min-width: 1800px) and (max-width: 2080){

html {
  font-size: 75% !important; //每百分之12.5降低1px 原1rem为16px 现1rem为10px
}
}

@media screen and (min-width: 1600px) and (max-width: 1800px){

html {
  font-size: 62.5% !important; //每百分之12.5降低1px 原1rem为16px 现1rem为10px
}
}

@media screen and (min-width: 1400px) and (max-width: 1600px){

html {
  font-size: 50% !important; //每百分之12.5降低1px 原1rem为16px 现1rem为10px
}
}

@media screen  and (max-width: 1400px){

html {
  font-size: 37.5% !important; //每百分之12.5降低1px 原1rem为16px 现1rem为10px
}
}

// @media screen and  (max-width: 1000px){

// html {
//   font-size: 25% !important; //每百分之12.5降低1px 原1rem为16px 现1rem为10px
// }
// }
</style>
  