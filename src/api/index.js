
import http from './http'
export default {
  close(param) {
    return http({
      url:  'close',
      data:{
       ...param,
      }
    })
  },
  min(param) {
    return http({
      url:  'min',
      data:{
       ...param,
      }
    })
  },
  max(param) {
    return http({
      url:  'max',
      data:{
       ...param,
      }
    })
  },
  get_books(param) {
    return http({
      url:  'get_books',
      data:{
       ...param,
      }
    })
  },

  get_directory(param){
    return http({
      url:  'get_directory',
      data:{
       ...param,
      }
    })
  },
  get_book_content(param){
    return http({
      url:  'get_book_content',
      data:{
       ...param,
      }
    })
  },

  add_books(param){
    return http({
      url:  'add_books',
      data:{
       ...param,
      }
    })
  },

  add_file(param){
    return http({
      url:  'add_file',
      data:{
       ...param,
      }
    })
  },
  

  update_file(param){
    return http({
      url:  'update_file',
      data:{
       ...param,
      }
    })
  },

  update_rank(param){
    return http({
      url:  'update_rank',
      data:{
       ...param,
      }
    })
  },
  del_file(param){
    return http({
      url:  'del_file',
      data:{
       ...param,
      }
    })
  },

  del_books(param){
    return http({
      url:  'del_books',
      data:{
       ...param,
      }
    })
  },
  update_books_rank(param){
    return http({
      url:  'update_books_rank',
      data:{
       ...param,
      }
    })
  },

  upload_image(param){
    return http({
      url:  'upload_image',
      data:{
       ...param,
      }
    })
  },
  get_folder(param){
    return http({
      url:  'get_folder',
      data:{
       ...param,
      }
    })
  },
  
  
 
}