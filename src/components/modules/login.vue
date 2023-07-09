<template>
  <div class="login" v-if="!userInfo.userId">
    <li @click="dialogShow"><span class="iconfont icon-yonghu-yuan"></span></li>
    <el-dialog
      v-model="dialogVisible"
      width="30%"
      @close="clearTimer"
      @open="getCookie"
    >
      <template #header>
        <h1>请使用网易云音乐app扫码登录</h1>
      </template>
      <!-- <span>请扫码登录</span> -->
      <!-- <template #footer> -->
      <div class="dialog-content">
        <img :src="imgUrl" alt="" @error="dealImgError"/>
      </div>
      <!-- </template> -->
    </el-dialog>
  </div>
  <div class="logined" v-else>
    <img :src="userInfo.avatarUrl ? userInfo.avatarUrl : imgUrl" alt="" @error="dealImgError"/>
  </div>
</template>

<script setup lang="ts">
// import "../../assets/css/modules-icon.less"
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { getKey, getQring, Login } from "../../api/login";
import { useStore } from "../../store/user";
import { storeToRefs } from "pinia";
import { image , dealImgError } from "../../baseconfig";

const user = useStore();
let timer1=ref() ,timer2=ref();
let dialogVisible = ref(false);
let imgUrl =ref("../../../src/assets/image/loading.gif");
let key = ref();
let { userInfo } = storeToRefs(user);
// let {userInfo} =user;
// console.log(toRef(userInfo));
// console.log(toRaw(userInfo));
// console.log(userInfo.value.profile.nickname);
async function dialogShow() {
  //显示遮罩层
  dialogVisible.value = !dialogVisible.value;
}

function getCookie() {
  try {
    new Promise(async (resolve, reject) => {
      let { data } = await getKey();
      key.value = data.data.unikey;
      setTimeout(async () => {
        let { data } = await getQring(key.value);
        imgUrl.value = data.data.qrimg ? data.data.qrimg : imgUrl.value;
      }, 10);
      resolve(data.data.unikey);
    }).then((Key) => {
      timer1.value = setInterval(async () => {
        let { data } = await Login(Key as string);
        // console.log(data);
        if (data.code === 803) {
          ElMessage({
            duration: 3000,
            type: "success",
            message: "登录成功",
          });
          clearInterval(timer1.value);
          // console.log(data);
          location.reload();
        } else if (data.code === 800) {
          ElMessage({
            duration: 3000,
            type: "success",
            message: "二维码过期",
          });
        }
      }, 5000);
      timer2.value = setTimeout(() => {
        clearInterval(timer1.value);
      }, 1000 * 60 * 2);
      // document.cookie=data.cookie;
      // console.log(document.cookie);
    });
  } catch (error) {
    if(error instanceof Error){
      ElMessage({
      type: "error",
      message: error.message
    });
    }
  }
}

function clearTimer() {
  // console.log(timer1.value,timer2.value);
  clearInterval(timer1.value);
  clearTimeout(timer2.value)
}
</script>

<style scoped lang="less">
@import "../../assets/css/modules-icon.less";

/deep/.el-overlay {
  z-index: inherit !important;
}

/deep/.el-dialog__body {
  // display: flex;
  // justify-items: center;
  margin: auto;
}
.login {
  h1 {
    text-align: center;
    color: #1b1b19;
    font-size: 1.6rem;
    letter-spacing: 1px;
  }
  .dialog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  img {
    width: 200px;
    height: 200px;
  }
}
/deep/.el-dialog {
  background-color: @modeBgColor !important;
}

.logined {
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
}
@media screen and (max-width: 1280px) {
  .logined {
    img {
      transform: scale(0.8);
    }
  }
}
</style>