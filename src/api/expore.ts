import axios from "axios";

/**
 * //获取推荐歌单 （不需要登录）
 * @param limit 
 * @returns 
 */
export const personalized=(limit?:number)=>{
    limit=limit?limit:30;
    return axios.get(`/personalized?limit=${limit}`);
}

/**
 * //获取推荐新音乐 （不需要登录）
 * @param limit 
 * @returns 
 */
export const personalizedNewsong=(limit?:number)=>{
    limit=limit?limit:30;
    return axios.get(`/personalized/newsong?limit=${limit}`);
}

/**  list的每一项中如果有ToplistType属性则是官方榜单
 * //获取所有榜单
 * @returns 
 */
export const gettoplist=()=>{
    return axios.get(`/toplist`);
}

/**
 * initial: 按首字母索引查找参数
 * 
 * type-1:全部
    1:男歌手
    2:女歌手
    3:乐队

    area 取值:

    -1:全部
    7华语
    96欧美
    8:日本
    16韩国
    0:其他
 * @param obj 
 * @returns 
 */
export const getArtist = (obj: 
    { limit: number, offset: number, initial: string,
         type: -1 | 1 | 2 | 3, area: -1 | 7 | 96 | 8 | 16 | 0 
    }
        ) => {
    return axios.get(`/artist/list`, {params:{...obj}});
}
/**
 * 还可以选月份和年份 ，不过这样子就没意义了 这里面有专辑 ，type为Single的也可以通过album获取专辑
 * @param obj 
 */
export const getNewSongs=(obj:{area:"ALL"|"ZH"|"EA"|"KR"|"JP",type:"new"|"hot"})=>{
    return axios.get(`/top/album`,{params:{...obj}});
}

/**
 * //获取的是新歌速递
 * @param type 0:全部 7华语 96欧美 8:日本 16韩国 
 * @returns 
 */

enum emnumType{
    "全部"=0,
    "华语"=7,
    "欧美"=96,
    "韩国"=16,
    "日本"=8,
}
export const newSongExpress=(type:emnumType)=>{
    return axios.get(`/top/song?type=${type}`);
}
