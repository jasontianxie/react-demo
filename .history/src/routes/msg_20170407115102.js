import { injectReducer } from 'REDUCER'
import userAuth from 'UTIL/userAuth'           // 用户访问拦截器
import createContainer from 'UTIL/createContainer'

const connectComponent = createContainer(
  ({ userData, msg }) => ({ userData, msg }), // mapStateToProps
  require('ACTION/msg').default               // mapActionCreators
)

export default {
  path: 'msg',

  /* 布局基页 */
  getComponent (nextState, cb) { // 动态路由，按需加载https://github.com/ReactTraining/react-router/blob/v3/docs/guides/DynamicRouting.md
    require.ensure([], (require) => { // require.ensure的三个参数，第一个为数组，表示当前模块的依赖，第二个参数是第一个参数中指定的依赖都加载完成后执行的回调函数，第三个参数是最终生成的js的名字。
      // 立即注入 Reducer
      injectReducer('msg', require('REDUCER/msg/').default)

      cb(null, require('VIEW/msg').default)
    }, 'msgView')
  },

  indexRoute: { // 对应 /msg
    getComponent (nextState, cb) { // nextState表示路由的信息，具体是什么可以console一下
      require.ensure([], (require) => {
        cb(null, connectComponent(require('COMPONENT/Msg/MsgList').default))
      }, 'msgList')
    }
  },

  childRoutes: [
  { // 对应 /msg/detail/:msgId
    path: 'detail/:msgId',
    getComponent (nextState, cb) {
      require.ensure([], (require) => {
        cb(null, connectComponent(require('COMPONENT/Msg/MsgDetail').default))
      }, 'msgDetail')
    }
  },
  { // 对应 /msg/add
    path: 'add',
    getComponent (nextState, cb) {
      require.ensure([], (require) => {
        cb(null, connectComponent(require('COMPONENT/Msg/MsgForm').default))
      }, 'msgForm')
    },
    onEnter: userAuth
  },
  { // 对应 /msg/:msgId
    path: 'modify/:msgId',
    getComponent (nextState, cb) {
      require.ensure([], (require) => {
        cb(null, connectComponent(require('COMPONENT/Msg/MsgForm').default))
      }, 'msgForm')
    },
    onEnter: userAuth
  }]
}
