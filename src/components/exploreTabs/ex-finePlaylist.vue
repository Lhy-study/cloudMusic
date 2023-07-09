<template>
    <div id="ex-fine" v-if="!loaderFlage">
        <div class="title">
            <div class="header">
                <h1>精品歌单</h1>
                <p @click="() => { flag = true }"><span class="iconfont icon-tansuofenxi"></span>{{ checkHight }}</p>
            </div>
            <div class="classify" v-if="flag" ref="hight">
                <p v-for="item in hightTags" :key="item">
                    <span :class="{ ischeck: item == checkHight }" @click="setCheckHight(item);(()=>{ flag=false })();">
                        {{ item }}
                    </span>
                </p>
            </div>
        </div>
        <div class="content">
            <li v-for="item in result.data" :key="item.id + item.name">
                <div class="img">
                    <router-link :to="`/playlistpage/${item.id}/songs`">
                        <img :src="image.Cover" :data-src="`${item.coverImgUrl}?param150y=150`" @error="dealImgError" v-lazyImg>
                        <i class="iconfont icon-18erji-2">&nbsp;{{ formatNum(item.playCount) }}</i>
                    </router-link>
                    <p><span class="iconfont icon-vip"></span></p>
                    <span class="iconfont icon-shipinbofangshibofang" @click.self="play(item.id)"></span>
                </div>
                <div class="info">
                    <p>{{ item.name }}</p>
                    <p>by <router-link :to="`/clientHome/${item.userId}`"><span>{{ item.user?.nickname }} </span> <span
                                class="iconfont icon-yonghu-yuan"></span></router-link></p>
                </div>
            </li>
        </div>
    </div>
    <searchLoading v-else />
</template>

<script lang="ts" setup>
import searchLoading from '../loading/searchLoading.vue';
import { onBeforeMount, reactive, watchEffect, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { highquality } from "../../api/tag";
import { getHighquality, plDetail } from "../../api/playlist";
import { playAllMusic, getAllId } from "../../api/playing";
import { formatNum } from "../../api/format";
import { usdetail } from "../../api/user";
import { pldetail } from "../../type/index";
import { plTagState } from "../../store/tag";
import { storeToRefs } from 'pinia';
import { onBeforeRouteLeave } from 'vue-router';
import { onClickOutside } from '@vueuse/core';
import { image , dealImgError} from "../../baseconfig";

const { setCheckHight, setHightTags } = plTagState();
const { hightTags, checkHight } = storeToRefs(plTagState());

let hight = ref<HTMLElement | null>(null);
onClickOutside(hight, () => {
    flag.value = false;
});
let flag = ref(false);
let loaderFlage = ref(true);
let result = reactive({
    data: [] as pldetail[],
});
onBeforeMount(async () => {
    try {
        let { data } = await highquality();
        if (data.tags) {
            let arr: string[] = [];
            for (let i = 0; i < data.tags.length; i++) {
                arr.push(data.tags[i].name);
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
})

let stop = watchEffect(async () => {
    try {
        let { data } = await getHighquality({ cat: checkHight.value, limit: 21 });
        // console.log(data);
        loaderFlage.value = true;
        if (data.playlists) {
            let arr: pldetail[] = [];
            for (let i = 0; i < data.playlists.length; i++) {
                let userData = await usdetail(data.playlists[i].userId);
                arr.push({
                    userId: data.playlists[i].userId,
                    id: data.playlists[i].id,
                    name: data.playlists[i].name,
                    coverImgUrl: data.playlists[i].coverImgUrl,
                    trackCount: data.playlists[i].trackCount,
                    playCount: data.playlists[i].playCount,
                    user: {
                        avatarUrl: userData.data.profile.avatarUrl,
                        nickname: userData.data.profile.nickname,
                        userId: userData.data.profile.userId,
                    }
                });
            }
            result.data = arr;
            loaderFlage.value = false;
        }
    } catch (error) {
        ElMessage({
            type: "error",
            message: "精品歌单获取失败，请重试"
        });
    }
});

onBeforeRouteLeave(() => {
    stop();
});

async function play(id: number) {
    //   console.log(id);
    let { data } = await plDetail(id);
    playAllMusic(getAllId(data.playlist.trackIds));
}
</script>

<style lang="less" scoped>
@size:3.5rem;
.ischeck {
    color: red;
}

#ex-fine {
    width: 85%;
    margin: auto;

    .title {
        position: relative;
        margin-bottom: 2rem;
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;

            h1 {
                color: @modeTextColor;
            }

            p {
                cursor: pointer;
                padding: 0 .5rem;
                border-radius: 1rem;
                height: 2rem;
                line-height: 2rem;
                border: 2px solid @modePColor;
                font-size: 1.4rem !important;
                color: #999;

                span {
                    margin-right: .5rem;
                }
            }
        }

        .classify {
            position: absolute;
            z-index: 1;
            right: 0;
            width: 53rem;
            box-sizing: border-box;
            padding: 1rem 3rem;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-row-gap: 1.5em;
            background-color: @modeBgColor;
            border-radius: 2%;
            border: 2px solid @modeTextColor;

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

    .content {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-column-gap: 2em;
        li {
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            .img {
                position: relative;
                width: 16rem;
                height: 16rem;
                overflow: hidden;
                &:hover {
                    &>span {
                        top: calc(85% - @size);
                        opacity: 1;
                    }
                }

                img {
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                    border-radius: 5%;
                    border: 2px solid @startColor;
                }


                i {
                    position: absolute;
                    top: 3%;
                    right: 5%;
                    font-weight: 600;
                    font-size: 1.2rem;
                    color: @buttonColor;
                }

                &>span {
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
                        top: calc(85% - @size);
                        opacity: .95;
                    }
                }

                p{
                    background-color: #f3b068;
                    top: 0;
                    position: absolute;
                    width: 50%;
                    height: 50%;
                    transform: translate(-50%,-50%) rotate(-45deg);
                    // transform: rotate(-45deg) translate(-50%,-50%);
                    // border-top: 20px solid transparent;
                    span{
                        display: block;
                        text-align: center;
                        font-size: 25%;
                        color: #ffffff;
                        position: absolute;
                        left: 50%;
                        top: 75%;
                        transform: translate(-50%,-50%);
                    }
                }
            }
            .info{
                width: 20rem;
                padding-left: 1rem;
                p{
                    margin-bottom: 1rem;
                }
                p:nth-of-type(1){
                    font-size: 1.5rem;
                    color: @modeTextColor;
                }
                p:nth-of-type(2){
                   span{
                    font-size: 1.4rem;
                    color: #999;
                   }
                }
            }
        }
    }
}
</style>