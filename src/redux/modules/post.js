import { createAction, handleActions } from 'redux-actions'
import { produce } from 'immer'
import {
  doc,
  docs,
  getDoc,
  addDoc,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  updateDoc,
  startAt,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../../shared/firebase'
import moment from 'moment'
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage'
import { actionCreators as imageActions } from './image'
import { add } from 'lodash'

const SET_POST = 'SET_POST'
const ADD_POST = 'ADD_POST'
const EDIT_POST = 'EDIT_POST'
const LOADING = 'LOADING'
const DELETE_POST = 'DELETE_POST'

// export function loadPost(post) {
//   return { type: SET_POST, post }
// }

const setPost = createAction(SET_POST, (post_list) => ({ post_list }))
const addPost = createAction(ADD_POST, (post) => ({ post }))
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}))
const loading = createAction(LOADING, (is_loading) => ({ is_loading }))

const deletePost = createAction(DELETE_POST, (post_id) => ({ post_id }))

const initialState = {
  list: [],
  paging: { start: null, next: null, size: 3 },
  is_loading: false,
}

const initialPost = {
  // id: 0,
  // user_info: {
  //   user_name: 'mark',
  //   user_profile:
  //     'https://i.pinimg.com/564x/06/8c/4c/068c4c352f5ec31f676f9368f26143ec.jpg',
  // },
  image_url:
    'https://i.pinimg.com/564x/06/8c/4c/068c4c352f5ec31f676f9368f26143ec.jpg',
  contents: '',
  comment_cnt: 0,
  insert_dt: moment().format('YYYY-MM-dd hh:mm:ss'),
}

//스토어 연결
const addPostFB = (contents = '') => {
  return async function (dispatch, getState, { history }) {
    const _user = getState().user.user
    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    }
    const _post = {
      ...initialPost,
      contents: contents,
      insert_dt: moment().format('YYYY-MM-dd'),
    }

    const _image = getState().image.preview

    const storage = getStorage()
    const storageRef = ref(
      storage,
      `images/${user_info.user_id}_${new Date().getTime()}`,
    )

    uploadString(storageRef, _image, 'data_url')
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then(async (url) => {
            await addDoc(collection(db, 'post'), {
              ...user_info,
              ..._post,
              image_url: url,
            })
            let post = { user_info, ..._post, id: doc.id, image_url: url }
            dispatch(addPost(post))
            history.replace('/')

            dispatch(imageActions.setPreview(null))
          })
          .catch((err) => {
            window.alert('post 작성에 실패했다릐,,')
            console.log('post 작성에 실패했다릐,,', err)
          })
      })
      .catch((err) => {
        window.alert('앗! 이미지 업로드에 문제가 있다료')
        console.log('앗! 이미지 업로드에 문제가 있다료', err)
      })
  }
}

export const getPostFB = (start = null, size = 3) => {
  return async function (dispatch) {
    dispatch(loading(true))
    const post_data = await getDocs(collection(db, 'post'))
    const postRef = collection(db, 'post')
    // 시간 순 정렬 (왜 안돼,,,)
    const q = start
      ? query(
          postRef,
          orderBy('insert_dt', 'desc'),
          startAt(start),
          limit(size + 1),
        )
      : query(postRef, orderBy('insert_dt', 'desc'), limit(2))
    const post = await getDocs(q)
    let post_list = []
    let paging = {
      start: post.docs[0],
      next:
        post.docs.length === size + 1 ? post.docs[post.docs.length - 1] : null,
      size: size,
    }
    post_data.forEach((doc) => {
      let _post = { id: doc.id, ...doc.data() }
      // console.log(_post)
      let post = Object.keys(_post).reduce(
        (acc, cur) => {
          if (cur.indexOf('user_') !== -1) {
            return {
              ...acc,
              user_info: { ...acc.user_info, [cur]: _post[cur] },
            }
          }
          return { ...acc, [cur]: _post[cur] }
        },
        { id: doc.id, user_info: {} },
      )
      // let post = {
      //   id: doc.id,
      //   user_info: {
      //     user_name: _post.user_name,
      //     user_profile: _post.user_profile,
      //     user_id: _post.user_id,
      //   },
      //   contents: _post.contents,
      //   image_url: _post.image_url,
      //   comment_cnt: _post.comment_cnt,
      //   insert_dt: _post.inser_dt,
      // }
      post_list.push(post)
    })
    dispatch(setPost(post_list, paging))
    // console.log(post_list)
    // })
  }
}
// export default function reducer(state = initialState, action = {}) {
//   // state = {} : 디폴트값
//   switch (action.type) {
//     case 'SET_POST': {
//       console.log(action.post)
//       return {
//         list: action.post,
//       }
//     }

