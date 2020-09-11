
// 用于管理所有订阅者，建立 Observer 和 Watcher 之间的联系
function Dep() {
  this.subs = [];
}

Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub);
  },
  // 通知所有订阅者执行更新
  notify: function () {
    this.subs.forEach(sub => {
      sub.update();
    })
  }
};

Dep.target = null;
