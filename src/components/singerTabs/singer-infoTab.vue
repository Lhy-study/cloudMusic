<template>
    <div id="infoTab" v-if="!loaderFlag">
        <ul>
            <li v-for="item in result.introduction" :key="item.ti">
                <h2>{{ item.ti }}</h2>
                <template v-for="i in item.txt.split('\n')">
                    <p>{{ i }}</p>
                </template>
            </li>
        </ul>
    </div>
    <SearchLoadingVue v-else/>
</template>

<script setup lang="ts">
import  SearchLoadingVue from "../loading/searchLoading.vue";
import { onMounted, reactive, ref } from "vue";
import { detail } from "../../api/singer";
import { useRoute } from "vue-router"
let loaderFlag=ref(true);
let result = reactive({
    introduction: [] as any[],
})
onMounted(async () => {
    let { data } = await detail(parseInt(useRoute().params.id as string));
    result.introduction = data.introduction;
    loaderFlag.value=false;
});
</script>

<style lang="less" scoped>
#infoTab {
    h2 {
        color: @modeTextColor;
        margin-top: 1.5rem;
    }

    p {
        word-spacing: 5px;
        font-size: 1.4rem;
        padding-top: 1rem;
        text-indent: 2em;
        padding-right: 2rem;
        color: @modePColor;
    }
}
</style>