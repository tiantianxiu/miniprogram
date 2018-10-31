const app = getApp()
import {request} from '../../utils/util.js'

Page({
  data: {
    have_data: false,
    nomore_data: false,
    tab:'recommend',
    loading_hidden: true,
    loading_msg: '加载中...',
    scrollTop:'',

    // swiper设置
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    swiperCurrent:0,
    // 推荐
    swiperCurR:0,
    swiperIndexR:0,
    page_size: 10,
    page_index: 0,
    articleList: [], 
    imgRecommend: [],
    // 车代表
    page_CarVipSize: 10,
    page_CarVipIndex: 0,
    articleListCarVip: [],
    carViptag:'carVipThread',
    userList: [],
    page_usersize: 15,
    page_userindex: 0,
    checkRead: true,
    applyStatus: '',
    applyTest: '',
    // 吐槽
    swiperCurF: 0,
    swiperIndexF: 0,
    page_ForumlistSize: 10,
    page_ForumlistIndex: 0,
    articleListForumlist: [],
    imgForumList: [
    ],
    // 话题
    topicList:[],
    newTopicList:[],
    page_topicSize: 10,
    page_topicIndex: 0,

    // E讯
    swiperCurE:0,
    swiperIndexE:0,    
    imgEnews: [],
    carTagList:[],
    einfoList:[],
    carid:'',
    page_eSize: 10,
    page_eIndex: 0,

    members:'',//会员数
    online:''//在线人数
  }, 
 
  onLoad: function (options) {
    const that = this
    if(options.tab){
      that.setData({
        tab: options.tab,
      })
    }
    that.reloadIndex();
  },
  onReachBottom: function () {
    const that = this, tab = that.data.tab
    switch (tab) {
      case 'recommend':
        that.recommendOnRB()
        break
      case 'vipCar':
        that.vipCarOnRB()
        break
      case 'forumList':
        that.forumListOnRB()
        break
      case 'topicList':
        that.topicListOnRB()
        break
      case 'Enews':
        that.EnewsOnRB()
        break  
    }
  },

  reloadIndex: function() {
    const that = this, tab = that.data.tab
    that.setLoding() 
    that.setPageScrollToTop() 
    that.setData({
      page_index: 0,
      page_CarVipIndex: 0,
      page_userindex: 0,
      page_ForumlistIndex: 0,
      page_topicIndex: 0,
      page_eIndex: 0,
    })
    switch (tab) {
      case 'recommend':
        that.recommend()
        break
      case 'vipCar':
        that.vipCar()
        break
      case 'forumList':
        that.forumList()
        break
      case 'topicList':
        that.topicList()
        break
      case 'Enews':
        that.Enews()
        break
    }
    that.getOnline()
  },
  getOnline: function () {
    const that = this
    request('post','get_online.php',{
        token: wx.getStorageSync("token"),
      }).then((res)=>{
        that.setData({
            online: res.data.online,
            members: res.data.members
        })
      })
  },
  setLoding: function() {
    this.setData({
        loading_hidden: false,
        loading_msg: '加载中...'
    }); 
  },
  setPageScrollToTop(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  navChange: function(e) {
    let tab = e.currentTarget.dataset.tab;
    this.setData({
      tab: tab
    })
    this.reloadIndex()
  },
  tagChange: function (e){
    const that = this, tag = e.currentTarget.dataset.tag;
    that.setData({
      carViptag: tag
    })
    that.reloadIndex()
  },
  swiperChangeR: function(e){  
    let current = e.detail.current  
    this.setData({  
        swiperIndexR: current  
    })  
  },
  swiperChangeF: function(e){  
    let current = e.detail.current  
    this.setData({  
        swiperIndexF: current  
    })  
  }, 
  swiperChangeE: function(e){  
    let current = e.detail.current  
    this.setData({  
        swiperIndexE: current  
    })  
  },     
  toDetail: function (e) {
    const [that, tid] = [this, e.currentTarget.dataset.tid]
    if(tid == 0){
      return
    }
    if(tid == -1) {
      that.toCarVip()
      return
    }
    wx.navigateTo({
      url: '../detail/detail?tid=' + tid,
    })
  },
  toEdetail: function (e) {
    const aid = e.currentTarget.dataset.aid;
    if(aid == 0){
      return
    }    
    wx.navigateTo({
      url: `../Edetail/Edetail?aid=${aid}`,
    })
  },
  toBigshot: function (e) {
    wx.navigateTo({
      url: `../bigShot/bigShot`,
    })    
  },
  toUserDetail: function (e) {
    let uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: `../user_detail/user_detail?uid=${uid}`,
    })
  },
  toTopicDetail: function (e) {
    const fid = e.currentTarget.dataset.fid;
    wx.navigateTo({
      url: '../topic_zone/topic_zone?fid=' + fid,
    })
  },
  changeCarid: function (e) {
    const [that, carid] = [this, e.currentTarget.dataset.carid]
    that.setData({
      carid : carid,
      page_eIndex:0
    })
    that.requestEinfoList();
  },

  // 推荐
  recommend: function(){
    const that = this, [page_size, page_index] = [that.data.page_size, that.data.page_index]
    request('post','get_thread.php',{
      token: wx.getStorageSync("token"),
      page_size: page_size,
      page_index: page_index
    }).then((res)=>{
      that.setData({
        articleList: res.data.forum_thread_data,
        page_index: page_index,
        loading_hidden: true,
        loading_msg: '加载完毕...'
      })
    });
    request('post','get_banner.php',{
      token: wx.getStorageSync("token"),
      type:1
    }).then((res)=>{
      that.setData({
        imgRecommend : res.data.banner_data,
      })
    });
  },
  // 推荐下拉加载
  recommendOnRB: function(){
    const that = this
    let [page_size, page_index] = [that.data.page_size, that.data.page_index + 1]
    request('post','get_thread.php',{
      token: wx.getStorageSync("token"),
      page_size: page_size,
      page_index: page_index
    }).then((res)=>{
      let [tmpArticleList, respArticleList] = [that.data.articleList, res.data.forum_thread_data],
          newArticleList = tmpArticleList.concat(respArticleList)
      that.setData({
        articleList: newArticleList,
        page_index: page_index,
        have_data: respArticleList.length <= 0 ? false:true,
        nomore_data: respArticleList.length > 0 ? false:true,
      })
    });
  },
  // 车代表
  vipCar: function(){
    const that = this
    if(that.data.carViptag == 'carVipThread') {
      let [page_size, page_index] = [that.data.page_CarVipSize, that.data.page_CarVipIndex]
      request('post','get_carvip_thread.php',{
        token: wx.getStorageSync("token"),
        page_size: page_size,
        page_index: page_index
      }).then((res)=>{
        that.setData({
          articleListCarVip: res.data.car_vip_thread_data,
          page_CarVipIndex: page_index,
          loading_hidden: true,
          loading_msg: '加载完毕...'
        })
      });
    }else if(that.data.carViptag == 'carVipUser'){
      let [page_usersize, page_userindex] = [that.data.page_usersize, that.data.page_userindex]
      request('post','get_carvip_user.php',{
        token: wx.getStorageSync("token"),
        page_size: page_usersize,
        page_index: page_userindex
      }).then((res)=>{
        that.setData({
          userList: res.data.car_vip_user_data,
          page_index: page_userindex,
          loading_hidden: true,
          loading_msg: '加载完毕...'
        })
      });
    }else{
      that.getApplyCarOwner()
    }
  },
  getApplyCarOwner: function(){
    const that = this
    request('post','get_apply_car_owner.php',{
        token: wx.getStorageSync("token"),
      }).then((res)=>{
        const applyStatus = res.data.status
        let applyTest
        //applyStatus1：已成为车代表 2：拒绝 3：已申请车代表 4：可以申请
        if(applyStatus == 1) {
          applyTest = '已审核通过'
        } else if(applyStatus == 2) {
          applyTest = '审核未通过'
        } else if(applyStatus == 3) {
          applyTest = '已申请'
        } else {
          applyTest = '一键申请'
        }
        that.setData({
          applyStatus:applyStatus,
          applyTest:applyTest,
          loading_hidden: true,
          loading_msg: '加载完毕...'
        })
      })
  },
  applyCarOwner: function () {
    const that = this
    if(that.data.applyStatus == 4 || that.data.applyStatus == 2 && that.data.checkRead == true){
     request('post','add_apply_car_owner.php',{
        token: wx.getStorageSync("token"),
        type:1
      }).then((res)=>{
        const status = res.data.status
        if(status == 1){
          wx.showToast({
            title: '申请成功',
            icon: 'success',
            duration: 2000,
          }) 
        }else{
          const [url, msg] = [res.data.url, res.data.msg]
          wx.showToast({
            title:msg,
            duration: 2000,
          }) 
          if(url){
            setTimeout(()=>{
              wx.navigateTo({
                url: url,
              }) 
            })
          }
        }
        setTimeout(()=>{
          that.getApplyCarOwner()
        },100)
      })
    }
  },
  vipCarOnRB: function() {
    const that = this;
    if(that.data.carViptag == 'carVipThread') {
      let [page_size, page_index] = [that.data.page_CarVipSize, that.data.page_CarVipIndex + 1]
      request('post','get_carvip_thread.php',{
        token: wx.getStorageSync("token"),
        page_size: page_size,
        page_index: page_index
      }).then((res)=>{
        let [tmpArticleList, respArticleList] = [that.data.articleListCarVip, res.data.car_vip_thread_data],
            newArticleList = tmpArticleList.concat(respArticleList)
        that.setData({
          articleListCarVip: newArticleList,
          page_CarVipIndex: page_index,
          have_data: respArticleList.length <= 0 ? false:true,
          nomore_data: respArticleList.length > 0 ? false:true,
        })
      });
    }else if(that.data.carViptag == 'carVipUser'){
      let [page_usersize, page_userindex] = [that.data.page_usersize, that.data.page_userindex + 1]
      request('post','get_carvip_user.php',{
        token: wx.getStorageSync("token"),
        page_size: page_usersize,
        page_index: page_userindex
      }).then((res)=>{
        let [tmpUserList, resUserList] = [that.data.userList, res.data.car_vip_user_data],
            newUserList = tmpUserList.concat(resUserList)
        that.setData({
          userList: newUserList,
          page_userindex: page_userindex,
          have_data: resUserList.length <= 0 ? false:true,
          nomore_data: resUserList.length > 0 ? false:true,
        })
      }) 
    } else{
      that.setData({
        have_data: false,
        nomore_data: false,
      })
    }
  },
  checkboxChange: function() {
    const that = this
    that.setData({
      checkRead:!that.data.checkRead,
    })
  },
  toCarVip: function() {
    const that = this
    that.setData({
      tab:'vipCar',
      carViptag:'carVipApply'
    })  
    that.getApplyCarOwner()  
  },
  // 车代表下拉

  // 吐槽
  forumList: function() {
    const that = this
    let [page_size, page_index] = [that.data.page_ForumlistSize, that.data.page_ForumlistIndex]
    request('post','get_complaint_thread.php',{
      token: wx.getStorageSync("token"),
      page_size: page_size,
      page_index: page_index
    }).then((res)=>{
      that.setData({
        articleListForumlist: res.data.complaint_thread_data,
        page_ForumlistIndex: page_index,
        loading_hidden: true,
        loading_msg: '加载完毕...'
      })
    });
    request('post','get_banner.php',{
      token: wx.getStorageSync("token"),
      type:4
    }).then((res)=>{
      that.setData({
        imgForumList : res.data.banner_data
      })
    });
  },
  // 吐槽下拉加载
  forumListOnRB: function(){
    const that = this
    let [page_size, page_index] = [that.data.page_ForumlistSize, that.data.page_ForumlistIndex + 1]
    request('post','get_complaint_thread.php',{
      token: wx.getStorageSync("token"),
      page_size: page_size,
      page_index: page_index
    }).then((res)=>{
      let [tmpArticleList, respArticleList] = [that.data.articleListForumlist, res.data.complaint_thread_data],
          newArticleList = tmpArticleList.concat(respArticleList)
      that.setData({
        articleListForumlist: newArticleList,
        page_ForumlistIndex: page_index,
        have_data: respArticleList.length <= 0 ? false:true,
        nomore_data: respArticleList.length > 0 ? false:true,
      })
    });
  },

  //话题
  topicList: function() {
    const that = this
    let [page_size, page_index] = [that.data.page_topicSize, that.data.page_topicIndex]
    request('post','get_forum_topic.php',{
      token: wx.getStorageSync("token"),
      page_size: page_size,
      page_index: page_index
    }).then((res)=>{
      that.setData({
        topicList: res.data.forum_forum_data,
        newTopicList: res.data.forum_forum_new_data,
        page_topicIndex: page_index,
        loading_hidden: true,
        loading_msg: '加载完毕...'
      })
    });
  },
  //话题下拉加载
  topicListOnRB: function() {
    const that = this
    let [page_size, page_index] = [that.data.page_topicSize, that.data.page_topicIndex + 1]
    request('post','get_forum_topic.php',{
      token: wx.getStorageSync("token"),
      page_size: page_size,
      page_index: page_index
    }).then((res)=>{
      let [tmpArticleList, respArticleList] = [that.data.topicList, res.data.forum_forum_data],
          newArticleList = tmpArticleList.concat(respArticleList)
      that.setData({
        topicList: newArticleList,
        page_index: page_index,
        have_data: respArticleList.length <= 0 ? false:true,
        nomore_data: respArticleList.length > 0 ? false:true,
      })
    });
  },

  //E讯
  Enews: function() {
    const that = this;
    that.setData({
      loading_hidden: false,
      loading_msg: '加载中...'
    });
    request('post','get_einfo_cat_list.php',{
      token: wx.getStorageSync("token"),
    }).then((res)=>{
      that.setData({
        carTagList: res.data.category_data,
        // carid:res.data.category_data[0].catid,
      })
      that.requestEinfoList();
    });
    request('post','get_banner.php',{
      token: wx.getStorageSync("token"),
      type:3
    }).then((res)=>{
      that.setData({
        imgEnews : res.data.banner_data
      })
    });
  },
  //E讯下拉加载
  EnewsOnRB: function() {
    const that = this
    let [page_size, page_index, carid] = [that.data.page_eSize, that.data.page_eIndex + 1, that.data.carid]
    request('post','get_einfo_list.php',{
      token: wx.getStorageSync("token"),
      page_size: page_size,
      page_index: page_index,
      catid: carid
    }).then((res)=>{
      let [tmpArticleList, respArticleList] = [that.data.einfoList, res.data.portal_article_title_data],
          newArticleList = tmpArticleList.concat(respArticleList)
      that.setData({
        einfoList: newArticleList,
        page_eIndex: page_index,
        have_data: respArticleList.length <= 0 ? false:true,
        nomore_data: respArticleList.length > 0 ? false:true,
      })
    });
  },
  //E讯列表
  requestEinfoList: function() {
    const that = this;
    that.setData({
      loading_hidden: false,
      loading_msg: '加载中...'
    });
    let [page_size, page_index, carid] = [that.data.page_eSize, that.data.page_eIndex, that.data.carid] 
    request('post','get_einfo_list.php',{
      token: wx.getStorageSync("token"),
      page_size: page_size,
      page_index: page_index,
      catid: carid
    }).then((res)=>{
      that.setData({
        einfoList: res.data.portal_article_title_data,
        page_topicIndex: page_index,
        loading_hidden: true,
        loading_msg: '加载完毕...'
      })
    });
  },
  /* 下拉刷新 */
  onPullDownRefresh: function () {
    this.reloadIndex();
    wx.stopPullDownRefresh();
  },

  /* 分享 */
  onShareAppMessage: function (res) {
    const [shareTitle, tab] = [app.globalData.shareTitle, this.data.tab]
    return {
      title: shareTitle,
      path: `/pages/index/index?tab=${tab}`,
      success: function (res) {
        console.log(res);
      },
    }
  },
  /* 返回顶 */
  onPageScroll: function (e) {
   this.setData({
      scrollTop: e.scrollTop
    })
  }

})
