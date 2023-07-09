import axios from "axios";
import { ref } from "vue"

export const getTagType = () => {
    const prop = ref("play");
    console.log(11);
    return prop.value
}

export const getAllList = async (obj:{limit:number,order:number,cat?:string}) => {//获取热门歌单
    let { limit, order, cat } = obj
    // cat==undefined ? "华语" :cat
    cat = cat ? cat : "华语";
    // console.log(cat);
    // let {data} =await axios.get(`/top/playlist?limit=${limit}&order=${order}&cat=华语/${Date}`);
    //  console.log(data);
    return axios.get(`/top/playlist?limit=${limit}&order=${order}&cat=${cat}`);
}

// export const getHotList=async ()=>{
//     let {data} =await axios.get('/playlist/hot');
//     console.log(data);
// }
