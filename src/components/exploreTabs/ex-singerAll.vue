<template>
    <div id="ex-singerAll">
        <div class="list">
            <div class="type">
                <h2>语种</h2>
                <div>
                    <span @click="()=>{ singerInfo.area=-1 }" :class="{ischeck:singerInfo.area==-1}">全部</span>
                    <span @click="()=>{ singerInfo.area=7 }" :class="{ischeck:singerInfo.area==7}">华语</span>
                    <span @click="()=>{ singerInfo.area=96 }" :class="{ischeck:singerInfo.area==96}">欧美</span>
                    <span @click="()=>{ singerInfo.area=8 }" :class="{ischeck:singerInfo.area==8}">日本</span>
                    <span @click="()=>{ singerInfo.area=16 }" :class="{ischeck:singerInfo.area==16}">韩国</span>
                    <span @click="()=>{ singerInfo.area=0 }" :class="{ischeck:singerInfo.area==0}">其他</span>
                </div>
            </div>
            <div class="area">
                <h2>分类</h2>
                <div>
                    <span @click="()=>{ singerInfo.type =-1}" :class="{ischeck:singerInfo.type==-1}">全部</span>
                    <span @click="()=>{ singerInfo.type =1}" :class="{ischeck:singerInfo.type==1}">男歌手</span>
                    <span @click="()=>{ singerInfo.type =2}" :class="{ischeck:singerInfo.type==2}">女歌手</span>
                    <span @click="()=>{ singerInfo.type =3}" :class="{ischeck:singerInfo.type==3}">乐队组合</span>
                </div>
            </div>
            <div class="initial">
                <h2>筛选</h2>
                <div>
                    <span @click="()=>{ singerInfo.initial='-1' }" :class="{ischeck:singerInfo.initial=='-1'}">热门</span>
                    <span @click="()=>{ singerInfo.initial='A' }" :class="{ischeck:singerInfo.initial=='A'}">A</span>
                    <span @click="()=>{ singerInfo.initial='B' }" :class="{ischeck:singerInfo.initial=='B'}">B</span>
                    <span @click="()=>{ singerInfo.initial='C' }" :class="{ischeck:singerInfo.initial=='C'}">C</span>
                    <span @click="()=>{ singerInfo.initial='D' }" :class="{ischeck:singerInfo.initial=='D'}">D</span>
                    <span @click="()=>{ singerInfo.initial='E' }" :class="{ischeck:singerInfo.initial=='E'}">E</span>
                    <span @click="()=>{ singerInfo.initial='F' }" :class="{ischeck:singerInfo.initial=='F'}">F</span>
                    <span @click="()=>{ singerInfo.initial='G' }" :class="{ischeck:singerInfo.initial=='G'}">G</span>
                    <span @click="()=>{ singerInfo.initial='H' }" :class="{ischeck:singerInfo.initial=='H'}">H</span>
                    <span @click="()=>{ singerInfo.initial='I' }" :class="{ischeck:singerInfo.initial=='I'}">I</span>
                    <span @click="()=>{ singerInfo.initial='J' }" :class="{ischeck:singerInfo.initial=='J'}">J</span>
                    <span @click="()=>{ singerInfo.initial='K' }" :class="{ischeck:singerInfo.initial=='K'}">K</span>
                    <span @click="()=>{ singerInfo.initial='L' }" :class="{ischeck:singerInfo.initial=='L'}">L</span>
                    <span @click="()=>{ singerInfo.initial='M' }" :class="{ischeck:singerInfo.initial=='M'}">M</span>
                    <span @click="()=>{ singerInfo.initial='N' }" :class="{ischeck:singerInfo.initial=='N'}">N</span>
                    <span @click="()=>{ singerInfo.initial='O' }" :class="{ischeck:singerInfo.initial=='O'}">O</span>
                    <span @click="()=>{ singerInfo.initial='P' }" :class="{ischeck:singerInfo.initial=='P'}">P</span>
                    <span @click="()=>{ singerInfo.initial='Q' }" :class="{ischeck:singerInfo.initial=='Q'}">Q</span>
                    <span @click="()=>{ singerInfo.initial='R' }" :class="{ischeck:singerInfo.initial=='R'}">R</span>
                    <span @click="()=>{ singerInfo.initial='S' }" :class="{ischeck:singerInfo.initial=='S'}">S</span>
                    <span @click="()=>{ singerInfo.initial='T' }" :class="{ischeck:singerInfo.initial=='T'}">T</span>
                    <span @click="()=>{ singerInfo.initial='U' }" :class="{ischeck:singerInfo.initial=='U'}">U</span>
                    <span @click="()=>{ singerInfo.initial='V' }" :class="{ischeck:singerInfo.initial=='V'}">V</span>
                    <span @click="()=>{ singerInfo.initial='W' }" :class="{ischeck:singerInfo.initial=='W'}">W</span>
                    <span @click="()=>{ singerInfo.initial='X' }" :class="{ischeck:singerInfo.initial=='X'}">X</span>
                    <span @click="()=>{ singerInfo.initial='Y' }" :class="{ischeck:singerInfo.initial=='Y'}">Y</span>
                    <span @click="()=>{ singerInfo.initial='Z' }" :class="{ischeck:singerInfo.initial=='Z'}">Z</span>
                    <span @click="()=>{ singerInfo.initial='0' }" :class="{ischeck:singerInfo.initial=='0'}">#</span>
                </div>
            </div>
        </div>
        <div class="content" v-if="loading">
            <ul>
                <li v-for="i in result.artistList" :key="i.id+i.name">
                    <div class="img">
                        <router-link :to="`/singerpage/${i.id}/album`">
                            <img :src="image.userImg" :data-src="`${i.picUrl!}?param150y=150`" @error="dealImgError" v-lazyImg>
                        </router-link>
                    </div>
                    <div class="user">
                        <router-link :to="`/singerpage/${i.id}/album`">
                            <p>{{i.name}}</p>
                        </router-link>
                        <router-link :to="`/clientHome/${i.accountId}`" v-if="i.accountId">
                            <span class="iconfont icon-1USER"></span>
                        </router-link>
                    </div>
                </li>
            </ul>
        </div>
        <SearchLoading v-if="!loading"></SearchLoading>
    </div>
    
