<template>
    <div id="per-likelist" v-if="!loaderFlag">
        <!-- <ul class="song">
          <li style="font-size:1.5rem;">
            <div class="one" style="height:3rem;"></div>
            <div class="div-title">标题</div>
            <div class="div-singer">歌手</div>
            <div class="div-album">专辑</div>
            <div class="div-duration">时长</div>
          </li>
          <li v-for="(item, index) in result.allsongs.slice(0,end)" :key="`${item.name}+${item.id}`" :class="{ check: index % 2 == 0 }"
            @dblclick="setNewPlayMusic(item.id)">
            <div class="one">
              <span>{{ index + 1 }}</span>
              <span class="iconfont icon-aixin" style="color: red;"></span>
            </div>
            <div class="div-title">
              <p>{{ item.name }}</p>
              <span :class="[{iconfont:true},`${formatFee(item.fee)}`]"></span>
            </div>
            <div class="div-singer">
              <template v-for="(aritem, arindex) in item.ar" :key="`${aritem.name}+${aritem.id}`">
                <router-link :to="`/singerpage/${encodeURIComponent(aritem.id)}/album`"><span>{{ aritem.name
                }}</span></router-link><span v-if="arindex != item.ar.length - 1">/</span>
              </template>
            </div>
            <div class="div-album">
              <router-link :to="`/albumpage/${encodeURIComponent(item.al.id)}/songs`">
                <p>{{ item.al.name }}</p>
              </router-link>
            </div>
            <div class="div-duration">
              <p>{{ fomatDuration(item.dt / 1000) }}</p>
            </div>
          </li>
        </ul> -->
        <ul class="song">
            <li style="font-size:1.5rem;">
                <div class="one" style="height:3rem;"></div>
                <div class="div-title">标题</div>
                <div class="div-singer">歌手</div>
                <div class="div-album">专辑</div>
                <div class="div-duration">时长</div>
            </li>
            <template v-if="result.allsongs.slice(0,end)">
                <li v-for="(item, index) in result.allsongs.slice(0,end)" :key="`${item.name}+${item.id}`"
                    :class="{ check: index % 2 == 0 }" @dblclick="setNewPlayMusic(item.id)">
                    <div class="one">
                      <span>{{ index + 1 }}</span>
                      <span class="iconfont icon-aixin" style="color: red;"></span>
                    </div>
                    <div class="div-title">
                        <p>{{ item.name }}</p>
                        <span :class="[{ iconfont: true }, `${formatFee(item.fee)}`]"></span>
                    </div>
                    <div class="div-singer">
                        <template v-for="(aritem, arindex) in item.ar" :key="`${aritem.name}+${aritem.id}`">
                            <router-link :to="`/singerpage/${encodeURIComponent(aritem.id)}/album`"><span>{{ aritem.name
                            }}</span></router-link><span v-if="arindex != item.ar.length - 1">/</span>
                        </template>
                    </div>
                    <div class="div-album">
                        <router-link :to="`/albumpage/${encodeURIComponent(item.al.id)}/songs`">
                            <p>{{ item.al.name }}</p>
                        </router-link>
                    </div>
                    <div class="div-duration">
                        <p>{{ fomatDuration(item.dt / 1000) }}</p>
                    </div>
                </li>
            </template>
            <div class="error" v-else>
                <p>
                    赶快去收藏你喜欢的音乐
                </p>
            </div>
        </ul>
    </div>
    <SearchLoadingVue v-else />
</template>

<script setup lang="ts">
import SearchLoadingVue from "../loading/searchLoading.vue";
import { storeToRefs } from "pinia";
import { useStore } from "../../store/user";
import { likelist } from "../../api/user";
import { getDeatils } from "../../api/music";
import {setNewPlayMusic} from "../../api/playing"
import { formatFee,fomatDuration } from "../../api/format";
import { onBeforeMount, onBeforeUnmount, reactive,ref } from "vue";
import { ElMessage } from "element-plus";
import { musicDeatils } from "../../type/index";

let loaderFlag = ref(true);
const { userInfo } = storeToRefs(useStore());
let timer=ref<any>(null);//是一个定时器
let end=ref(100);
let result=reactive({
    allsongs:<musicDeatils[]>[{
        name:"",
        id:NaN,
        fee:NaN,
        dt:NaN,
        al:{
            id:NaN,
            name:"",
            picUrl:"",
        },
        ar:[{id:NaN,name:""}]
    }],
    showSongs:[] as musicDeatils[]
});

