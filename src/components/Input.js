import Styled from 'styled-components'

const InputGroup = Styled.div`
  text-align: left;
  display: block;
  width: 300px;
  margin: 10px;
`

const Input = Styled.input`
  border-radius: 3px;
  border: 1px solid #ddd;
  box-sizing: border-box;
  padding-left: 10px;
  display: inline-block;
  outline: none;
  width:100%;
  margin:5px 0px;
`

export { Input, InputGroup }