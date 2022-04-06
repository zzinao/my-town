//  btn.js
import React from 'react'
import styled from 'styled-components'

const Button = (props) => {
  const { text, _onClick, width } = props

  const styles = {
    width,
  }

  return (
    <React.Fragment>
      <Btn {...styles} onClick={_onClick}>
        {text}
      </Btn>
    </React.Fragment>
  )
}

Button.defaultProps = {
  width: '100%',
  text: '텍스트',
  _onClick: () => {},
}

const Btn = styled.button`
  padding: 5px 30px;
  width: ${(props) => props.width};
  cursor: pointer;
  border: none;
  box-sizing: border-box;
  text-align: center;
  border-radius: 10px;
`

export default Button
