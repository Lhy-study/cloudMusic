<template>
<div id="ex-toplist">
    <div class="official">
        <h1>官方榜</h1>
        <ul>
            <li v-for="item in result.officalList" :key="`${item.playlist.name}+${item.playlist.id}`" >
                <router-link :to="`/playlistpage/${item.playlist.id}/songs`">
                    <img :src="image.Cover" :data-src="`${item.playlist.coverImgUrl}?param130y=130`" @error="dealImgError" v-lazyImg>
                    <p>{{ formatDate(item.playlist.updateTime!) }}更新</p>
                </router-link>
                <div class="content">
                    <ul class="songs">
                        <li v-for="(i, index) in item.songs" :key="`${i.name}+${i.id}`" :class="{ check: index % 2 == 0 }"
                        @dblclick="setNewPlayMusic(i.id)">
                        <div>
                            <span :class="{isThree:index<=2}">{{ index+1 }}</span>
                            <span v-if="i.ratio">{{ i.ratio }}%</span>
                            <p>{{ i.name }}</p>
                        </div>
                        <div>
                            <router-link :to="`/singerpage/${ari.id}/album`" v-for="ari in i.ar" :key="ari.id+ari.name">
                                <span>{{ ari.name }}</span>
                            </router-link>
                        </div>
                            
                        </li>
                        <router-link :to="`/playlistpage/${item.playlist.id}/songs`"><p>查看更多></p></router-link>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
    <div class="globe" v-if="loading">
        <h1>全球榜</h1>
        <ul>
            <template v-for="(i) in result.globeList.slice(0,end)" :key="`${i.name}+${i.id}`">
                <li>
                    <div class="img">
                        <router-link :to="`/playlistpage/${i.id}/songs`">
                            <img :src="image.Cover" :data-src="`${i.coverImgUrl}?param200y=200`" @error="dealImgError" v-lazyImg />
                        </router-link>
                        <p>{{ formatDate(i.updateTime!) }}更新</p>
                        <span class="iconfont icon-shipinbofangshibofang" @click.self="play(i.id)"></span>
                        <i class="iconfont icon-18erji-2">&nbsp;{{ formatNum(i.playCount) }}</i>
                    </div>
                    <p>{{ i.name }}</p>
                </li>
            </template>
        </ul>
    </div>

    <SearchLoading v-else/>
</div>
</template>

<script setup lang="ts">
import SearchLoading from "../loading/searchLoading.vue";
import { onBeforeMount, onBeforeUnmount, reactive ,ref} from "vue";
import { gettoplist } from "../../api/expore";
import { formatNum ,formatDate} from "../../api/format";
import { ElMessage } from "element-plus";
import { pldetail ,simmusic} from "../../type/index";
import { image , dealImgError} from "../../baseconfig";
import { play ,setNewPlayMusic} from "../../api/playing";
import { plDetail } from "../../api/playlist";
import { getDeatils } from "../../api/music";

let loading=ref(false);
let timer=ref<any>(null);//是一个定时器
let end=ref(10);
let result=reactive({
    officalList:[] as {playlist:pldetail,songs:simmusic[]}[],
    globeList:[] as pldetail[],
    
});
let one=onBeforeMount(async ()=>{
    try {
        let {data} = await gettoplist();
        // console.log(data);
        if(data.list){
            let arr1:Array<pldetail> = [];
            let arr2:Array<pldetail> = [];
            for (let i = 0; i < data.list.length; i++) {
                if(data.list[i].ToplistType){ //官方榜
                    arr1.push({
                    updateTime:data.list[i].updateTime,
                    id:data.list[i].id,
                    name:data.list[i].name,
                    coverImgUrl:data.list[i].coverImgUrl,
                    playCount:data.list[i].playCount,
                    trackCount:data.list[i].trackCount,
                    });
                }else{ //全球榜
                    arr2.push({
                    updateTime:data.list[i].updateTime,
                    id:data.list[i].id,
                    name:data.list[i].name,
                    coverImgUrl:data.list[i].coverImgUrl,
                    playCount:data.list[i].playCount,
                    trackCount:data.list[i].trackCount,
                    });   
                }
            }
            result.globeList=arr2;
            arr1.forEach((item:any)=>{
                result.officalList.push({
                    playlist:item,
                    songs:[]
                });
            });
        }

        if (result.officalList.length) {//获取官方榜的歌曲 以及起前五个歌曲
            // console.log(result.officalList);
            
            for (let i = 0; i < result.officalList.length; i++) {
                let pldata = await plDetail(result.officalList[i].playlist.id);
                // console.log(pldata.data);
                
                let songIds: number[] = [];
                let ratioS:number[]=[];
                for (let index = 0; index < pldata.data.playlist.trackIds.slice(0,5).length; index++) {
                    // console.log(pldata.data.playlist.trackIds.slice(0,5));
                    
                    ratioS.push(pldata.data.playlist.trackIds.slice(0.5)[index].ratio); //在这里获取到每个歌曲的飙升两
                    songIds.push(pldata.data.playlist.trackIds.slice(0,5)[index].id);
                }
                // console.log(songIds);
                
                let musicData = await getDeatils(songIds);
                // console.log(musicData);
                
                if (musicData.data.songs) {
                    let arr: Array<simmusic> = [];
                    for (let i = 0; i < musicData.data.songs.length; i++) {
                        arr.push({
                            id: musicData.data.songs[i].id,
                            name: musicData.data.songs[i].name,
                            ar: musicData.data.songs[i].ar,
                            ratio:ratioS[i],
                        });
                    }
                    // console.log(arr);
                    
                    arr.forEach((item: simmusic) => {
                        result.officalList[i].songs.push(item);
                    });
                    loading.value=true;
                }
            }
        }
    } catch (error) {
        ElMessage({
            type:"error",
            // message:"获取排行榜失败，请重试"
            message:error as string
        })
    }
});

