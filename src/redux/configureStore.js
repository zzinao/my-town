import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'
import { connectRouter } from 'connected-react-router'

import User from './modules/User'
import Post from './modules/post'
import Image from './modules/image'
import Comment from './modules/comments'

export const history = createBrowserHistory()

const rootReducer = combineReducers({
  user: User,
  post: Post,
  image: Image,
  comment: Comment,
  router: connectRouter(history),
})

//미들웨어 ㅗ

const middlewares = [thunk.withExtraArgument({ history: history })]

// 지금이 어느 환경인지 알려준다. (개발 환경, 프로덕션(배포)환경...)
const env = process.env.NODE_ENV

// 개발환경에서는 로거라는 걸 하나만 더 써볼게요
if (env === 'development') {
  //env가 개발 환경일 때
  const { logger } = require('redux-logger') //require = import logger를 가지고 와
  middlewares.push(logger)
}

//redux devTools

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

//미들웨어 묶기
const enhancer = composeEnhancers(applyMiddleware(...middlewares))

//스토어 만들기
let store = (initialStore) => createStore(rootReducer, enhancer)

export default store()
