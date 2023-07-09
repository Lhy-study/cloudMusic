import {createPinia} from "pinia";
const pinia= createPinia();
import { storeToRefs } from "pinia";
import { likeList } from "../store/likeList";
let { likelists } = storeToRefs(likeList(pinia));

export function formatIsLike(id:number){
    return likelists.value.includes(id);
}

/**
 * //格式化数量量
 * @param num 
 * @returns 
 */
export const formatNum = (num: number) => {
    let playnum;
    if (num >=100000000) {
        playnum = `${Math.floor(num / 100000000)}亿`
    } else if (num >= 10000) {
        playnum = `${Math.floor(num / 10000)}万`
    } else {
        playnum = num
    }
    return playnum
}

/**
 * //格式化时长 04:00
 * @param time 
 * @returns 
 */
export const fomatDuration = (time: number) => {
    //格式化歌曲总时长
    let Time = Math.floor(time / 60);
    let minute;
    if (Time >= 10) {
        minute = Time;
    } else if (Time > 0) {
        minute = "0" + Time;
    } else {
        minute = "00";
    }
    let seconds =
        Math.floor(time % 60) >= 10
            ? Math.floor(time % 60)
            : "0" + Math.floor(time % 60);
    return `${minute}:${seconds}`;
}

// export function formatFee(num: number) {
//     let p: string;
//     switch (num) {
//       case 1:
//         p = "VIP";
//         break;
//       case 4:
//         p = "付费";
//         break;
//       default:
//         p = "免费";
//         break;
//     }
//     return p;
// }

/**
 * //格式化日期  2021-01-01 如果是今年则 01-01
 * @param time 
 * @returns 
 */
export const formatDate =(time:number)=>{  
    let now=Date.now();
    let nowYear=new Date(now).getFullYear()
    let day:string|number=new Date(time).getDate();
    day=day>=10?day:`0${day}`;
    let month:string|number=new Date(time).getMonth()+1;
    month=month>=10?month:`0${month}`;
    let year:number=new Date(time).getFullYear();
    if(year==nowYear){
        return `${month}-${day}`
    }else{
        return `${year}-${month}-${day}`
    }
}

/**
 * //格式化具体时间  12:00:00
 * @param time 
 * @returns 
 */
export function formatTime(time:number){
    let Time=new Date(time);
    let hours,minutes,seconds;
    hours=Time.getHours()>=10?Time.getHours():`0${Time.getHours()}`;
    minutes=Time.getMinutes()>=10?Time.getMinutes():`0${Time.getMinutes()}`;
    seconds=Time.getSeconds()>=10?Time.getSeconds():`0${Time.getSeconds()}`;
    return `${hours}:${minutes}:${seconds}`
}

/**
 * //格式化性别 1男 ，2女
 * @param gender 
 * @returns 
 */
export function formatGender(gender:0|1|2){
   switch (gender) {
    case 0:
        return "icon-wuxingbie :true"
        break;
   
    case 1:
        return "icon-nan :true"
        break;

    case 2:
        return "icon-nv : true"
        break;
   }
}

export function formatFee(fee:number){
    switch(fee){
        case 1:
            return "icon-vip"
            break;
        case 4:
            return "icon-fufeizhifu"
            break;
        default:
            return "icon-mianfei"
    }
}

export function fromatcat(category:string){
    // console.log(category);
    switch(category){
        
        case "语种":
            return "icon-yuyan-kong"
            break;
        case "风格":
            return "icon-fengge"
            break;
        case "场景":
            return "icon-changjing1"
            break;
        case "情感":
            return "icon-qingganganqing"
            break;
        case "主题":
            return "icon-zhineng-zhuti-01"
            break;
        default :
            return "icon-shezhi"
            break;
    }
}

/**
 * 距离上次播放的时间 几天前 、几小时前、几分钟前
 * @param playTime 
 * @returns 
 */
export function formatPt(playTime:number){
    let nowT=Date.now();

    let difference:number=nowT - playTime; //差值
 
    let oneDay = 1000 * 60 *60 *24;//一天
    let oneH = 1000 * 60 * 60 ;//一小时 
    let oneM =1000 * 60
    if(difference>oneM && difference<oneH){ 
        return `${Math.floor(difference/oneM)}分钟前` 
    }else if(difference>oneH && difference<oneDay){
        return `${Math.floor(difference/oneH)}小时前` 
    }else if(difference>oneDay && difference<oneDay * 2){
        return `昨天`
    }else if(difference > oneDay *2){
        return formatDate(playTime)
    }else{
        return '刚刚'
    }
}

