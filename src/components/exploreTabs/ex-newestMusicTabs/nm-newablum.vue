<template>
    <div id="nm-newablum">
        <div class="header">
            <ul>
                <li><span :class="{ischeck:area=='全部'}" @click="area='全部'">全部</span></li>
                <li><span :class="{ischeck:area=='华语'}" @click="area='华语'">华语</span></li>
                <li><span :class="{ischeck:area=='欧美'}" @click="area='欧美'">欧美</span></li>
                <li><span :class="{ischeck:area=='韩国'}" @click="area='韩国'">韩国</span></li>
                <li><span :class="{ischeck:area=='日本'}" @click="area='日本'">日本</span></li>
            </ul>
            <ul>
                <li><span :class="{ischeck:type=='全部'}" @click="type='全部'">全部</span></li>
                <li><span :class="{ischeck:type=='热门'}" @click="type='热门'">热门</span></li>
            </ul>    
        </div>
        <div class="content" v-if="!loading">
            <ul>
                <template v-for="(i) in result.data.slice(0,endNum)" :key="`${i.name}+${i.id}`">
                    <li>
                        <div class="img">
                            <router-link :to="`/albumpage/${i.id}/songs`">
                                <img :src="image.Cover" :data-src="`${i.picUrl}?param150y=150`" @error="dealImgError" v-lazyImg />
                            </router-link>
                            <span class="iconfont icon-shipinbofangshibofang" @click.self="play_al(i.id)"></span>
                        </div>
                        <p>{{ i.name }}</p>
                        <p><router-link :to="`/singerpage/${i.artist.id}/album`">{{ i.artist.name }}</router-link>  </p>
                    </li>
                </template>
            </ul>
        </div>
        <SearchLoading v-else/>
    </div>
</template>

<script setup lang="ts">

import SearchLoading from "../../loading/searchLoading.vue";
import { reactive, ref, watchEffect } from "vue";
import { getNewSongs } from "../../../api/expore";
import { play_al } from "../../../api/playing";
import { simBlum } from "../../../type/index";
import { onBeforeRouteLeave } from "vue-router";
import { ElMessage } from "element-plus";
import { image , dealImgError} from "../../../baseconfig";

enum enumArea{
    "全部"="ALL",
    "华语"="ZH",
    "欧美"="EA",
    "韩国"="KR",
    "日本"="JP",
};

enum enumType{
    "全部"='new',
    "热门"='hot',
};
let timer=ref<any>(null);
let area=ref<string>("全部");
let type=ref<string>("全部");

// let param:{area:string,type:string}=reactive({
//     area:"",
//     type:"",
// });

// param.area=enumArea[area.value as keyof typeof enumArea];
// area:enumArea[area.value as keyof typeof enumArea],
//     type:enumType[type.value as keyof typeof enumType],


let endNum=ref<number>(50);
let loading=ref<boolean>(true);
let result:{data:simBlum[]}=reactive({
    data:[],
});

const stop=watchEffect(async ()=>{//要每次参数不同时，要重置endNum 
    endNum.value=50;
    loading.value=true;
    try {
        let {data} = await getNewSongs({
            area:enumArea[area.value as keyof typeof enumArea],
            type:enumType[type.value as keyof typeof enumType],});
        // console.log(data);
        if(data.monthData.length){
            console.log(data.monthData.length);
            let arr:simBlum[]=[];
            for (let i = 0; i < data.monthData.length; i++) {
                arr.push({
                    id:data.monthData[i].id,
                    name:data.monthData[i].name,
                    picUrl:data.monthData[i].picUrl,
                    artist:{
                        id:data.monthData[i].artist.id,
                        name:data.monthData[i].artist.name,
                        alias:data.monthData[i].artist.alias,
                    }
                });
            }
            result.data=arr;
            loading.value=false;
        }else if(data.weekData){
            // console.log(data.weekData.length);
            let arr:simBlum[]=[];
            for (let i = 0; i < data.weekData.length; i++) {
                arr.push({
                    id:data.weekData[i].id,
                    name:data.weekData[i].name,
                    picUrl:data.weekData[i].picUrl,
                    artist:{
                        id:data.weekData[i].artist.id,
                        name:data.weekData[i].artist.name,
                        alias:data.weekData[i].artist.alias,
                    }
                });
            }
            result.data=arr;
            loading.value=false;
        }else{
            result.data=[];
        }   
    } catch (error) {
        ElMessage({
            message: "获取新碟失败",
            type: "error",
        })
    }
});

