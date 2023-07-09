import axios from "axios";

export const baseInfo = (id: number) => {//获取歌手详情
    return axios.get(`/artist/detail?id=${id}`);
}

export const detail = (id: number) => {//获取歌手详情
    return axios.get(`/artist/desc?id=${id}`);
}

export const fansNum = (id: number) => {//获取歌手粉丝数
    return axios.get(`/artist/follow/count?id=${id}`);
}

export const simiSinger = (id: number) => {//获取歌手相似歌手
    return axios.get(`/simi/artist?id=${id}`)
}

export const album = (obj: { id: number, limit?: number, offset?: number }) => {
    let { id, limit, offset } = obj;
    limit = limit ? limit : 30;
    offset = offset ? offset * limit : 0
    return axios.get(`/artist/album?id=${id}&limit=${limit}&offset=${offset}`);
}