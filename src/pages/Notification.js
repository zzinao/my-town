import React from 'react'
import { Grid, Text, Image } from '../elements'
import Card from '../components/Card'
import { realtime } from '../shared/firebase'
import { useSelector } from 'react-redux'
import { ref, get, update } from 'firebase/database'

const Notification = (props) => {
  const user = useSelector((state) => state.user.user)
  const [noti, setNoti] = React.useState([])

  React.useEffect(() => {
    if (!user) {
      return
    }
    const notiDB = ref(realtime, `noti/${user.uid}/list`)

    get(notiDB).then(
      (snapshot) => {
        if (snapshot.exists()) {
          let _data = snapshot.val()
          let _noti_list = Object.keys(_data)
            .reverse()
            .map((n) => {
              return _data[n]
            })
          setNoti(_noti_list)
        }
      },
      [user],
    )

    return () => {
      const notiDB = ref(realtime, `noti/${user.user_id}`)
      update(notiDB, { list: [] })
    }
  }, [user])

  return (
    <React.Fragment>
      <Grid padding="16px" bg="#EFF6FF">
        {noti.map((n, idx) => {
          return <Card key={`noti_${idx}`} {...n} />
        })}
      </Grid>
    </React.Fragment>
  )
}

export default Notification
