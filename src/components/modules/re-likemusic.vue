<template>
    <div id="ex-likemusic" v-if="!loaderFlage">
        <h1><router-link to="/">最新音乐<span class="iconfont icon-xiangyou1"></span></router-link></h1>
        <ul class="newsong">
            <li v-for="i in result.musicS" :key="`${i.id}+${i.name}`">
                <div class="imgae">
                    <span class="iconfont icon-shipinbofangshibofang" @click.stop="setNewPlayMusic(i.id)"></span>
                    <img :src="image.Cover" alt="" :data-src="`${i.al.picUrl}?param80y=80`" @error="dealImgError" v-lazyImg>
                </div>
                <div class="info">
                    <p>{{i.name}}<span v-if="i.transName">({{ i.transName }})</span></p>
                    <p>
                        <i :class="[{ iconfont: true }, `${formatFee(i.fee)}`]"></i>
                        <span v-for="ari in i.ar" :key="`${ari.id}`+`${ari.name}`">
                            <router-link :to="`/singerpage/${ari.id}/album`">{{ ari.name}}</router-link>
                        </span>
                    </p>
                </div>
            </li>
        </ul>
    </div>
    <SkeletonVue v-else />
</template>

<script setup lang="ts">
import SkeletonVue from "../skeleton/skeleton.vue";
import { ref, reactive ,onBeforeMount} from "vue";
import { formatFee} from "../../api/format";
import { setNewPlayMusic } from "../../api/playing";
import { personalizedNewsong } from "../../api/expore";
import { musicDeatils } from "../../type/index";
import { ElMessage } from "element-plus";
import {image , dealImgError} from "../../baseconfig";

let loaderFlage = ref(true);
let result = reactive({
    musicS: [] as musicDeatils[],
});
onBeforeMount(async ()=>{
    try {
        let {data}= await personalizedNewsong(12);
        if(data.result ){
            let arr:musicDeatils[] = [];
            for (let i = 0; i < data.result.length; i++) {
                arr.push({
                    id:data.result[i].song.id,
                    name:data.result[i].song.name,
                    ar:data.result[i].song.artists,
                    fee:data.result[i].song.fee,
                    dt:data.result[i].song.duration,
                    al:{
                        id:data.result[i].song.album.id,
                        name:data.result[i].song.album.name,
                        picUrl:data.result[i].song.album.picUrl,
                    },
                    transName:data.result[i].song.transName,
                });
            }
            result.musicS=arr;
            loaderFlage.value=false;
        }
    } catch (error) {
        ElMessage({
            type:"error",
            message:"新音乐获取失败，请重试"
        });
    }
})
</script>

<style lang="less" scoped>
@import "../../assets/css/fee.less";
#ex-likemusic{
    margin-bottom: 1rem;
    width: 85%;
    margin: auto;
    padding: 0 1rem;
    h1{
        // font-size: 1.5rem;
        font-weight: 700;
        margin: 1rem 0;
        a{
            color: @modeTextColor;
        }
    }
    ul.newsong{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li{
            width: 32%;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            border-radius: 5%;
            &:hover{
                background-color: #ebebeb;
            }
            .imgae{
                position: relative;
                width: 7rem !important;
                height: 7rem !important;
                margin-right: 1rem;
                cursor: pointer;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 5%;
                }
                span{
                    transform: translate(-50%,-50%);
                    top: 50%;
                    left: 50%;
                    width: 4rem;
                    height: 4rem;
                    background-color: white;
                    line-height: 4rem;
                    text-align: center;
                    font-size: 2rem;
                    position: absolute;
                    border-radius: 50%;
                    color: @textColor;
                }
            }
            div.info{
                flex: 1;
                p:nth-of-type(1){
                    font-size: 1rem;
                    font-weight: 700;
                    margin-bottom: .5rem;
                    span{
                        font-size: .8rem;
                        font-weight: 400;
                        color: #999;
                    }
                }
                p:nth-of-type(2){
                    display: flex;
                    align-items: center;
                   span:nth-of-type(2n){
                       &::before{
                        content: "/";
                        margin: 0 .5rem;
                       }
                   }
                   span{
                    a{
                        color:@modePColor;
                        cursor: pointer;
                    }
                   }
                }
            }
        }
    }
}
</style>