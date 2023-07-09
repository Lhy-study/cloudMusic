import axios from "axios";
export const getHotComment=(obj:{id:number,type?:number,limit?:number,offset?:number})=>{//
    let {id,type,limit,offset}=obj;
    type=type ? type :  0;
    limit=limit ? limit : 20;
    offset=offset ? (offset-1)*limit : 0 ;
    return axios.get(`/comment/hot?id=${id}&type=${type}&limit=${limit}&offset=${offset}`);
    // return axios({method:"post",url:`/comment/hot/${Date.now()}`,data:{id,type,limit,offset}});  //post请求一定要记得带时间戳，防止同一条路由被缓存
}

export const plcomment=(obj:{id:number,offset?:number,limit?:number})=>{
    let {id,limit,offset}=obj;
    limit=limit ? limit : 50;
    offset=offset ? (offset-1)*limit : 0 ;
    return axios.get(`/comment/playlist?id=${id}&limit=${limit}&offset=${offset}`);
}

export const alcomment=(obj:{id:number,offset?:number,limit?:number})=>{
    let {id,limit,offset} =obj;
    limit=limit ? limit : 50;
    offset=offset ? (offset-1)*limit : 0 ;
    return axios.get(`/comment/album?id=${id}&limit=${limit}&offset=${offset}`);
}