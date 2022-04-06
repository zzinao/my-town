// Input.js
import React from 'react'
import styled from 'styled-components'
import { Text, Grid } from './index'

const Input = (props) => {
  const {
    label,
    placeholder,
    is_submit,
    _onChange,
    _onSumbit,
    type,
    value,
    textarea,
  } = props

  if (is_submit) {
    return (
      <React.Fragment>
        <Text>{label}</Text>
        <InputField
          type={type}
          placeholder={placeholder}
          onChange={_onChange}
          value={value}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              _onSumbit(e)
            }
          }}
        />
      </React.Fragment>
    )
  } else if (textarea) {
    return (
      <React.Fragment>
        <Text>{label}</Text>
        <TextAreaField
          value={value}
          rows={10}
          placeholder={placeholder}
          onChange={_onChange}
        />
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <Text>{label}</Text>
        <InputField
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={_onChange}
        />
      </React.Fragment>
    )
  }
}
Input.defaultProps = {
  label: '텍스트',
  placeholder: '텍스트를 입력하세용',
  _onChange: () => {},
  _onSubmit: () => {},
  is_submit: false,
  is_upload: false,
  width: false,
  type: 'text',
  value: '',
}

const InputField = styled.input`
  padding: 10px;
  ${(props) => (props.width ? `width: ${props.width};` : `width: 100%;`)}
  min-width: 230px;
  border: 1px solid #ddd;
  box-sizing: border-box;
`

const TextAreaField = styled.textarea`
  ${(props) => (props.is_upload ? `display: none;` : '')}
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ddd;
`
export default Input
