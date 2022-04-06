import './App.css'
import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { history } from '../redux/configureStore'
import { Grid } from '../elements'

import PostList from '../pages/PostList'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Header from '../components/Header'
import Permit from './Permit'
import PostWrite from '../pages/PostWrite'
import PostDetail from '../pages/PostDetail'
import Search from './Search'
import Notification from '../pages/Notification'

import { BsPlusCircleFill } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { actionCreators as userActions } from '../redux/modules/User'
import { apiKey } from './firebase'
import styled from 'styled-components'

function App(props) {
  const dispatch = useDispatch()
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`
  const is_session = sessionStorage.getItem(_session_key) ? true : false

  React.useEffect(() => {
    if (is_session) {
      dispatch(userActions.loginCheckFB())
    }
  })
  return (
    <Container>
      <Grid>
        <ConnectedRouter history={history}>
          <Header />
          <Route path="/" exact component={PostList} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/write" exact component={PostWrite} />
          <Route path="/write/:id" exact component={PostWrite} />
          <Route path="/post/:id" exact component={PostDetail} />
          <Route path="/search" exact component={Search} />
          <Route path="/noti" exact component={Notification} />
        </ConnectedRouter>
      </Grid>
      <Permit>
        <Navigation>
          <BsPlusCircleFill
            className="plus_btn"
            size="60"
            onClick={() => {
              history.push('/write')
            }}
          />
        </Navigation>
      </Permit>
    </Container>
  )
}
const Container = styled.div`
  width: 800px;
  margin: 0 auto;
`

// const Title = styled.div`
//   height: 100px;
//   background-color: green;
// `

const Navigation = styled.nav`
  .plus_btn {
    color: #ddd;
    position: fixed;
    right: 20px;
    bottom: 20px;
  }
`

export default App
