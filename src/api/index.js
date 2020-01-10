
import http from './http'
export default {
  
   // 删除项目
   del_project(param) {
    return http({
      url:  'del_project',
      data:{
       ...param,
      }
    })
  },
  // 克隆代码
  git_clone(param) {
    return http({
      url:  'git_clone',
      data:{
       ...param,
      }
    })
  },
  // 获取分支
  get_git_branch(param){
    return http({
      url:  'get_git_branch',
      data:{
       ...param,
      }
    })
  },
  // 切换分支
  switch_git_branch(param){
    return http({
      url:  'switch_git_branch',
      data:{
       ...param,
      }
    })
  },
  // 获取修改的文件
  get_git_status(param){
    return http({
      url:  'get_git_status',
      data:{
       ...param,
      }
    })
  },
  // 更新代码
  git_pull(param){
    return http({
      url:  'git_pull',
      data:{
       ...param,
      }
    })
  },
   // 检测冲突文件
   git_diff(param){
    return http({
      url:  'git_diff',
      data:{
       ...param,
      }
    })
  },
   // 提交代码
   git_push(param){
    return http({
      url:  'git_push',
      data:{
       ...param,
      }
    })
  },


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