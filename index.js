

var menuList = document.getElementsByClassName('menu-list')[0];
var studentAddBtn = document.getElementById('student-add-btn');
var studentlistMenu = menuList.getElementsByTagName('dd')[0];
var addForm = document.getElementById('studnet-add-form');
var tbody = document.getElementById('tbody');
var modal = document.getElementsByClassName('modal')[0];
var studentEditBtn = document.getElementById('student-edit-btn');
var mask = document.getElementsByClassName('mask')[0];
// 表格数据
var tableData = [];
// 左侧导航列表点击事件
menuList.onclick = function (e) {
  // 如果点击的是导航 切换样式以及右侧内容区的样式
  if (e.target.tagName == 'DD') {
    // 切换左侧导航激活导航的class类名
    var activeList = this.getElementsByClassName('active');
    initStyle(activeList, 'active', e.target);
    var id = e.target.getAttribute('data-id');
    var activeContentList = document.getElementsByClassName('content-active');
    // 'id' 'stundent-list  student-add'
    var content = document.getElementById(id);
    initStyle(activeContentList,'content-active', content )
  }
}

// 新增学生功能：
studentAddBtn.onclick = function (e) {
  e.preventDefault();
  var data = getFormData(addForm);
  if (typeof data === 'object') {
    transferData('/api/student/addStudent', data, function () {
      alert('添加成功')
      addForm.reset();
      studentlistMenu.click();
      getTableData();
    })
  } else {
    alert(data);
  }
}
// 编辑，删除功能
tbody.onclick = function (e) {
  // 点击的是否为编辑和删除的按钮
  if (e.target.tagName == 'BUTTON') {
    // 判断是否为编辑按钮   
    var classList = e.target.classList;
    var index = e.target.dataset.index;
    if (classList.contains('edit')) {
      // 编辑功能
      modal.style.display = 'block';
      var data = tableData[index];
      renderEditForm(data);
      
    } else {
      // 删除的功能
      var isDelete = window.confirm('确定删除？');
      if (isDelete) {
        transferData('/api/student/delBySno', {
          sNo: tableData[index].sNo
        }, function () {
          alert('删除是成功');
          getTableData();
        })
      }
    }
  }
}
// 编辑的提交按钮
studentEditBtn.onclick = function (e) {
  e.preventDefault();
  var editForm = document.getElementById('studnet-edit-form');
  var data = getFormData(editForm);
  if (typeof data == 'string') {
    alert(data);
  } else {
    transferData('/api/student/updateStudent', data, function () {
      alert('修改成功');
      modal.style.display = 'none';
      getTableData();
    })
  }

}

mask.onclick = function () {

  modal.style.display = 'none'
}
function renderEditForm(data) {
  var editForm = document.getElementById('studnet-edit-form');
  // data中的属性和页面中的form下面的input的name值一一对应
  for (var prop in data) {
    if (editForm[prop]) {
      editForm[prop].value = data[prop];
    }
  }
}

// 获取表单数据的函数 会返回所有的表单数据
function getFormData(form) {
  
  var name = form.name.value;
  var sex = form.sex.value;
  var email = form.email.value;
  var sNo = form.sNo.value;
  var birth = form.birth.value;
  var phone = form.phone.value;
  var address = form.address.value;
  var obj = {
    name: name,
    sex: sex,
    email,
    sNo,
    birth,
    phone,
    address,
  }
  if (!name || !sex || !email || !number || !birth || !phone || !address) {
    return "信息填写不全";
  }
 
  return obj;
}

// 切换class类名  
// domlist:  要循环的dom节点   toggleClass 切换的类名， dom：给哪个元素添加class类名
function initStyle(domlist, toggleClass, dom) {
  for (var j = 0; j < domlist.length; j++) {
    domlist[j].classList.remove(toggleClass);
  }
  dom.classList.add(toggleClass);
}
// 获取学生列表数据
function getTableData() {
  transferData('/api/student/findByPage', {
    page: 1,
    size: 10
  }, function (data) {
    tableData = data.findByPage;
    renderTable(tableData);
  })
}
// 渲染表格数据
function renderTable(data) {
  var str = '';
  data.forEach(function (item, index) {
    str += `<tr>
    <td>${item.sNo}</td>
    <td>${item.name}</td>
    <td>${item.sex == 0 ? '男' : '女'}</td>
    <td>${item.email}</td>
    <td>${new Date().getFullYear() - item.birth}</td>
    <td>${item.phone}</td>
    <td>${item.address}</td>
    <td>
        <button class="btn edit" data-index="${index}">编辑</button>
        <button class="btn delete" data-index="${index}">删除</button>
    </td>
</tr>`
  });
  
  tbody.innerHTML = str;
}
function transferData(url, data, cb) {
  var response = saveData('https://open.duyiedu.com' + url, Object.assign({
    appkey: 'dusuixin_1575641173830',
  }, data));
  if (response.status == 'success') {
    cb(response.data);
  } else {
    alert(response.msg)
  }
}



getTableData();
// 数据交互  url: 接口地址  param： 请求参数
function saveData(url, param) {
  var result = null;
  var xhr = null;
  if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
  } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  if (typeof param == 'string') {
      xhr.open('GET', url + '?' + param, false);
  } else if (typeof param == 'object'){
      var str = "";
      for (var prop in param) {
          str += prop + '=' + param[prop] + '&';
      }
      xhr.open('GET', url + '?' + str, false);
  } else {
      xhr.open('GET', url + '?' + param.toString(), false);
  }
  xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
          if (xhr.status == 200) {
              result = JSON.parse(xhr.responseText);
          }
      }
  }
  xhr.send();
  return result;
}





