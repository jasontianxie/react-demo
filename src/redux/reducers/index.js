import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux' // react-router-redux的作用就是将react-router的state纳入到redux的store中，进行统一的管理，未使用前react-router和redux各自管理状态
import store from 'STORE'
import userReducer from 'REDUCER/user'

// ================================
// 同步的 Reducers（即应用初始化所必需的）
// ================================
const syncReducers = {
  router: routerReducer,
  userData: userReducer
}

// ================================
// 异步加载的 Reducers（Code Splitting 按需加载的）
// ================================
const asyncReducers = {}

/**
 * @return {Function} rootReducer
 */
export function createRootReducer() {
  return combineReducers({
    ...syncReducers,
    ...asyncReducers
  })
}

/**
 * 按需加载时，立即注入对应的 Reducer
 * @param  {String}   key
 * @param  {Function} reducer
 */
export function injectReducer(key, reducer) {
  asyncReducers[key] = reducer
  store.replaceReducer(createRootReducer()) // 替换当前store的 rootReducer
}
