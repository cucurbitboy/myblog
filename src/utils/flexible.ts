
// tslint:disable: typedef
(function flexible(window, document) {
  // 指代文档的根元素
  let docEl = document.documentElement;
  // 返回当前显示设备的物理像素分辨率与 CSS 像素分辨率的比率
  let dpr = window.devicePixelRatio || 1;
  // adjust body font size
  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = 12 * dpr + "px";
    } else {
      document.addEventListener("DOMContentLoaded", setBodyFontSize);
    }
  }
  setBodyFontSize();
  // set 1rem = viewWidth / 10
  function setRemUnit() {
    let rem = docEl.clientWidth / 10;
    docEl.style.fontSize = rem + "px";
  }
  setRemUnit();
  // reset rem unit on page resize
  window.addEventListener("resize", setRemUnit);
  // 类似于onload 事件，onload 事件在页面第一次加载时触发， onpageshow 事件在每次加载页面时触发
  window.addEventListener("pageshow", function(e) {
    // 该页面是否从浏览器缓存中读取
    if (e.persisted) {
      setRemUnit();
    }
  });
  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement("body");
    var testElement = document.createElement("div");
    testElement.style.border = ".5px solid transparent";
    fakeBody.appendChild(testElement);
    docEl.appendChild(fakeBody);
    if (testElement.offsetHeight === 1) {
      docEl.classList.add("hairlines");
    }
    docEl.removeChild(fakeBody);
  }
})(window, document);
