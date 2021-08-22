import { createStore } from 'vuex';
const store = createStore({
    state: {
        userInfo: {
            isLogin: false,
            id: 0,
            role: -1,
            user: '',
            token: ''
        }
    },
    mutations: {
        userLogin(state, userInfoS) {
            state.userInfo.isLogin = userInfoS.getLoginState;
            state.userInfo.id = userInfoS.userId;
            state.userInfo.role = userInfoS.roleLevel;
            state.userInfo.user = userInfoS.userName;
            state.userInfo.token = userInfoS.userToken;
        },
    },
    actions: {},
    modules: {}
});
export default store;
//# sourceMappingURL=index.js.map