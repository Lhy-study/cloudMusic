<template>
    <div id="pi-comments" v-show="!loaderFlag" v-if="showarr.total">
        <ul>
            <h2>最新评论({{ formatNum(showarr.total) }})</h2>
            <li v-for="(item, index) in showarr.comarr" :key="`${item.commentId}+${item.timeStr}`">
                <div class="left">
                  <router-link :to="`/clientHome/${item.user.userId}`">
                    <img :src="image.userImg" alt="" :data-src="`${item.user.avatarUrl}?param=70y70`" @error="dealImgError" v-lazyImg>
                  </router-link>
                </div>
                  <div class="right">
                    <div class="top">
                      <p><router-link :to="`/clientHome/${item.user.userId}`">{{ item.user.nickname }}&nbsp;:&nbsp;</router-link>{{ item.content }}</p>
                    </div>
                    <div class="under">
                      <p>{{ item.timeStr }}&nbsp;&nbsp;{{ formatTime(item.time) }}</p>
                      <div><p><span :class="{iconfont:true, 'icon-dianzan':true,islike:item.liked}"></span>{{ item.likedCount }}</p></div>
                    </div>
                </div>
              </li>
              <el-pagination layout="prev, pager, next" :total="showarr.total" background v-model:current-page="pageCount"
              @current-change="changePage" :page-size="50" v-if="showarr.total > 50" />
          </ul>
          <div class="related">
            <h3>相似歌单推荐</h3>
            <div v-if="showarr.similar.length">
              <router-link :to="`/playlistpage/${item.id}/songs`" v-for="item in showarr.similar">
                <div class="cover">
                  <img :src="image.Cover" alt="" :data-src="`${item.coverImgUrl}?param=150y150`" @error="dealImgError" v-lazyImg>
                  <router-link :to="`/clientHome/${item.creator.userId}`"><span class="iconfont icon-xingming"></span><span>{{ item.creator.nickname }}</span></router-link>
                </div>
                <p>{{ item.name }}</p>
              </router-link>
            </div>
            <p v-else>抱歉暂时无相似的歌单推荐,</p>
          </div>
    </div>
    <EmptyVue v-show="!loaderFlag" v-else-if="!showarr.total" />
    <SearchLoadingVue v-show="loaderFlag" />
</template>

<script lang="ts" setup>
import EmptyVue from "../empty.vue";
import SearchLoadingVue from "../loading/searchLoading.vue";
import { comment } from "../../type/index";
import { plcomment} from "../../api/comment";
import { related} from "../../api/playlist"
import {formatNum,formatTime} from "../../api/format";
import { reactive, ref, watchEffect } from "vue";
import {useRoute , onBeforeRouteLeave} from "vue-router";
import { ElMessage } from "element-plus";
import { image ,dealImgError} from "../../baseconfig";

let loaderFlag=ref(true);
let pageCount=ref(1);//分页的页数
let route=useRoute();
let showarr:{comarr:comment[],more:boolean,total:number,similar:any[]}=reactive({
    comarr:[] as comment[],
    more:true,//是否还有下一页
    total:NaN,//总评论数
    similar:[]//相似歌单
});
let stop =watchEffect(async () => {
    try {
        let { data } = await plcomment({ id: parseInt(route.params.playlistid as string) });
        showarr.more = data.more;
        showarr.total=data.total;
        let arr: comment[] = [];
        (data.comments as comment[]).forEach(item => {
            let obj: comment = {
                commentId: NaN,
                content: "",
                liked: false,//是否点赞过
                likedCount: NaN,//点赞数
                time: NaN,//一个距离1970年1月1日的毫秒值
                timeStr: "",// 03-26
                user: {
                    avatarUrl: "",
                    followed: false,//是否关注
                    nickname: "",
                    userId: NaN,
                }
            }
            obj.commentId=item.commentId;
            obj.content=item.content;
            obj.liked=item.liked;
            obj.likedCount=item.likedCount
            obj.time=item.time;
            obj.timeStr=item.timeStr;
            obj.user={
                avatarUrl:item.user.avatarUrl,
                followed:item.user.followed,
                nickname:item.user.nickname,
                userId:item.user.userId,
            }
            arr.push(obj);
        });
        showarr.comarr=arr;
        loaderFlag.value=false;
    } catch (error) {
        ElMessage({
            type:"error",
            message:error as string
        })
    }
});

