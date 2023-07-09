<template>
    <div id="home" v-if="!loaderFlag">
        <div class="title">
        <h1>最近播放列表</h1>
        <span>共{{ result.songs.length }}首</span>
      </div>
      <ul>
        <li><div class="one"><span style="font-size: 1.5rem;">序号</span></div><div class="two"><p style="font-size: 1.7rem;">标题</p></div> <div class="album"><p>专辑</p></div> <div class="duration"><p>时长</p></div> <div class="lastTime"><p>上次播放</p></div></li>
        <li v-for="(item, index) in result.songs" :key="`${item.playTime}+${index}`"
          :class="{ check: item.data.id == playMusic.id }">
          <div class="one">
            <MusicLoader v-if="flag && item.data.id == playMusic.id" />
            <p v-else :class="{ check: item.data.id == playMusic.id }">{{ index + 1 }}</p>
          </div>
          <div class="one b">
            <p class="iconfont icon-weibiaoti519" v-if="flag && item.data.id == playMusic.id" @click="timeOut"></p>
            <p class="iconfont icon-shipinbofangshibofang" v-else @click="begin(); setMusic(item.data.id)"></p>
          </div>
          <div class="two">
            <div class="right">
              <p>
                {{ item.data.name }}
              </p>
              <template v-for="(authorTtem, authorIndex) in item.data.ar" :key="authorTtem.id+`${authorIndex}`">
                <router-link :to="`/singerpage/${authorTtem.id}/album`" ><span>{{ authorTtem.name?authorTtem.name:`未知专辑` }}</span></router-link><span
                  v-if="authorIndex != item.data.ar.length - 1">/</span>
              </template>
            </div>
          </div>
          <div class="album">
            <router-link :to="`/albumpage/${encodeURIComponent(item.data.al.id)}/songs`">
              <p>{{ item.data.al.name }}</p>
            </router-link>
          </div>
          <div class="duration">
            <p>{{ fomatDuration(item.data.dt / 1000) }}</p>
          </div>
          <div class="lastTime">
            <p>{{ formatPt(item.playTime) }}</p>
          </div>
        </li>
      </ul>
    </div>
    <SearchLoadingVue v-else />
</template>

<script lang="ts" setup>
import SearchLoadingVue from "../../components/loading/searchLoading.vue";
import { onBeforeMount, reactive ,ref} from "vue";
import {song} from "../../api/record";
import {recordMusic} from "../../type/index";
import MusicLoader from "../../components/modules/musicLoader.vue"
import { musicListStore } from "../../store/playlist";
import { musicStateStore } from "../../store/musicState"
import { storeToRefs } from "pinia";
import {fomatDuration,formatPt} from "../../api/format";
import { ElMessage } from "element-plus";

const { playlist, playMusic } = storeToRefs(musicListStore());
const { flag } = storeToRefs(musicStateStore());
const { setMusic } = musicListStore()
const { begin, timeOut } = musicStateStore();

let loaderFlag=ref(true);
let result: { songs: recordMusic[] } = reactive({
    songs: [{
        playTime: NaN,
        data: {
            name: "",
            fee: NaN,
            id: NaN,
            dt: 0,
            al: {
                id: NaN,
                name: "",
            },
            ar: [{
                id: NaN,
                name: ""
            }]
        }
    }]
})
onBeforeMount(async () => {
    try {
        let { data } = await song();
        // console.log(data.data.list);
        if (data.data.list.length) {
            let arr: recordMusic[] = [];
            for (let i = 0; i < data.data.list.length; i++) {
                let obj: recordMusic = {
                    playTime: NaN,
                    data: {
                        name: "",
                        fee: NaN,
                        id: NaN,
                        dt: 0,
                        al: {
                            id: NaN,
                            name: "",
                        },
                        ar: [{
                            id: NaN,
                            name: ""
                        }]
                    }
                }
                obj.playTime = data.data.list[i].playTime;
                obj.data.name = data.data.list[i].data.name;
                obj.data.fee = data.data.list[i].data.fee;
                obj.data.id = data.data.list[i].data.id;
                obj.data.dt = data.data.list[i].data.dt;
                obj.data.al.id = data.data.list[i].data.al.id;
                obj.data.al.name = data.data.list[i].data.al.name;
                obj.data.ar = data.data.list[i].data.ar;
                arr.push(obj);
            }
            result.songs = arr;
            loaderFlag.value=false;      }
    } catch (error) {
        ElMessage({
            message: (error) as string,
            type: "error"
        })
    }
});
</script>

<style lang="less" scoped>
#home{
  width: calc(100vw - 15rem) !important;
}

@media screen and (min-width: 2300px)  {
  
  #home{
    width: 100% !important;
  }
}

.title {
  display: flex;
  align-items: center;
  letter-spacing: 0.7rem;
  color: @modeTextColor !important;

  h1 {
    margin-right: 30px;
    // color:@modeTextColor
  }

  span {
    font-family: kaiti;
    font-size: 1.7rem;
  }
}

ul {
  li:nth-of-type(n+2){
    &:hover {
      background-color: @bgColor;
    }
  }
  li:nth-of-type(1){
    background-color: @bgColor;
    margin-bottom: 1rem;
  }
  li {
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    padding: 1rem 1rem;
    align-items: center;
    color: @modePColor;
    border-radius: 1.5rem;
    height: 4rem;

    &:hover .b {
      opacity: 1;
    }

    .b {
      position: absolute;
      opacity: 0;
      background-color: @bgColor;
    }

    .one {
      width: 5rem;
      height: 3rem;
      display: flex;
      align-items: center;

      p {
        font-size: 2.1rem;
        line-height: 3rem;
        text-align: center;
      }

      margin:0 2rem;
    }

    .two {
      display: flex;
      align-items: center;
      width: 30%;
      // height: 4rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .right {
        p {
          font-size: 1.6rem;
        }

        span {
          padding-right: 0.3rem;
          padding: 1rem 0;
        }

        &>a>span:nth-of-type(n + 1) {
          color: #978d8c !important;
          cursor: pointer;
        }

        &>a>span:nth-of-type(n + 1):hover {
          text-decoration: underline;
        }
      }
    }

    .album {
      width: 20rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      &:hover {
        text-decoration: underline;
      }
    }

    .lastTime{
      width: 15rem;
    }

    .album,
    .duration ,.lastTime{
      padding-left: 20px;
      display: flex;
      align-items: center;

      p {
        font-family: kaiti;
        font-weight: 400;
        font-size: 1.7rem;
        color: @modePColor;
      }
    }
  }
}
</style>