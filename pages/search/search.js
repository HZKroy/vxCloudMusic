// pages/search/search.js

import request from '../../utils/request'

let isSend=false//函数防抖初始化

Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:'',//默认搜索词
    hotList:[],//热搜榜
    searchContent:'',//搜索内容
    searchList:[],//搜索结果
    histroyList:[],//搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlaceholder()
    this.getHotList()
    this.getSearchHistory()
  },
  //获取默认搜索词
  async getPlaceholder(){
    let placeholderData=await request('/search/default')
    this.setData({
      placeholder:placeholderData.data.showKeyword
    })
  },
  //获取热搜榜
  async getHotList(){
    let hotListData=await request('/search/hot/detail')
    let index=0
    let hotList=hotListData.data.map(item=>{
      item.id=index++
      return item
    })
    this.setData({
      hotList
    })
  },
  //搜索输入
  handleInput(event){
    this.setData({
      searchContent:event.detail.value.trim()
    })
    //函数防抖
    if(isSend){
      return
    }
    isSend=true
    setTimeout(()=>{
      this.getSearchList()
      isSend=false
    },500)
  },
  //请求搜索数据
  async getSearchList(){
    let {histroyList,searchContent}=this.data
    if(!searchContent){
      this.setData({
        searchList:[]
      })
      return
    }
    let searchListData=await request('/search',{keywords:searchContent,limit:10})
    this.setData({
      searchList:searchListData.result.songs
    })
    //将搜索词放入搜索历史中
    let index=histroyList.indexOf(searchContent)
    if(index===-1){
      if(histroyList.length<=9){
        histroyList.unshift(searchContent)
      }else{
        histroyList.pop()
        histroyList.unshift(searchContent)
      }
    }else{
      histroyList.splice(index,1)
      histroyList.unshift(searchContent)
    }
    wx.setStorageSync('searchHistory',histroyList)
    this.getSearchHistory()
  },
  //获取本地搜索历史
  getSearchHistory(){
    let histroyList=wx.getStorageSync('searchHistory')
    if(histroyList){
      this.setData({
        histroyList
      })
    }
  },
  //清空搜索内容
  clearSearchInput(){
    this.setData({
      searchContent:'',
      searchList:[]
    })
  },
  //清除历史记录
  clearHistoryList(){
    wx.showModal({
      content:"确认删除?",
      success:(res)=>{
        if(res.confirm){
          wx.removeStorageSync('searchHistory')
          this.setData({
            histroyList:[]
          })
        }
      }
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