onBeforeMount(async () => {
    try {
        let { data } = await likelist(userInfo.value.userId);
        // console.log(data);
        let ids = data.ids
        if (data.ids.length) {
            let { data } = await getDeatils(ids as number[]);
            // console.log(data);
            let arr: musicDeatils[] = []
            if (data.songs.length) {
                for (let index = 0; index < data.songs.length; index++) {
                    let obj: musicDeatils = {
                        name: "",
                        id: NaN,
                        fee: NaN,
                        dt: NaN,
                        al: {
                            id: NaN,
                            name: "",
                        },
                        ar: [{ id: NaN, name: "" }]
                    }
                    obj.name = data.songs[index].name;
                    obj.id = data.songs[index].id;
                    obj.dt = data.songs[index].dt;
                    obj.fee = data.songs[index].fee;
                    obj.al.id = data.songs[index].al.id;
                    obj.al.name = data.songs[index].al.name;
                    obj.ar = data.songs[index].ar;
                    arr.push(obj);
                }
                result.allsongs = arr;
                loaderFlag.value=false;
            }
        }
    } catch (error) {
        ElMessage({
            type: "error",
            message: error as string
        })
    }
});

const controller = new AbortController();//用来取消监听在该组件下的滚动事件
document.addEventListener("scroll", () => {
    if (timer.value) {
        clearTimeout(timer.value);
    }
    timer.value = setTimeout(() => {
      // console.log(11);
      
        if (end.value < result.allsongs.length) {
            let scrollTop = document.documentElement.scrollTop;
            let clientHeight = document.documentElement.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            if (scrollTop + clientHeight >= scrollHeight - 100 && scrollTop + clientHeight >= scrollHeight-1) {
                // console.log("到底了");
                end.value=end.value+30>=result.allsongs.length?result.allsongs.length:end.value+30;
            }
        }else if(document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight-1  && !loaderFlag.value){
            ElMessage({
                message: "已经到底了",
                type: "warning"
            });
        }
    }, 300);
},{signal:controller.signal});//监听滚动事件

onBeforeUnmount(()=>{
    controller.abort();
});//取消监听滚动事件
</script>

<style lang="less" scoped>

@import "../../assets/css/fee.less";
.check {
  background-color: #dcdada;
}

.checkfree {
  color: rgb(242, 66, 66) !important;
  border-color: rgb(242, 66, 66) !important;
}


#per-likelist{
  width: calc(100vw - 15rem) !important;
}

@media screen and (min-width: 2300px)  {
  
  #per-likelist{
    width: 100% !important;
  }
}
ul.song {
  // width: 100% !important;
  margin-top: 2rem;
}


// li {
//   box-sizing: border-box;
//   border-radius: 1rem;
//   padding: 1rem 1rem;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   color: @modePColor;
//   text-align: left;

//   &:hover {
//     background-color: #cccccc;
//   }

//   .one {
//     width: 10rem;
//     display: flex;
//     justify-content: space-around;
//     align-items: center;

//     span {
//       display: block;
//       height: 30px;
//       line-height: 30px;
//       font-size: 1.5rem;
//     }
//   }

//   .div-title {
//     display: flex;
//     align-items: center;
//     width: 30%;
//     max-width: 40vw;
//     p {
//       margin-right: 1rem;
//       white-space: nowrap;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       font-size: 1.7rem;
//       letter-spacing: 2px;
//     }
//   }

//   .div-singer {
//     // width: 300px;
//     width: 25%;
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     font-size: 1.7rem;

//     a {
//       width: 100%;
//       color: #978d8c;

//       &:hover {
//         text-decoration: underline;
//       }
//     }

//     span {
//       padding: 0 0.2rem;
//     }
//   }

//   .div-album {
//     // width: 250px;
//     width: 25%;
//     p {
//       font-size: 1.6rem;
//       color: @modePColor;
//     }
//   }

//   // .div-duration {
//   //   // width: 120px;
//   //   font-size: 1.5rem;
//   // }

//   .div-duration {
//         width: 12rem;
//         font-size: 1.5rem;
//     }
// }

li {
    border-radius: 1rem;
    padding: 1rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: @modePColor;
    text-align: left;

    &:hover {
        background-color: #cccccc;
    }

    .one {
        width: 10rem;
        display: flex;
        justify-content: space-around;
        align-items: center;

        span {
            display: block;
            height: 30px;
            line-height: 30px;
            font-size: 1.5rem;
        }
    }

    .div-title {
        display: flex;
        align-items: center;
        // width: 40vw;
        width: 30%;
        max-width: 40vw;
        p {
            // width: 80%;
            margin-right: 1rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 1.7rem;
            letter-spacing: 2px;
        }

        &>span {
            display: block;
            font-size: 1.7rem;
            border-radius: 0.2rem;
            color: @startColor;
        }
    }

    .div-singer {
        // width: 300px;
        width: 25%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1.7rem;

        a {
            width: 100%;
            color: #978d8c;

            &:hover {
                text-decoration: underline;
            }
        }

        span {
            padding: 0 0.2rem;
        }
    }

    .div-album {
        // width: 250px;
        width: 25%;
        p {
            font-size: 1.6rem;
            color: @modePColor;
        }
    }

    .div-duration {
        width: 120px;
        font-size: 1.5rem;
    }
}

.error {
  position: relative;
  top: 100px;

  p {
    text-align: center;

    span {
      color: @textColor;
    }
  }
}
</style>