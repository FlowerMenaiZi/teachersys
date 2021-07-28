import { createStore } from 'vuex'

const store = createStore({
  state: {
    userInfo:{
      isLogin:false,
      role:-1,
      user:'',
      token:''
    }
  },
  mutations: {
    userLogin(state,userInfoS){
      state.userInfo.isLogin = userInfoS.getLoginState
      state.userInfo.role = userInfoS.roleLevel
      state.userInfo.user = userInfoS.userName
      state.userInfo.token = userInfoS.userToken
    },
  },
  actions: {
  },
  modules: {
  }
})

export default store
