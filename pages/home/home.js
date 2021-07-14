// pages/home/home.js
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[], //轮播图数据
    recommendList:[], //推荐数据
    topList:[],//排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //获取轮播图数据
    let bannerListDataresult=await request('/banner',{type:2})
    this.setData({
      bannerList:bannerListDataresult.banners
    })
    //获取推荐数据
    let recommendListDataresult=await request('/personalized',{limit:10})
    this.setData({
      recommendList:recommendListDataresult.result
    })
    //获取排行榜数据
    let index=0
    let tracksResult=[]
    while(index<5){
      let topListDataresult=await request('/top/list',{idx:index++})
      let topListTracks={name:topListDataresult.playlist.name,tracks:topListDataresult.playlist.tracks.slice(0,3)}
      tracksResult.push(topListTracks)
    }
    this.setData({
      topList:tracksResult
    })
  },
  //每日推荐跳转
  recommendSongs(){
    // console.log(111)
    wx.navigateTo({
      url:'/pages/recommendSongs/recommendSongs'
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})