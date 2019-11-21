
import http from './http'
import {
  myLocalStorage
} from '@/uilts/uilts'

export default {
  get_books(param) {
    return http({
      url:  process.env.VUE_APP_ROOT + '/get_books',
      method: "get",
      data:{
       ...param,
      }
    })
  },

  get_directory(param){
    return http({
      url:  process.env.VUE_APP_ROOT + '/get_directory',
      method: "get",
      data:{
       ...param,
      }
    })
  },
  get_book_content(param){
    return http({
      url:  process.env.VUE_APP_ROOT + '/get_book_content',
      method: "get",
      data:{
       ...param,
      }
    })
  },

  add_books(param){
    return http({
      url:  process.env.VUE_APP_ROOT + '/add_books',
      method: "post",
      data:{
       ...param,
      }
    })
  },

  add_file(param){
    return http({
      url:  process.env.VUE_APP_ROOT + '/add_file',
      method: "post",
      data:{
       ...param,
      }
    })
  },
  

  update_file(param){
    return http({
      url:  process.env.VUE_APP_ROOT + '/update_file',
      method: "post",
      data:{
       ...param,
      }
    })
  },

  update_rank(param){
    return http({
      url:  process.env.VUE_APP_ROOT + '/update_rank',
      method: "post",
      data:{
       ...param,
      }
    })
  },
  del_file(param){
    return http({
      url:  process.env.VUE_APP_ROOT + '/del_file',
      method: "post",
      data:{
       ...param,
      }
    })
  },

  clone(param){
    return http({
      url:  process.env.VUE_APP_ROOT + '/git/clone',
      method: "get",
      data:{
       ...param,
      }
    })
  },

  del_books(param){
    return http({
      url:  process.env.VUE_APP_ROOT + '/del_books',
      method: "post",
      data:{
       ...param,
      }
    })
  },


 
}