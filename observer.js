
function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  walk: function (data) {
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  },
  defineReactive: function (data, key, val) {
    observe(val); // 递归遍历所有子属性
    const dep = new Dep();
    Object.defineProperty(data, key,{
      enumerable: true,
      configurable: false,
      get: function() {
        // 在 getter 中添加订阅者（依赖收集）
        // Dep.target 其实就是当前的 Watcher 对象
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return val;
      },
      set: function (newVal) {
        // 在 setter 中通知订阅者更新（派发更新）
        if (val === newVal) {
          return;
        }
        val = newVal;
        dep.notify(); // 如果数据变化，通知所有订阅者
        console.log(`属性 ${key} 监听到变化，当前值为：${newVal.toString()}`);
      }
    })
  }
};

function observe(data) {
  if (!data || typeof data !== 'object') {
    return;
  }
  return new Observer(data)
}

