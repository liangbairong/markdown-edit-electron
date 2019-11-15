import {
  myLocalStorage, mySessionstorage
} from '@/uilts/uilts'
export default {
  // 用户信息
  userInfo: mySessionstorage.get('userInfo') || {},
};