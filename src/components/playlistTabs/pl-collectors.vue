<template>
    <div id="pl-collectors" v-show="!loaderFlag">
        <ul v-if="result.userArr.length">
            <router-link :to="`/clientHome/${item.userId}`" v-for="item in result.userArr" :key="`${item.userId}+${item.userId}`">
                <li>
                    <div class="img"><img :src="image.userImg"  :data-src="`${item.avatarUrl}?param=140y140`" @error="dealImgError" v-lazyImg></div>
                    <div><p>{{ item.nickname }}<span :class="{iconfont:true} " v-bind:class="formatGender(item.gender)"></span></p><p v-if="item.signature">{{ item.signature }}</p></div>
                </li>
            </router-link>
        </ul>
        <div v-else class="null"><p>暂无收藏者</p></div>
    </div>
    <SearchLoadingVue v-show="loaderFlag" />
</template>

<script lang="ts" setup>
import SearchLoadingVue from "../loading/searchLoading.vue";
import { reactive, watchEffect ,ref} from "vue";
import {subscribers } from "../../api/playlist";
import { formatGender } from "../../utils/format"
import {useRoute , onBeforeRouteLeave} from "vue-router";
import {user} from "../../type/index";
import { ElMessage } from "element-plus";
import {dealImgError , image} from "../../baseconfig";

let loaderFlag=ref(true);
let route=useRoute();
let result:{total:number,more:boolean,userArr:user[]}=reactive({
    total:NaN,
    more:false,
    userArr:[] as user[],
})

let stop=watchEffect(async ()=>{
    try {
        let {data}=await subscribers({ id: parseInt(route.params.playlistid as string) });
        // console.log(data);
        result.total=data.total;
        result.more=data.more;
        let arr=[];
        for(let i=0;i<data.subscribers.length;i++){
            let obj:user={
                userId:NaN,
                gender:0,
                nickname:"",
                avatarUrl:"",
                signature:"",
            }
            obj.userId=data.subscribers[i].userId;
            obj.gender=data.subscribers[i].gender;
            obj.nickname=data.subscribers[i].nickname;
            obj.avatarUrl=data.subscribers[i].avatarUrl;
            obj.signature=data.subscribers[i].signature;
            arr.push(obj);
        }
        result.userArr=arr;
        loaderFlag.value=false;
    } catch (error) {
        ElMessage({
            type:"error",
            message:error as string,
        });
    }
});

onBeforeRouteLeave(()=>{
    stop();
})
</script>

<style lang="less" scoped>
.icon-nan{
    color: #0091ff !important;
}
.icon-nv{
    color: #ff4d94;
}

.null{
    text-align: center;
    font-size: 1.7rem;
    margin-top: 3rem;
    color: @modeTextColor;
}
#pl-collectors{
    ul{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        a{
            display: block !important;
            width: 24%;
            li{
                display: flex;
                margin-top: 1rem;
                img{
                    width: 10rem;
                    height: 10rem;
                    border-radius: 50%;
                    border: .25rem solid @textColor;
                }
                div:nth-of-type(2){
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    p{
                        display: flex;
                        align-items: center;
                        box-sizing: border-box;
                        padding-left: 5px;
                        font-size: 1.5rem;
                        color: @modeTextColor;
                    }
                }
            }
        }
    }
}
</style>