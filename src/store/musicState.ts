import { defineStore } from "pinia";
import { musicListStore } from "./playlist";
import { musicStore } from "./musicInfo";
// let { duration } = storeToRefs(musicStore());
// const { nextSong } = musicListStore();
export const musicStateStore = defineStore("musicState", {
    state: (): musicState => {
        return {
            flag: false,
            // isLoading:false,
            musicAudio: document.querySelector("audio") as HTMLAudioElement,
            timeStr: "00:00",
            value1: 0,//歌曲进度条绑定的值
            value2: 1,//音量进度条绑定的值
            intermediateVariables: 0,//中间变量 用来实时更新时间戳
            isMute: false,//表示是否静音            
            // touch:true,
            timer: 0,//定时器的代称
            time: 0,//作为中间变量，用来双向绑定歌曲播放的时间 通过歌曲身获得
            state: true,
        }
    },
    actions: {
        update() {
            this.time = (this.musicAudio as HTMLAudioElement).currentTime as number;
        },
        flagtoTrue() {
            this.flag = true;
        },
        flagtoFalse() {
            this.flag = false;
        },
        begin() {//点击播放
            this.flagtoTrue();
            if (this.flag) {
                this.onPlay();
            }
        },
        timeOut() {//点击暂停
            console.log('timeOut');
            this.flagtoFalse();
            // flag.value=false;
            clearInterval(this.timer as number);
            (this.musicAudio as HTMLAudioElement).pause();
        },

        //变为播放状态
        onPlay() {
            clearInterval(this.timer as number);
            let num: number = musicStore().duration;
            // duration.value=playMusic.value.duration;
            if (this.flag && this.state) {  //只有图标为播放状态才进行进度条变化和歌曲播放
                this.timer = setInterval(() => {
                    // console.log('free');
                    //   console.log(1/num);
                    this.value1 += (1 / num);
                    this.intermediateVariables += 1;//再变为时间戳的实时更新歌曲时间
                    // console.log(111);
                    let minute, seconds;
                    if (this.intermediateVariables / 60 >= 10) {
                        minute = Math.floor(this.intermediateVariables / 60)
                    } else if (this.intermediateVariables / 60 > 0) {
                        minute = '0' + Math.floor(this.intermediateVariables / 60)
                    } else {
                        minute = '00'
                    }
                    seconds = Math.floor(this.intermediateVariables % 60) >= 10 ? Math.floor(this.intermediateVariables % 60) : '0' + Math.floor(this.intermediateVariables % 60);
                    this.timeStr = `${minute}:${seconds}`
                }, 1000);
                // console.log(this.flag, this.state, Date.now());
                (this.musicAudio as HTMLAudioElement).play();
                // console.log('this.musicAudio.play()');
            }
            // console.log( musicAudio.value);
        },

        //切换至另一首歌曲（无论是上一首还是下一首歌曲）
        free() {
            // console.log('free');
            clearInterval(this.timer as number);
            setTimeout(() => {
                this.onPlay();//这里使用异步的原因是当调用nextsong时的方法需要时间，需要音乐的路径渲染好后才可以调用.play()方法
                // console.log(musicAudio.value.duration);
                // musicAudio.value.play()
            }, 10);
        },

        //一首歌曲播放结束之后
        onEnd() {//下一首歌曲 把歌曲的时长、封面、名字渲染到dom上
            console.log('onEnd');
            musicListStore().nextSong();
        }
    }
});
interface musicState {
    musicAudio: HTMLAudioElement|null;
    flag: boolean;
    timeStr: string;
    value1: number;
    value2: number;
    intermediateVariables: number;
    isMute: boolean;
    timer: NodeJS.Timeout| number;
    time: number;
    state: boolean;
}