const controller = new AbortController();//用来取消监听在该组件下的滚动事件
document.addEventListener("scroll",()=>{
    if(timer.value){
        clearTimeout(timer.value);
    }
    timer.value=setTimeout(()=>{
        if(endNum.value<result.data.length){
            let scrollHeight=document.documentElement.scrollHeight;
            let scrollTop=document.documentElement.scrollTop;
            let clientHeight=document.documentElement.clientHeight;
            if(scrollHeight-scrollTop-clientHeight<=100 && scrollTop+clientHeight>=scrollHeight-1){
                endNum.value=(endNum.value+10)>=result.data.length?result.data.length:endNum.value+10;
            }
        }else if(document.documentElement.scrollTop+document.documentElement.clientHeight>=document.documentElement.scrollHeight-1 && !loading.value){
            ElMessage({
                message: "没有更多数据了",
                type: "warning",
                duration: 2000,
            });
        }
    },200);
},{signal:controller.signal});
onBeforeRouteLeave(() => {
    stop(); 
    controller.abort();
})
</script>

<style lang="less" scoped>
@size:3.5rem;
#nm-newablum{
    margin: auto;
    padding-top: 2rem;
    width: 85%;
    .header{
        display: flex;
        justify-content: space-between;
        ul{
            display: flex;
            li{
                margin-right: 1rem;
                span{
                    display: block;
                    padding: .5rem;
                    font-size: 1.4rem;
                    font-weight: 400;
                    color: @modeTextColor;
                    cursor: pointer;
                    &.ischeck{
                        // background-color: #bbbbbb;
                        color: rgb(26, 22, 22) !important;
                        font-weight: bolder !important;
                    }
                }
            }
        }
    }
    .content{
        ul {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-row-gap: 1em;

            li {
                width: 20rem;
                height: 23rem;
                margin: 1rem 1rem 0 0;
                position: relative;

                .img {
                    width: 20rem;
                    height: 20rem;
                    border-radius: 5%;
                    position: relative;

                    &:hover {
                        span {
                            opacity: 1;
                        }
                    }

                    img {
                        width: 100%;
                        height: 100%;
                    }

                    p {
                        text-align: center;
                        position: absolute;
                        top: 70%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: white;
                        font-size: 1.5rem;
                        font-weight: bolder;
                    }

                    i {
                        position: absolute;
                        top: 3%;
                        right: 5%;
                        font-weight: 600;
                        font-size: 1.4rem;
                        color: @buttonColor;
                    }

                    span {
                        cursor: pointer;
                        display: block;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        border-radius: 50%;
                        // background-color: @buttonColor;
                        background-color: #fffffe;
                        backdrop-filter: blur(1rem);
                        width: @size;
                        height: @size;
                        text-align: center;
                        line-height: @size;
                        font-size: 2rem;
                        color: @buttonColor;
                        transition: .2s opacity;
                        opacity: 0;
                    }
                }

                &>p:nth-of-type(1),
                &>p:nth-of-type(2) {
                    box-sizing: border-box;
                    width: 20rem;
                    height: 20px;
                    line-height: 20px;
                    font-family: kaiti;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    letter-spacing: 1px;
                }
                &>p:nth-of-type(1){
                    color: @modePColor;
                    font-size: 1.6rem;
                }
                &>p:nth-of-type(2){
                    a{
                        color: @modeTextColor;
                        font-size: 1.4rem;
                    }
                }
            }
        }
    }
}
</style>