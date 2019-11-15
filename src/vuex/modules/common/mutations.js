/*
 * @Author: 王益
 * @Date: 2019-01-23 14:44:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-03 17:15:40
 * @Description: file content
 */


export default {

  // 设置用户信息
  setUserInfo: (state, userInfo = {}) => {
    state.userInfo = userInfo;
  },

  // 设置入驻信息
  setSettleInfo: (state, settleInfo = {}) => {
    state.settleInfo = settleInfo || {};
  },

  // 设置项目信息
  setProjectInfo: (state, projectList = []) => {
    state.projectList = projectList;
  },

  // 用户是否登录
  setLoginFlag: (state, loginFlag = 'N') => {
    state.loginFlag = loginFlag;
  },



  // 设置当前真正操作动作
  setRealAction: (state, realAction = '') => {
    state.realAction = realAction;
  },

  // 设置滚动条位置
  setWinScrollTop: (state, winScrollTop = '') => {
    state.winScrollTop = winScrollTop;
  },
};