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
    this.emptyCount = 0;
    this.setDataRandom(); // 随机填充 
    this.startData = 1;
  },
  setDataRandom() { // 随机填充
    for (var i = 0; i < this.startData; i++) {
      this.addRandomData();
    }
  },
  addRandomData() { //填充数据
    if (!this.board.cellEmpty()) {
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
    var result = [
        [],
        [],
        [],
        []
    ];

    for (var i = 0; i < this.size; i++)
        for (var j = 0; j < this.size; j++) {
            switch (dir) {
                case 0:
                    result[i][j] = list[j][i];
                    break;
                case 1:
                    result[i][j] = list[i][this.size - 1 - j];
                    break;
                case 2:
                    result[i][j] = list[j][this.size - 1 - i];
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
  formList(dir) { // 根据滑动方向生成list的四个数组
    var list = [
      [],
      [],
      [],
      []
    ];
    for (var i = 0; i < this.size; i++)
      for (var j = 0; j < this.size; j++) {
        switch (dir) {
          case 0:
            list[i].push(this.board.grid[j][i]);
            break;
          case 1:
            list[i].push(this.board.grid[i][this.size - 1 - j]);
            break;
          case 2:
            list[i].push(this.board.grid[this.size - 1 - j][i]);
            break;
          case 3:
            list[i].push(this.board.grid[i][j]);
            break;
        }
      }
    return list;
  },
  combine(list) { // 滑动时相同的合并
    for (var i = 0; i < list.length; i++) // 数字靠边
      list[i] = this.changeItem(list[i]);
    return list;
  },
  changeItem(item) { // 将 ['', 2, '', 2] 改为 [2, 2, '', '']
    let a = item[0];
    let b = item[1];
    let c = item[2];
    let d = item[3];
    if (b == "" && c == "" && d == "") {
      console.log(" any，0，0，0👉any，0，0，0");
      return [a, b, c, d];
    } else if (a != "" && b != "" && a != b && c == "" && d == "") {
      console.log(" 3，!3，0，0👉3，!3，0，0");
      return [a, b, c, d];
    } else if (a != "" && b != "" && c != "" && a != b && b != c && c != d) {
      console.log(" 3，6，12，!12👉3，6，12，!12");
      return [a, b, c, d];
    } else if (a == "" && b == "" && c == "" && d != "") {
      console.log(" 0，0，0，3👉3，0，0，0");
      return [d, "", "", ""];
    } else if (a == "" && b == "" && c != "" && c == d) {
      console.log("0，0，3，3👉6，0，0，0");
      return [this.GetNext(c), "", "", ""];
    } else if (a == "" && a == c && b == d && b != "") {
      console.log("0，3，0，3👉6，0，0，0");
      return [this.GetNext(b), "", "", ""];
    } else if (a == b && a != "" && c != "" && c == d) {
      console.log(" 3， 3， 6， 6👉 6， 12， 0， 0");
      return [this.GetNext(a), this.GetNext(c), "", ""];
    } else if (a == b && a != "" && c == "") {
      console.log(" 3， 3， 0， any👉 6， any， 0， 0");
      return [this.GetNext(a), d, "", ""];
    } else if (a == c && a != "" && b == "") {
      console.log("3， 0， 3， any👉 6， any， 0， 0");
      return [this.GetNext(a), d, "", ""];
    } else if (a == b && c == d && a != "" && c == "") {
      console.log(" 3， 3， 0， 0👉 6， 0， 0， 0");
      return [this.GetNext(a), "", "", ""];
    } else if (a == c && b == d && a != "" && b == "") {
      console.log("3， 0， 3， 0👉 6， 0， 0， 0");
      return [this.GetNext(a), "", "", ""];
    } else if (a != c && b == d && a != "" && c != "" && b == "") {
      console.log("3， 0， 6， 0👉 3， 6， 0， 0");
      return [a, c, "", ""];
    } else if (a != c && c == d && a != "" && c != "" && b == "") {
      console.log("3， 0， 6， 6👉 3， 12， 0， 0");
      return [a, this.GetNext(c), "", ""];
    } else if (a != c && c != d && a != "" && c != "" && d != "" && b == "") {
      console.log("3， 0， 6， 12👉 3， 6， 12， 0");
      return [a, c, d, ""];
    } else if (a == "" && a != b && b != c && c != d && c != "") {
      console.log("0， 3， 6， 12👉 3， 6， 12， 0");
      return [b, c, d, ""];
    } else if (a != b && b != d && c == "" && a != "" && b != "" && d != "") {
      console.log("3， 6， 0， 12👉 3， 6， 12， 0");
      return [a, b, d, ""];
    } else if (a == "" && b != c && b != "" && c != "" && c != d) {
      console.log("0， 3， 6， !6👉 3， 6，!6， 0");
      return [b, c, d, ""];
    } else if (a == c && a == "" && b != d && b != "") {
      console.log(" 0， 3， 0， !3👉 3， !3， 0， 0");
      return [b, d, "", ""];
    } else if (a == b && a == "" && c != d && c != "") {
      console.log("0， 0， 3， !3👉 3， !3， 0， 0");
      return [c, d, "", ""];
    } else if (a == "" && b == c && b != a) {
      console.log(" 0， 6， 6， any👉 12， any， 0， 0");
      return [this.GetNext(b), d, "", ""];
    } else if (a != "" && a == b && c != "" && c != d) {
      console.log("6， 6， 6， !6👉 12， 6， !6， 0");
      return [this.GetNext(a), c, d, ""];
    } else if (a == b && c == d && a != "" && c != "") {
      console.log("6， 6， 3， 3👉 12， 6， 0， 0");
      return [this.GetNext(a), this.GetNext(c), "", ""];
    } else if (a != "" && a != b && b == c && b != "") {
      console.log("12， 3， 3， any👉 12， 6， any， 0");
      return [a, this.GetNext(b), d, ""];
    } else if (a != "" && b != "" && c != "" && a != b && b != c && c == d) {
      console.log("12， 6， 3， 3👉 12， 6， 6， 0");
      return [a, b, this.GetNext(c), ""];
    } else if (a == c && c == d && a != b && a == "") {
      console.log("0，3，0，0👉3，0，0，0");
      return [b, "", "", ""];
    } else if (a == b && b == d && a != c && a == "") {
      console.log("0， 0， 3， 0👉 3， 0， 0， 0");
      return [c, "", "", ""];
    } else if (a == d && b == c && a != "" && b == "") {
      console.log("3， 0， 0， 3👉 6， 0， 0， 0");
      return [this.GetNext(a), "", "", ""];
    } else if (a != "" && a != b && b == d && c == "" && b != "") {
      console.log("6， 3， 0， 3👉 6， 6， 0， 0");
      return [a, this.GetNext(b), "", ""];
    } else if (a != "" && a != d && d != "" && b == "" && c == "") {
      console.log("6， 0， 0， 3👉 6， 3， 0， 0");
      return [a, d, "", ""];
    } else if (a == "" && b != "" && c != "" && c == d && b != c) {
      console.log("0， 3， 6， 6👉 3， 12， 0， 0");
      return [b, this.GetNext(c), "", ""];
    } else {
      console.log("没有处理的情况" + "a" + a + "b" + b + "c" + c + "d" + d)
    }
    return item;
  },

  GetNext(value) {
    // let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    // var a = letters.indexOf(value);
    return value * 2;
  },
  isOver() { // 游戏是否结束，结束条件：可用格子为空且所有格子上下左右值不等
    this.board.__proto__ = this.bproto;
    if (this.emptyCount >= 4 || !this.board.cellEmpty()) {
      return false;
    } else {
      for (var i = 0; i < this.size; i++) // 左右不等
        for (var j = 1; j < this.size; j++) {
          if (this.board.grid[i][j] == this.board.grid[i][j - 1])
            return false;
        }
      for (var j = 0; j < this.size; j++) // 上下不等
        for (var i = 1; i < this.size; i++) {
          if (this.board.grid[i][j] == this.board.grid[i - 1][j])
            return false;
        }
    }
    return true;
  }
};

module.exports = Main;