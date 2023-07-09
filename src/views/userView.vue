<template>
    <div id="personal">
        <div class="base">
            <img :src="userInfo.avatarUrl" alt="" @error="dealImgError">
            <div class="info">
                <h1>{{ userInfo.nickname }}&nbsp;&nbsp;Lv{{ userInfo.level }}&nbsp;&nbsp;<span :class="{ iconfont: true }"
                        v-bind:class="formatGender(userInfo.gender)"></span></h1>
                <p>{{ formatDate(userInfo.createTime!) }}注册</p>
                <div><span>关注:{{ userInfo.follows }}</span> <span>粉丝:{{ userInfo.followeds }}</span></div>
                <p>个人介绍：<span v-if="userInfo.signature">{{ userInfo.signature }}</span><span v-else>还没有写个人介绍。。。</span></p>
            </div>
        </div>
        <!-- <div id="per-list" v-if="!loaderFlag">
            <h1>{{ userInfo.nickname }}的歌单</h1>
            <ul v-infinite-scroll="load" style="overflow: auto" id="infilite">
                <template v-for="(i) in result.playlist" :key="`${i.id}+${i.name}`">
                    <router-link :to="`/playlistpage/${i.id}/songs`">
                        <li>
                            <img :src="image.Cover" :data-src="`${i.coverImgUrl}?param=200y200`" v-lazyImg @error="dealImgError"/>
                            <p>{{ i.name }}</p>
                            <p>{{ i.trackCount }}首</p>
                            <i class="iconfont icon-18erji-2">&nbsp;{{ formatNum(i.playCount) }}</i>
                        </li>
                    </router-link>
                </template>
            </ul> -->
        <!-- <el-pagination layout="prev, pager, next" :total="userInfo.playlistCount" background v-model:current-page="pageCount" 
             :page-size="30" v-if="userInfo.playlistCount! > 30" /> -->
        <h1>{{ userInfo.nickname }}的歌单</h1>
        <ul  id="per-list">
            <template v-for="(i) in result.playlist" :key="`${i.name}+${i.id}`">
                <li>
                    <div class="img">
                        <router-link :to="`/playlistpage/${i.id}/songs`">
                            <img :src="image.Cover" :data-src="`${i.coverImgUrl}?param200y=200`" @error="dealImgError"
                                v-lazyImg />
                            <i class="iconfont icon-18erji-2">&nbsp;{{ formatNum(i.playCount) }}</i>
                            <span class="iconfont icon-wode" v-if="userInfo.userId == i.userId"> </span>
                        </router-link>
                    </div>
                    <p>{{ i.name }}</p>
                    <p>{{ i.trackCount }}首</p>
                </li>
            </template>
        </ul>
        <SearchLoadingVue v-if="loaderFlag" />
    </div>
</template>

<script lang="ts" setup>
import SearchLoadingVue from "../components/loading/searchLoading.vue";
import { reactive, watchEffect, ref } from "vue";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import { formatDate, formatGender, formatNum } from "../api/format";
import { uPlaylist, usdetail } from "../api/user";
import { user, pldetail } from "../type";
import { ElMessage } from "element-plus";
import { image, dealImgError } from "../baseconfig";

let loaderFlag = ref(true);
const route = useRoute();
let userInfo = reactive<user>({
    avatarUrl: "",
    userId: 0,
    gender: 0,
    createTime: 0,
    level: 0,
    listenSongs: 0,
    nickname: "",
    signature: "",
    followeds: 0,
    follows: 0,
    userType: 0,
    playlistCount: 0
});

let result: { more: boolean, playlist: pldetail[] } = reactive({
    more: true,
    playlist: [] as pldetail[]
});

let offset=ref(0);
let timer: any = ref(null);
const stop = watchEffect(async () => {
    try {
        let { data } = await usdetail(parseInt(route.params.uid as string));
        // console.log(data);

        userInfo.level = data.level;
        userInfo.createTime = data.createTime;
        userInfo.listenSongs = data.listenSongs;

        if (data.profile) {
            userInfo.avatarUrl = data.profile.avatarUrl;
            userInfo.userId = data.profile.userId;
            userInfo.gender = data.profile.gender;
            userInfo.nickname = data.profile.nickname;
            userInfo.signature = data.profile.signature;
            userInfo.followeds = data.profile.followeds;
            userInfo.follows = data.profile.follows;
            userInfo.userType = data.profile.userType;
            userInfo.playlistCount = data.profile.playlistCount;
            document.title = userInfo.nickname + '的空间';
        }
    } catch (error) {
        ElMessage({
            type: "error",
            message: error as string
        });
    }
});

