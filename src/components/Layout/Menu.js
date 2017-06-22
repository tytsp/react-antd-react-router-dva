import React, { PropTypes } from 'react'
import { Menu, Icon } from 'antd'
import { Link } from 'dva/router'
// import { menu } from '../../utils'

// const topMenus = menu.map(item => item.key)


function Menus ({ siderFold, darkTheme, location, handleClickNavMenu, navOpenKeys, changeOpenKeys ,menu}) {

const topMenus = menu.map(item => item.menuUrl)
const getMenus = function (menuArray, siderFold, parentPath = '/') {
  return menuArray.map(item => {
    const linkTo = parentPath + item.menuUrl
    if (item.child) {
      return (
        <Menu.SubMenu key={linkTo} title={<span>{item.icon ? <Icon type={item.icon} /> : ''}{siderFold && topMenus.indexOf(item.menuUrl) >= 0 ? '' : item.name}</span>}>
          {getMenus(item.child, siderFold, `${linkTo}/`)}
        </Menu.SubMenu>
      )
    }
    return (
      <Menu.Item key={linkTo}>
        <Link to={linkTo}>
          {item.icon ? <Icon type={item.icon} /> : ''}
          {siderFold && topMenus.indexOf(item.menuUrl) >= 0 ? '' : item.name}
        </Link>
      </Menu.Item>
    )
  })
}
  const menuItems = getMenus(menu, siderFold)

  const getAncestorKeys = (menuUrl) => {
    const map = {
      '/navigation/navigation2': ['/navigation'],
    }
    return map[menuUrl] || []
  }

  const onOpenChange = (openKeys) => {
  	
    // 最后关 和最后开的存储状态
    const latestOpenKey = openKeys.find(key => !(navOpenKeys.indexOf(key) > -1))

    const latestCloseKey = navOpenKeys.find(key => !(openKeys.indexOf(key) > -1))
    
    let nextOpenKeys = []

     
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
     
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey)
    }
 
    changeOpenKeys(nextOpenKeys)
  }
  
  let menuProps = !siderFold ? {
    onOpenChange,
    openKeys: navOpenKeys,
  } : {}
 
  return (
    <Menu
      {...menuProps}
      mode={siderFold ? 'vertical' : 'inline'}
      theme={darkTheme ? 'dark' : 'light'}
      onClick={handleClickNavMenu}
      defaultSelectedKeys={[location.pathname !== '/' ? location.pathname : '/dashboard']}
    >
      {menuItems}
    </Menu>
  )
}

Menus.propTypes = {
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  isNavbar: PropTypes.bool,
  handleClickNavMenu: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Menus
