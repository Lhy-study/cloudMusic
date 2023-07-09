<template>
    <div class="inputHome" ref="input">
        <div class="search">
            <span class="iconfont icon-sousuo"></span>
            <input type="text"  @input="change" v-model="keyword"  @focus="()=>{flag=true}" @keydown.enter="exprole">
        </div>
        <ul v-show="flag">
            <router-link :to="`/search/${encodeURIComponent(item.name)}/song`" 
            v-for="item in result.results" :key="item.name" 
            @click="() => { flag = false ; keyword=item.name}"
            >
                <li >{{ item.name }}</li>
            </router-link>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import {searchSuggest} from '../../api/search';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import {onClickOutside} from "@vueuse/core";//使用的是vueuse的一个方法
// import {musicDeatils} from "../../type/index";
const router=useRouter();
const input=ref<HTMLElement|null>(null);

let flag=ref(false);
let keyword=ref("");
let timer=ref<NodeJS.Timeout|null>(null);
let result:{results:{name:string}[]}=reactive({
    results:[] as {name:string}[]
});

onClickOutside(input,()=>{//点击外部隐藏
    flag.value=false;
})

function exprole(){
    // console.log('蛮');
    
  if(keyword.value.trim()){
    router.replace(`/search/${encodeURIComponent(keyword.value)}/song`);
  }else{
    ElMessage({
      duration:2000,
      type:"warning",
      message:"搜索框不能为空"
    });
  }
}

function change(event: any) {
    if (timer.value) {
        clearTimeout(timer.value);
    }
    try {
        timer.value = setTimeout(async () => {
            let {data} =await searchSuggest({ keywords: event.target.value });
            // console.log(data.result);
            
            if(data.result && (data.result.songs || data.result.artists)){
                let arr:{name:string}[]=[];
                if(data.result.songs){
                    data.result.songs.forEach((item:any) => {
                        arr.push({name:item.name})
                    });
                }
                if(data.result.artists){
                    data.result.artists.forEach((item:any) => {
                        arr.push({name:item.name})
                    });
                }
                result.results=data.result.songs || data.result.artists;
                flag.value=true;
                result.results=arr;
            }else{
                result.results=[];
            }
        }, 300);
    } catch (error) {
        ElMessage({
            duration: 2000,
            type: "warning",
            message: "搜索框不能为空",
        })
    }
}
</script>

<style lang="less" scoped>
.inputHome {
    // width: 100%;
    // height: 100%;
    position: relative;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    .search {
        width: 80%;
        height: 4rem;
        background-color: #f5f5f5;
        border-radius: 2rem;
        display: flex;
        align-items: center;
        padding: 0 1rem;
        span {
            font-size: 2rem;
            color: #999;
        }
        input {
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            background-color: transparent;
            padding: 0 1rem;
            font-size: 1.6rem;
            color: #333;
        }
    }
    ul
    {
        position: absolute;
        top: 4rem;
        left: 0;
        width: 200%;
        // max-height: 20rem;
        // background-color: #fff;
        border-radius: 1rem;
        overflow: auto;
        li{
            box-sizing: border-box;
            width: 100%;
            height: 3rem;
            line-height: 3rem;
            padding: 0 1rem;
            font-size: 1.6rem;
            color: #333;
            background-color: #fff;
            border-bottom: 1px solid #f5f5f5;
            font-family: kaiti;
            cursor: pointer;
        }
    }
}
</style>