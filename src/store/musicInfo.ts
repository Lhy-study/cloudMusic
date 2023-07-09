import { defineStore } from "pinia";
export const musicStore = defineStore("musicInfo", {
    state: (): musicInfo => {
        return {
            id:0,
            name: "",
            musicUrl: "",
            author: [],
            album: {},//专辑
            musicCover: "",
            duration: 0,//歌曲的总时长 中间变量
            fee: 0,
            freeTrialInfo: {},//当为vip或者未登录状态下返回的 试听片段,
            state:true,
        }
    },
});

interface musicInfo {
    id: number;
    name: string;
    musicUrl: string;
    author: any[];
    album: object;
    musicCover: string;
    duration: number;
    fee: number;
    freeTrialInfo: object;
    state:boolean;
}