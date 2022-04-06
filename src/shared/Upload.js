import React, { useRef } from 'react'
import { Button } from '../elements/index'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useSelector, useDispatch } from 'react-redux'
import { actionCreators as imageActions } from '../redux/modules/image'

const Upload = (props) => {
  const fileInput = React.useRef()
  const is_uploading = useSelector((state) => state.image.uploading)
  const dispatch = useDispatch()

  const selectFile = (e) => {
    console.log(e.target.files)
    const reader = new FileReader()
    const file = fileInput.current.files[0]
    // ㅍㅏ일 내용 읽기
    reader.readAsDataURL(file)
    // 읽기가 끝나면 발생하는 이벤트 핸들러 ~
    reader.onloadend = () => {
      // console.log(reader.result)
      dispatch(imageActions.setPreview(reader.result))
    }
  }
  // const uploadFB = () => {
  //   if (!fileInput.current || fileInput.current.files.length === 0) {
  //     window.alert('파일을 선택해주세용')
  //     return
  //   }
  //   dispatch(imageActions.uploadImageFB(fileInput.current.files[0]))

  // const file = fileInput.current.files[0]
  // const storage = getStorage()
  // let image = fileInput.current.files[0]
  // const _upload = ref(storage, `images/${image.name}`)

  // uploadBytes(_upload, file).then((snapshot) => {
  //   console.log('Uploaded...!')

  //   //url 링크 얻기
  //   getDownloadURL(_upload).then((url) => {
  //     console.log(url)
  //   })
  // })
  // }

  return (
    <React.Fragment>
      <input
        type="file"
        onChange={selectFile}
        ref={fileInput}
        disabled={is_uploading}
      />
    </React.Fragment>
  )
}

export default Upload
