import React from 'react'
import { Grid, Image, Text } from '../elements'

import { useDispatch, useSelector } from 'react-redux'
import { actionCreators as commentActions } from '../redux/modules/comments'

const CommentList = (props) => {
  const dispatch = useDispatch()
  const comment_list = useSelector((state) => state.comment.list)

  const { post_id } = props

  React.useEffect(() => {
    if (!comment_list[post_id]) {
      // 코멘트 정보가 없으면 불러오기
      dispatch(commentActions.getCommentFB(post_id))
    }
  }, [])
  //post_id를 props로 받아오고 그 post_id도 database에서 가져오므로
  //post_id가 없는 순간이 생기면서 comment_list[post_id]에 아무 것도 없게 된다
  //또는 달린 댓글이 없을때도 map함수를 돌리면 오류가 나므로 이 조건 추가해야함!
  // comment가 없거나, post_id가 없으면 아무것도 안넘겨준다!
  if (!comment_list[post_id] || !post_id) {
    return null
  }

  return (
    <React.Fragment>
      <Grid padding="16px">
        {comment_list[post_id].map((comment) => {
          return <CommentItem key={comment.id} {...comment} />
        })}
      </Grid>
    </React.Fragment>
  )
}

const CommentItem = (props) => {
  const { user_profile, user_name, contents, insert_dt } = props
  return (
    <Grid is_flex>
      <Grid is_flex width="auto">
        <Image shape="circle" src={user_profile} />
        <Text bold>{user_name}</Text>
      </Grid>
      <Grid is_flex margin="0px 4px">
        <Text margin="0px">{contents}</Text>
        <Text margin="0px">{insert_dt}</Text>
      </Grid>
    </Grid>
  )
}

CommentList.defaultProps = {
  post_id: null,
}

CommentItem.defaultProps = {
  user_profile: '',
  user_name: 'mean0',
  user_id: '',
  post_id: 1,
  contents: '귀여운 고양이네요!',
  insert_dt: '2021-01-01 19:00:00',
}

export default CommentList
