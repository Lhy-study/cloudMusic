<template>
    <div id="ex-playlist">
        <router-link to="/explore/fine" v-if="hightTags.includes(plInfo.name)" @click="setCheckHight(plInfo.name)">
            <div class="hight" 
            :style="`background-image: url(${result.hightFirst.coverImgUrl}?param=200y200);`"
            >
                <div class="hight-content">
                    <img :src="`${result.hightFirst.coverImgUrl}?param=200y200`" @error="dealImgError">
                    <div class="info">
                        <p><span ></span ><span class="iconfont icon-vip">精品歌单</span></p>
                        <p>{{ result.hightFirst.name }}</p>
                    </div>
                </div>
            </div>
        </router-link>
        <div class="tag">
            <div class="title">
                <div class="tag-title-some">
                    <div class="checkTag" @click.self="() => { flag = true }">{{ plInfo.name }}<span
                            class="iconfont icon-xiangyou1"></span></div>
                    <ul>
                        <li v-for="i in result.hotTag" :key="i.name" :class="{ ischeck: i.name == plInfo.name }"
                            @click="setInfo(i)">
                            <p>{{ i.name }}</p>
                        </li>
                    </ul>
                </div>
                <div class="tag-title-all" v-if="flag" ref="all">
                    <div class="title-all">
                        <p @click="setInfo({ name: '全部歌单', hot: false, category: 0 })"
                            :class="{ ischeck: '全部歌单' == plInfo.name }">
                            全部歌单</p>
                    </div>
                    <div class="classify">
                        <li v-for="(i, key) of result.catlist.sub" :key="key">
                            <h1><span :class="['iconfont', fromatcat(key as string)]"></span>{{ key }}</h1>
                            <div>
                                <p v-for="item in i" :key="item.name">
                                    <span :class="{ ischeck1: item.name == plInfo.name, ishot: item.hot }"
                                        @click="setInfo(item);(()=>{flag=false})()">
                                        {{ item.name }}
                                    </span>
                                </p>
                            </div>
                        </li>
                    </div>
                </div>
            </div>
            <div class="content" v-if="!loaderFlage">
                <ul>
                    <template v-for="(i) in result.playlist" :key="`${i.name}+${i.id}`">
                        <li>
                            <router-link :to="`/playlistpage/${i.id}/songs`">
                                <img :src="image.Cover" :data-src="`${i.coverImgUrl}?param100y=100`" v-lazyImg @error="dealImgError"/>
                                <p>{{ i.name }}</p>
                                <i class="iconfont icon-18erji-2">&nbsp;{{ formatNum(i.playCount) }}</i>
                            </router-link>
                            <span class="iconfont icon-shipinbofangshibofang" @click.self="play(i.id)"></span>
                        </li>
                    </template>
                </ul>
                <el-pagination layout="prev, pager, next" :total="result.total" background v-model:current-page="pageCount"
                :page-size="page.bigPage" v-if="result.total > page.bigPage" />
            </div>
            <SearchLoading v-else/>
        </div>
    </div>
</template>

<script setup lang="ts">
import SearchLoading from '../loading/searchLoading.vue';
import { onBeforeMount, reactive, ref, watchEffect ,watch} from 'vue';
import { catlist, hotTag, highquality } from "../../api/tag";
import { fromatcat ,formatNum} from "../../api/format";
import { getAllList ,plDetail ,getHighquality} from "../../api/playlist";
import { playAllMusic , getAllId} from "../../api/playing";
import { plTag, category } from "../../type/index"
import { plTagState } from "../../store/tag";
import { page ,image ,dealImgError} from "../../baseconfig";
import { pldetail } from "../../type/index";
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
import { onClickOutside } from '@vueuse/core';
import { onBeforeRouteLeave } from 'vue-router';

let flag=ref(false);
let all = ref<HTMLDivElement|null>(null);
let loaderFlage=ref(true);
let pageCount=ref(1);

onClickOutside(all, () => {
    flag.value = false;
});

