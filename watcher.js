
// 订阅者
function Watcher(vm, exp, cb) {
  this.vm = vm;
  this.exp = exp;
  this.cb = cb;
  this.value = this.get();
}

Watcher.prototype = {
  // 订阅者暴露更新方法
  update: function () {
    this.run();
  },
  run: function () {
    const value = this.vm.data[this.exp];
    const oldValue = this.value;
    if (value !== oldValue) {
      // 值发生变化后，将前后变化的值回调
      this.value = value;
      this.cb.call(this.vm, value, oldValue);
    }
  },
  get: function () {
    Dep.target = this; // 缓存自己
    const value = this.vm.data[this.exp]; // 强制执行监听器中的getter函数
    Dep.target = null; // 释放自己
    return value;
  }
};
