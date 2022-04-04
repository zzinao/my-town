//  btn.js
import React from 'react'
import styled from 'styled-components'

const Button = (props) => {
  const { text, _onClick } = props

  return (
    <React.Fragment>
      <Btn onClick={_onClick}>{text}</Btn>
    </React.Fragment>
  )
}

Button.defaultProps = {
  text: '텍스트',
  _onClick: () => {},
}

const Btn = styled.button`
  padding: 12px 30px;
  marign: 10px;
  cursor: pointer;
  border: none;
  border-radius: 10px;
`

export default Button
