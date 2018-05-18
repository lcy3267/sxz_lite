module.exports = {
  // 基础类型输入框配置
  base: {
    name: {
      focus: true,
      title: '公司全称',
      placeholder: '请输入公司全称'
    },
    shortname: {
      focus: true,
      title: '公司简称',
      placeholder: '请输入公司简称'
    },
    provice: {
      focus: true,
      title: '所属省份',
      placeholder: '请输入公司所属省份'
    }, 
    
    city: {
      focus: true,
      title: '所属城市',
      placeholder: '请输入公司所属城市'
    },
    tel: {
      error: true,
      title: '公司电话',
      inputType: 'number',
      placeholder: '请输入公司电话'
    },
    brief: {
      title: '简介',
      type: 'textarea',
      placeholder: '请输入公司简介'
    },
    address: {
      title: '详细地址',
      type: 'textarea',
      placeholder: '请输入公司详细地址'
    },
    webpage: {
      title: '公司官网',
      placeholder: '请输入公司官网'
    }
    }
  
};
