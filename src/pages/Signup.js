import React from 'react'
import { Grid, Text, Input, Button } from '../elements'

import { useDispatch } from 'react-redux'
import { actionCreators as userActions } from '../redux/modules/User'

const Signup = (props) => {
  const dispatch = useDispatch()

  const [id, setId] = React.useState('')
  const [pwd, setPwd] = React.useState('')
  const [pwd_check, setPwdCheck] = React.useState('')
  const [user_name, setUserName] = React.useState('')

  const signup = () => {
    if (pwd !== pwd_check) {
      window.alert('비밀번호가 일치하지 않아용')
      return
    }
    if (id === '' || pwd === '' || user_name === '') {
      window.alert('빈칸을 채워주세용!')
      return
    }
    dispatch(userActions.signupFB(id, pwd, user_name))
  }

  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text size="32px" bold>
          회원가입
        </Text>

        <Grid padding="16px 0 0">
          <Input
            label="아이디"
            value={id}
            placeholder="아이디를 입력해주세요."
            _onChange={(e) => {
              setId(e.target.value)
            }}
          />
        </Grid>

        <Grid>
          <Input
            label="닉네임"
            value={user_name}
            placeholder="닉네임을 입력해주세요."
            _onChange={(e) => {
              setUserName(e.target.value)
            }}
          />
        </Grid>

        <Grid>
          <Input
            label="비밀번호"
            value={pwd}
            placeholder="비밀번호를 입력해주세요."
            _onChange={(e) => {
              setPwd(e.target.value)
            }}
          />
        </Grid>

        <Grid>
          <Input
            label="비밀번호 확인"
            value={pwd_check}
            placeholder="비밀번호를 다시 입력해주세요."
            _onChange={(e) => {
              setPwdCheck(e.target.value)
            }}
          />
        </Grid>

        <Button text="회원가입하기" _onClick={signup}></Button>
      </Grid>
    </React.Fragment>
  )
}

Signup.defaultProps = {}

export default Signup
