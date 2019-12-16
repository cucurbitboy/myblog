import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/home.vue")
    },
    {
      path: "/articles",
      name: "articles",
      component: () =>
        import("./views/articles.vue")
    },
    {
      path: "/archive",
      name: "archive",
      component: () =>import(/* webpackChunkName: "archive" */ "./views/archive.vue")
    },
    {
      path: "/timeline",
      name: "timeline",
      component: () =>
        import(/* webpackChunkName: "timeline" */ "./views/timeline.vue")
    },
    {
      path: "/project",
      name: "project",
      component: () =>
        import(/* webpackChunkName: "project" */ "./views/project.vue")
    },
    {
      path: "/message",
      name: "message",
      component: () =>
        import(/* webpackChunkName: "message" */ "./views/message.vue")
    },
    {
      path: "/about",
      name: "about",
      component: () =>
        import("./views/aboutMe.vue")
    }
  ]
});
