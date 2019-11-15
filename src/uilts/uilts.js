
//金钱格式
export var fmoney = num => {
  if(typeof num!='string'){
      num=num.toString()
  }
  if (num.length == 0) {
      return "0.00";
  } else if (num.length == 1) {
      return "0.0" + num;
  }
  if (num.length == 2) {
      return "0." + num;
  }
  return num.substring(0, num.length - 2) + "." + num.substring(num.length - 2);
};

//保留两位小数格式
export var twoFixed = num => {
  num = parseFloat(num).toFixed(2);
  return num;
};
// 随机数
export var RandomNumBoth = (Min, Max) => {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range);
  return num;
};




export var isLogin = () => {
  return myLocalStorage.get('sessionid');
}

export var isIOS = () => {
  var u = navigator.userAgent;
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  return isiOS;
}


export var isInclude = (name) => {
  var js = /js$/i.test(name);
  var es = document.getElementsByTagName(js ? 'script' : 'link');
  for (var i = 0; i < es.length; i++)
    if (es[i][js ? 'src' : 'href'].indexOf(name) != -1) return true;
  return false;
}
//动态加载js
export var loadJs = (url, callback) => {
  if (isInclude(url)) {
    callback();
  } else {
    var script = document.createElement('script');
    script.type = "text/javascript";
    if (typeof (callback) != "undefined") {
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState == "loaded" || script.readyState == "complete") {
            script.onreadystatechange = null;
            callback();
          }
        }
      } else {
        script.onload = function () {
          callback();
        }
      }
    }
    script.src = url;
    document.body.appendChild(script);
  }

}


//url
export var getQueryString = (name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

//获取二维码后的参数
export var getCodeString = (url, name) => {
  var us = "?" + url.split("?")[1];
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = us.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
export var mySessionstorage = {
  set(key, val) {
    try {
      sessionStorage.setItem(key, JSON.stringify(val)); //存入缓存值  
    } catch (e) {console.log(e)}
  },
  get(key) {
    try {
      if (!sessionStorage) {
        return false;
      }
      var cacheVal = sessionStorage.getItem(key);
      var result = JSON.parse(cacheVal);
      if (!result) {
        return null;
      } //缓存不存在  
      return result;
    } catch (e) {
      return null;
    }
  },
  /**移除缓存*/
  remove: function (key) {
    if (!sessionStorage) {
      return false;
    }
    sessionStorage.removeItem(key);
  },

}

//数据存储
export var myLocalStorage = {
  set: function (key, stringVal, time) {
    try {
      if (!localStorage) {
        return false;
      }
      if (!time || isNaN(time)) {
        time = 60000000000000;
      }
      var cacheExpireDate = (new Date() - 1) + time * 1000;
      var cacheVal = {
        val: stringVal,
        exp: cacheExpireDate
      };
      localStorage.setItem(key, JSON.stringify(cacheVal)); //存入缓存值  
    } catch (e) {console.log(e)}
  },
  /**获取缓存*/
  get: function (key) {
    try {
      if (!localStorage) {
        return false;
      }
      var cacheVal = localStorage.getItem(key);
      var result = JSON.parse(cacheVal);
      var now = new Date() - 1;
      if (!result) {
        return null;
      } //缓存不存在  
      if (now > result.exp) { //缓存过期  
        this.remove(key);
        return "";
      }
      return result.val;
    } catch (e) {
      this.remove(key);
      return null;
    }
  },
  /**移除缓存，一般情况不手动调用，缓存过期自动调用*/
  remove: function (key) {
    if (!localStorage) {
      return false;
    }
    localStorage.removeItem(key);
  },
  /**清空所有缓存*/
  clear: function () {
    if (!localStorage) {
      return false;
    }
    localStorage.clear();
  }
}

export var FormatTime = (date) => {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;

}


export default {
  getQueryString,
  getCodeString,
  mySessionstorage,
  myLocalStorage,
  isIOS,
  fmoney,
  loadJs,
  isLogin,
  FormatTime,
}