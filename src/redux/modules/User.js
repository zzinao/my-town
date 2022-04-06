import { createAction, handleActions } from 'redux-actions'
import { produce } from 'immer'

import { setCookie, getCookie, deleteCookie } from '../../shared/Cookies'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  browserSessionPersistence,
  setPersistence,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import { auth } from '../../shared/firebase'

//action
const LOG_OUT = 'LOG_OUT'
const GET_USER = 'GET_USER'
const SET_USER = 'SET_USER'

//action creator

const logOut = createAction(LOG_OUT, (user) => ({ user }))
const getUser = createAction(GET_USER, (user) => ({ user }))
const setUser = createAction(SET_USER, (user) => ({ user }))

// initialState
const initialState = {
  user: null,
  is_login: false,
}

// middlewares actions
const loginFB = (id, pwd) => {
  return function (dispatch, getState, { history }) {
    const auth = getAuth()
    setPersistence(auth, browserSessionPersistence).then((res) => {
      signInWithEmailAndPassword(auth, id, pwd)
        .then((user) => {
          dispatch(
            setUser({
              user_name: user.user.displayName,
              id: id,
              user_profile: '',
              uid: user.user.uid,
            }),
          )
          history.push('/')
          // return signInWithEmailAndPassword(auth, id, pwd)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
        })
    })
  }
}

const signupFB = (id, pwd, user_name) => {
  return function (dispatch, getState, { history }) {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, id, pwd)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        console.log(user)

        updateProfile(auth.currentUser, {
          displayName: user_name,
        })
          .then(() => {
            dispatch(
              setUser({
                user_name: user_name,
                id: id,
                user_profile: '',
                uid: user.uid,
              }),
            )
            history.push('/')
          })
          .catch((error) => {
            console.log(error)
          })
        // ...
      })

      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        // ..
      })
  }
}

const loginCheckFB = () => {
  return function (dispatch, getState, { history }) {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            user_name: user.displayName,
            user_profile: '',
            id: user.email,
            uid: user.uid,
          }),
        )
        history.push('/')
      }
    })
  }
}

const logoutFB = () => {
  return function (dispatch, getState, { history }) {
    auth.signOut().then(() => {
      dispatch(logOut())
      history.replace('/')
    })
  }
}
//reducer
export default handleActions(
  {
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        setCookie('is_login', 'success')
        draft.user = action.payload.user
        draft.is_login = true
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        deleteCookie('is_login')
        draft.user = null
        draft.is_login = false
      }),
    [GET_USER]: (state, action) => produce(state, (draft) => {}),
  },
  initialState,
)

//action creator export
const actionCreators = {
  logOut,
  getUser,
  signupFB,
  loginFB,
  loginCheckFB,
  logoutFB,
}

export { actionCreators }
