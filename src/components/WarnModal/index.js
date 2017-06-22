import React from 'react'
import { Modal } from 'antd'

const Warn = ({...single }) => {

  return (<Modal {...single}>
          {single.text}
        </Modal>)
}



export default Warn
