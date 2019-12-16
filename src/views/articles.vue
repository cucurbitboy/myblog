<template>
  <div class="left clearfix">
    <h3 v-if="params.tag_id" class="left-title">{{tag_name}} 相关的文章：</h3>
    <ul class="articles-list" id="list">
      <transition-group name="el-fade-in">
        <li @click="articleDetail(article._id)"
            v-for="(article) in articlesList"
            :key="article._id"
            class="item">
          <img class="wrap-img img-blur-done"
               :data-src="article.img_url"
               data-has-lazy-src="false"
               src="../assets/demo.jpg"
               alt="文章封面" />
          <div class="content">
            <h4 class="title">{{article.title}}</h4>
            <p class="abstract">{{article.desc}}</p>
            <div class="meta">
              <span>查看 {{article.meta.views}}</span>
              <span>评论 {{article.meta.comments}}</span>
              <span>赞 {{article.meta.likes}}</span>
              <span v-if="article.create_time"
                    class="time">
                {{formatTime(article.create_time)}}
              </span>
            </div>
          </div>
        </li>
      </transition-group>
    </ul>
    <LoadingCustom v-if="isLoading"></LoadingCustom>
    <LoadEnd v-if="isLoadEnd"></LoadEnd>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import {
  throttle,
  getScrollTop,
  getDocumentHeight,
  getWindowHeight,
  getQueryStringByName,
  timestampToTime
} from "@/utils/utils";
import LoadEnd from "@/components/loadEnd.vue";
import LoadingCustom from "@/components/loading.vue";

const viewHeight = window.innerHeight || document.documentElement.clientHeight;
const lazyload = throttle(() => {
  const imgs = document.querySelectorAll("#list .item img");
  let num = 0;
  for (let i = num; i < imgs.length; i++) {
    let distance = viewHeight - imgs[i].getBoundingClientRect().top;
    let imgItem: any = imgs[i];
    if (distance >= 100) {
      let hasLaySrc = imgItem.getAttribute("data-has-lazy-src");
      if (hasLaySrc === "false") {
        imgItem.src = imgItem.getAttribute("data-src");
        imgItem.setAttribute("data-has-lazy-src", "true");
      }
      num = i + 1;
    }
  }
}, 1000);

@Component({
  components: {
    LoadEnd,
    LoadingCustom
  }
})
export default class Articles extends Vue {
  // initial data
  isLoadEnd: boolean = false;
  isLoading: boolean = false;
  articlesList: Array<object> = [];
  total: number = 0;
  tag_name: string = decodeURI(getQueryStringByName("tag_name"));
  params: any = {
    keyword: "",
    likes: "", // 是否是热门文章
    state: 1, // 文章发布状态 => 0 草稿，1 已发布,'' 代表所有文章
    tag_id: getQueryStringByName("tag_id"),
    category_id: getQueryStringByName("category_id"),
    pageNum: 1,
    pageSize: 10
  };

  // lifecycle hook
  mounted() {
    this.handleSearch();
    window.onscroll = () => {
      if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 100) {
        // 如果不是已经没有数据了，都可以继续滚动加载
        if (this.isLoadEnd === false && this.isLoading === false) {
          this.handleSearch();
        }
      }
    };
    document.addEventListener("scroll", lazyload);
  }

  @Watch("$route")
  routeChange(val: Route, oldVal: Route) {
    this.tag_name = decodeURI(getQueryStringByName("tag_name"));
    this.params.tag_id = getQueryStringByName("tag_id");
    this.params.category_id = getQueryStringByName("category_id");
    this.articlesList = [];
    this.params.pageNum = 1;
    this.handleSearch();
  }

  // method
  articleDetail(id: string) {
    // console.log("`id`", `/articleDetail?article_id=${id}`);
    let url: string = "";
    if (process.env.NODE_ENV === "development") {
      url = "http://localhost:3001/articleDetail?";
    } else {
      url = "https://biaochenxuying.cn/articleDetail?";
    }
    window.open(url + `article_id=${id}`);
  }
  formatTime(value: any) {
    return timestampToTime(value, true);
  }
  async handleSearch() {
    this.isLoading = true;
    this.articlesList = [{
        category: ["5bf014e8bc1e7805eb83dba7"],
        create_time: "2019-06-21T11:28:48.423Z",
        desc: "星河滚烫你是人间理想",
        img_url: '../assets/temp.jpg',
        meta: {views: 92, likes: 0, comments: 6},
        tags: ["5bf013a6bc1e7805eb83db97"],
        title: "星河滚烫你是人间理想",
        _id: "1"
      }, {
        category: ["5bf014e8bc1e7805eb83dba7"],
        create_time: "2019-06-21T11:28:48.423Z",
        desc: "万世浮沉你是人间归途",
        img_url: "../assets/temp.jpg",
        meta: {views: 92, likes: 0, comments: 6},
        tags: ["5bf013a6bc1e7805eb83db97"],
        title: "人海冷漠你是人间炽热",
        _id: "3"
      },{
        category: ["5bf014e8bc1e7805eb83dba7"],
        create_time: "2019-06-21T11:28:48.423Z",
        desc: "世事无常你是人间琳琅",
        img_url: "../assets/temp.jpg",
        meta: {views: 92, likes: 0, comments: 6},
        tags: ["5bf013a6bc1e7805eb83db97"],
        title: "众人平庸你是人间星光",
        _id: "2"
      }
    ]
    // const res: any = await this.$https.get(this.$urls.getArticleList, {
    //   params: this.params
    // });
    // this.isLoading = false;
    // if (res.status === 200) {
    //   if (res.data.code === 0) {
    //     const data: any = res.data.data;
    //     this.articlesList = [...this.articlesList, ...data.list];
    //     this.total = data.count;
    //     this.params.pageNum++;
    //     if (this.total === this.articlesList.length) {
    //       this.isLoadEnd = true;
    //     }
    //     this.$nextTick(() => {
    //       lazyload();
    //     });
    //   } else {
    //     this.$message({
    //       message: res.data.message,
    //       type: "error"
    //     });
    //   }
    // } else {
    //   this.$message({
    //     message: "网络错误!",
    //     type: "error"
    //   });
    // }
  }
}
</script>

<style lang="less" scoped>
.left {
  .articles-list {
    margin: 0;
    padding: 0;
    list-style: none;
    .title {
      color: #333;
      margin: 7px 0 4px;
      display: inherit;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.5;
    }
    .item > div {
      padding-right: 140px;
    }
    .item .wrap-img {
      position: absolute;
      top: 50%;
      margin-top: -50px;
      right: 0;
      width: 125px;
      height: 100px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        border: 1px solid #f0f0f0;
      }
    }
    li {
      line-height: 20px;
      position: relative;
      width: 100%;
      padding: 15px 0px;
      border-bottom: 1px solid #f0f0f0;
      word-wrap: break-word;
      cursor: pointer;
      &:hover {
        .title {
          color: #000;
        }
      }
      .abstract {
        min-height: 30px;
        margin: 0 0 8px;
        font-size: 13px;
        line-height: 24px;
        color: #555;
      }
      .meta {
        padding-right: 0 !important;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        a {
          margin-right: 10px;
          color: #b4b4b4;
          &::hover {
            transition: 0.1s ease-in;
            -webkit-transition: 0.1s ease-in;
            -moz-transition: 0.1s ease-in;
            -o-transition: 0.1s ease-in;
            -ms-transition: 0.1s ease-in;
          }
        }
        span {
          margin-right: 10px;
          color: #666;
        }
      }
    }
  }
}
</style>