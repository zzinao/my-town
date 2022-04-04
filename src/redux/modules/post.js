import { createAction, handleActions } from 'redux-actions'
import { produce } from 'immer'
import {
  doc,
  docs,
  getDoc,
  addDoc,
  getDocs,
  collection,
} from 'firebase/firestore'
import { db } from '../../shared/firebase'
import moment from 'moment'
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage'
import { actionCreators as imageActions } from './image'

const SET_POST = 'SET_POST'
const ADD_POST = 'ADD_POST'

export function loadPost(post) {
  return { type: SET_POST, post }
}

const setPost = createAction(SET_POST, (post_list) => ({ post_list }))
const addPost = createAction(ADD_POST, (post) => ({ post }))

const initialState = {
  list: [],
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
      insert_dt: moment().format('YYYY-MM-dd hh:mm:ss'),
    }

    const _image = getState().image.preview
    console.log(_image)
    console.log(typeof _image)

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

export const getPostFB = () => {
  return async function (dispatch) {
    const post_data = await getDocs(collection(db, 'post'))
    let post_list = []
    post_data.forEach((doc) => {
      let _post = { id: doc.id, ...doc.data() }
      console.log(_post)
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
    dispatch(setPost(post_list))
    console.log(post_list)
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
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.post_list
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post)
      }),
  },
  initialState,
)

const actionCreators = {
  setPost,
  addPost,
  getPostFB,
  addPostFB,
}

export { actionCreators }
