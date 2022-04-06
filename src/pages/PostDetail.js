import React, { useEffect } from 'react'
import Post from '../components/Post'
import { Button } from '../elements/index'
import CommentList from '../components/CommentList'
import CommentWrite from '../components/CommentWrite'
import { useSelector, useDispatch } from 'react-redux'
import { actionCreators as postActions } from '../redux/modules/post'

const PostDetail = (props) => {
  const dispatch = useDispatch()
  const id = props.match.params.id
  console.log(id)
  const user_info = useSelector((state) => state.user.user)
  const post_list = useSelector((store) => store.post.list)
  const post_idx = post_list.findIndex((p) => p.id === id)
  const post = post_list[post_idx]

  React.useEffect(async () => {
    //여기서도 마찬가지로 새로고침하면 reducer store는 리셋된다!
    //따라서 post가 있을 때(맨처음 detail 페이지로 왔을 때 )는 더 작업을 안해도 되고
    //디테일 페이지에서 새로고침을 했을 때마다 post_id에 해당하는 data하나만
    //firestore에서 load해온다!
    if (post) {
      return
    }
    dispatch(postActions.getOnePostFB(id))
  }, [])

  const deletePost = () => {
    window.alert('삭제가 완료되었습니다!')
  }

  return (
    <React.Fragment>
      {post && (
        <>
          <Post {...post} is_me={post.user_info?.user_id === user_info?.uid} />
          {post.user_info.user_id === user_info?.uid ? (
            <Button _onClick={deletePost} text="삭제하기~">
              삭제하기
            </Button>
          ) : null}
        </>
      )}
      <CommentWrite post_id={id} />
      <CommentList post_id={id} />
    </React.Fragment>
  )
}

export default PostDetail
