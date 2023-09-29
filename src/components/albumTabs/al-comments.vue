<template>
    <div id="pi-comments" v-show="!loaderFlag" v-if="showarr.total">
      <ul v-if="showarr.hotComments.length" id="hot">
          <h2>热门评论</h2>
          <!-- <li v-for="item in 4">{{ item }}</li> -->
          <li v-for="i in showarr.hotComments" :key="i.commentId">
              <div class="left">
                <router-link :to="`/clientHome/${i.user.userId}`">
                <img :src="image.userImg" alt="" :data-src="`${i.user.avatarUrl}?param=70y70`" @error="dealImgError" v-lazyImg>
                </router-link>
              </div>
              <div class="right">
                <div class="top">
                  <p><router-link :to="`/clientHome/${i.user.userId}`">{{ i.user.nickname }}&nbsp;:&nbsp;</router-link>{{ i.content }}</p>
                </div>
                <div class="under">
                  <p>{{ i.timeStr }}&nbsp;&nbsp;{{ formatTime(i.time) }}</p>
                  <div><p><span :class="{iconfont:true, 'icon-dianzan':true,islike:i.liked}"></span>{{ i.likedCount }}</p></div>
                </div>
              </div>
          </li>
      </ul>
      <ul>
          <h2>最新评论({{ formatNum(showarr.total) }})</h2>
          <li v-for="(item, index) in showarr.comarr" :key="item.commentId">
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
            :page-size="page.middlePage" v-if="showarr.total > page.middlePage" />
        </ul>
    </div>
    <div v-else-if="!showarr.total" id="empty">
      <EmptyVue />
    </div>
    <SearchLoadingVue v-show="loaderFlag" />
</template>

<script lang="ts" setup>
import SearchLoadingVue from "../loading/searchLoading.vue";
import EmptyVue  from "../empty.vue";
import { comment } from "../../type/index";
import { alcomment} from "../../api/comment";
import {formatNum,formatTime} from "../../utils/format";
import { reactive, ref, watchEffect } from "vue";
import {useRoute , onBeforeRouteLeave} from "vue-router";
import { ElMessage } from "element-plus";
import { image ,page ,dealImgError} from "../../baseconfig";

let loaderFlag=ref(true);
let pageCount=ref(1);//分页的页数
let route=useRoute();
let showarr:{comarr:comment[],more:boolean,total:number,hotComments:comment[]}=reactive({
    hotComments:[] as comment[],//热门评论
    comarr:[] as comment[],
    more:true,//是否还有下一页
    total:NaN,//总评论数
});
let stop =watchEffect(async () => {
    try {
        let { data } = await alcomment({ id: parseInt(route.params.albumid as string) ,limit:page.middlePage,offset:pageCount.value});
        // console.log(data);
        
        showarr.more = data.more;
        showarr.total=data.total;
        let arr: comment[] = [];
        let hot:comment[]=[];
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
        if(data.hotComments){
          for(let i=0;i<data.hotComments.length;i++){
            hot.push({
              commentId:data.hotComments[i].commentId,
              content:data.hotComments[i].content,
              liked:data.hotComments[i].liked,
              likedCount:data.hotComments[i].likedCount,
              time:data.hotComments[i].time,
              timeStr:data.hotComments[i].timeStr,
              user:{
                avatarUrl:data.hotComments[i].user.avatarUrl,
                followed:data.hotComments[i].user.followed,
                nickname:data.hotComments[i].user.nickname,
                userId:data.hotComments[i].user.userId,
              }
            });
          }
        }
        showarr.comarr=arr;
        showarr.hotComments=hot;
        loaderFlag.value=false;
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
  loader();
});



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
    #hot{
      padding-right: 10rem;
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