const controller =new AbortController();
document.addEventListener("scroll", () => {
    if (timer.value) {
        clearTimeout(timer.value);
    }
    timer.value = setTimeout(() => {
        if (end.value < result.globeList.length) {
            let scrollTop = document.documentElement.scrollTop;
            let clientHeight = document.documentElement.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            if (scrollTop + clientHeight >= scrollHeight - 100 && scrollTop + clientHeight >= scrollHeight-1) {
                // console.log("到底了");
                end.value = (end.value + 10) >= result.globeList.length ? result.globeList.length : end.value+10;
            }
        }else if(document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight-1 && loading.value){
            ElMessage({
                type:"warning",
                message:"已经到底了"
            })
        }
    }, 300);
},{signal:controller.signal});

onBeforeUnmount(()=>{
    controller.abort();
});
</script>

<style lang="less" scoped>
@size: 4rem;
.check{
    background-color: #f5f5f5;
}
.isThree{
    color: red;
}
#ex-toplist {
    width: 85%;
    margin: auto;

    .official {
        h1 {
            font-size: 2.4rem;
            color: @modePColor;
            padding-bottom: 1rem;
        }

        li {
            display: flex;
            padding-bottom: 5rem;

            &>a {
                // display: block;
                position: relative;
                img {
                    box-sizing: border-box;
                    width: 15rem;
                    height: 15rem;
                    border-radius: 5%;
                    border: 1px solid @modePColor;
                }

                p {
                    text-align: center;
                    position: absolute;
                    top: 20%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 1.5rem;
                    font-weight: bolder;
                }
            }

            .content {
                flex: 1;
                margin-left: 7rem;

                .songs {
                    &>a{
                        display: block;
                        box-sizing: border-box;
                        padding-top: 1rem;
                        padding-left: 1.5rem;
                        p{
                            font-size: 1.4rem;
                            color: @modeTextColor;
                        }
                    }
                    li {
                        border-radius: 1rem;
                        padding: .5rem 1rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        color: @modePColor;
                        text-align: left;
                        &:hover {
                            background-color: #cccccc;
                        }
                        div:nth-of-type(1){
                            display: flex;
                            align-items: center;
                            span:nth-of-type(1){
                                font-size: 1.5rem;
                            }
                            span:nth-of-type(2){
                                color: #766a6a;
                            }
                            span{
                                padding: 0 .5rem;
                            }
                        }
                        div:nth-of-type(2){
                            text-align: right;
                            width: 35rem;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            span{
                                color: @modeTextColor;
                            }
                            a:hover{
                                text-decoration: underline;
                            }
                            a+a::before{
                                content: "/";
                                margin: 0 .3rem;
                            }
                        }
                    }
                }
            }
        }
    }

    .globe {
        // width: 85%;
        // margin: auto;

        h1 {
            font-size: 2.5rem;
            font-weight: 600;
            color: @modeTextColor;
            margin: 2rem 0;
        }

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
                    font-size: 1.6rem;
                    font-family: kaiti;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    letter-spacing: 1px;
                    color: @modeTextColor;
                }
            }
        }
    }
}</style>