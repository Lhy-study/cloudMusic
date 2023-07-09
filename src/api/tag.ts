import axios from "axios";

/**
 * //调用此接口,可获取歌单分类,包含 category 信息 这个没有id
 * @returns 
 */
export const catlist=()=>{ 
    return axios.get(`/playlist/catlist`);
}


/**
 * //调用此接口,可获取歌单分类,包含 category 信息 (热门分类) 不准确，一切以catlist为准 的hot为准
 * 这个只是用来展示部分热门分类
 * @returns 
 */
export const hotTag=()=>{ 
    return axios.get(`/playlist/hot`);
}


/**
 * //调用此接口,可获取精品歌单标签列表
 * @returns 
 */
export const highquality=()=>{ 
    return axios.get(`/playlist/highquality/tags`);
}