
import Vue from 'vue'
var isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1; //android终端
Vue.directive('resetInput', {
  inserted: function (el) {
    if (isAndroid) {
      return;
    }
    el.addEventListener('blur', function () {
      var input = document.getElementById('reset-input');
      if (!input) {
        input = document.createElement('INPUT');
        input.type = 'text';
        input.style.height = '0px'
        input.style.width = '0px'
        input.style.position = 'absolute'
        input.id = 'reset-input';
        document.body.prepend(input);
      }
      input.focus();
      input.blur();
    })
  },

})
