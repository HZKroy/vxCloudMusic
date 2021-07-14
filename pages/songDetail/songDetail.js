// pages/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'

//获取全局实例
const appInstance=getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//是否播放
    song:{},//歌曲信息
    musicId:'',//音乐Id
    musicLink:'',//音乐链接
    currentTime:'00:00',//当前播放时间
    durationTime:'00:00',//歌曲总时间
    currentWidth:0,//实时进度条的宽度

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let musicId=options.musicId
    this.setData({
      musicId
    })
    this.getMusicInfo(musicId)
    //判断当前页面是否在播放
    if(appInstance.globalData.isMusicPlay&&musicId===appInstance.globalData.musicAppId){
      this.setData({
        isPlay:true
      })
    }

    //创建音乐播放实例
    this.backgroundAudioManager=wx.getBackgroundAudioManager()
    this.backgroundAudioManager.onPlay(()=>{
      this.setData({
        isPlay:true
      })
      appInstance.globalData.isMusicPlay=true
      appInstance.globalData.musicAppId=musicId
    })
    this.backgroundAudioManager.onPause(()=>{
      this.setData({
        isPlay:false
      })
      appInstance.globalData.isMusicPlay=false
    })
    this.backgroundAudioManager.onStop(()=>{
      this.setData({
        isPlay:false
      })
      appInstance.globalData.isMusicPlay=false
    })
    //监听音乐实时播放进度
    this.backgroundAudioManager.onTimeUpdate(()=>{
      let currentTime=moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
      let currentWidth=((this.backgroundAudioManager.currentTime)/(this.backgroundAudioManager.duration))*450
      this.setData({
        currentTime,
        currentWidth
      })
    })
    //监听音乐播放结束
    this.backgroundAudioManager.onEnded(()=>{
      //切换至下一首并自动播放
      PubSub.publish('switchType','next')
      this.setData({
        currentWidth:0,
        currentTime:'00:00'
      })
    })
  },
  //请求数据
  async getMusicInfo(musicId){
    let songData=await request('/song/detail',{ids:musicId})
    let durationTime=moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song:songData.songs[0],
      durationTime
    })
    wx.setNavigationBarTitle({
      title: this.data.song.al.name
    })
  },
  //控制音乐播放
  async musicControl(isPlay,musicId,musicLink){
    if(isPlay){
      if(!musicLink){
        let musicLinkData=await request('/song/url',{id:musicId})
        musicLink=musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }

      //创建音频实例
      this.backgroundAudioManager.src=musicLink
      this.backgroundAudioManager.title=this.data.song.al.name
    }else{
      this.backgroundAudioManager.pause() 
    }
  },
  //音乐播放
  musicPlay(){
    let isPlay=!this.data.isPlay
    // this.setData({
    //   isPlay
    // })
    let{musicId,musicLink}=this.data
    this.musicControl(isPlay,musicId,musicLink)
  },
  //切歌,发布消息
  changeSong(event){
    let type=event.currentTarget.id
    //关闭当前播放的音乐
    this.backgroundAudioManager.stop()
    // console.log(type)
    PubSub.subscribe('musicId',(msg,musicId)=>{
      // console.log(musicId)
      this.getMusicInfo(musicId)
      this.musicControl(true,musicId)
      PubSub.unsubscribe('musicId')
    })
    PubSub.publish('switchType',type)
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