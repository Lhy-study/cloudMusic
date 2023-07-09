<template>
    <div id="infoTab">
        <ul>  
            <!-- <h1>{{ al_detail }}</h1> -->
              <template v-for="i in al_detail.description?.split('/n')">
                    <p>{{ i }}</p>
                </template>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import {aldetail} from "../../type/index";
import { al_Result } from "../../inject_provide";

const al_detail:aldetail = inject(al_Result) as aldetail;
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