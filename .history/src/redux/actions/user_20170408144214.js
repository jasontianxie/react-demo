import userService from 'SERVICE/userService'
// ================================
// Action Type
// ================================
const LOG_IN = 'LOG_IN'
const LOG_OUT = 'LOG_OUT'

// ================================
// Action Creator
// ================================
const loginDone = (userData) => ({
  type: LOG_IN,
  payload: userData
})

const login = (formData) => {
  return dispatch => {
    userService
      .login(formData)
      .then(
        re => dispatch(loginDone(re))
      )
  }
}

const checkLogin = () => {
  return dispatch => {
    userService
      .checkLogin()
      .then((re) => {
        if (!re) return
        dispatch(loginDone(re))
      })
  }
}

const logout = () => {
  return dispatch => {
    userService
      .logout()
      .then(() => 
        dispatch({
          type: LOG_OUT
        })
      )
  }
}
/* default 导出所有 Actions Creator */ // 因为这里的的action是异步操作，使用了redux-thunk中间件，所以，这里的Actions Creater返回的是函数，具体看阮一峰redux教程“中间件”这部分内容。
export default {
  login, checkLogin, logout
} // 这里导出的内容在components/Navbar/index.js中引入，用在connect函数中。

// ================================
// Action handlers for Reducer
// 本来更新 state 是 Reducer 的责任
// 但要把 ActionType 导出又引入实在太麻烦
// 且在 Reducer 中写 switch-case 实在太不优雅
// 故在此直接给出处理逻辑
// ================================
export const ACTION_HANDLERS = {
  [LOG_IN]: (userData, { payload }) => payload, // payload is userData
  [LOG_OUT]: () => null
}
