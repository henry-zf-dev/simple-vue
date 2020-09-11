
function SimpleVue(options) {
  this.vm = this;
  this.data = options.data;
  this.methods = options.methods;

  Object.keys(this.data).forEach(key => {
    this.proxyKeys(key);
  });

  observe(this.data);
  new Compile(options.el, this.vm);
  // 双向绑定处理完成后，执行 mounted 函数
  options.mounted.call(this);
}

SimpleVue.prototype = {
  // 对 this.key 的访问和更改，代理为对 this.data.key 的访问和更改
  proxyKeys: function (key) {
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: () => {
        return this.data[key];
      },
      set: (newValue) => {
        this.data[key] = newValue;
      }
    });
  }
};
