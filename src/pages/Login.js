import React from 'react'
import styled from 'styled-components'
import { Grid, Text, Input, Button } from '../elements/index'
import { getCookie, setCookie, deleteCookie } from '../shared/Cookies'
import { useDispatch } from 'react-redux'
import { actionCreators as userActions } from '../redux/modules/User'

const Login = (props) => {
  const dispatch = useDispatch()

  const [id, setId] = React.useState('')
  const [pwd, setPwd] = React.useState('')

  // console.log(getCookie('user_id'))

  const login = () => {
    if (id === '' || pwd === '') {
      window.alert('빈칸을 채워주셔요~')
      return
    }
    dispatch(userActions.loginFB(id, pwd))
  }

  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text type="heading" size="32px">
          로그인
        </Text>
        <Container>
          <Grid padding="12px 0 0">
            <span>아이디</span>
            <Input
              label="id"
              value={id}
              placeholder="아이디를 입력해주세요"
              _onChange={(e) => {
                setId(e.target.value)
              }}
            />
          </Grid>

          <Grid>
            <span>비밀번호</span>
            <Input
              label="pw"
              value={pwd}
              _onChange={(e) => {
                setPwd(e.target.value)
              }}
              type="password"
              placeholder="패스워드를 입력해주세요"
            />
          </Grid>

          <Button text="로그인" _onClick={login}>
            로그인
          </Button>
        </Container>
      </Grid>
    </React.Fragment>
  )
}

const Container = styled.div`
  text-align: center;
`

export default Login
