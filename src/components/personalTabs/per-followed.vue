<template>
    <div id="per-followed" v-show="!loaderFlag">
        <h1>{{ userInfo.nickname }}的关注</h1>
        <ul v-if="result.list.length">
            <router-link :to="`/clientHome/${item.userId}`" v-for="item in result.list" :key="item.userId">
                <li>
                    <div class="img"><img :src="image.userImg"  :data-src="`${item.avatarUrl}?param=140y140`" @error="dealImgError" v-lazyImg></div>
                    <div>
                        <p>{{ item.nickname }}<span :class="{iconfont:true} " v-bind:class="formatGender(item.gender)"></span></p>
                        <div class="info">
                            <p>粉丝{{ formatNum(item.followeds!) }} &nbsp;&nbsp;|&nbsp;&nbsp; 歌单:{{ formatNum(item.playlistCount!) }}</p>
                            <p v-if="item.signature">{{ item.signature }}</p><p v-else>还没有写个人介绍。。。</p>
                        </div>
                    </div>
                </li>
            </router-link>
        </ul>
        <div v-else class="null"><p>暂无关注哦</p></div>
        <el-pagination layout="prev, pager, next" :total="userInfo.follows" background v-model:current-page="pageCount" 
        @current-change="changePage" :page-size="30" v-if="result.list.length > 30" />
    </div>
    <SearchLoadingVue v-show="loaderFlag" />
</template>

<script lang="ts" setup>
import SearchLoadingVue from "../loading/searchLoading.vue";
import userPic from "../../assets/user.jpg";
import { storeToRefs } from "pinia";
import { useStore } from "../../store/user";
import { followed } from "../../api/user";
import { formatGender, formatNum } from "../../utils/format";
import { user } from "../../type/index";
import { onBeforeMount, reactive, ref } from "vue";
import { image , dealImgError } from "../../baseconfig";

let pageCount=ref(1);
let loaderFlag=ref(true);
let result:{more:boolean,list:user[]}=reactive({
    more:false,
    list:[] as user[]
})
const { userInfo } = storeToRefs(useStore());

onBeforeMount(async()=>{
    try {
        let {data} =await followed({uid:userInfo.value.userId,limit:30});
        // console.log(data);
        let arr:user[]=[];
        result.more=data.more;
        if(data.follow.length){
            for (let i = 0; i < data.follow.length; i++) {
                let obj:user={
                    userId:0,
                    gender:0,
                    nickname:"",
                    avatarUrl:"",
                    signature:"",
                    followeds:0,
                    userType:0,
                    playlistCount:0
                }
                obj.userId=data.follow[i].userId;
                obj.gender=data.follow[i].gender;
                obj.nickname=data.follow[i].nickname;
                obj.avatarUrl=data.follow[i].avatarUrl;
                obj.signature=data.follow[i].signature;
                obj.followeds=data.follow[i].followeds;
                obj.userType=data.follow[i].userType;
                obj.playlistCount=data.follow[i].playlistCount;
                arr.push(obj);
            }
            result.list=arr;
            loaderFlag.value=false;
        }
    } catch (error) {
        console.log(error);
    }
});

async function changePage() {
  try {
    let { data } = await followed({
        uid:userInfo.value.userId,
        limit: 30,
        offset: pageCount.value,
    });
    let arr:user[]=[];
        result.more=data.more;
        if(data.follow.length){
            for (let i = 0; i < data.follow.length; i++) {
                let obj:user={
                    userId:0,
                    gender:0,
                    nickname:"",
                    avatarUrl:"",
                    signature:"",
                    followeds:0,
                    userType:0,
                }
                obj.userId=data.follow[i].userId;
                obj.gender=data.follow[i].gender;
                obj.nickname=data.follow[i].nickname;
                obj.avatarUrl=data.follow[i].avatarUrl;
                obj.signature=data.follow[i].signature;
                obj.follows=data.follow[i].follows;
                obj.userType=data.follow[i].userType;
                arr.push(obj);
            }
            result.list=arr;
            loaderFlag.value=false;
        }
    } catch (error) {
        console.log(error);
    }
}
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
#per-followed{
    margin-top: 1rem;
    ul{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        h1{
            color: @modePColor;
        }
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
                        width: 20rem;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        // display: flex;
                        align-items: center;
                        box-sizing: border-box;
                        padding-left: 5px;
                        font-size: 1.5rem;
                        color: @modeTextColor;
                    }
                    .info{
                        p{
                        font-size: 1.3rem;
                        }   
                    }
                }
            }
        }
    }
}
</style>