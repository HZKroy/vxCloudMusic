// pages/recommendSongs/recommendSongs.js
import PubSub, { publish } from 'pubsub-js'
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',//日
    month:'',//月
    recommendList:[],//推荐歌曲列表
    index:0,//点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //登录
    let userInfo=wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.showToast({
        title:"请先登录",
        icon:'none',
        success:()=>{
          wx.reLaunch({
            url:'/pages/login/login'
          })
        }
      })
    }
    //更新日期状态
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()+1
    })
    //请求数据
    this.getRecommendListData()

    //订阅事件(来自dongDetail)
    PubSub.subscribe('switchType',(msg,data)=>{
      let{recommendList,index}=this.data
      if(data==='pre'){
        if(index===0){
          index=recommendList.length
        }
        index-=1
      }else{
        if(index===recommendList.length-1){
          index=-1
        }
        index+=1
      }
      this.setData({
        index
      })
      let musicId=recommendList[index].id
      //将music回传给songDetail页面
      PubSub.publish('musicId',musicId)
    })

  },
  //获取推荐歌曲列表数据
  async getRecommendListData(){
    let recommendListData= await request('/recommend/songs')
    this.setData({
      recommendList:recommendListData.recommend
    })
  },
  //歌曲跳转至详情
  toSongDetail(event){
    let {song,index}=event.currentTarget.dataset
    this.setData({
      index
    })
    //路由跳转传参,query
    wx.navigateTo({
      url:'/pages/songDetail/songDetail?musicId='+song.id
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