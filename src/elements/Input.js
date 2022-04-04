// Input.js

import React from 'react'
import styled from 'styled-components'

import { Text, Grid } from './index'

const Input = (props) => {
  const { label, placeholder, _onChange, type } = props

  return (
    <React.Fragment>
      <Grid>
        <Text>
          <InputBox
            type={type}
            placeholder={placeholder}
            onChange={_onChange}
          />
        </Text>
      </Grid>
    </React.Fragment>
  )
}

Input.defaultProps = {
  label: '텍스트',
  placeholder: '텍스트를 입력하세용',
  _onChange: () => {},
  type: 'text',
}

const InputBox = styled.input`
  padding: 15px 4px;
  width: 200px;
  border: 1px solid #ddd;
  box-sizing: border-box;
`

export default Input
