var Board = require("./grid.js");

function Main(size) { 
  this.size = size;
  this.startData = 2; // 初始填充2个数据
  this.init();
}

Main.prototype = {
  init() { // 填充数据
    this.board = new Board(this.size);
    this.bproto = this.board.__proto__;
    this.setDataRandom(); // 随机填充 
    this.startData = 1;
  },
  setDataRandom() {  // 随机填充
    for(var i = 0; i < this.startData; i++) {
      this.addRandomData();
    }
  },
  addRandomData() { //填充数据
    if(!this.board.cellEmpty()) {
      var value = Math.random() < 0.9 ? 2 : 4;
      var cell = this.board.selectCell(); 
      cell.val = value; 
      this.update(cell);
    }
  },
  update(cell) { // 更新数据
    this.board.grid[cell.x][cell.y] = cell.val;
  },
  move(dir) {
    // 0:上, 1:右, 2:下, 3:左
    var curList = this.formList(dir);

    var list = this.combine(curList); 
    var result = [[],[],[],[]];

    for(var i = 0; i < this.size; i++)
      for(var j = 0; j < this.size; j++) {
        switch (dir) {
          case 0:
            result[i][j] = list[j][i];
            break;
          case 1:
            result[i][j] = list[i][this.size-1-j];
            break;
          case 2:
            result[i][j] = list[j][this.size-1-i];
            break;
          case 3:
            result[i][j] = list[i][j];
            break;
        }
      } 
    this.board.grid = result;
    this.setDataRandom();

    return result;
  },
  formList(dir) {  // 根据滑动方向生成list的四个数组
    var list = [[], [], [], []];
    for(var i = 0; i < this.size; i++)
      for(var j = 0; j < this.size; j++) {
        switch(dir) {
          case 0:
            list[i].push(this.board.grid[j][i]);
            break;
          case 1:
            list[i].push(this.board.grid[i][this.size-1-j]);
            break;
          case 2:
            list[i].push(this.board.grid[this.size-1-j][i]);
            break;
          case 3:
            list[i].push(this.board.grid[i][j]);
            break;
        }
      }
    return list;
  },
  combine(list) { // 滑动时相同的合并
    for(var i = 0; i < list.length; i++)  // 数字靠边
      list[i] = this.changeItem(list[i]);

    for(var i = 0; i < this.size; i++) { 
      for(var j = 1; j < this.size; j++) {
        if(list[i][j-1] == list[i][j] && list[i][j]!="") {
          list[i][j-1] += list[i][j];
          list[i][j] = ""; 
        }
      }
    }
    for (var i = 0; i < list.length; i++)  // 再次数字靠边
      list[i] = this.changeItem(list[i]);

    return list;
  },
  changeItem(item) {  // 将 ['', 2, '', 2] 改为 [2, 2, '', '']
    var cnt = 0;
    for(var i = 0; i < item.length; i++)
      if(item[i] != '')
        item[cnt++] = item[i];
    for(var j = cnt; j < item.length; j++) 
      item[j] = "";
    return item;
  },
  isOver() {  // 游戏是否结束，结束条件：可用格子为空且所有格子上下左右值不等
    this.board.__proto__ = this.bproto;
    if (!this.board.cellEmpty()) {
      return false;
    } else {
      for (var i = 0; i < this.size; i++) // 左右不等
        for (var j = 1; j < this.size; j++) {
          if (this.board.grid[i][j] == this.board.grid[i][j - 1])
            return false;
        }
      for (var j = 0; j < this.size; j++)  // 上下不等
        for (var i = 1; i < this.size; i++) {
          if (this.board.grid[i][j] == this.board.grid[i - 1][j])
            return false;
        }
    }
    return true;
  } 
};

module.exports = Main;