// ========================================================
// 同步 history 配置
// ========================================================
import { useRouterHistory } from 'react-router'
import createHashHistory from 'history/lib/createHashHistory'
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux'// react-router-redux的作用就是将react-router的state纳入到redux的store中，进行统一的管理

const browserHistory = useRouterHistory(createHashHistory)({
  basename: '', // 相当于 rootPath
  queryKey: false // 去除随机标识符
})

export const historyMiddleware = routerMiddleware(browserHistory)

/**
 * @param  {Store}
 * @return {History} 增强版 history
 */
export default function (store) {
  return syncHistoryWithStore(
    browserHistory,
    store,
    { selectLocationState: (state) => state.router }
  )
}
