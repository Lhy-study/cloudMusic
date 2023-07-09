import { defineStore } from "pinia";
import {randomInt} from "mathjs";
export const musicListStore=defineStore("musicList",{
    state:():playlist=>{
        return{
            isShuffle:false,//是否随机播放顺序
            shuffleList:[],//随机排序的歌单
            playlist:[] as Array<number>,//播放的列表 用处：用户查看播放的列表
            playMusic:{id:NaN,index:NaN}
        }
    },
    getters:{
        setMusic:(state)=>{
            return (id:number)=>{
                let list=state.isShuffle ? state.shuffleList : state.playlist;
                
                if(!list){
                    list=[]
                }
                // console.log(state.isShuffle,state.shuffleList,id);
                let index=list.indexOf(id) == -1 ? 0 :list.indexOf(id);
                // let index=1
                state.playMusic={id,index}
            }
        }
    },
    actions:{
        nextSong(){ //同时也可做顺序播放的功能
            //判断正在播放的这首歌在点击下一首之前是不是本播放列表的最后一首
            let list=this.isShuffle ? this.shuffleList : this.playlist;
            let index=this.playMusic.index+1 > list.length-1 ? 0 : this.playMusic.index+1 ;
            let id=list[index];
            this.setMusic(id);
            window.localStorage.setItem("playMusic",JSON.stringify({id,index}));
            // console.log('nextSong');
        },
        preSong(){
            //判断正在播放的这首歌在点击上一首之前是不是本播放列表的第一首
            let list=this.isShuffle ? this.shuffleList : this.playlist;
            let index=this.playMusic.index-1 <  0 ? list.length-1 : this.playMusic.index-1;
            
            let id=list[index];
            this.setMusic(id);
            window.localStorage.setItem("playMusic",JSON.stringify({id,index}));
        },
        shuffle(){//随机播放模式 原理 ：随机排序原本的播放歌单顺序
            let list:Array<number>=[],arr:Array<number>=[];
            list=this.playlist;
            // console.log(list === this.playlist);
           while (list.length>0) {
            let index=randomInt(0,list.length);
            // console.log(list.splice(index,1)[0]);
            arr.push(list.splice(index,1)[0]);
           }
        //    console.log(arr);
           this.shuffleList=arr;
        },
        pushPLaylist(id:number){//添加新的歌曲到播放列表
            this.playlist.push(id);
        },
        setPlaying(id:number,index:number){
            this.playMusic={id,index};
        },
        setPlayList(arr:Array<number>){//重新设置播放歌单
            this.playlist=arr;
        },
        addPlayList(arr:Array<number>){
            this.playlist=this.playlist.concat(arr);
        }
    }
});
interface playlist{
    isShuffle:boolean;
    shuffleList:Array<number>;
    playlist:Array<number>;
    playMusic:{id:number,index:number};
}