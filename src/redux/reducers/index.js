import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux' // react-router-redux的功能就是增强react-router的history的功能，比如从A页面跳到B页面，如果再从B页面跳回A的时候，A页面会重新刷新，如果在A页面跳转B之前A中有状态的更改（如：有些文字的颜色改了，或者有些元素隐藏了），当跳回来的时候，A中这些更改都不存在了，又回到了初始状态（颜色更改和元素隐藏都没有了）。
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
  store.replaceReducer(createRootReducer()) // 替换当前的 rootReducer
}
