import React from 'react';
import { Modal, Button , Row , Col , Input , Radio , Checkbox ,Form ,Tree} from 'antd';
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

const CheckboxGroup = Checkbox.Group;
const formItemLayout = {
   style:{
    margin:0
   },
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
const options = [
  { label: '用户管理', value: '用户管理'},
  { label: '角色定义', value: '角色定义' },
  { label: '工厂及设备查看', value: '工厂及设备查看' },
  { label: '单体设备参数查看', value: '单体设备参数查看' },
  { label: '群体图参数定义', value: '群体图参数定义' },
  { label: '预设报警设置', value: '预设报警设置' },
  { label: '内部报警设置', value: '内部报警设置' },
  { label: '报表查询', value: '报表查询' },
];

const Rolepermission  = ({
  ...single,
  state,
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  }
}) => {
   function handleOk () {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onOk(data)
    })
  }
  const modalOpts = {
    ...single,
    onOk: handleOk,
   
  }
  const TreeProps = {
      defaultExpandAll:true,
      showLine:true,
      
      onSelect(){
        console.log(arguments)
      }
  }
  const onChange = (e,c,d) => {
    var flagStatus = e.target.checked == true ? 1 : 0;
    var path = e.target.__id.split(',');
    var arr = state.sourceTree;

    for (var i = 0; i < arr.length; i++) {
      if(arr[i].pkid == path[0]){

        var start = arr[i].workshopList;

        for (var j = 0; j < start.length; j++) {
          if(start[j].pkid == path[1]){
            var end = start[j].lineList;
            console.log(end)
            for (var k = 0; k < end.length; k++) {
              if(end[k].lineId == path[2]){
               
                end[k].flagStatus = flagStatus
              }
            }
          }
        }
      }
    }

   single.dispatch({type:'userSetting/querySuccess',payload:{
    sourceTree:arr
   }})
  }
  const TreeView = () => {
    return <Tree {...TreeProps}>
              {state.sourceTree.map(item=>{
                return <TreeNode title={item.factoryName} key={item.pkid}>
                        {item.workshopList.map(item1=>{
                          return <TreeNode Checkbox={item1.lineList} title={item1.workshopName} key={item1.pkid +item.pkid }> 
                              {item1.lineList.map(item2=>
                                      <Checkbox onChange={onChange}  key={item2.lineId} __id={`${item.pkid},${item1.pkid},${item2.lineId}` } defaultChecked={item2.flagStatus == 1 ? true : false}  >{item2.lineName}</Checkbox>

                              )}
                          </TreeNode>
                        })}
                </TreeNode>
              })}
              
            </Tree>
  }
  console.log(state)
    return (
     
        <Modal {...modalOpts }
        >
        
        <Form>
         <TreeView />
           
          
          
        </Form>
  


        </Modal>

    );
  
}
export default Form.create({})(Rolepermission)