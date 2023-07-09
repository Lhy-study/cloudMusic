<template>
  <ul>
    <h3 v-if="!idArr.ids.length">非常遗憾，暂无相似的音乐</h3>
    <h3 v-else>与这首歌相似的音乐</h3>
    <template v-for="(item,index) in idArr.info" :key="`${item.id}+${item.name}`">
      <li v-if="idArr.info.length>0" @click.stop="setNewPlayMusic(item.id)">
        <img :src="image.Cover" :data-src="`${item.al.picUrl}?param150y=150`"  @error="dealImgError" v-lazyImg>
        <div>
          <p>{{item.name}}&nbsp;-&nbsp;</p>
          <p v-for="(i,arindex ) in item.ar" :key="`${i.id}+${i.name}`">{{i.name}} <span v-if="arindex!=item.ar.length-1">/</span></p>
        </div>
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import {watchEffect, reactive, nextTick} from "vue";
import {storeToRefs} from "pinia";
import {getSimilarSongs,getDeatils} from "../../api/music";
import {musicListStore} from "../../store/playlist";
import { image , dealImgError } from "../../baseconfig";
const {playMusic,playlist} = storeToRefs(musicListStore());
const {pushPLaylist,setPlaying}=musicListStore();



let idArr=reactive({
  ids:[] as any[],
  info:[] as any[],
});
// onMounted(async()=>{
//     new Promise(async(resolve,reject)=>{
//       // console.log(playMusic.value.id);
//         let {data}= await getSimilarSongs(playMusic.value.id);
//         // console.log(data);
//         if(data.songs){
//           let arr:number[]=[];
//           data.songs.forEach(item=> {
//             arr.push(item.id);
//           });
//           idArr.ids=arr;
//         // console.log(idArr.ids);
//           resolve(arr); 
//         }else{
//           idArr.ids=[];
//           reject([]);
//         }

//     }).then(async (i)=>{
//       console.log(i);
//      let {data} =await getDeatils(i as number[]);
//       idArr.info=data.songs;
//       await nextTick();
//     }).catch((i)=>{
//       idArr.info=i;
//     });
// });

// watch(()=>playMusic.value.id,(val,oldVal)=>{
//   new Promise(async(resolve,reject)=>{
//       // console.log(playMusic.value.id);
//         let {data}= await getSimilarSongs(val);
//         // console.log(data);
//         if(data.songs){
//           let arr:number[]=[];
//           data.songs.forEach(item => {
//             arr.push(item.id);
//           });
//           idArr.ids=arr;
//         // console.log(idArr.ids);
//           resolve(arr); 
//         }else{
//           idArr.ids=[];
//           reject([]);
//         }

//     }).then(async (i)=>{
//       // console.log(i);
//      let {data} =await getDeatils(i as number[]);
//      await nextTick();
//       idArr.info=data.songs;
//     }).catch((i)=>{
//       idArr.info=i;
//     });
// });

watchEffect(()=>{
  new Promise(async(resolve,reject)=>{
      // console.log(playMusic.value.id);
        let {data}= await getSimilarSongs(playMusic.value.id);
        // console.log(data);
        if(data.songs as any[]){
          let arr:number[]=[];
          data.songs.forEach((item:{id:number,[propName: string]: any}) => {
            arr.push(item.id);
          });
          idArr.ids=arr;
        // console.log(idArr.ids);
          resolve(arr); 
        }else{
          idArr.ids=[];
          reject([]);
        }

    }).then(async (i)=>{
      // console.log(i);
     let {data} =await getDeatils(i as number[]);
     await nextTick();
      idArr.info=data.songs;
    }).catch((i)=>{
      idArr.info=i;
    });
})
//461347998
function setNewPlayMusic(id:number){
  let index:number;
  console.log(playlist.value.indexOf(id));
  if(playlist.value.indexOf(id)!=-1){
      index=playlist.value.indexOf(id);
  }else{
    index=playlist.value.length;
    pushPLaylist(id);
    localStorage.setItem("playlist",JSON.stringify(playlist.value));
    localStorage.setItem("playMusic",JSON.stringify({id,index}));
  }
  setPlaying(id,index);
}
</script>

<style lang="less" scoped>
h3{
  font-size: 2rem;
  color:@modeTextColor;
  padding-bottom: 2rem;;
}
li{
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  img{
    width: 5rem;
    height: 5rem;
    border-radius: 20%;
  }
  div{
    display: flex;
    padding-left: 1rem;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    p{
      font-size: 1.6rem;
      color: @modePColor;
    }
  }
}
</style>