import axios from "axios";
//搜索结果
//默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合,
export const search = (obj: { keywords: string, limit?: number | undefined, offset?: number | undefined, type?: number |undefined}) => {
    let { keywords, limit, offset, type } = obj;
    // console.log(keywords);
    limit = limit ? limit : 30;
    offset = offset ? (offset - 1) * limit as number : 0
    type = type ? type : 1;
    return axios.get(`/cloudsearch?keywords=${keywords}&limit=${limit}&offset=${offset}&type=${type}`);//&timestamp=${Date.now()}
}

export const multimatch =(obj:{keywords:string})=>{//搜索匹配
    let {keywords} =obj;
    return axios.get(`/search/multimatch?keywords=${keywords}`)
}


export const searchSuggest =(obj:{keywords:string,type?:string})=>{//搜索建议
    let {keywords} =obj;
    return axios.get(`/search/suggest?keywords=${keywords}`)
}