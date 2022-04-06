import { createAction, handleActions } from 'redux-actions'
import { produce } from 'immer'
import { firestore } from '../../shared/firebase'
import firebase from 'firebase/compat/app'
import {
  getDocs,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../shared/firebase'
import { actionCreators as postActions } from './post'
import { update } from 'lodash'
import moment from 'moment'

const SET_COMMENT = 'SET_COMMENT'
const ADD_COMMENT = 'ADD_COMMENT'

const LOADING = 'LOADING'

const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({
  post_id,
  comment_list,
}))
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({
  post_id,
  comment,
}))

const loading = createAction(LOADING, (is_loading) => ({ is_loading }))

const initialState = {
  list: {},
  is_loading: false,
}

const addCommentFB = (post_id, contents) => {
  return async function (dispatch, getState, { history }) {
    // const commentDB = collection(db, 'comment')
    const user_info = getState().user.user
    const post = getState().post.list.find((l) => l.id === post_id)

    let comment = {
      post_id: post_id,
      user_id: user_info.uid,
      user_name: user_info.user_name,
      user_profile: user_info.user_profile,
      contents: contents,
      insert_dt: moment().format('YYYY-MM-DD hh:mm:ss'),
    }

    await addDoc(collection(db, 'comment'), { comment }).then(async (doc) => {
      const postDB = collection(db, 'post')

      const increment = firebase.firestore.FieldValue.increment(1)
      comment = { ...comment, id: doc.id }

      await updateDoc(postDB, { comment_cnt: increment }).then((_post) => {
        dispatch(addComment(post_id, comment))

        if (post) {
          dispatch(
            postActions.editPost(post_id, {
              comment_cnt: parseInt(post.comment_cnt) + 1,
            }),
          )
        }
      })
    })
  }
}

const getCommentFB = (post_id) => {
  return async function (dispatch, getState, { history }) {
    if (!post_id) {
      return
    }
    const commentDB = collection(db, 'comment')
    console.log(commentDB)
    const q = query(commentDB, where('post_id', '==', post_id))
    console.log("i'm here,,")
    // console.log(q)
    console.log(post_id)

    await getDocs(q)
      .then((docs) => {
        let list = []
        docs.forEach((doc) => {
          console.log(doc.data())
          list.push({ ...doc.data(), id: doc.id })
        })

        dispatch(setComment(post_id, list))
      })

      .catch((err) => {
        console.log('댓글 정보를 가져올 수가 ....', err)
      })
  }
}

export default handleActions(
  {
    [SET_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        //let date ={[post_id]: com_list...}
        draft.list[action.payload.post_id] = action.payload.comment_list
      }),
    [ADD_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.post_id].unshift(action.payload.comment)
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading
      }),
  },
  initialState,
)

const actionCreators = {
  getCommentFB,
  setComment,
  addComment,
  addCommentFB,
}

export { actionCreators }