const { plInfo, hightTags} = storeToRefs(plTagState());
const { setInfo, setHightTags ,setCheckHight} = plTagState();
let result = reactive({
    catlist: { categories: {} as category ,sub:{} as {[propname:string]:plTag[]} },
    hotTag: [] as plTag[],
    playlist: [] as pldetail[],
    more: true,
    total:0,
    hightFirst: {} as pldetail,
});
onBeforeMount(async () => {
    try {
        let catData = await catlist();
        if (catData.data.categories) {
            result.catlist.categories = catData.data.categories;
        }
        if(catData.data.categories && catData.data.sub){
            let sub:any = {};//存放 标签 分类
            for (let prop in catData.data.categories) {
                // console.log(catData.data.categories[prop]);
                
                let arr: plTag[] = [];
                for (let i = 0; i < catData.data.sub.length; i++) {
                    if (parseInt(prop) == catData.data.sub[i].category) {
                        arr.push({
                            name: catData.data.sub[i].name,
                            category: catData.data.sub[i].category,
                            hot: catData.data.sub[i].hot,
                        });
                    }
                }
                sub[catData.data.categories[prop]] = arr;
            }
            result.catlist.sub = sub;
            // console.log(sub);
        }

        let hotData = await hotTag();
        if (hotData.data.tags) {
            let arr: plTag[] = [];
            for (let i = 0; i < hotData.data.tags.length; i++) {
                arr.push({
                    name: hotData.data.tags[i].name,
                    category: hotData.data.tags[i].category,
                    hot: hotData.data.tags[i].hot,
                    id: hotData.data.tags[i].id
                });
            }
            result.hotTag = arr;
        }

        let highData = await highquality();
        if (highData.data.tags) {
            let arr: string[] = [];
            for (let i = 0; i < highData.data.tags.length; i++) {
                arr.push(highData.data.tags[i].name);
            }
            setHightTags(arr);
        } else {
            setHightTags([]);
        }
    } catch (error) {
        ElMessage({
            type: "error",
            message: "标签获取失败，请重试"
        });
    }
});

async function play(id:number){
//   console.log(id);
  let {data} =await plDetail(id);
  playAllMusic(getAllId(data.playlist.trackIds));
}

const watchCat=watchEffect(()=>{
    if(plInfo.value.name){
        pageCount.value=1;
    }
});

const stop=watchEffect(async ()=>{
    try {
        loaderFlage.value=true;
        let {data} =await getAllList({cat:plInfo.value.name,limit:page.bigPage,offset:pageCount.value});
        // console.log(data);
        result.more=data.more;
        result.total=data.total;
        if(data.playlists){
            let arr:pldetail[] =[];
            for (let i = 0; i < data.playlists.length; i++) {
                arr.push({
                    id:data.playlists[i].id,
                    name:data.playlists[i].name,
                    coverImgUrl:data.playlists[i].coverImgUrl,
                    playCount:data.playlists[i].playCount,
                    trackCount:data.playlists[i].trackCount,
                });
            }
            result.playlist=arr;
            loaderFlage.value=false;
        }
    } catch (error) {
        ElMessage({
            type:"error",
            message:error as string
        })
    }
});


const stopHight=watchEffect(async ()=>{
    if(hightTags.value.includes(plInfo.value.name)){
        try {
            let {data} =await getHighquality({cat:plInfo.value.name,limit:1});
            // console.log(data);
            if(data.playlists){
                result.hightFirst={
                    id:data.playlists[0].id,
                    name:data.playlists[0].name,
                    coverImgUrl:data.playlists[0].coverImgUrl,
                    playCount:data.playlists[0].playCount,
                    trackCount:data.playlists[0].trackCount,
                }
            }   
        } catch (error) {
            ElMessage({
                type:"error",
                message:"网络错误请重试"
            });
        }
    }
});

onBeforeRouteLeave(()=>{
    stop();
    stopHight();
    watchCat();
})
</script>


<style lang="less">
@import "../../assets/css/active.less";
</style>

<style lang="less" scoped>

@size:3.5rem;
.ishot {
    &::after {
        content: "hot";
        position: absolute;
        left: 100%;
        bottom: 35%;
        color: red;
        font-size: 1rem;
        font-family: kaiti;
    }
}

.ischeck {
    color: red;
    p{
        color: red !important;
    }
    background-color: #fef5f5;
}
.ischeck1 {
    color: red;
}

