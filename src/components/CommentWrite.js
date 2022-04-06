import React from 'react'
import { Grid, Input, Button } from '../elements'
import { actionCreators as commentActions } from '../redux/modules/comments'
import { useDispatch, useSelector } from 'react-redux'

const CommentWrite = (props) => {
  const dispatch = useDispatch()
  const [comment_text, setCommentText] = React.useState()
  const { post_id } = props
  const writeComment = (e) => {
    setCommentText(e.target.value)
  }

  const onChange = () => {
    dispatch(commentActions.addCommentFB(post_id, comment_text))
    console.log(comment_text)
  }

  return (
    <React.Fragment>
      <Grid padding="16px" is_flex>
        <Input
          _onChange={writeComment}
          value={comment_text}
          placeholder="댓글 내용을 입력해주세요 :)"
          value={comment_text}
        />
        <Button
          _onClick={onChange}
          width="50px"
          margin="0px 2px 0px 2px"
          text="작성"
        >
          작성
        </Button>
      </Grid>
    </React.Fragment>
  )
}

export default CommentWrite
