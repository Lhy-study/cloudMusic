import axios from "axios";
import { ref } from "vue";

export const getTagType = () => {
    const prop = ref("play");
    // console.log(11);
    return prop.value
}
/**
 * //获取歌单详情
 * @param id 
 * @returns 
 */
export const plDetail=(id:number)=>{
    return axios.get(`/playlist/detail?id=${id}`);
}

/**
 * //获取热门歌单
 * @param obj 
 * @returns 
 */
export const getAllList =(obj:{limit?:number,order?:string,cat?:string,offset?:number}) => {
    let { limit, order, cat ,offset} = obj
    // cat==undefined ? "华语" :cat
    cat = cat ? cat : "华语";
    limit = limit ? limit : 30;
    order = order ? order : "hot";
    offset=offset ? (offset-1)*limit : 0 ;
    return axios.get(`top/playlist?limit=${limit}&order=${order}&cat=${cat}&offset=${offset}`);
}
/**
 * //获取精品歌单
 * @param obj 
 * @returns 
 */
export const getHighquality=(obj:{limit?:number,cat?:string})=>{
    let {limit,cat}=obj;
    limit=limit ? limit : 30;
    cat=cat ? cat : "华语";
    return axios.get(`/top/playlist/highquality?limit=${limit}&cat=${cat}`);
}

/**
 * //获取5个相似的歌单
 * @param id 
 * @returns 
 */
export const related=(id:number)=>{
    return axios.get(`/related/playlist?id=${id}`);
}
/**
 * //调用后可获取歌单详情动态部分,如评论数,是否收藏,播放数
 * @param id 
 * @returns 
 */
export const dynamic=(id:number)=>{
    return axios.get(`/playlist/detail/dynamic?id=${id}&timestamp=${Date.now()}`);
}

/**
 * //收藏或者取消收藏歌单 1为收藏
 * @param id 
 * @param t 
 * @returns 
 */
export const subscribe=(id:number,t:number)=>{
    return axios.get(`playlist/subscribe?t=${t}&id=${id}`);
}


export const subscribers=(obj:{id:number,limit?:number,offset?:number})=>{
    let {id,limit,offset}=obj;
    limit=limit ? limit : 40;
    offset=offset ? (offset-1)*limit : 0 ;
    return axios.get(`/playlist/subscribers?id=${id}&limit=${limit}&offset=${offset}`);
}