</template>

<script setup lang="ts">
import { reactive, ref ,watch} from 'vue';
import {getArtist} from "../../api/expore";
import {onBeforeRouteLeave} from "vue-router";
import { artist } from "../../type/index";
import { ElMessage } from 'element-plus';
import {page,image , dealImgError} from "../../baseconfig";
import SearchLoading from '../loading/searchLoading.vue';


type SingerInfo={
    limit:number,
    offset:number,
    type: -1 | 1 | 2 | 3,
    area:-1 | 7 | 96 | 8 | 16 | 0 ,
    initial:string|"-1"|"0"
}
let singerInfo=reactive<SingerInfo>({//第一次进入该路由时，会发送请求，所以要设置初始值
    limit:page.smallPage,
    offset:0,
    type:1,
    area:-1,
    initial:"A"
});
let timer=ref<any>(null);//是一个定时器
let loading=ref<boolean>(false);
let result:{artistList:Array<artist>,more:true}=reactive({
    artistList:[] ,
    more:true
})
//watch监听一个对象或者数组时，监听的是对象或者数组的地址，而不是对象或者数组的内容
//新值和旧值都是同一个地址，所以无法监听到对象或者数组的变化
let stop = watch(() => { return { ...singerInfo } }, async (newVal, oldVal) => {
    // let tim1=Date.now();
    // console.log(newVal, oldVal);
    if (!oldVal) {//因为第一次oldVal值为undefined，所以要判断一下
        loading.value = false;
        // console.log("第一次");
    } else {
        if (newVal.initial != oldVal!.initial || newVal.area != oldVal!.area || newVal.type != oldVal!.type) {//证明改变的（不）是偏移量
            //每次改变 歌手的筛选选项都要重新初始化
            singerInfo.limit=page.smallPage;
            singerInfo.offset=0;
            loading.value = false;
            // console.log("第二次");
        } 
    }
    try {
        let { data } = await getArtist(singerInfo);
        // console.log(data);
        data.more = true;
        if (data.artists) {
            let arr: Array<artist> = [];
            for (let i = 0; i < data.artists.length; i++) {
                arr.push({
                    id: data.artists[i].id,
                    name: data.artists[i].name,
                    picUrl: data.artists[i].picUrl,
                    accountId: data.artists[i].accountId,
                });
            }
            if (!oldVal) {//因为第一次oldVal值为undefined，所以要判断一下
                // loading.value=false;
                result.artistList.push(...arr);
                loading.value = true;
                return
            }
            if (newVal.initial == oldVal!.initial && newVal.area == oldVal!.area && newVal.type == oldVal!.type) {//证明改变的是偏移量
                result.artistList.push(...arr);
            } else {
                // loading.value=false;
                result.artistList = arr;
                loading.value = true;
            }
        }
        // console.log(Date.now()-tim1);
        
    } catch (error) {
        ElMessage({
            // message: "获取歌手数据失败，请重试",
            message: error as string,
            type: "error"
        });
    }
}, { deep: true, immediate: true, flush: "pre" });


