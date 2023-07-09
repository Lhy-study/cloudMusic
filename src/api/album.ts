import axios from "axios";
export const albumCont = (alId:number) => {//专辑内容
    return axios.get(`/album?id=${alId}`);
}

export const albumDynamic = (alId:number) => {//专辑动态信息 , 可获得专辑动态信息,如是否收藏,收藏数,评论数,分享数
    return axios.get(`/album/detail/dynamic?id=${alId}`);
}

export const albumSub = (alId:number,t:number) => {//收藏/取消收藏专辑
    return axios.get(`/album/sub?id=${alId}&t=${t}`);
}