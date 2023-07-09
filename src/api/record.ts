import axios from "axios";

export function song(limit?:number){//最近播放的歌曲
    limit=limit?limit:30
    return axios.get(`/record/recent/song?limit=${limit}`);
}