// pages/video/video.js

import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],//视频导航数据
    navId:'',//导航点击标识
    videoList:[],//视频列表数据
    videoId:'',//点击的视频id
    videoUpdateTime:[],//video播放的时长
    isTriggered:false,//下拉刷新是否被触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupList()
  },
  //获取视频导航数据
  async getVideoGroupList(){
    let videoGroupListData=await request('/video/group/list')
    this.setData({
      videoGroupList:videoGroupListData.data.slice(0,14),
      navId:videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId) //拿到navId才可以执行该函数，或者使用Promise
  },
  //获取视频列表数据
  async getVideoList(navId){
    let videoListData=await request('/video/group',{id:navId})
    // console.log(videoListData)
    let index=0
    let videoList=videoListData.datas.map(item=>{
      item.id=index++
      return item
    })
    this.setData({
      videoList,
      isTriggered:false
    })
    wx.hideLoading()

  },
  //点击切换导航
  selectNav(event){
    let navId=event.currentTarget.id //通过id向event传参的时候，若传的是number则会转化为string
    this.setData({
      navId:navId*1, //将字符串转为number
      videoList:[]
    })
    //显示正在加载
    wx.showLoading({
      title:"正在加载"
    })
    this.getVideoList(this.data.navId)
  },
  //视频点击、继续播放
  handlePlay(event){
    //找到控制的id值
    let vid=event.currentTarget.id
    //找到上一个视频的实例对象
    this.vid!==vid&&this.videoContext&&this.videoContext.stop()
    this.vid=vid
    //更新videoId
    this.setData({
      videoId:vid
    })
    //创建控制video标签的实例对象
    this.videoContext=wx.createVideoContext(vid)
    //判断要播放的视频是否播放过
    let {videoUpdateTime}=this.data
    let videoItem=videoUpdateTime.find(item=>item.vid===vid)
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },
  //视频播放时长更新
  handleTimeUpdate(event){
    let videoTimeObj={
      vid:event.currentTarget.id,
      currentTime:event.detail.currentTime
    }
    let{videoUpdateTime}=this.data
    let videoItem=videoUpdateTime.find(item=>item.vid===videoTimeObj.vid)
    if(videoItem){ //有该视频的播放记录数据
      videoItem.currentTime=videoTimeObj.currentTime
    }else{
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },
  //视频播放结束
  handleEnded(event){
    let{videoUpdateTime}=this.data
    let removeId=videoUpdateTime.findIndex(item=>item.vid===event.currentTarget.id)
    videoUpdateTime.splice(removeId,1)
    this.setData({
      videoUpdateTime
    })
  },
  //处理下拉更新
  handleRefresher(){
    // console.log('refresh')
    this.getVideoList(this.data.navId)
  },
  //上拉加载更多
  handleToLower(){
    
  },

  //跳转至搜索页
  toSearch(){
    wx.navigateTo({
      url:'/pages/search/search'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // console.log('页面下拉刷新')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    // console.log(event)
    let videoId=event.target.id
    let {videoList}=this.data
    let videoItem=videoList.find(item=>item.data.vid===videoId)
    if(videoItem){
      return {
        title:videoItem.data.title,
        page:'/pages/video/video',
        imageUrl:videoItem.data.coverUrl
      }
    }
  }
})