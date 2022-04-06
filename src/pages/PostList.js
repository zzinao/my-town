//PostList.js
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Post from '../components/Post'
import { Grid } from '../elements/index'
import { actionCreators as postActions } from '../redux/modules/post'

const PostList = (props) => {
  const dispatch = useDispatch()
  const post_list = useSelector((state) => state.post.list)
  const user_info = useSelector((state) => state.user.user)
  const is_loading = useSelector((state) => state.post.is_loading)
  console.log(user_info)
  console.log(post_list)
  console.log(is_loading)

  const { history } = props

  React.useEffect(() => {
    if (post_list.length < 2) {
      dispatch(postActions.getPostFB())
    }
  }, [])

  return (
    <React.Fragment>
      {post_list.map((post, idx) => {
        //로그인 했을 때만 체크하기 위해 optional chaining(user?.uid)사용
        if (post.user_info.user_id === user_info?.uid) {
          return (
            <Grid key={post.id}>
              <Post {...post} is_me />
            </Grid>
          )
        } else {
          return (
            <Grid key={post.id}>
              <Post {...post} />
            </Grid>
          )
        }
      })}
    </React.Fragment>
  )
}

export default PostList
