var Board = require("./grid.js");
var Main = require("./main.js");

Page({
  data: {
    hidden: false,
    start: "开始游戏",
    num: [],
    score: 0,
    bestScore: 0, // 最高分
    endMsg: '',
    over: false // 游戏是否结束 
  },
  // 页面渲染完成
  onReady: function () {
    if (!wx.getStorageSync("highScore"))
      wx.setStorageSync('highScore', 0);
    this.gameStart();
  },
  gameStart: function () { // 游戏开始

    var main = new Main(4);
    this.setData({
      endMsg: '',
      main: main,
      bestScore: wx.getStorageSync('highScore')
    });
    this.data.main.__proto__ = main.__proto__;

    this.setData({
      hidden: true,
      over: false,
      score: 0,
      num: this.data.main.board.grid
    });
  },
  gameOver: function () { // 游戏结束
    this.setData({
      over: true
    });

    if (this.data.score >= 2048) {
      this.setData({
        endMsg: '恭喜达到2048！'
      });
      wx.setStorageSync('highScore', this.data.score);
    } else if (this.data.score > this.data.bestScore) {
      this.setData({
        endMsg: '创造新纪录！'
      });
      wx.setStorageSync('highScore', this.data.score);
    } else {
      this.setData({
        endMsg: '游戏结束！'
      });
    }
  },
  // 触摸
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  touchStart: function (ev) { // 触摸开始坐标
    var touch = ev.touches[0];
    this.touchStartX = touch.clientX;
    console.log("  this.touchStartX" + this.touchStartX)
    this.touchStartY = touch.clientY;
    console.log("  this.touchStartY" + this.touchStartY)

  },

  touchEnd: function (ev) {
    var touch = ev.changedTouches[0];
    this.touchEndX = touch.clientX;
    console.log("  this.touchEndX" + this.touchEndX)
    this.touchEndY = touch.clientY;
    console.log("  this.touchEndY" + this.touchEndY)
    console.log("touchEnd")
    var disX = this.touchStartX - this.touchEndX;
    var absdisX = Math.abs(disX);
    console.log(" disX" + disX)
    var disY = this.touchStartY - this.touchEndY;
    var absdisY = Math.abs(disY);
    console.log(" disY" + disY)
    if (this.data.main.isOver()) { // 游戏是否结束
      this.gameOver();
    } else {
      let dis = Math.max(absdisX, absdisY);
      console.log("dis" + dis)
      if (dis > 3) { // 减少触屏失效的错句
        var direction = absdisX > absdisY ? (disX < 0 ? 1 : 3) : (disY < 0 ? 2 : 0); // 确定移动方向

        var data = this.data.main.move(direction);
        this.updateView(data);
      }
    }
  },
  updateView(data) {
    var max = 0;
    for (var i = 0; i < 4; i++)
      for (var j = 0; j < 4; j++)
        if (data[i][j] != "" && data[i][j] > max)
          max = data[i][j];
    this.setData({
      num: data,
      score: max
    });
  },
  onShareAppMessage: function () {
    return {
      title: '2048小游戏',
      desc: '来试试你能达到多少分',
      path: '/page/user?id=123'
    }
  }
})