let similar=watchEffect(async ()=>{//获取相似的歌单
  try {
    let { data } = await related(parseInt(route.params.playlistid as string) );
    showarr.similar=data.playlists;
  } catch (error) {
    ElMessage({
      type:"error",
      message:error as string
    })
  }
});

let loader = watchEffect(() => {
  if (pageCount.value) {
    // console.log('页数发生改变');
    loaderFlag.value = true;
  }
});

onBeforeRouteLeave(()=>{
  stop();
  similar();
  loader();
})

/*改变分页器的页数*/
async function changePage() {
  try {
    let { data } = await plcomment({
      id: parseInt(route.params.playlistid as string),
      limit: 50,
      offset: pageCount.value,
    });
    // console.log(data);
    if (data.comments.length) {
      showarr.more = data.more;
      showarr.total = data.total;
      let arr: comment[] = [];
      (data.comments as comment[]).forEach(item => {
        let obj: comment = {
          commentId: NaN,
          content: "",
          liked: false,//是否点赞过
          likedCount: NaN,//点赞数
          time: NaN,//一个距离1970年1月1日的毫秒值
          timeStr: "",// 03-26
          user: {
            avatarUrl: "",
            followed: false,//是否关注
            nickname: "",
            userId: NaN,
          }
        }
        obj.commentId = item.commentId;
        obj.content = item.content;
        obj.liked = item.liked;
        obj.likedCount = item.likedCount
        obj.time = item.time;
        obj.timeStr = item.timeStr;
        obj.user = {
          avatarUrl: item.user.avatarUrl,
          followed: item.user.followed,
          nickname: item.user.nickname,
          userId: item.user.userId,
        }
        arr.push(obj);
      });
      showarr.comarr = arr;
      loaderFlag.value = false;
    } else {
      ElMessage({
        type: "warning",
        duration: 2000,
        message: `没有找到相关的结果`,
      });
    }
  } catch (error) {
    ElMessage({
      type: "error",
      duration: 2000,
      message: `${error}`,
    });
  }
}


</script>

<style lang="less" scoped>
  .islike{
    color: red;
  }
  #pi-comments{
    display: flex;
    h1{
      color:@modeTextColor;
    }
    ul{
      li{
        display: flex;
        margin-top: 1.3rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid @modePColor;
        .left{
          padding-right: 1rem;
          img{
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            border: 0.1px solid @modeTextColor;
            cursor: pointer;
          }
        }
        .right{
          &>div{
            width: 50rem;
            // background-color: aqua;
          }
          .top{
            p{
              width: 100%;
              padding-bottom: 1rem;
              font-family: kaiti;
              font-size: 1.7rem;
              color: @modePColor;
              word-break: break-all;
              a{
                font-size: 1.7rem;
                color:@textColor
              }
            }
          }
          .under{
            display: flex;
            justify-content: space-between;
            p:nth-of-type(1){
              font-size: 1.5rem;
              a{
                font-size: 1.5rem;
              }
            }
            span{
              cursor: pointer;
            }
          }
        }
      }
    }
    .related{
      margin-left: 5rem;
      width: 25rem;
      &>div>a{
        display: block;
        margin-bottom: 1rem;
      }
      h3{
        font-size: 1.9rem;
        color: @modePColor;
        margin-bottom: 1rem; 
      }
      .cover{
        position: relative;
        img{
          width: 25rem;
          height: 20rem;
          border-radius: 5%;
        }
        a{
          display: block;
          box-sizing: border-box;
          padding-left: 10px;
          position: absolute;
          bottom: 5%;
          span{
            font-size: 1.4rem;
            color: white;
          }
        }
      }
      p{
        box-sizing: border-box;
        padding: 0 10px;
        font-size: 1.5rem;
        color: @modePColor;
      }
    }
  }
</style>

<style lang="less">
.is-active.number {
  background-color: @buttonColor !important;
}
</style>