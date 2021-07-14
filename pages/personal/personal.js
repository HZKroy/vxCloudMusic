// pages/personal/personal.js

import request from '../../utils/request'

let startY=0 //手指初始纵坐标
let endY=0  //手指终止纵坐标
let moveDistance=0  //手指移动距离

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'translateY(0)', //页面触屏移动
    coverTransition:'', //页面触屏移动
    userInfo:{}, //用户信息数据
    recentPlayList:[],//播放记录列表

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取用户基本信息
    let userInfo=wx.getStorageSync('userInfo')
    if(userInfo){
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
      //获取用户播放记录
      this.getRecentPlayList(this.data.userInfo.userId)
    }
  },
  //获取用户播放记录
  async getRecentPlayList(userId){
    let recentListData=await request('/user/record',{uid:userId,type:1})
    let index=0
    let recentPlayListData=recentListData.weekData.slice(0,10).map(item=>{
      item.id=index++
      return item
    })
    this.setData({
      recentPlayList:recentPlayListData
    })
  },
  //触屏操作
  handleTouchStart(event){
    // console.log('start')
    this.setData({
      coverTransition:''
    })
    startY=event.touches[0].clientY
  },
  handleTouchMove(event){
    // console.log('move')
    endY=event.touches[0].clientY
    moveDistance=endY-startY
    //限制移动
    if(moveDistance<=0){
      return
    }
    if(moveDistance>=80){
      moveDistance=80
    }
    //更新coverTransform的状态值
    this.setData({
      coverTransform:`translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd(){
    // console.log('end')
    this.setData({
      coverTransform:'translateY(0)',
      coverTransition:'transform 1s linear'
    })
  },
  //跳转至login界面
  toLogin(){
    wx.navigateTo({
      url:'/pages/login/login',

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