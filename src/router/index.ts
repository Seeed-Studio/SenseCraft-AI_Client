import Layout from "@renderer/layout/index.vue"
import {
  createRouter,
  RouteRecordRaw,
  createWebHashHistory,
  createWebHistory
} from "vue-router"
import { ERouter } from "@renderer/types/defines"
import i18n from "@renderer/i18n"
const { t, tm } = i18n.global
export const settingRouterList = () => {
  return [
    {
      path: `${ERouter.ABOUT}`,
      name: `${ERouter.ABOUT}`,
      component: async () => await import("@renderer/view/setting/about.vue"),
      meta: {
        title: t("about")
      }
    }
  ]
}
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layout,
    redirect: `${ERouter.LIVE}`,
    meta: {
      title: t("title")
    },
    children: [
      {
        path: `${ERouter.LIVE}`,
        name: `${ERouter.LIVE}`,
        component: async () => await import("@renderer/view/live.vue"),
        meta: {
          title: t("title"),
          hideSubHeader: true,
          visibleRightSider: true
        }
      },
      {
        path: `${ERouter.FULLSCREEN}/:id`,
        name: `${ERouter.FULLSCREEN}`,
        component: async () =>
          await import("@renderer/view/video/fullscreen.vue"),
        meta: {
          hideSubHeader: true,
          title: '',
          backPage: {
            name: `${ERouter.LIVE}`
          }
        }
      },
      {
        path: `${ERouter.STREAM_LIST}`,
        name: `${ERouter.STREAM_LIST}`,
        component: async () => await import("@renderer/view/video/videos.vue"),
        meta: {
          title: t("videoStream"),
          backPage: {
            path: "/"
          }
        }
      },
      {
        path: `${ERouter.STREAM_CONFIG}/:id`,
        name: `${ERouter.STREAM_CONFIG}`,
        component: async () =>
          await import("@renderer/view/video/streamConfig.vue"),
        meta: {
          title:'',
          backPage: {
            name: `${ERouter.STREAM_LIST}`
          }
        }
      },
      {
        path: `${ERouter.SETTING}`,
        name: `${ERouter.SETTING}`,
        component: async () =>
          await import("@renderer/view/setting/setting.vue"),
        meta: {
          title: t("setting"),
          backPage: {
            path: "/"
          }
        }
      },
      ...settingRouterList().map((item) => {
        item.meta["backPage"] = {
          name: ERouter.SETTING
        }
        return item
      })
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// set Page Tile
router.beforeEach((to, from, next) => {
  const title = to.meta.title as string
  if (title) {
    document.title = title
  }
  if (to.query.reference) {
    to.meta.backPage = {
      name: to.query.reference
    }
  }
  next()
})

export default router
