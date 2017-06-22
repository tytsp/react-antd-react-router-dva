import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import styles from './index.less'
import { color } from '../../utils'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
  submit:{
    position: 'absolute',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    margin: '-24px 0 0 -24px',
    opacity: 0,
  }
}

function Dashboard ({ ...single }) {
  const {...state} = single.app
  return (
    <div>
   
   {state.structure.map(item=>{
    	const FactoryId = item.pkid;
    return (
      <div key={item.pkid} className={styles.indexmain}>
        <div className={styles.indextitle}>
          <img alt="" src="../../src/images/index-title-icon.png" />
          <span>{item.factoryName}</span>
        </div>
        <Row gutter={24}>
          {item.workshopList.map(item=>{
            	const WorkshopId = item.pkid;
            	const lineList = item.lineList;

            return (

              item.flagStatus == 1 ? <form key={item.pkid} target="_blank"  action={item.url} method="post">
              <input type="hidden" name="factoryId" value={FactoryId} />
              <input type="hidden" name="workshopId" value={WorkshopId} />
              <input type="hidden" name="lineList" value={JSON.stringify(lineList)} />
              <input type="hidden" name="Token" value={state.Token} />

              <Col  span="6">
              
                <Card style={{'position':'relative'}} bordered={false} className={item.flagStatus == 1 ? styles.cardgreen :styles.cardgray }>
                  <input  style= {bodyStyle.submit} type="submit" value=""/>
                  <div className={styles.cardtitle}>{item.workshopName}</div>
                  <div className={styles.cardindent}>
                    <img alt="" src="/src/images/index-card-img.png" />
                    <span>{item.flagStatus == 1 ?'立即查看' : '无法查看'}</span>
                  </div>
                </Card>
               
              </Col>
              </form>:
              <Col key={item.pkid} span="6">
              	<a href="#">
                <Card bordered={false} className={item.flagStatus == 1 ? styles.cardgreen :styles.cardgray }>
                  <div className={styles.cardtitle}>{item.workshopName}</div>
                  <div className={styles.cardindent}>
                    <img alt="" src="/src/images/index-card-img.png" />
                    <span><input  type="submit"  style={{'cursor':'pointer','border':0,'backgroundColor':item.flagStatus == 1 ?'#62CCA4':'none'}} value={item.flagStatus == 1 ?'立即查看' : '无法查看'} /></span>
                  </div>
                </Card>
               	</a>
              </Col>
              )
          })}
          
        </Row>
      </div>
      )
   })}
    

</div>
  )
}



export default connect(({ app }) => ({ app }))(Dashboard)
