<template>
    <div id="albumTab" v-if="!loaderFlag">
        <ul>
            <li v-for="item in result.hotAlbums" :key="`${item.name}+${item.id}`" >
                <router-link :to="`/albumpage/${item.id}/songs`">
                    <img :src="image.Cover" :data-src="`${item.picUrl}?param=130y130`" @error="dealImgError" v-lazyImg>
                    <p>{{ formatDate(item.publishTime) }}</p>
                </router-link>
                <div class="content">
                    <div class="fun">
                        <router-link :to="`/albumpage/${item.id}/songs`">{{ item.name }}</router-link>
                        <span class="iconfont icon-shipinbofangshibofang" @click="playAllMusic(getAllId(item.content))"></span>
                    </div>
                    <ul class="songs">
                        <li v-for="(i, index) in item.content.slice(0,end)" :key="`${i.name}+${i.id}`" :class="{ check: index % 2 == 0 }"
                        @dblclick="setNewPlayMusic(i.id)">
                            <div class="one">
                                <span>{{ index + 1 }}</span>
                                <span :class="[`iconfont` ,'icon-aixin',{like:likeList().likelists.includes(i.id)}]"></span>
                            </div>
                            <div class="div-title">
                                <p>{{ i.name }}</p>
                                <span :class="[{ iconfont: true }, `${formatFee(i.fee)}`]"></span>
                            </div>
                            <div class="div-duration">
                                <p>{{ fomatDuration(i.dt / 1000) }}</p>
                            </div>
                        </li>
                        <p @click="()=>{end=item.size}" v-if="item.size>10">点击查更多</p>
                    </ul>
                </div>
            </li>
        </ul>
        <!-- {{ num }} -->
        <!-- <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto" infinite-scroll-distance="1">
            <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
        </ul> -->
    </div>
    <SearchLoadingVue v-else />
</template>

<script setup lang="ts">
import SearchLoadingVue from "../loading/searchLoading.vue";
import { ElMessage } from "element-plus";
import { album } from "../../api/singer";
import { formatDate, formatFee, fomatDuration } from "../../api/format";
import { albumCont } from "../../api/album";
import {setNewPlayMusic,playAllMusic,getAllId} from "../../api/playing"
import { likeList } from "../../store/likeList";
// import { getDeatils } from "../../api/music";

import { reactive,ref ,watchEffect } from 'vue';
import { useRoute, onBeforeRouteLeave } from "vue-router";
import { storeToRefs } from "pinia";
import { image ,dealImgError} from "../../baseconfig";

let loaderFlag=ref(true);
const { likelists } = storeToRefs(likeList());
// let b=inject('b');
// let num = inject('num');
let end=ref<number>(10);
const route = useRoute();
let timer=ref<any>(null);//是一个定时器

let result = reactive({
    artist: {id:NaN},
    hotAlbums: [] as hotobj[],
    more: true,
});

let page=ref(0);
interface hotobj {
    id: number,
    name: string,
    picUrl: string,
    publishTime: number,
    size: number,
    content: simpMusic[]
    // content:{songs:[]}|null
}

interface simpMusic {
    id: number
    name: string,
    fee: number,
    dt: number,
}

// const stop = watchEffect(async () => {
//     try {
//         if (route.params.id) {
//             let { data } = await album({ id: parseInt(route.params.id as string), limit: 5 });
//             console.log(data);
//             if (data.hotAlbums.length) {
//                 data.hotAlbums.forEach(async (item: any) => {
//                     let obj: hotobj = { id: NaN, name: "", picUrl: "", publishTime: NaN, size: NaN, content: [] }
//                     obj.id = item.id;
//                     obj.name = item.name;
//                     obj.picUrl = item.picUrl;
//                     obj.publishTime = item.publishTime;
//                     obj.size = item.size;
//                     try {
//                         let res = await albumCont(item.id);
//                         let musicS: simpMusic[] = [];
//                         if (res.data.songs) {
//                             for (let i = 0; i < res.data.songs.length; i++) {
//                                 let music: simpMusic = { id: NaN, dt: NaN, name: "", fee: NaN }
//                                 music.dt = res.data.songs[i].dt;
//                                 music.fee = res.data.songs[i].fee;
//                                 music.id = res.data.songs[i].id;
//                                 music.name = res.data.songs[i].name;
//                                 musicS.push(music);
//                             }
//                             obj.content = musicS;
//                         }
//                     } catch (error) {
//                         ElMessage({
//                             type: "error",
//                             message: error as string
//                         });
//                     }
//                     result.hotAlbums.push(obj);
//                 });
//                 result.more = data.more;
//             }
//         }
//     } catch (error) {
//         ElMessage({
//             duration: 1000,
//             message: error as string,
//             type: "error"
//         })
//     }
// });

