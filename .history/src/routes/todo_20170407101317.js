import { injectReducer } from 'REDUCER'
import createContainer from 'UTIL/createContainer'

export default {
  path: 'todo',

  /* 布局基页 */
  getComponent (nextState, cb) {
    require.ensure([], (require) => { // 动态路由，按需加载https://github.com/ReactTraining/react-router/blob/v3/docs/guides/DynamicRouting.md
      cb(null, require('VIEW/todo').default)  // require.ensure的三个参数，第一个为数组，表示当前模块的依赖，第二个参数是第一个参数中指定的依赖都加载完成后执行的回调函数，第三个参数是最终生成的js的名字。
    }, 'todoView')
  },

  indexRoute: {
    getComponent (nextState, cb) {
      require.ensure([], (require) => {
        // 注入 Reducer
        injectReducer('todos', require('REDUCER/todo').default)

        /* 组件连接 state */
        const TodoContainer = createContainer(
          ({ todos }) => ({ todos }),        // mapStateToProps,
          require('ACTION/todo').default,    // mapActionCreators,
          require('COMPONENT/Todo/').default // 木偶组件
        )

        cb(null, TodoContainer)
      }, 'todo')
    }
  }
}

/**
 * 【拓展】
 * 在 msg 的路由中，Reducer 是在 布局基页 中注入
 * 而在这里就可以在 indexRoute 中注入
 * 这主要取决于 Reducer 的作用范围
 */