#ex-playlist {
    padding-top: 2rem;
    width: 85%;
    margin: auto;
    &>a{
        border-radius: 5%;
    }
    .hight {
        width: 100%;
        height: 17rem;
        // background-color: aqua;
        // background-image: url("https://p2.music.126.net/qA0W0aER7LxB99iTOMQZcA==/109951166153828602.jpg?param200y=200");
        background-repeat: no-repeat;
        background-size: 100%;
        // border-radius: 5%;
        background-position: center;
        .hight-content {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(5rem);

            img {
                width: 15rem;
                height: 15rem;
                margin-left: 1rem;
                border: 1px solid @startColor;
            }
            .info{
                margin-left: 4rem;
                p:nth-of-type(1){
                    width: 100px;
                    height: 30px;
                    line-height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 5px;
                    border: 2px solid @textColor;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    span{
                        // text-align: center;
                        margin-right: 5px;
                        font-size: 15px;
                        font-weight: bolder;
                        color: @textColor;
                    }
                }
                p:nth-of-type(2){
                    font-size: 20px;
                    // font-weight: bolder;
                    color: white;
                }
            }

            @media screen and(max-width :1200px){
                .info{
                    transform: scale(.6);
                }
            }
        }
    }

    .tag {
        width: 100%;

        // background-color: aqua;
        .title {
            position: relative;

            .tag-title-some {
                width: 100%;
                height: 5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .checkTag {
                    width: 10rem;
                    align-items: center;
                    display: flex;
                    justify-content: center;
                    height: 3rem;
                    line-height: 3rem;
                    text-align: center;
                    border-radius: 1.5rem;
                    border: 2px solid @modeTextColor;
                    padding: 0 .5rem;
                    font-size: 1.5rem;
                    cursor: pointer;

                    &:hover {
                        opacity: 0.7;
                    }
                }

                ul {
                    display: flex;

                    li {
                        height: 2rem;
                        line-height: 2rem;
                        text-align: center;
                        border-radius: 1rem;
                        padding: 0 1rem;
                        font-size: 1.3rem;
                        cursor: pointer;
                        p{
                            color: @modePColor;
                        }
                    }
                }
            }

            .tag-title-all {
                position: absolute;
                z-index: 1;
                top: 100%;
                background-color: @modeBgColor;
                border-radius: 1%;
                border: 1px solid @modeTextColor;

                .title-all {
                    width: 100%;
                    height: 5rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-bottom: 1px solid @modeTextColor;

                    p {
                        height: 2rem;
                        line-height: 2rem;
                        font-size: 1.5rem;
                        cursor: pointer;
                    }
                }

                .classify {
                    // m
                    padding-top: 1rem;

                    li {
                        display: flex;
                        align-items: flex-start;
                        margin-bottom: 3rem;
                        margin-left: 1rem;

                        h1 {
                            height: 2rem;
                            line-height: 2rem;
                            display: flex;
                            align-items: center;
                            font-size: 1.5rem;
                            font-weight: lighter;
                            margin-right: 4rem;
                            color: @modeTextColor;
                            span {
                                font-size: 3rem;
                                margin-right: .5rem;
                                color: @modePColor;
                            }
                        }

                        div {
                            width: 65rem;
                            display: grid;
                            grid-template-columns: repeat(6, 1fr);
                            grid-row-gap: 1.5em;

                            p {
                                cursor: pointer;
                                width: 10rem;
                                height: 2rem;
                                line-height: 2rem;
                                font-size: 1.5rem;

                                span {
                                    position: relative;
                                }
                            }
                        }
                    }

                }
            }
        }

        .content {
            ul {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                grid-row-gap: 1em;

                li {
                    width: 20rem;
                    height: 23rem;
                    margin: 1rem 1rem 0 0;
                    position: relative;

                    &:hover {
                        span {
                            top: calc(75% - @size);
                            opacity: 1;
                        }
                    }

                    img {
                        width: 20rem;
                        height: 20rem;
                        border-radius: 5%;
                        border: 1px solid @startColor;
                    }

                    p {
                        box-sizing: border-box;
                        width: 20rem;
                        height: 20px;
                        line-height: 20px;
                        font-size: 1.6rem;
                        font-family: kaiti;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        letter-spacing: 1px;
                        color: @modeTextColor;
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
                        top: 80%;
                        right: 10%;
                        border-radius: 50%;
                        background-color: @buttonColor;
                        width: @size;
                        height: @size;
                        text-align: center;
                        line-height: @size;
                        font-size: 2rem;
                        color: whitesmoke;
                        transition: .2s;
                        opacity: 0;

                        &:hover {
                            top: calc(75% - @size);
                            opacity: .95;
                        }
                    }
                }
            }
        }
    }
}
</style>