import { createAction, handleActions } from 'redux-actions'
import produce from 'immer'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

//action

const UPLOADING = 'UPLOADING'
const UPLOAD_IMAGE = 'UPLOAD_IMAGE'
const SET_PREVIEW = 'SET_PREVIEW'

const uploading = createAction(UPLOADING, (uploading) => ({ uploading }))
const uploadImage = createAction(UPLOAD_IMAGE, (image_url) => ({ image_url }))

const setPreview = createAction(SET_PREVIEW, (preview) => ({ preview }))

const initialState = {
  image_url: '',
  uploading: false,
  preview: null,
}

const uploadImageFB = (image) => {
  return function (dispatch, getState, { history }) {
    dispatch(uploading(true))

    const storage = getStorage()
    const _upload = ref(storage, `images/${image.name}`)

    //업로드
    uploadBytes(_upload, image).then((snapshot) => {
      console.log('Uploaded...!')

      //url 링크 얻기
      getDownloadURL(_upload).then((url) => {
        dispatch(uploadImage(url))
        console.log(url)
      })
    })
  }
}

export default handleActions(
  {
    [UPLOAD_IMAGE]: (state, action) =>
      produce(state, (draft) => {
        draft.image_url = action.payload.image_url
        draft.uploading = false
      }),

    [UPLOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.uploading = action.payload.uploading
      }),

    [SET_PREVIEW]: (state, action) =>
      produce(state, (draft) => {
        draft.preview = action.payload.preview
      }),
  },
  initialState,
)

const actionCreators = {
  uploadImage,
  uploadImageFB,
  setPreview,
}

export { actionCreators }
