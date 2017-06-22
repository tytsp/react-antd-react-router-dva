import React, { PropTypes } from 'react'
import { Icon, Switch } from 'antd'
import styles from './Layout.less'
import { config } from '../../utils'
import Menus from './Menu'

function Sider ({ siderFold, darkTheme, location, changeTheme, navOpenKeys, changeOpenKeys,menu }) {
  const menusProps = {
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys,
    menu
  }
  return (
    <div>
      <div className={styles.logo}>
        <img alt={'logo'} src={config.logoSrc} />
        {siderFold ? '' : <span><a href="/dashboard">{config.logoText}</a></span>}
      </div>
      <Menus {...menusProps} />
      
    </div>
  )
}

Sider.propTypes = {
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  changeTheme: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Sider
