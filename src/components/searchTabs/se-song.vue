<template>
  <div v-if="!loaderFlag">
    <ul class="song">
      <li style="font-size:1.5rem;">
        <div class="one" style="height:3rem;"></div>
        <div class="div-title">标题</div>
        <div class="div-singer">歌手</div>
        <div class="div-album">专辑</div>
        <div class="div-duration">时长</div>
      </li>
      <li v-for="(item, index) in resoult.songs" :key="`${item.id}+${item.name}`" :class="{ check: index % 2 == 0 }"
        @dblclick="setNewPlayMusic(item.id)">
        <div class="one">
          <span>{{ index + 30 * (pageCount-1) + 1 }}</span>
          <span class="iconfont icon-aixin"></span>
        </div>
        <div class="div-title">
          <p>{{ item.name }}</p>
          <span :class="[{ iconfont: true }, `${formatFee(item.fee)}`]"></span>
        </div>
        <div class="div-singer">
          <template v-for="(aritem, arindex) in item.ar" :key="`${aritem.id}+${aritem.name}`">
            <router-link :to="`/singerpage/${encodeURIComponent(aritem.id)}/album`"><span>{{ aritem.name
            }}</span></router-link><span v-if="arindex != item.ar.length - 1">/</span>
          </template>
        </div>
        <div class="div-album">
          <router-link :to="`/albumpage/${encodeURIComponent(item.al.id)}/songs`">
            <p>{{ item.al.name }}</p>
          </router-link>
        </div>
        <div class="div-duration">
          <p>{{ fomatDuration(item.dt / 1000) }}</p>
        </div>
      </li>
    </ul>
    <el-pagination layout="prev, pager, next" :total="resoult.songCount" background v-model:current-page="pageCount" 
    @current-change="changePage" :page-size="30" v-if="resoult.songCount > 30" />
    <div class="error" v-if="resoult.songCount==0">
      <p>
        很抱歉，没有找到与“<span>{{ route.params.keyword }}</span>”相关的单曲
      </p>
    </div>
  </div>

  <SearchLoadingVue v-if="loaderFlag" />
</template>

<script setup lang="ts">
import SearchLoadingVue from "../loading/searchLoading.vue";
import { ElMessage } from "element-plus";
import { reactive, ref, watchEffect } from "vue";
import { useRoute ,onBeforeRouteLeave} from "vue-router";
import { search } from "../../api/search";
import { fomatDuration ,formatFee} from "../../api/format";
import {setNewPlayMusic} from "../../api/playing";
let pageCount = ref(1);
// let offset = ref(0);
let loaderFlag = ref(true);
let resoult = reactive({
  songs: [] as any[],
  songCount: 0,
});
const route = useRoute();

function test() {
  console.log('test', pageCount.value);
}

const stop=watchEffect(async () => {
  // console.log('还在做');

  try {
    // console.log("watchEffect");
    let { data } = await search({
      keywords: route.params.keyword as string,
      limit: 30,
      type: 1,
      offset: pageCount.value,
    });
    // console.log(data, 73);
    resoult.songCount = data.result.songCount;
    if (data.result.songCount) {
      resoult.songs = data.result.songs;
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
});

const loader = watchEffect(() => {
  if (pageCount.value) {
    // console.log('页数发生改变');
    loaderFlag.value = true;
  }
});

onBeforeRouteLeave(()=>{
  stop();
  loader();
});

/*改变分页器的页数*/
async function changePage() {
  try {
    let { data } = await search({
      keywords: route.params.keyword as string,
      limit: 30,
      type: 1,
      offset: pageCount.value,
    });
    // console.log(data);
    if (data.result.songCount) {
      resoult.songs = data.result.songs;
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
    width: 4rem;
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
    width: 40vw;

    p {
      width: 80%;
      margin-right: 1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 1.7rem;
      letter-spacing: 2px;
    }
  }

  .div-singer {
    width: 300px;
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
    width: 250px;

    p {
      font-size: 1.6rem;
      color: @modePColor;
    }
  }

  .div-duration {
    width: 120px;
    font-size: 1.5rem;
  }
}

.error {
  position: relative;
  top: 100px;

  p {
    text-align: center;

    span {
      color: @textColor;
    }
  }
}
</style>

<style lang="less">
.is-active.number {
  background-color: @buttonColor !important;
}

.el-pagination{
  margin-top: 2.5rem;
}
</style>