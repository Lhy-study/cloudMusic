<template>
    <div id="singerView">
        <div class="baseInfo">
            <img :src="result.artist.cover ? result.artist.cover+`?param=130y130` : image.userImg" alt="" @error="dealImgError">
            <div class="text">
                <h1>{{ result.artist.name }}</h1>
                <p>{{result.artist.alias ? JSON.stringify(result.artist.alias).replace("[", "").replace("]", "").replaceAll('"', " "):"" }}</p>
                <div style="display: flex;">
                    <p>单曲数:{{ result.artist.musicSize }}</p>
                    <p>专辑数:{{ result.artist.albumSize }}</p>
                    <p>MV数:{{ result.artist.mvSize }}</p>
                    <p></p>
                </div>
            </div>
        </div>
        <ul class="tab">
            <li><router-link :to="`/singerpage/${encodeURIComponent(route.params.id as string)}/album`"><span
                        :class="{ ischeck: `/singerpage/${encodeURIComponent(route.params.id as string)}/album` == route.path }">专辑</span></router-link>
            </li>
            <li><router-link :to="`/singerpage/${encodeURIComponent(route.params.id as string)}/info`"><span
                        :class="{ ischeck: `/singerpage/${encodeURIComponent(route.params.id as string)}/info` == route.path }">歌手详情</span></router-link>
            </li>
            <li><router-link :to="`/singerpage/${encodeURIComponent(route.params.id as string)}/similar`"><span
                        :class="{ ischeck: `/singerpage/${encodeURIComponent(route.params.id as string)}/similar` == route.path }">相似歌手</span></router-link>
            </li>
        </ul>
        <!-- <el-button @click="()=>a.b.num++">dianji</el-button> -->
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
import { watchEffect, reactive, provide } from "vue";
import { useRoute ,onBeforeRouteLeave} from "vue-router";
import { baseInfo } from "../api/singer";
import { ElMessage } from "element-plus"
import { image ,dealImgError} from "../baseconfig";

// let b=ref(0);provide("b",b);
let result = reactive({
    artist: {} as any
});
// let a=reactive({
//     b:{
//         num:0
//     }
// });
const route = useRoute();
// watch(()=>route.params.id,(val,oldval)=>{
//     console.log(val);
// });
// let num=provide('num',toRefs(a.b).num);
provide('route',route);
const stop = watchEffect(async () => {
    try {
        if (route.params.id) {
            let { data } = await baseInfo(parseInt(route.params.id as string));
            // console.log(route.params);

            // console.log(data);

            if (data.data.artist) {
                // console.log(data.data);
                result.artist = data.data.artist;
            }
        }
    } catch (error) {
        ElMessage({
            type: "error",
            message: error as string + 'singerView',
            duration: 2000
        })
    }
});
onBeforeRouteLeave(()=>{
    stop();
})
// TypeError: Cannot read properties of undefined (reading 'artist')singerView
</script>

<style scoped lang="less">
.ischeck {
    border-bottom: 3px solid red;
}


#singerView {
    .tab {
        display: flex;

        li {
            span {
                margin-right: 3rem;
                display: block;
                padding: 10px 0 0 0px;
                height: 30px;
                font-size: 1.5rem;
                line-height: 30px;
                color: @modeTextColor;
            }
        }
    }

    .baseInfo {
        box-sizing: border-box;
        display: flex;

        img {
            width: 20rem;
            height: 20rem;
            border-radius: 5%;
        }

        .text {
            color: @modeTextColor;
            padding-left: 2rem;

            h1 {
                color: @modeTextColor;
                font-size: 2rem;
                margin-bottom: 1.4rem;
            }

            &>p {
                font-size: 1.6rem;
                margin-bottom: 1.3rem;
            }

            p {
                padding-left: 1rem;
            }
        }
    }
}</style>