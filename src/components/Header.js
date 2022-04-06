import React from 'react'
import { getCookie, deleteCookie } from '../shared/Cookies'
import { Grid, Text, Button } from '../elements/index'

import { useSelector, useDispatch } from 'react-redux'
import { actionCreators as userActions } from '../redux/modules/User'

import { history } from '../redux/configureStore'
import { apiKey } from '../shared/firebase'

import NotiBadge from './NotiBadge'
import { FiLogOut } from 'react-icons/fi'

const Header = (props) => {
  const dispatch = useDispatch()
  const is_login = useSelector((state) => state.user.is_login)
  const user_info = useSelector((state) => state.user.user)

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`
  const is_session = sessionStorage.getItem(_session_key) ? true : false

  if (is_login && is_session) {
    return (
      <React.Fragment>
        <Grid is_flex padding="4px 16px">
          <Grid>
            <Text
              _onClick={() => {
                window.location.replace('/')
              }}
              margin="0px"
              size="24px"
              bold
            >
              안뇽
            </Text>
          </Grid>

          <Grid is_flex>
            <Button text="내정보"></Button>
            <NotiBadge
              _onClick={() => {
                history.push('./noti')
              }}
            ></NotiBadge>
            <FiLogOut
              size="25"
              onClick={() => {
                dispatch(userActions.logoutFB())
              }}
            />
            {/* <Button
              text="로그아웃"
              _onClick={() => {
                dispatch(userActions.logoutFB())
              }}
            ></Button> */}
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Grid is_flex padding="4px 16px">
        <Grid>
          <Text
            _onClick={() => {
              window.location.replace('/')
            }}
            margin="0px"
            size="24px"
            bold
          >
            안뇽
          </Text>
        </Grid>

        <Grid is_flex>
          <Button
            text="로그인"
            _onClick={() => {
              history.push('/login')
            }}
          ></Button>
          <Button
            text="회원가입"
            _onClick={() => {
              history.push('/signup')
            }}
          ></Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default Header
