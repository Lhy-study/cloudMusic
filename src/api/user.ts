import axios from "axios"

export const usdetail=(uid:number)=>{//获取用户信息
    return axios.get(`/user/detail?uid=${uid}`)
}

export const subcount=()=>{//获取用户信息 , 歌单，收藏，mv, dj 数量
    return axios.get(`/user/subcount`);
}

export const likelist=(uid:number)=>{//获取喜欢的歌单数组
    return axios.get(`/likelist?uid=${uid}`);
}
/*为确保喜欢歌单、创建的歌单、收藏的歌单能够分类，且在对应歌单可以分页，所以一次性全部获取 */
export const uPlaylist=(obj:{uid:number,limit?:number,offset?:number})=>{//获取用户的歌单 ，其中包括喜爱歌单、自己创建的歌单、收藏的歌单 data.playlist[0].creator.userId
    let {uid,limit,offset} = obj;
    limit = limit ? limit : 30;
    offset = offset ? offset  : 0
    return axios.get(`/user/playlist?uid=${uid}&limit=${limit}&offset=${offset}`);
}

export const followed=(obj:{uid:number,offset?:number,limit?:number})=>{//获取关注列表
    let {uid,offset,limit} = obj;
    limit = limit ? limit : 30 ;
    offset = offset ? offset * limit : 0;    
    return axios.get(`/user/follows?uid=${uid}&limit=${limit}&offset=${offset}`);
}

export const fans=(obj:{uid:number,offset?:number,limit?:number})=>{//获取粉丝
    let {uid,offset,limit} = obj;
    limit = limit ? limit : 30 ;
    offset = offset ? offset * limit : 0;    
    return axios.get(`/user/followeds?uid=${uid}&limit=${limit}&offset=${offset}`);
}

export const getDaySongs=()=>{//获取每日推荐的音乐
    return axios.get(`/recommend/songs`);
}