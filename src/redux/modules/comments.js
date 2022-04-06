import { createAction, handleActions } from 'redux-actions'
import { produce } from 'immer'
import { realtime } from '../../shared/firebase'
import firebase from 'firebase/compat/app'
import {
  getDocs,
  doc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  updateDoc,
  increment,
} from 'firebase/firestore'
import { db } from '../../shared/firebase'
import { actionCreators as postActions } from './post'
import { ref, update, push } from 'firebase/database'
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
    const postDB = collection(db, 'comment')
    const post = getState().post.list.find((l) => l.id === post_id)

    let comment = {
      post_id: post_id,
      user_id: user_info.uid,
      user_name: user_info.user_name,
      user_profile: user_info.user_profile,
      contents: contents,
      insert_dt: moment().format('YYYY-MM-DD hh:mm'),
    }

    await addDoc(postDB, comment).then(async (i) => {
      const post = getState().post.list.find((l) => l.id === post_id)
      comment = { ...comment, id: i.id }
      //   const increment = firebase.firestore.FieldValue.increment(1){ comment_cnt: increment }
      //   comment = { ...comment, id: doc.id }

      await updateDoc(doc(db, 'post', post_id), {
        comment_cnt: increment(1),
      }).then(async (_post) => {
        dispatch(addComment(post_id, comment))

        if (post) {
          dispatch(
            postActions.editPost(post_id, {
              comment_cnt: parseInt(post.comment_cnt) + 1,
            }),
          )
          const _noti_item = ref(
            realtime,
            `noti/${post.user_info.user_id}/list`,
          )
          await push(_noti_item, {
            post_id: post_id,
            user_name: comment.user_name,
            image_url: post.image_url,
            insert_dt: comment.insert_dt,
          }).then((i) => {
            const notiDB = ref(realtime, `noti/${post.user_info.user_id}`)
            update(notiDB, { read: false })
          })
        }
      })
    })
  }
}

const getCommentFB = (post_id = null) => {
  return async function (dispatch, getState, { history }) {
    if (!post_id) {
      return
    }
    const commentDB = collection(db, 'comment')
    console.log(commentDB)
    let list = []
    const q = query(
      commentDB,
      where('post_id', '==', post_id),
      orderBy('insert_dt', 'desc'),
    )
    await getDocs(q)
      .then((docs) => {
        docs.forEach((doc) => {
          console.log(doc.data())
          list.push({ ...doc.data(), id: doc.id })
        })
        console.log(list)
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
