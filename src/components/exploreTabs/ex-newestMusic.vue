<template>
    <div id="ex-newestMusic">
        <div>
            <router-link :to="`/explore/newestMusic/newmusic`" :class="{ischeck:state=='music'}" >新歌速递</router-link>
            <router-link :to="`/explore/newestMusic/newablum`" :class="{ischeck:state=='album'}" >新碟上架</router-link>
        </div>
    </div>
    <router-view></router-view>
</template>

<script setup lang="ts">
// import { storeToRefs } from "pinia";
// import { newstate } from "../../store/newest";
import { useRoute } from "vue-router";
import { ref, watchEffect } from "vue";

let state=ref("music");
// const {state}= storeToRefs(newstate());
// const { changeState } =newstate();

const route=useRoute();
watchEffect(()=>{
    route.fullPath=="/explore/newestMusic/newmusic"? state.value="music":state.value="album";
})
</script>

<style lang="less" scoped>
    .ischeck{
        background-color: #bbbbbb;
        color: white !important;
    }
    #ex-newestMusic{
        width: 85%;
        margin: auto;
        padding-top: 1rem;
        display: flex;
        justify-content: center;
        // div{
        //     width: 21.6rem;
        //     display: flex;
        //     height: 3rem;
        //     margin: auto;
        //     // background-color: #f5f5f5;
        //     border: 1px solid @modePColor;
        //     border-radius: 1.5rem;
        //     a{
        //         display: block;
        //         height: 100%;
        //         line-height: 3rem;
        //         border-radius: 1.5rem;
        //         text-align: center;
        //         padding:0 3rem;
        //         font-size: 1.2rem;
        //         font-weight: 400;
        //         color: @modeTextColor;
        //         // letter-spacing: 2px;
        //     }
        // }
        div{
            width: 220pxm;
            display: flex;
            height: 30px;
            margin: auto;
            // background-color: #f5f5f5;
            border: 1px solid @modePColor;
            border-radius: 15px;
            a{
                display: block;
                height: 100%;
                line-height: 30px;
                border-radius: 15px;
                text-align: center;
                padding:0 30px;
                font-size: 12px;
                font-weight: 400;
                color: @modeTextColor;
                // letter-spacing: 2px;
            }
        }
    }
    @media screen and (max-width: 1200px) {
        #ex-newestMusic{
            div{
                transform: scale(.6);
            }
        }
    }
</style>