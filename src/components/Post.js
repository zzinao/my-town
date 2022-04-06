import React from 'react'
import { Grid, Image, Text, Button } from '../elements/index'
import { history } from '../redux/configureStore'
import { FiEdit3 } from 'react-icons/fi'
import { AiFillDelete } from 'react-icons/ai'
import { actionCreators as postActions } from '../redux/modules/post'
import { useDispatch } from 'react-redux'

const Post = (props) => {
  const dispatch = useDispatch()

  const deleteHandle = () => {
    dispatch(postActions.deletePostFB(props.id))
  }

  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="240px" is_flex>
            <Text>{props.insert_dt}</Text>
            {props.is_me && (
              <>
                <AiFillDelete size="20" onClick={deleteHandle} />
                <FiEdit3
                  size="20"
                  onClick={() => {
                    history.push(`/write/${props.id}`)
                  }}
                />
              </>
            )}
          </Grid>
        </Grid>

        <Grid
          _onClick={() => {
            history.push(`/post/${props.id}`)
          }}
        >
          <Grid padding="16px">
            <Text>{props.contents}</Text>
          </Grid>
          <Grid>
            <Image shape="rectangle" src={props.image_url} />
          </Grid>
          <Grid padding="16px">
            <Text>댓글{props.comment_cnt}개</Text>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

Post.defaultProps = {
  user_info: {
    user_name: 'mark',
    user_profile:
      'https://i.pinimg.com/564x/06/8c/4c/068c4c352f5ec31f676f9368f26143ec.jpg',
  },
  image_url:
    'https://i.pinimg.com/564x/06/8c/4c/068c4c352f5ec31f676f9368f26143ec.jpg',
  contents: '애옹..?',
  comment_cnt: 10,
  insert_dt: '2022-04-01 10:00:00',
  is_me: false,
}
export default Post
