import React from 'react'
import { Grid, Image, Text } from '../elements/index'

const Post = (props) => {
  console.log(props)
  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex>
          <Image shape="circle" src={props.src} />
          <Text bold>{props.user_info.user_name}</Text>
          <Text bold>{props.insert_dt}</Text>
        </Grid>
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
}
export default Post
