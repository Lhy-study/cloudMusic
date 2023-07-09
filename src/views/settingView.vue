<template>
  <div id="setting">
    <h1>设置</h1>
    <div class="setting-content">
      <div class="mode">
        <h3>主题</h3>
        <ul>
          <li @click="setMode('default'); changeMode('default')" :class="{ check: checkMode == 'default' }"><span
              class="iconfont icon-taiyang"></span>&nbsp;&nbsp;<span>浅色</span></li>
          <li @click="setMode('dark'); changeMode('dark')" :class="{ check: checkMode == 'dark' }"><span
              class="iconfont icon-yueliang"></span>&nbsp;&nbsp;<span>深色</span></li>
        </ul>
      </div>
      <div class="theme">
        <h3>主题色</h3>
        <ul>
          <li @click="setTheme('default'); changeTheme('default')" :class="{ check: checkTheme == 'default' }"><span
              class="iconfont icon-zhuti_tiaosepan"></span>&nbsp;&nbsp;<span>万条垂下绿丝绦</span></li>
          <li @click="setTheme('dark'); changeTheme('dark')" :class="{ check: checkTheme == 'dark' }"><span
              class="iconfont icon-zhuti_tiaosepan"></span>&nbsp;&nbsp;<span>秋风起兮白云飞</span></li>
          <li @click="setTheme('blue'); changeTheme('blue')" :class="{ check: checkTheme == 'blue' }"><span
              class="iconfont icon-zhuti_tiaosepan"></span>&nbsp;&nbsp;<span>瀚海阑干百丈冰</span></li>
          <li @click="setTheme('gold'); changeTheme('gold')" :class="{ check: checkTheme == 'gold' }"><span
              class="iconfont icon-zhuti_tiaosepan"></span>&nbsp;&nbsp;<span>嫩如金色软如丝</span></li>
          <li @click="setTheme('purple'); changeTheme('purple')" :class="{ check: checkTheme == 'purple' }"><span
              class="iconfont icon-zhuti_tiaosepan"></span>&nbsp;&nbsp;<span>缥缈危楼紫翠间</span></li>
        </ul>
      </div>
      <div class="same">
        <h3>音乐品质</h3>
        <div>
          <p>注意：音乐品质越高，加载所需时间越多，可能造成不好的体验，请谨慎选择</p>
          <!-- <el-select><el-option>1</el-option></el-select> -->
        </div>
      </div>
      <div class="lrc same">
        <h3>歌词</h3>
        <div>
          <p>是否显示翻译，如英语的中文翻译，粤语的发音等等</p>
          <Switch :prop1="lrc" prop2="lrc" />
        </div>
      </div>
      <div class="message same">
        <h3>评论</h3>
        <div>
          <p>查看各大歌单、榜单、音乐的精选评论</p>
          <Switch :prop1="msg" prop2="msg" />
        </div>
      </div>
      <div class="same">
        <div>
          <p>格式化设置</p>
          <el-button @click="test">点击</el-button>
        </div>
      </div>
      <div class="same" v-if="userInfo">
        <div>
          <p>推出登录</p>
          <el-button @click="LogOut">点击</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Switch from "../components/modules/switch.vue";
import { ElMessage } from 'element-plus';
import { logOut } from "../api/login";
import { setTheme, setMode } from "../theme/theme";
// import {styleStore,settingStore,useStore} from "../store/index.js";
import { lrcStore, styleStore } from "../store/setting"
import { useStore } from "../store/user";
import { ref, onMounted } from "vue"
import { storeToRefs } from "pinia";

document.title='设置'
let value1 = ref(true);
function test() {
  // console.log(1);
  // console.log(window.localStorage.getItem("theme"));
}
// onUnmounted(()=>{
//   console.log('卸载完毕');
// });
const { changeTheme, changeMode } = styleStore();
const { checkTheme, checkMode } = storeToRefs(styleStore());//拿到主题值//主题色的值
const { lrc, msg } = storeToRefs(lrcStore());
const { changeLrc, changeMsg } = lrcStore();
const { userInfo } = storeToRefs(useStore());
onMounted(() => {
  let Lrc1 = localStorage.getItem("lrc") || "false"; let Msg1 = localStorage.getItem("msg") || "false";
  changeLrc(JSON.parse(Lrc1));
  changeMsg(JSON.parse(Msg1));
});
async function LogOut() {
  let { data } = await logOut();
  // console.log(data);
  if (data.code == 200) {
    ElMessage({
      duration: 3000,
      type: "success",
      message: "退出成功"
    });
    window.location.reload();
  }
}
    // const {checkMode}=storeToRefs(styleState);
</script>

<style lang="less" scoped>
// /deep/.el-switch__core,.el-switch__action{
//   color:@buttonColor ;
// }

.check {
  color: white !important;
  background-color: @textColor !important;
}

#setting {
  box-sizing: border-box;
  padding-right: 20px;
  width: 100%;
  height: 100%;
  margin: 0 auto;

  h1 {
    color: @modeTextColor;
  }

  .setting-content {
    &>div {
      margin-top: 15px;

      h3 {
        margin-bottom: 5px;
        font-size: 1.5rem;
        color: @modeTextColor;
      }

      li {
        display: flex;
        align-items: center;
        float: left;
        cursor: pointer;
        padding: 5px 15px 5px;
        border-radius: 30px;
        margin-right: 20px;
        background-color: #827f7f;
        width: 200px;
        height: 30px;
        line-height: 30px;
        // color: @modePColor;

        span:nth-of-type(1) {
          font-size: 2.1rem;
        }

        span:nth-of-type(2) {
          font-size: 1.2rem;
        }
      }

      ul {
        &::after {
          display: block;
          content: "";
          clear: both;
        }
      }
    }
  }

  /*以上为相似的li标签的样式，统一写在上方*/
  background-color: @modeBgColor;

  .mode {
    ul {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .theme {
    ul {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-row-gap: 20px;
    }
  }

  .same {
    width: 100%;

    p {
      letter-spacing: .2rem;
      color: @modePColor;
    }

    div {
      display: flex;
      justify-content: space-between;
    }
  }
}</style>