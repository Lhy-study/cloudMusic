export const modes :{[propname:string]:any}= {
    'default': {
        'modeTextColor': "#73776b",
        'modeBgColor': "white",//fdfcf4
        'modeThumbColor': "#979792",
        'modePColor': "#000101",
        'modePageColor': "linear-gradient(to top, #ffffff, #f6f6f8, #edeef0, #e4e5e9, #dadde2)"//显示歌词页面的背景yanse

        // modePageColor:"#d12121cc",

    },
    'dark': {
        'modeTextColor': "white",
        'modeBgColor': "#323333",
        'modeThumbColor': "white",
        'modePColor': "#979797",
        'modePageColor': "linear-gradient(to top, #323333 ,#323333, #3e403e, #4c4c4a, #5a5957)"//显示歌词页面的背景yanse
        // modePageColor:"#d12121cc",
    }
}

export const themes:{[propname:string]:any}= {
    'default': {
        'bgColor': "#dce5dd",
        'textColor': "#006c47",
        'buttonColor':"#616a54",
        'startColor':"#6A8588",
    },
    'dark':{
        'bgColor':"#f4dfd3",
        'textColor':"#8e4702",
        'buttonColor':"#963437",
        'startColor':"#806100",
    },
    'blue':{
        'bgColor':"#BEFBFF",
        'textColor':"#30CDDC",
        'buttonColor':"#4899E3",
        'startColor':"#5C7BBF",
    },
    'gold':{
        'bgColor':"#FFEECA",
        'textColor':"#FFBD8D",
        'buttonColor':"#C0AD71",
        'startColor':"#E9B307",
    },
    'purple':{
        'bgColor':"#FFE8FF",
        'textColor':"#B4A7B7",
        'buttonColor':"#CE9FD8",
        'startColor':"#FEA0CB",
    },
}

// export const themes= class themes {
//     default: object;
//     dark: object;
//     blue: object;
//     constructor() {
//         this.default = {
//             'bgColor': "#dce5dd",
//             'textColor': "#006c47",
//             'buttonColor': "#616a54",
//             'startColor': "#6A8588",
//         },
//         this.dark = {
//             'bgColor': "#f4dfd3",
//             'textColor': "#8e4702",
//             'buttonColor': "#963437",
//             'startColor': "#806100",
//         }
//         this.blue={
//             'bgColor':"#BEFBFF",
//             'textColor':"#30CDDC",
//             'buttonColor':"#4899E3",
//             'startColor':"#5C7BBF",
//         }
//     }
// }

