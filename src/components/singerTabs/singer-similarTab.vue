<template>
    <div id="similarTab">
        <router-link :to="`/singerpage/${item.id}/album`" v-for="item in result.artilst" :key="`${item.id}+${item.name}`">
            <div class="tab-item">
                <div>
                    <img :src="`${image.Cover}`" alt="" :data-src="`${item.picUrl}?param=130y130`" @error="dealImgError" v-lazyImg>
                </div>
                <span>{{ item.name }}</span>
            </div>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import {  watchEffect, reactive } from 'vue';
import { simiSinger } from "../../api/singer";
import {useRoute , onBeforeRouteLeave} from "vue-router";
import { image ,dealImgError} from "../../baseconfig";
let result = reactive({
    artilst: [] as Array<{ name: string, id: number, picUrl: string }>
});

let route=useRoute();

const stop = watchEffect(async () => {
    try {
        // console.log(singerid.value);

        let { data } = await simiSinger(parseInt(route.params.id as string));
        // console.log(data);
        let arr:Array<{ name: string, id: number, picUrl: string }>=[];
        (data.artists as Array<any>).forEach((item) => {
            let obj = { name: "", id: NaN, picUrl: "" };
            obj.name = item.name;
            obj.id = item.id;
            obj.picUrl = item.picUrl;
            arr.push(obj);
        });
        result.artilst=arr;
    } catch (error) {
        // console.log(error);
        // let msg1 = (error as any).response.data.message, msg2 = ((error as any).response.data.msg)
        // // console.log();
        ElMessage({
            type: "error",
            duration: 2000,
            message: error as string
        });
    }
});

onBeforeRouteLeave(()=>{
    stop();
})
</script>

<style lang="less" scoped>
#similarTab {
    display: flex;
    flex-wrap: wrap;

    .tab-item {
        display: flex;
        flex-direction: column;

        &>div {
            padding: 1.6rem 1.6rem 1.6rem 0rem;

            img {
                width: 20rem;
                height: 20rem;
            }
        }

        span {
            color: @modePColor;
        }
    }
}
</style>