const playlist = watchEffect(async () => {
    loaderFlag.value = true;
    if (userInfo.userId) {
        try {
            let { data } = await uPlaylist({ uid: userInfo.userId, limit: 30, offset: offset.value });
            console.log(data);
            result.more = data.more;
            let arr: pldetail[] = []
            if (data.playlist.length) {
                for (let index = 1; index < data.playlist.length; index++) {//第一首自己喜欢的音乐也在，所以要排除
                    let obj: pldetail = {
                        id: NaN,
                        playCount: NaN,
                        trackCount: NaN,
                        name: "",
                        coverImgUrl: ""
                    }
                    obj.id = data.playlist[index].id;
                    obj.playCount = data.playlist[index].playCount;
                    obj.trackCount = data.playlist[index].trackCount;
                    obj.name = data.playlist[index].name;
                    obj.coverImgUrl = data.playlist[index].coverImgUrl;
                    obj.userId=data.playlist[index].userId;
                    arr.push(obj);
                }
                result.playlist.push(...arr);
                loaderFlag.value = false;
            }

        } catch (error) {
            ElMessage({
                type: "error",
                message: error as string
            });
        }
    }
}, { flush: "post" });


// console.log(route.params.uid);

// async function load() {
//     offset.value += 5;
//     try {
//         if (result.more) {
//             let { data } = await uPlaylist({ uid: userInfo.userId, offset: offset.value, limit: 5 });
//             console.log(data);
//             result.more = data.more;
//             let arr: pldetail[] = []
//             if (data.playlist.length) {
//                 for (let index = 1; index < data.playlist.length; index++) {//第一首自己喜欢的音乐也在，所以要排除
//                     let obj: pldetail = {
//                         id: NaN,
//                         playCount: NaN,
//                         trackCount: NaN,
//                         name: "",
//                         coverImgUrl: ""
//                     }
//                     obj.id = data.playlist[index].id;
//                     obj.playCount = data.playlist[index].playCount;
//                     obj.trackCount = data.playlist[index].trackCount;
//                     obj.name = data.playlist[index].name;
//                     obj.coverImgUrl = data.playlist[index].coverImgUrl;
//                     arr.push(obj);
//                 }
//                 console.log(arr);

//                 result.playlist = result.playlist.concat(arr);
//                 // loaderFlag.value=false;
//             }
//         }
//     } catch (error) {
//         ElMessage({
//             type: "error",
//             message: error as string
//         });
//     }
// }

const controller = new AbortController();//用来取消监听在该组件下的滚动事件
document.addEventListener("scroll", () => {
    if (timer.value) {
        clearTimeout(timer.value);
    }
    timer.value = setTimeout(() => {
        // console.log(11);
        if (result.more) {
            let scrollTop = document.documentElement.scrollTop;
            let clientHeight = document.documentElement.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            if (scrollTop + clientHeight >= scrollHeight - 100 && scrollTop + clientHeight >= scrollHeight - 1) {
                offset.value+=1;
                // console.log("到底了");
            }
        } else if (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1 && !loaderFlag.value) {
            ElMessage({
                message: "已经到底了",
                type: "warning"
            });
        }
    }, 300);
}, { signal: controller.signal });//监听滚动事件

onBeforeRouteLeave(() => {
    stop();
    playlist();
    controller.abort();
})
</script>

<style lang="less">
.el-menu-item {
    a {
        font-size: 1.6rem;
        color: @modeTextColor !important;
    }
}

.el-sub-menu__title {
    font-size: 1.7rem;
    color: @modeTextColor !important;
}
</style>

<style lang="less" scoped>
.icon-nan {
    color: #0091ff !important;
}

.icon-nv {
    color: #ff4d94 !important;
}

#personal {
    .base {
        display: flex;

        img {
            width: 20rem;
            height: 20rem;
            border-radius: 50%;
        }

        .info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 1.3rem;

            h1 {
                font-size: 2rem;
                color: @modePColor;
                justify-items: flex-start !important;
            }

            p {
                font-size: 1.5rem;
                color: @modePColor;
            }

            p:nth-of-type(2) {
                width: 70%;
            }
        }
    }

    h1{
        color: @modePColor;
    }

    ul#per-list {
        box-sizing: border-box;
        padding-right: 5rem;
        padding-top: 5rem;
        display: flex;
        flex-wrap: wrap;

        li {
            margin: 1rem 1rem 0 0;

            // position: relative;
            .img {
                position: relative;
                width: 30rem;
                height: 30rem;

                img {
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

                span {
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
                color: @modeTextColor;
            }
        }
    }
}
</style>