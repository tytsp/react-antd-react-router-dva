import React, { PropTypes } from 'react'
import { Router,routerRedux  } from 'dva/router'
// import pathToRegexp from 'path-to-regexp'
import App from './routes/app'

const cached = {}
const registerModel = (app, model) => {
  if (!cached[model.namespace]) {
    app.model(model)
    cached[model.namespace] = 1
  }
}
var menuUrl = localStorage.getItem('menuUrl');
var locationList = location.pathname.split('/');
var lastPath = locationList[locationList.length-1];

if(menuUrl && menuUrl.indexOf(lastPath) < 0 ){
  window.location.href = '/'
}

const Routers = function ({ history, app }) {
  const handleChildRoute = ({ location, params, routes }) => {
    // console.log(location, params, routes)
    
  }

  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {

          // registerModel(app, require('./models/password'))
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          },
        }, 

        {
          path: 'userRose/setting',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              /*用户管理*/
              registerModel(app, require('./models/userSetting'))
              cb(null, require('./routes/userRose/UserSettingContainer'))
            }, 'userRose-setting')
          },
        },
        {
          path: 'userRose/defined',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              /*角色管理*/
              registerModel(app, require('./models/roseDefined'))
              cb(null, require('./routes/userRose/RoseDefinedContainer'))

            }, 'userRose-defined')
          },
        },
        {
          path: 'system/populmeter',
          getComponent (nextState, cb) {
            require.ensure([], require => {
             /*群体图参数定义*/
             registerModel(app, require('./models/populmeter'))
              cb(null, require('./routes/system/PopulmeterContainer'))
            }, 'system-populmeter')
          },
        },
         {
          path: 'system/factoryment',
          getComponent (nextState, cb) {
            require.ensure([], require => {
               registerModel(app, require('./models/factoryment.model'))
              cb(null, require('./routes/system/FactorymentContainer2'))
            }, 'system-factoryment')
          },
        },
         {
          path: 'system/monoment',
          getComponent (nextState, cb) {
            require.ensure([], require => {
             registerModel(app, require('./models/monoment'))
              cb(null, require('./routes/system/MonomentContainer'))
            }, 'system-monoment')
          },
        },
         {
          path: 'report/reportquery',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/Reportquery'))
              registerModel(app, require('./models/global'))

              cb(null, require('./routes/reportQuery/ReportqueryContainer'))
            }, 'report-reportquery')
          },
        },
        {
          path: 'system/prealarm',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/prealarm'))
              cb(null, require('./routes/system/PrealarmContainer'))
            }, 'system-prealarm')
          },
        },
        {
          path: 'system/interalarm',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/interalarm'))
              cb(null, require('./routes/system/InteralarmContainer'))
            }, 'system-interalarm')
          },
        },
         {
          path: '*',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/error/'))
            }, 'error')
          },
        },
      ],
    },
  ]

  routes[0].childRoutes.map(item => {
    item.onEnter = handleChildRoute
    return item
  })

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
