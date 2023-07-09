<template>
    <div id="per-list">
        <!-- <h1>{{ result.createdPlaylistCount+result.subPlaylistCount -1}}</h1>
        <h2>创建的歌单</h2> -->
        <ul v-if="!loaderFlag">
            <template v-for="(i) in result.playlist.slice(0,endNum)" :key="`${i.name}+${i.id}`">
                <li>
                    <div class="img">
                        <router-link :to="`/playlistpage/${i.id}/songs`"> 
                            <img :src="image.Cover"  :data-src="`${i.coverImgUrl}?param200y=200`" @error="dealImgError" v-lazyImg/>
                            <i class="iconfont icon-18erji-2">&nbsp;{{ formatNum(i.playCount) }}</i>
                            <span class="iconfont icon-wode" v-if="userInfo.userId==i.userId"> </span>
                        </router-link>
                    </div>
                    <p>{{ i.name }}</p>
                    <p>{{ i.trackCount }}首</p>
                </li>
            </template>
        </ul>
        <searchLoading v-else="loaderFlag"/>
    </div>
</template>

<script setup lang="ts">
import searchLoading from "../loading/searchLoading.vue";
import { onBeforeMount, onBeforeUnmount, reactive, ref } from "vue";
import { useStore } from "../../store/user";
import { uPlaylist} from "../../api/user";
import { formatNum } from "../../api/format";
import {pldetail} from "../../type/index";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import { image ,dealImgError} from "../../baseconfig"; 


const {userInfo} = storeToRefs(useStore());
let result:{more:boolean,playlist:pldetail[]}= reactive({
    more:true,
    playlist:[] as pldetail[],
});

let loaderFlag=ref(true);
let timer:any=ref(null);
let endNum=ref(30);


onBeforeMount(async ()=>{
    try {
        let {data} =await uPlaylist({uid:userInfo.value.userId,limit:30,offset:0});
        console.log(data);
        result.more=data.more;
        let arr:pldetail[]=[]
        if(data.playlist.length){
            for (let index = 1; index < data.playlist.length; index++) {//第一首自己喜欢的音乐也在，所以要排除
                    let obj:pldetail={
                        id:NaN,
                        playCount:NaN,
                        trackCount:NaN,
                        name:"",
                        coverImgUrl:""
                    }
                    obj.id=data.playlist[index].id;
                    obj.playCount=data.playlist[index].playCount;
                    obj.trackCount=data.playlist[index].trackCount;
                    obj.name=data.playlist[index].name;
                    obj.coverImgUrl=data.playlist[index].coverImgUrl;
                    obj.userId=data.playlist[index].userId;
                    arr.push(obj);
                }
            result.playlist=arr;
            loaderFlag.value=false;
        }

    } catch (error) {
        ElMessage({
            type:"error",
            message:error as string
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
      
        if (endNum.value < result.playlist.length) {
            let scrollTop = document.documentElement.scrollTop;
            let clientHeight = document.documentElement.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            if (scrollTop + clientHeight >= scrollHeight - 100 && scrollTop + clientHeight >= scrollHeight-1) {
                // console.log("到底了");
                endNum.value=endNum.value+10>=result.playlist.length?result.playlist.length:endNum.value+10;
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
});
// onBeforeMount(async ()=>{
//     try {
//         let {data} =await subcount();
//         result.createdPlaylistCount=data.createdPlaylistCount;
//         result.subPlaylistCount=data.subPlaylistCount;
//     } catch (error) {
//         ElMessage({
//             type:"error",
//             message:error as string
//         });
//     }
    

// });
</script>

<style lang="less" scoped>
#per-list{
    ul{
        display: flex;
        flex-wrap: wrap;
        li{
            margin: 1rem 1rem 0 0;
            // position: relative;
            .img{
                position: relative;
                width: 30rem;
                height: 30rem;
                img{
                    width: 100%;
                    height: 100%;
                }
                i {
                    position: absolute;
                    top: 3%;
                    right: 5%;
                    font-weight: 600;
                    font-size: 1.6rem;
                    color: @buttonColor;
                }
                span{
                    position: absolute;
                    font-size: 4rem;
                    left: 3%;
                    bottom: 5%;
                    color: @startColor;
                }
            }
            p {
                box-sizing: border-box;
                width: 30rem;
                height: 20px;
                line-height: 20px;
                font-size: 1.6rem;
                font-family: kaiti;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                letter-spacing: 1px;
                color:@modeTextColor;
            }
        }
    }
}
</style>