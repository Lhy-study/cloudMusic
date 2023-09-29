<template>
    <div v-if="songs?.songs.length">
        <!-- <h1 @click="test">dianji</h1> -->
        <ul class="song">
            <li style="font-size:1.5rem;">
                <div class="one" style="height:3rem;"></div>
                <div class="div-title">标题</div>
                <div class="div-singer">歌手</div>
                <div class="div-album">专辑</div>
                <div class="div-duration">时长</div>
            </li>
            <template v-if="songs?.songs.length">
                <li v-for="(item, index) in songs.songs" :key="`${item.name}+${item.id}`"
                    :class="{ check: index % 2 == 0 }" @dblclick="setNewPlayMusic(item.id)">
                    <div class="one">
                        <span>{{ index + 70 * (pageCount - 1) + 1 }}</span>
                        <span class="iconfont icon-aixin"></span>
                    </div>
                    <div class="div-title">
                        <p>{{ item.name }}</p>
                        <span :class="[{ iconfont: true }, `${formatFee(item.fee)}`]"></span>
                    </div>
                    <div class="div-singer">
                        <template v-for="(aritem, arindex) in item.ar" :key="`${aritem.name}+${aritem.id}`">
                            <router-link :to="`/singerpage/${encodeURIComponent(aritem.id)}/album`"><span>{{ aritem.name
                            }}</span></router-link><span v-if="arindex != item.ar.length - 1">/</span>
                        </template>
                    </div>
                    <div class="div-album">
                        <router-link :to="`/playlistpage/${encodeURIComponent(item.al.id)}`">
                            <p>{{ item.al.name }}</p>
                        </router-link>
                    </div>
                    <div class="div-duration">
                        <p>{{ fomatDuration(item.dt / 1000) }}</p>
                    </div>
                </li>
            </template>
            <div class="error" v-else>
                <p>
                    赶快去收藏你喜欢的音乐
                </p>
            </div>
        </ul>
    </div>
    <SearchLoadingVue v-else />
</template>

<script lang="ts" setup>
import SearchLoadingVue from "../loading/searchLoading.vue";
import { ref, inject} from 'vue';
import { fomatDuration, formatFee } from "../../utils/format";
import { setNewPlayMusic } from "../../api/playing"
import { aldetail} from "../../type/index";
import { useRoute } from "vue-router";
import { al_Result } from "../../inject_provide"; 

let route = useRoute();
let pageCount = ref(1);
let loaderFlag = ref(true);

let songs:aldetail=inject(al_Result) as aldetail;


</script>

<style lang="less" scoped>
@import "../../assets/css/fee.less";
.check {
    background-color: #dcdada;
}

.checkfree {
    color: rgb(242, 66, 66) !important;
    border-color: rgb(242, 66, 66) !important;
}

ul.song {
    margin-top: 2rem;
}

/deep/.is-active {
    background-color: @buttonColor !important;
}

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
        width: 10rem;
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
        text-align: center;
    }
}
</style>