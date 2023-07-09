<template>
    <div id="dailySongs">
        <div class="top">
            <div class="calendar"><!--日历 -->
                <p>{{ new Date(Date.now()).getDate() >= 10 ? new Date(Date.now()).getDate() : `0${new
                    Date(Date.now()).getDate()}` }}</p>
            </div>
            <div class="title">
                <h1>每日推荐</h1>
                <p>根据你的音乐口味生成，每天6:00更新</p>
            </div>
        </div>
        <div class="playall">
            <span class="iconfont icon-shipinbofangshibofang" @click="playAllMusic(getAllId(result.dailySongs))"></span>
            <span>播放全部</span>
            <span class="iconfont icon-tianjia" @click="addplayList(getAllId(result.dailySongs))"></span>
        </div>
        <div>
            <ul class="song">
                <li style="font-size:1.5rem;">
                    <div class="one" style="height:3rem;"></div>
                    <div class="div-title">标题</div>
                    <div class="div-singer">歌手</div>
                    <div class="div-album">专辑</div>
                    <div class="div-duration">时长</div>
                </li>
                <template v-if="result.dailySongs.length">
                    <li v-for="(item, index) in result.dailySongs" :key="`${item.id}+${item.name}`" :class="{ check: index % 2 == 0 }"
                        @dblclick="setNewPlayMusic(item.id)">
                        <div class="one">
                            <span>{{ index + 1 }}</span>
                            <span :class="['iconfont', 'icon-aixin', { islike: formatIsLike(item.id) }]"></span>
                        </div>
                        <div class="div-title">
                            <p>{{ item.name }}</p>
                            <span :class="[{ iconfont: true }, `${formatFee(item.fee)}`]"></span>
                        </div>
                        <div class="div-singer">
                            <template v-for="(aritem, arindex) in item.ar" :key="`${aritem.id}+${aritem.name}`">
                                <router-link :to="`/singerpage/${encodeURIComponent(aritem.id)}/album`"><span>{{ aritem.name
                                }}</span></router-link><span v-if="arindex != item.ar.length - 1">/</span>
                            </template>
                        </div>
                        <div class="div-album">
                            <router-link :to="`/albumpage/${encodeURIComponent(item.al.id)}/songs`">
                                <p>{{ item.al.name }}</p>
                            </router-link>
                        </div>
                        <div class="div-duration">
                            <p>{{ fomatDuration(item.dt / 1000) }}</p>
                        </div>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive } from "vue";
import { formatIsLike, fomatDuration, formatFee } from "../api/format";
import { setNewPlayMusic ,playAllMusic,getAllId ,addplayList} from "../api/playing";
import { getDaySongs } from "../api/user";
import { musicDeatils } from "../type/index";
import { ElMessage } from "element-plus";

let result: { dailySongs: musicDeatils[] } = reactive({
    dailySongs: []
});

onBeforeMount(async () => {
    document.title = "每日推荐";
    try {
        let { data } = await getDaySongs();
        if (data.data.dailySongs) {
            let arr: musicDeatils[] = [];
            for (let index = 0; index < data.data.dailySongs.length; index++) {
                arr.push({
                    id: data.data.dailySongs[index].id,
                    name: data.data.dailySongs[index].name,
                    ar: data.data.dailySongs[index].ar,
                    al: data.data.dailySongs[index].al,
                    dt: data.data.dailySongs[index].dt,
                    fee: data.data.dailySongs[index].fee
                });
            }
            result.dailySongs = arr;
        }
    } catch (error) {
        ElMessage({
            type: "error",
            message: "获取每日推荐失败,请稍后再试"
        });
    }
});

</script>

<style lang="less" scoped>
@import "../assets/css/fee.less";
@h: 3rem;

.islike {
    color: red;
}

#dailySongs {
    .top {
        display: flex;
        align-items: flex-end;

        .title {
            margin-left: 3rem;

            h1 {
                font-size: 2rem;
                font-weight: 600;
                color: @textColor;
                margin-bottom: 1rem;
            }

            p {
                font-size: 1.2rem;
                color: @textColor;
                margin-bottom: 1rem;
            }
        }
    }

    .playall {
        margin-top: 2rem;
        display: flex;
        justify-content: space-between;
        position: relative;
        background-color: red;
        width: @h * 4;
        height: @h;
        border-radius: @h;
        cursor: pointer;

        span:nth-of-type(1),
        span:nth-of-type(3) {
            display: block;
            // position: absolute;
            width: @h;
            height: @h;
            border-radius: 50%;
            line-height: @h;
            text-align: center;
            color: white;
            font-size: 1.6rem;
        }

        span:nth-of-type(2) {
            height: @h;
            line-height: @h;
            color: white;
            letter-spacing: 2px;
        }

        // span:nth-of-type(1){
        //   left: 0;
        // }
        span:nth-of-type(3):hover::after {
            display: block;
            width: 15rem;
            content: "添加到全部播放列表";
            font-size: 1rem;
            color: @modePColor;
            background-color: white;
        }
    }

    ul.song {
        li {
            border-radius: 1rem;
            padding: 1rem 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: @modePColor;
            text-align: left;

            &:hover {
                background-color: #cccccc;
            }

            .one {
                width: 4rem;
                display: flex;
                justify-content: space-around;
                align-items: center;

                span {
                    display: block;
                    height: 30px;
                    line-height: 30px;
                    font-size: 1.5rem;
                }
            }

            .div-title {
                display: flex;
                align-items: center;
                width: 30%;
                max-width: 40vw;
                p {
                    // width: 80%;
                    margin-right: 1rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 1.7rem;
                    letter-spacing: 2px;
                }

                &>span {
                    display: block;
                    font-size: 1.7rem;
                    border-radius: 0.2rem;
                    color: @startColor;
                }
            }

            .div-singer {
                // width: 300px;
                width: 25%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 1.7rem;

                a {
                    width: 100%;
                    color: #978d8c;

                    &:hover {
                        text-decoration: underline;
                    }
                }

                span {
                    padding: 0 0.2rem;
                }
            }

            .div-album {
                // width: 250px;
                width: 25%;
                p {
                    font-size: 1.6rem;
                    color: @modePColor;
                }
            }

            .div-duration {
                width: 120px;
                font-size: 1.5rem;
            }
        }
    }
}

.calendar {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: relative;
    width: 7.5rem;
    height: 7.5rem;
    box-sizing: border-box;
    border-radius: 20%;
    border: 2px solid @textColor;
    margin-top: 20px;

    p {
        box-sizing: border-box;
        padding: 1px 1px 4px 1px;
        border-top: @textColor 3px solid;
        font-size: 3.8rem;
        font-weight: 600;
        text-align: center;
        color: @textColor;
    }
}

.calendar::before,
.calendar::after {
    content: "";
    position: absolute;
    top: 0;
    transform: translateY(-60%);
    display: block;
    width: 0.3rem;
    height: 18%;
    background-color: @textColor;
}

.calendar::before {
    left: 30%;
}

.calendar::after {
    right: 30%;
}</style>

