<template>
    <div id="nm-newmusic">
        <div class="header">
            <ul>
                <li><span :class="{ischeck:type=='全部'}" @click="type='全部'">全部</span></li>
                <li><span :class="{ischeck:type=='华语'}" @click="type='华语'">华语</span></li>
                <li><span :class="{ischeck:type=='欧美'}" @click="type='欧美'">欧美</span></li>
                <li><span :class="{ischeck:type=='韩国'}" @click="type='韩国'">韩国</span></li>
                <li><span :class="{ischeck:type=='日本'}" @click="type='日本'">日本</span></li>
            </ul>
                <span class="iconfont icon-shipinbofangshibofang" @click="playAllMusic(getAllId(result))">播放全部</span>
        </div>
        <div class="content" v-show="loading">
            <ul>
                <li v-for="(item,index) in result.slice(0,endNum)" :key="item.id+item.name">
                    <div class="serialNumber">
                        <p>{{ index+1>=10?index+1:`0${index+1}` }}</p>
                    </div>
                    <div class="baseInfo">
                        <div class="img">
                            <img :src="image.Cover" :data-src="`${item.al.picUrl}?param100y=100`" @error="dealImgError" v-lazyImg>
                            <span class="iconfont icon-shipinbofangshibofang" @click="setNewPlayMusic(item.id)"></span>
                        </div>
                        <div class="name">
                            <p>{{ item.name }} <span v-if="item.transName">({{ item.transName }})</span></p>
                            <p :class="['iconfont',formatFee(item.fee)]"></p>
                        </div>
                    </div>
                    <div class="artist">
                        <router-link :to="`/singerpage/${ari.id}/album`" v-for="ari in item.ar" :key="ari.id+ari.name">
                            <p>{{ ari.name }}</p>
                        </router-link>
                    </div>
                    <div class="album">
                        <router-link :to="`/albumpage/${item.al.id}/songs`">
                            <p>{{ item.al.name }}</p>
                        </router-link>
                    </div>
                    <div class="duration">
                        <p>{{ fomatDuration(item.dt/1000) }}</p>
                    </div>
                </li>
            </ul>
        </div>
        <SearchLoading v-if="!loading"/>
    </div>
</template>

<script lang="ts" setup>
import SearchLoading from "../../loading/searchLoading.vue";
import { ref ,watchEffect} from "vue";
import { newSongExpress } from "../../../api/expore";
import{ musicDeatils } from "../../../type/index";
import { ElMessage } from "element-plus";
import { image , dealImgError} from "../../../baseconfig";
import { fomatDuration, formatFee } from "../../../api/format";
import { onBeforeRouteLeave } from "vue-router";
import { setNewPlayMusic ,playAllMusic,getAllId} from "../../../api/playing";

let timer=ref<any>(null);//一个定时器
let loading=ref<boolean>(false);
let type=ref<string>("全部");
let endNum=ref<number>(50);
let result=ref<musicDeatils[]>([]);
enum emnumType{
    "全部"=0,
    "华语"=7,
    "欧美"=96,
    "韩国"=16,
    "日本"=8,
}

let stop=watchEffect(async ()=>{
    endNum.value=50;
    try {
        loading.value=false;
        let {data}= await newSongExpress(emnumType[type.value as keyof typeof emnumType]);
        console.log(data);
        if(data.data){
            let arr:musicDeatils[]=[];
            for (let i = 0; i < data.data.length; i++) {
                arr.push({
                    id:data.data[i].id,
                    name:data.data[i].name,
                    al:{
                        id:data.data[i].album.id,
                        name:data.data[i].album.name,
                        picUrl:data.data[i].album.picUrl,
                    },
                    ar:data.data[i].artists.map((item:any)=>{
                        return {
                            id:item.id,
                            name:item.name
                        }
                    }),
                    fee:data.data[i].fee,
                    dt:data.data[i].duration,
                    transName:data.data[i].transNames?data.data[i].transNames[0]:"",
                });
            }
            result.value=arr;
            loading.value=true;
        }
    } catch (error) {
        ElMessage({
            // message: "获取数据失败",
            message: error as string,
            type: "error",
            duration: 2000,
        })
    }
    
});

const controller = new AbortController();//用来取消监听在该组件下的滚动事件
document.addEventListener("scroll",()=>{
    if(timer.value){
        clearTimeout(timer.value);
    }
    timer.value=setTimeout(()=>{
        if(endNum.value<result.value.length){
            let scrollHeight=document.documentElement.scrollHeight;
            let scrollTop=document.documentElement.scrollTop;
            let clientHeight=document.documentElement.clientHeight;
            if(scrollHeight-scrollTop-clientHeight<=100 && scrollTop+clientHeight>=scrollHeight-1){
                endNum.value=endNum.value+10>result.value.length?result.value.length:endNum.value+10;
            }
        }else if(document.documentElement.scrollTop+document.documentElement.clientHeight>=document.documentElement.scrollHeight-1 && loading.value){
            ElMessage({
                message: "没有更多数据了",
                type: "warning",
                duration: 2000,
            });
        }
    },200);
},{signal:controller.signal})

onBeforeRouteLeave(()=>{
    stop();
    controller.abort();
})

</script>

<style lang="less" scoped>
@import "../../../assets/css/fee.less";
    #nm-newmusic{
        width: 85%;
        margin: auto;
        padding-top: 2rem;
        .header{
            display: flex;
            align-items: center;
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
            &>span{
                cursor: pointer;
                display: block;
                // padding: .5rem;
                width: 10rem;
                height: 3rem;
                line-height: 3rem;
                text-align: center;
                font-size: 1.4rem;
                color: white;
                // padding: 1rem 0rem !important;
                background-color: red;
                border-radius: 1.5rem;
            }
        }

        .content{
            ul{
                li{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding:1rem 0;
                    .serialNumber{
                        width: 5%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        p{
                            font-size: 1.4rem;
                            color: @modeTextColor;
                        }
                    }
                    .baseInfo{
                        width: 40%;
                        display: flex;
                        align-items: center;
                        .img{
                            width: 5rem;
                            height: 5rem;
                            position: relative;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                            span{
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
                                width: 3rem;
                                height:3rem;
                                text-align: center;
                                line-height: 3rem;
                                font-size: 1.4rem;
                                color: @buttonColor;
                            }
                        }
                        .name{
                            padding-left: 2rem;     
                            display: flex;
                            align-self: center;
                            p:nth-of-type(1){
                                max-width: 30rem;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                color: @modePColor;
                                span{
                                    color:  #ccc;
                                }
                            }
                            p:nth-of-type(2){
                                margin-left: .5rem;
                            }
                        }
                    }

                    .artist{
                        width: 20%;
                        display: flex;
                        align-self: center;
                        a{
                            
                            display: flex;
                            align-items: center;
                        }
                        a+a{
                            &::before{
                                content: "/";
                                margin: 0 .5rem;
                            }
                        }
                        p{
                            overflow: hidden;
                            // height: 2rem;
                            // line-height: 2rem;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            font-size: 1.4rem;
                            color: @modeTextColor;
                            cursor: pointer;
                            &:hover{
                                text-decoration: underline;
                            }
                        }
                    }

                    .album{
                        width: 20%;
                        p{
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            font-size: 1.4rem;
                            color: @modeTextColor;
                            cursor: pointer;
                            &:hover{
                                text-decoration: underline;
                            }
                        }
                    }

                    .duration{
                        width: 12rem;
                        text-align: center;
                    }
                }
            }
        }
    }
</style>