const  controller =new AbortController();
document.addEventListener("scroll", () => {
    if (timer.value) {
        clearTimeout(timer.value);
    }
    timer.value = setTimeout(() => {
        if (result.more) {
            let scrollTop = document.documentElement.scrollTop;
            let clientHeight = document.documentElement.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            if (scrollTop + clientHeight >= scrollHeight - 100 && scrollTop + clientHeight >= scrollHeight-1) {
                // console.log("到底了");
                singerInfo.limit= 20;
                singerInfo.offset += 20;
            }
        }else if(document.documentElement.scrollTop+document.documentElement.clientHeight>=document.documentElement.scrollHeight-1 && loading.value){
            ElMessage({
                message: "没有更多数据了",
                type: "warning"
            })
        }
    }, 300);
},{signal:controller.signal});


onBeforeRouteLeave(()=>{
    stop();
    controller.abort();
});
</script>

<style lang="less" scoped>
.ischeck{
    color: red;
    background-color: #fef5f5;
}
#ex-singerAll{
    width: 85%;
    margin: auto;
    margin-top: 1rem;
    .list{
        &>div{
            margin-bottom: 1rem;
            display: flex;
            h2{
                height: 2rem;
                line-height: 2rem;
                font-size: 1.4rem;
                color: @modeTextColor;
            }
            div{
                padding-left: 2rem;
                width: 70rem;
                display: flex;
                flex-wrap: wrap;
                // display: grid;
                // grid-template-columns: repeat(6,1fr);
                // padding-left: 2rem;
                span{
                    text-align: center;
                    cursor: pointer;
                    display: block;
                    height: 2rem;
                    line-height: 2rem;
                    font-size: 1.4rem;
                    padding:0 1rem;
                    margin-right: 1rem;
                    margin-bottom: 1rem;
                    border-radius: 1rem;
                    // background-color: aqua;
                }
            }
        }

        .initial{
            div{
                display: grid;
                grid-template-columns: repeat(10,1fr);

            }
        }
    }
    .content{
        margin-top: 1rem;
        ul{
            display: grid;
            grid-template-columns: repeat(5,1fr);
            grid-gap: 2rem;
            li{
                .img{
                    width: 17rem;
                    height: 17rem;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 1rem;
                    }
                }

                .user{
                    padding:.5rem 0;
                    width: 17rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    a:nth-of-type(1){
                        p{
                            font-size: 1.4rem;
                            color: @modeTextColor;
                            cursor: pointer;
                        }
                    }
                    a:nth-of-type(2){
                        span{
                            font-size: 1.4rem;
                            color: @modeTextColor;
                            cursor: pointer;
                        }
                    }
                }
            }
            
        }
    }
}
</style>