//components/NotiBadge.js
import React from 'react'

import { Notifications } from '@material-ui/icons'
import { Badge } from '@material-ui/core'
import { realtime } from '../shared/firebase'
import { useSelector } from 'react-redux'
import { onValue, ref, update } from 'firebase/database'

const NotiBadge = (props) => {
  const [is_read, setIsRead] = React.useState(true)
  const user_id = useSelector((state) => state.user.user.uid)

  const notiDB = ref(realtime, `noti/${user_id}`)

  const notiCheck = () => {
    update(notiDB, { read: true })
    props._onClick()
  }

  React.useEffect(() => {
    onValue(notiDB, (v) => {
      if (v.val() === null) {
        update(notiDB, { read: true })
      } else {
        setIsRead(Boolean(v.val().read))
      }
    })
  }, [])

  return (
    <React.Fragment>
      <Badge
        invisible={is_read}
        color="secondary"
        onClick={notiCheck}
        variant="dot"
      >
        <Notifications />
      </Badge>
    </React.Fragment>
  )
}

NotiBadge.defaultProps = {
  _onClick: () => {},
}

export default NotiBadge
