import React, { PropTypes } from 'react'
import {Menu, Icon} from 'antd';



const SearchTree = ({...single}) => {

    const loop = function (menuArray,  parentPath = '/') {
      return menuArray.map(item => {
        const linkTo = parentPath + item.key
        if (item.children.length) {
          return (
            <Menu.SubMenu key={linkTo} title={<span>{item.icon ? <Icon type={item.icon} /> : ''}{item.title}</span>}>
              {loop(item.children, `${linkTo}/`)}
            </Menu.SubMenu>
          )
        }
        return (
          <Menu.Item key={linkTo}>
           
              {item.icon ? <Icon type={item.icon} /> : ''}
              {item.title}
           
          </Menu.Item>
        )
      })
    }

    return (
      <Menu
       mode={single.mode}
       theme={single.mode}
       width={single.width}
       defaultSelectedKeys={single.defaultSelectedKeys}
       defaultOpenKeys={single.defaultOpenKeys}
       onClick={single.handleClickNavMenu}
      >
         {loop(single.gData)}
      </Menu>
      
    );

}

export default SearchTree