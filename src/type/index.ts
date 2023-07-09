export  interface musicDeatils{//歌曲的信息
    name:string,
    id:number,
    fee:number,//歌曲的免费信息
    dt:number,
    al:{
        id:number,
        name:string,
        picUrl?:string,
    }
    ar:{
        id:number,
        name:string,
        [propname:string]:string | number,
    }[],
    transName?:string | undefined,
    ratio?:number,//某些榜单的歌曲有这个属性 用来说明飙升率
}
/**
 * 歌单的信息
 * user不是后端返回的 ，要根据userId去获取
 */
export interface pldetail {//歌单的详情
    id: number,
    playCount: number,//播放量
    subscribedCount?: number | undefined,//收藏数
    trackCount: number,//包含歌曲数 
    createTime?: number | undefined,
    commentCount?:number | undefined,//评论数
    userId?: number | undefined,
    name: string,
    description?: string | undefined,//简介
    coverImgUrl: string,
    subscribed?:boolean | undefined
    tags?: Array<string> | undefined,
    trackIds?: Array<number> | undefined,
    user?: { avatarUrl: string, nickname: string, userId: number } | undefined
    updateTime?: number | undefined,
}
/**
 * //专辑详情
 */
export interface aldetail{
    id:number,
    name:string,
    picUrl:string,
    publishTime?: number | undefined,
    size?:number | undefined //专辑包含歌曲数，
    commentCount?:number | undefined //评论数,
    shareCount?:number | undefined //分享数,
    subCount?:number | undefined //收藏数,
    isSub?:boolean | undefined //是否收藏
    description?:string | undefined //简介
    artists?:{
        id:number,
        name:string,
    }[],
    songs:musicDeatils[]
}
/**
 * //评论
 */
export interface comment{
    commentId:number,
    content:string,
    liked:boolean,//是否点赞过
    likedCount:number,//点赞数
    time:number,//一个距离1970年1月1日的毫秒值
    timeStr:string,// 03-26
    user:{
        avatarUrl:string,
        followed:boolean,//是否关注
        nickname:string,
        userId:number,
    },
    [porpname:string]:any
}

/**
 * //用户详情
 */
export interface user{
    avatarUrl:string,
    createTime?:number,
    follows?:number,//关注用户
    followeds?:number,//粉丝
    gender:0|1|2,
    level?:number,//等级
    listenSongs?:number,//累听歌数
    nickname:string,
    playlistCount?:number,//歌单数：听歌排行，喜欢音乐，创建歌单、收藏歌单
    signature:string,//个人介绍-
    userId:number,
    userType?:number //0为用户 、10为歌手
}

export interface recordMusic{//最近播放
    playTime:number;
    data:{
        name:string;
        fee:number;
        id:number;
        dt:number;
        al:{
            id:number;
            name:"";
        }
        ar:{id:number,name:string,[propname:string]:any}[]
    }
}
/**
 * 简易的专辑信息
 */
export interface simBlum{
    id:number,
    name:string,
    picUrl:string,
    artist:{
        id:number,
        name:string,
        alias:string[]
    }
}

/**
 * 简易的歌曲信息
 * 用来在某些排行榜中展示
 * 只需要有id name  artist即可 
 * 除此之外还有某些榜单所具有的属性
 */
export interface simmusic{
    id:number,
    name:string,
    ar:{
        id:number,
        name:string,
        [propname:string]:string | number,
    }[],
    ratio?:number,//飙升率

}

/**
 * //歌单标签
 */
export interface plTag{
    id?:number,
    name:string,
    category:0|1|2|3|4,
    hot:boolean,
}

export interface category {
    [propname:number]:string
}

/**
 * //歌手信息
 */
export interface artist{
    id:number,
    name:string,
    picUrl?:URL
    musicSize?:number,//歌曲数
    albumSize?:number,//专辑数
    fansCount?:number,//粉丝数
    followed?:boolean,//是否关注
    accountId?:number,//歌手的用户id
    trans?:string,//翻译名
}

