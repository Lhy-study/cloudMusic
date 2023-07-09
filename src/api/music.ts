import axios from "axios";
import { ref } from "vue"

export const getTagType = () => {
    const prop = ref("play");
    // console.log(11);
    return prop.value
}

export const getLrc=(id:number)=>{//获取歌词路由
    return axios.get(`/lyric?id=${id}`);
}

export const checkMusic=(id:number)=>{//检查是否可用
    return axios.get(`/check/music?id=${id}`);
}

export const getDeatils=(idArr:Array<number>)=>{//获取一首或多首歌的信息
    let str=JSON.stringify(idArr);
    // console.log(str,idArr);
    let ids=str.replace("[","").replace("]","");
    return axios.get(`/song/detail?ids=${ids}`);
}

export const getSimilarSongs=(id:number)=>{
    return axios.get(`/simi/song?id=${id}`);
}

export const getUrl=(id:number)=>{
    return axios.get(`/song/url?id=${id}`);
}