//     default:
//       return state
//   }
// }

//수정
const editPostFB = (post_id = null, post = {}) => {
  return async function (dispatch, getState, { history }) {
    // if (!post_id) {
    //   console.log('게시물 정보가 없어요!')
    //   return
    // }
    const _image = getState().image.preview
    const storage = getStorage()
    const post_idx = getState().post.list.findIndex((p) => p.id === post_id)
    const _post = getState().post.list[post_idx]

    // const uid = getState().user.user.user_id
    // console.log(uid)
    const postDB = collection(db, 'post')
    console.log(postDB)

    if (_image === _post.image_url) {
      await updateDoc(postDB, { post }).then(() => {
        dispatch(editPost(post_id, { ...post }))
        history.replace('/')
      })

      return
    } else {
      const _user = getState().user.user

      const storageRef = ref(
        storage,
        `images/${_user.uid}_${new Date().getTime()}`,
      )
      uploadString(storageRef, _image, 'data_url').then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            dispatch(imageActions.uploadImage(url))
            console.log(url)
            return url
          })
          .then(async (url) => {
            try {
              await updateDoc(postDB, { post }).then(() => {
                dispatch(editPost(post_id, { ...post, image_url: url }))
                history.replace('/')
              })
            } catch (err) {
              window.alert('앗! 이미지 업로드에 문제가 있어요!')
              console.log('앗! 이미지 업로드에 문제가 있어요!', err)
            }
          })
      })
    }

    console.log(_post)
  }
}

const getOnePostFB = (id) => {
  return async function (dispatch, getState, { history }) {
    const postDB = await getDocs(collection(db, 'post'))
    postDB.forEach((doc) => {
      let _post = doc.data()
      if (!_post) {
        return
      }
      let post = Object.keys(_post).reduce(
        (acc, cur) => {
          if (cur.indexOf('user_') !== -1) {
            return {
              ...acc,
              user_info: { ...acc.user_info, [cur]: _post[cur] },
            }
          }
          return { ...acc, [cur]: _post[cur] }
        },
        { id: _post.id, user_info: {} },
      )
      dispatch(setPost([post]))
    })
  }
}

const deletePostFB = (post_id) => {
  return async function (dispatch) {
    const docRef = doc(db, 'post', post_id)
    await deleteDoc(docRef)
    alert('삭제합니다요~')
    dispatch(deletePost(post_id))
  }
}

export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post_list)

        draft.ist = draft.list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.id === cur.id) === -1) {
            return [...acc, cur]
          } else {
            acc[acc.findIndex((a) => a.id === cur.id)] = cur
            return acc
          }
        }, [])
        if (action.payload.paging) {
          draft.paging = action.payload.paging
        }

        draft.is_loading = false
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post)
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => (p.id = action.payload.post))
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post }
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading
      }),
    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = draft.list.filter((l) => l.id !== action.payload.post_id)
      }),
  },
  initialState,
)

const actionCreators = {
  setPost,
  addPost,
  getPostFB,
  addPostFB,
  editPostFB,
  getOnePostFB,
  deletePostFB,
}

export { actionCreators }
