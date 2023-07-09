import { storeToRefs } from "pinia";
import {createPinia} from "pinia";
createPinia();
import {musicListStore } from "../store/playlist";
let {playlist} = storeToRefs(musicListStore());
const {setPlaying,pushPLaylist ,setPlayList ,addPlayList} =musicListStore();

import {plDetail} from "../api/playlist";
import { albumCont } from "../api/album";
import { ElMessage } from "element-plus";

/**
 * 
 * @param id 只知道一首歌的id时，可以用这个方法播放歌曲
 */
export const setNewPlayMusic=(id:number)=>{//播放单独一首音乐
  if(!playlist.value){playlist.value=[]}
  let index:number;
  if(playlist.value.indexOf(id)!=-1){
    index=playlist.value.indexOf(id);
  }else{
    index=playlist.value.length;
    pushPLaylist(id);
    localStorage.setItem("playlist", JSON.stringify(playlist.value));
    localStorage.setItem("playMusic", JSON.stringify({ id, index }));
  }
  setPlaying(id,index);
}

export const getAllId=(obj_arr:{id:number,[propname:string]:any}[])=>{
  let arr:number[]=[];
  for (let index = 0; index < obj_arr.length; index++) {
    arr.push(obj_arr[index].id);
  }
  return arr
}

export const playAllMusic=(idArr:number[])=>{//播放一个歌单或者专辑的音乐
  // console.log(idArr,idArr[0]);
  // console.log(idArr);
  setNewPlayMusic(idArr[0]);
  setPlayList(idArr);
}

export const addplayList=(arr:number[])=>{
  addPlayList(arr);
}

/**
 * 
 * @param id 只知道一个歌单的id时，可以用这个方法播放歌单
 */
export async function play(id:number){
  //   console.log(id);
  try {
    let {data} =await plDetail(id);
    if(data.playlist){
      playAllMusic(getAllId(data.playlist.trackIds));
    }
  } catch (error) {
    if(error instanceof Error){
      ElMessage.error(`${error.message}，请检查网络连接`);
    }
  }
}

export async function play_al(id:number){
  try {
    let {data} =await albumCont(id);
    if(data.songs){
      playAllMusic(getAllId(data.songs));
    }
  } catch (error) {
    if(error instanceof Error){
      ElMessage({
        type:"error",
        message:error.message
      });
    }else{
      ElMessage({
        type:"error",
        message:error as string
      });
    }
  }
}