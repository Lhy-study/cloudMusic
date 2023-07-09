import { createWebHashHistory, createRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useStore } from "../store/user";
import {ElMessage} from "element-plus";
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import("../views/HomeView.vue"),
    meta: {
      title: "首页"
    }
  },
  {
    path: '/explore',
    // name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/exploreView.vue'),
    children: [
      {
        path: "personalityRecommendation",
        component:()=>import("../components/exploreTabs/ex-personalityRecommendation.vue"),
      },
      {
        path: "playlistAll",
        component:()=>import("../components/exploreTabs/ex-playlistAll.vue"),
      },
      {
        path:"fine",
        component:()=>import("../components/exploreTabs/ex-finePlaylist.vue"),
      },
      {
        path: "toplist",
        component:()=>import("../components/exploreTabs/ex-toplist.vue"),
      },
      {
        path: "singerAll",
        component:()=>import("../components/exploreTabs/ex-singerAll.vue"),
      },
      {
        path: "newestMusic",
        component:()=>import("../components/exploreTabs/ex-newestMusic.vue"),
        children:[
          {
            path:"newmusic",
            component:()=>import("../components/exploreTabs/ex-newestMusicTabs/nm-newmusic.vue"),
          },
          {
            path:"newablum",
            component:()=>import("../components/exploreTabs/ex-newestMusicTabs/nm-newablum.vue"),
          }
        ]
      }
    ]
  },
  {
    path: '/setting',
    component: () => import('../views/settingView.vue'),
  },
  {
    path:"/dailyMusic",
    component:()=>import("../views/dailySongs.vue"),
  },
  // {
  //   path:'/recentlyPlayed',
  //   component:()=>import('../views/recentlyPlayedView.vue'),
  // },
  {
    path: "/singerpage/:id",
    component: () => import("../views/singerView.vue"),
    children: [
      {
        path: "album",
        component: () => import("../components/singerTabs/singer-albumTab.vue"),
      },
      {
        path: "info",
        component: () => import("../components/singerTabs/singer-infoTab.vue"),
        // beforeEnter(to,from ,next){
        //   console.log(to,from,next);
        //   next()
        // }
      },
      {
        path: "similar",
        component: () => import("../components/singerTabs/singer-similarTab.vue"),
      },
    ]
  },
  {
    path: '/playlistpage/:playlistid',
    component: () => import('../views/playlistShowView.vue'),
    children:[
      {
        path: "songs",
        component: () => import(/* webpackChunkName: "about" */ '../components/playlistTabs/pl-songs.vue'),
      },
      {
        path: "comments",
        component: () => import(/* webpackChunkName: "about" */ '../components/playlistTabs/pl-comments.vue'),
      },
      {
        path: "collectors",
        component: () => import(/* webpackChunkName: "about" */ '../components/playlistTabs/pl-collectors.vue'),
      }
    ]
  },
  {
    path: '/albumpage/:albumid',
    component: () => import('../views/albumShowView.vue'),
    children:[
      {
        path: "songs",
        component: () => import(/* webpackChunkName: "about" */ '../components/albumTabs/al-songs.vue'),
      },
      {
        path: "comments",
        component: () => import(/* webpackChunkName: "about" */ '../components/albumTabs/al-comments.vue'),
      },
      {
        path: "introduce",
        component: () => import(/* webpackChunkName: "about" */ '../components/albumTabs/al-introduce.vue'),
      }
    ]
  },
  {
    path: '/search/:keyword',
    // name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/searchView.vue'),
    children: [
      {
        path: "song",
        component: () => import(/* webpackChunkName: "about" */ '../components/searchTabs/se-song.vue'),
      },
      {
        path: "singer",
        component: () => import(/* webpackChunkName: "about" */ '../components/searchTabs/se-singer.vue'),
      },
      {
        path: "album",
        component: () => import(/* webpackChunkName: "about" */ '../components/searchTabs/se-album.vue'),
      }
    ]
  },
  {
    path: '/personal',
    component: () => import("../views/personalView.vue"),
    children:[
      {
        path:"home",
        component:()=>import("../components/personalTabs/home.vue"),
      },{
        path:"likeList",
        component:()=>import("../components/personalTabs/per-likelist.vue"),
      },
      {
        path:"create",
        component:()=>import("../components/personalTabs/per-create.vue"),
      },
      {
        path:"follows",
        component:()=>import("../components/personalTabs/per-followed.vue"),
      },
      {
        path:"fans",
        component:()=>import("../components/personalTabs/per-fans.vue"),
      }
    ]
  },
  {
    path:"/clientHome/:uid",
    component:()=>import("../views/userView.vue"),
  },
  // {
  //   path:'/s:(*)',
  //   component:()=>import("../components/modules/Emptyfirst.vue"),
  // }
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

router.beforeEach((to, from) => {// /^\/singerpage+.*similar$/
  if (((/^\/personal/).test(to.fullPath) || (/^\/dailyMusic/).test(to.fullPath)) && !useStore().userInfo.userId) {
    ElMessage({
      message: "很抱歉，您还未登录",
      type: "warning",
      duration: 1000,
    })
    return from.fullPath
  }
  if ((/^\/singerpage+.*similar$/).test(to.fullPath) && !useStore().userInfo.userId) {
    ElMessage({
      message: "还未登录，查看不了相似歌手信息",
      type: "error",
      duration: 1000,
    })
    return false
  }
});

// router.beforeEach((to, from) => { // 单独写也是可以的
//   if ((/^\/singerpage+.*similar$/).test(to.fullPath) && !useStore().userInfo.userId) {
//     // console.log(from.fullPath);
//     return false
//   }
// })

export default router