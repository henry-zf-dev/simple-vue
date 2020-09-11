
function Compile(el, vm) {
  this.vm = vm;
  this.el = document.querySelector(el);
  this.fragment = null;
  this.init();
}

Compile.prototype = {
  init: function () {
    if (this.el) {
      this.fragment = this.nodeToFragment(this.el);
      this.compileElement(this.fragment);
      this.el.appendChild(this.fragment);
    } else {
      console.log('Dom 元素不存在');
    }
  },
  nodeToFragment: function (el) {
    const fragment = document.createDocumentFragment();
    let child = el.firstChild;
    while (child) {
      // 将 Dom 元素移入到 fragment 中
      // appendChild 会将 el 的子元素移动到 fragment 中，而不是复制
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;
  },
  compileElement: function (el) {
    const childNodes = el.childNodes;
    // Array.prototype.slice.call 将类数组转化为数组
    Array.prototype.slice.call(childNodes).forEach(node => {
      const reg = /\{\{\s*(.*?)\s*\}\}/;
      const text = node.textContent;

      if (this.isElementNode(node)) {
        this.compileDirective(node);
      }
      // 判断是否是符合这种形式 {{}} 的指令
      if (this.isTextNode(node) && reg.test(text)) {
        this.compileText(node, reg.exec(text)[1]);
      }
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node);
      }
    });
  },
  compileDirective: function (node) {
    const nodeAttrs = node.attributes;
    Array.prototype.forEach.call(nodeAttrs, attr => {
      const attrName = attr.name;
      const exp = attr.value;
      // v-model 指令
      if (this.isModelDirective(attrName)) {
        this.compileModel(node, exp);
        node.removeAttribute(attrName)
      }
      // 事件指令
      if (this.isEventDirective(attrName)) {
        const event = attrName.substring(1);
        this.compileEvent(node, exp, event);
        node.removeAttribute(attrName)
      }
    });
  },
  compileText: function (node, exp) {
    const initText = this.vm[exp];
    this.updateText(node, initText);
    new Watcher(this.vm, exp, (value) => {
      this.updateText(node, value);
    });
  },
  updateText: function (node, value) {
    node.textContent = value || ''
  },
  compileModel: function (node, exp, dir) {
    let value = this.vm[exp];
    this.updateModel(node, value, value);
    new Watcher(this.vm, exp, (newVal, oldVal) => {
      this.updateModel(node, newVal, oldVal);
    });
    // 为节点添加 input 事件
    node.addEventListener('input', (event) => {
      const newValue = event.target.value;
      if (value === newValue) {
        return
      }
      this.vm[exp] = newValue;
      value = newValue;
    })
  },
  updateModel: function (node, value, oldValue) {
    node.value = value || ''
  },
  compileEvent: function (node, exp, event) {
    const cb = this.vm.methods && this.vm.methods[exp];
    if (event && cb) {
      node.addEventListener(event, cb.bind(this.vm), false)
    }
  },
  isTextNode: function (node) {
    return node.nodeType === 3;
  },
  isElementNode: function (node) {
    return node.nodeType === 1;
  },
  isModelDirective: function(attr) {
    return attr.indexOf('v-model') === 0;
  },
  isEventDirective: function(dir) {
    return dir.indexOf('@') === 0;
  }
};
