import React from 'react'
import styled from 'styled-components'

const Text = (props) => {
  const { bold, color, size, children, _onClick } = props
  const styles = { bold: bold, color: color, size: size }

  return (
    <P {...styles} onClick={_onClick}>
      {children}
    </P>
  )
}

Text.defaultProps = {
  bold: false,
  color: '#222831',
  size: '14px',
  _onClick: () => {},
}

const P = styled.p`
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => (props.bold ? '700' : '400')};
`

export default Text
