<template>
    <!-- <div class="re-playlist" v-if="!loaderFlage">
        <h1><router-link to="/explore/playlistAll/华语">推荐歌单</router-link></h1>
    </div> -->
    <div id="re-playlist" v-if="!loaderFlage">
        <h1><router-link to="/explore/playlistAll">推荐歌单<span class="iconfont icon-xiangyou1"></span></router-link></h1>
        <ul>
                <template v-for="(i) in result.playlist" :key="`${i.name}+${i.id}`">
                    <li>
                        <router-link :to="`/playlistpage/${i.id}/songs`">
                            <img :src="image.Cover" :data-src="`${i.coverImgUrl}?param200y=200`" @error="dealImgError" v-lazyImg />
                            <p>{{ i.name }}</p>
                            <p>{{ i.trackCount }}首</p>
                            <i class="iconfont icon-18erji-2">&nbsp;{{ formatNum(i.playCount) }}</i>
                        </router-link>
                        <span class="iconfont icon-shipinbofangshibofang" @click.self="play(i.id)"></span>
                    </li>
                </template>
        </ul>
    </div>
    <SkeletonVue v-else />
</template>
  
<script lang="ts" setup>
import SkeletonVue from "../skeleton/skeleton.vue";
import { ref, reactive ,onBeforeMount} from "vue";
import { plDetail} from "../../api/playlist";
import { formatNum} from "../../utils/format";
import {playAllMusic,getAllId} from "../../api/playing";
import { personalized } from "../../api/expore";
import { pldetail } from "../../type/index";
import { ElMessage } from "element-plus";
import { image , dealImgError} from "../../baseconfig";

let result = reactive({
    playlist: [] as pldetail[],
});

let loaderFlage = ref(true);

async function play(id:number){
//   console.log(id);
  let {data} =await plDetail(id);
  playAllMusic(getAllId(data.playlist.trackIds));
}

onBeforeMount(async () => {
    try {
        let {data} = await personalized(10);
        if(data.result){
            let arr:pldetail[] =[];
            for (let i = 0; i < data.result.length; i++) {
                arr.push({
                    id:data.result[i].id,
                    name:data.result[i].name,
                    coverImgUrl:data.result[i].picUrl,
                    playCount:data.result[i].playCount,
                    trackCount:data.result[i].trackCount,
                });
            }
            result.playlist=arr;
            loaderFlage.value=false;
        }
        
    } catch (error) {
        ElMessage({
            type:"error",
            message:"推荐歌单获取失败，请重试"
        });
    }
    
});
</script>
  
<style lang="less" scoped>
@size:3.5rem;
#re-playlist{
    margin: auto;
    margin-bottom: 3rem;
    width: 85%;
    h1{
        font-size: 20px;
        font-weight: 700;
        margin: 20px 0;
        a{
            color: @modeTextColor;
        }
    }
    ul{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-row-gap: 1em;
        li{
            width: 20rem;
            height: 23rem;
            margin: 1rem 1rem 0 0;
            position: relative;
            &:hover{
                span{
                    top: calc(75% - @size);
                    opacity: 1;
                }
            }
            img{
                width: 20rem;
                height: 20rem;
                border-radius: 5%;
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
                color:@modeTextColor;
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
                display: block;
                position: absolute;
                top: 90%;
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
</style>