const stop = watchEffect(async () => {
    // console.log('stop');
    
    try {
        if (route.params.id) {
            let { data } = await album({ id: parseInt(route.params.id as string), limit: 3 ,offset:page.value});
            // console.log(data);
            if (data.hotAlbums.length) {
                let arr: hotobj[] = [];

                for(let index=0;index<data.hotAlbums.length;index++){
                    // data.hotAlbums.forEach(async (item: any) => {
                    let obj: hotobj = { id: NaN, name: "", picUrl: "", publishTime: NaN, size: NaN, content: [] }
                    obj.id = data.hotAlbums[index].id;
                    obj.name = data.hotAlbums[index].name;
                    obj.picUrl = data.hotAlbums[index].picUrl;
                    obj.publishTime = data.hotAlbums[index].publishTime;
                    obj.size = data.hotAlbums[index].size;
                    try {
                        let res = await albumCont(data.hotAlbums[index].id);
                        let musicS: simpMusic[] = [];
                        if (res.data.songs) {
                            for (let i = 0; i < res.data.songs.length; i++) {
                                let music: simpMusic = { id: NaN, dt: NaN, name: "", fee: NaN }
                                music.dt = res.data.songs[i].dt;
                                music.fee = res.data.songs[i].fee;
                                music.id = res.data.songs[i].id;
                                music.name = res.data.songs[i].name;
                                musicS.push(music);
                            }
                            obj.content = musicS;
                        }
                    } catch (error) {
                        ElMessage({
                            type: "error",
                            message: error as string
                        });
                    }
                    arr.push(obj);
                    // console.log(obj);
                }
                if(result.artist.id==data.artist.id){
                    result.hotAlbums.push(...arr);
                }else{             
                    result.artist=data.artist;
                    result.hotAlbums=arr;
                }
                result.more = data.more;
                loaderFlag.value=false;
            }
        }
    } catch (error) {
        ElMessage({
            duration: 1000,
            message: error as string,
            type: "error"
        })
    }
});

onBeforeRouteLeave(() => {
    stop();
    controller.abort();
});
const controller =new AbortController();
document.addEventListener("scroll", () => {
    if (timer.value) {
        clearTimeout(timer.value);
    }
    timer.value = setTimeout(() => {
        // console.log(11);
        
        if (result.more) {
            let scrollTop = document.documentElement.scrollTop;
            let clientHeight = document.documentElement.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            if (scrollTop + clientHeight >= scrollHeight - 100 && scrollTop + clientHeight >= scrollHeight-1) {
                // console.log("到底了");
                page.value += 1;
            }
        }
    }, 200);
},{signal:controller.signal});
</script>

<style lang="less" scoped>
@import "./../../assets/css/fee.less";

// .icon-mianfei{
//     color: @startColor !important;
// }
// .icon-vip{
//     color: red !important;
// }
// .icon-fufeizhifu{
//     color: red !important;
// }
.check {
  background-color: #dcdada;
}

.like{
    color: red;
}

.checkfree {
  color: rgb(242, 66, 66) !important;
  border-color: rgb(242, 66, 66) !important;
}


#albumTab {
    margin-top: 2rem;
    li {
        display: flex;
        padding-bottom: 5rem;
        &>a {
            display: block;
            img {
                box-sizing: border-box;
                width: 15rem;
                height: 15rem;
                border-radius: 5%;
                border: 1px solid @modePColor;
            }

            p {
                font-size: 1.4rem;
                color: @modePColor;
            }
        }

        .content {
            flex: 1;
            margin-left: 7rem;
            .fun {
                display: flex;
                box-sizing: border-box;
                align-items: center;
                a {
                    font-size: 1.6rem;
                    color: @modePColor;
                }
                span{
                    margin-left: 3rem;
                    display: block;
                    width: 1.8rem;
                    height: 1.8rem;
                    line-height: 1.8rem;
                    background-color: white;
                    border: 1px solid @modePColor;
                    font-size: 1.4rem;
                    text-align: center;
                    border-radius: 50%;
                    color: @modeTextColor;
                    cursor: pointer;
                }
                padding-bottom: 1rem;
            }

            .songs {
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
                        width: 4rem;
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
                        width: 40%;
                        width: 40vw;
                        p {
                            margin-right: 1rem;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            font-size: 1.7rem;
                            letter-spacing: 2px;
                        }

                    }
                    .div-duration {
                        width: 120px;
                        font-size: 1.5rem;
                    }
                }
            }
        }
    }
}
</style>