var nowPage = 1;
var pageSize = 5;
var tableData = [];
var allPage = 1;
var searchWord = '';
// 绑定事件
function bindEvent() {
    // 切换导航的功能
    $(".menu-list").on("click", "dd", function(e) {
        $(".menu-list > .active").removeClass("active");
        $(this).addClass("active");
        var id = $(this).data("id");
        $(".content > div").fadeOut(function() {
            $("#" + id).fadeIn();
        });
    });
    $("#student-add-btn").click(function(e) {
        e.preventDefault();
        var data = format($("#student-add-form").serializeArray());
        if (data.status == "error") {
            alert(data.msg);
            return false;
        }
        transferData('/api/student/addStudent', data, function (res) {
            alert("添加成功");
            getTableData();
            $('#student-add-form')[0].reset();
            $(".menu-list > dd[data-id=student-list]").click();
        })
    });

    $('#tbody').on('click', '.btn', function (e) {
        // var index = $(this).data('index');
        var index = $(this).parents('tr').index();
        // 编辑
        if ($(this).hasClass('edit')) {
            $('.modal').slideDown();
            renderEditForm(tableData[index])
        // 删除
        } else {
            var isDel = confirm('确认删除？');
            if (isDel) {
                transferData('/api/student/delBySno', {
                                sNo: tableData[index].sNo
                            }, function (res) {
                                alert('删除成功');
                                getTableData();
                            })
            }
        }
    });
    $('#student-edit-btn').click(function (e) {
        e.preventDefault();
        var data = format($("#studnet-edit-form").serializeArray());
        if (data.status == "error") {
            alert(data.msg);
            return false;
        }
        transferData('/api/student/updateStudent', data, function (res) {
            alert("修改成功");
            $('.modal').slideUp();
            getTableData();
        })
    });
    $('.mask').click(function ( ) {
        $('.modal').slideUp()
    });
    $('#search-btn').click(function () {
        var val = $('#search-inp').val();
        searchWord = val;
        nowPage = 1;
        if (val) {
            searchData(val);
        } else {
            getTableData();
        }
        
    })
}
function searchData(val) {
    var sex = -1;
    if (val == '男') {
        sex = 0;
        val = '';
    } else if (val == '女') {
        sex = 1;
        val = '';
    }
    transferData('/api/student/searchStudent', {
        sex: sex,
        search: val,
        page: nowPage,
        size: pageSize
    }, function (res) {
        allPage = Math.ceil(res.data.cont / pageSize);
        tableData = res.data.searchList;
        renderTable(tableData)
    })
}


// 获取学生列表数据
function getTableData() {
    transferData('/api/student/findByPage', {
        page: nowPage,
        size: pageSize
    }, function (res) {
        allPage = Math.ceil(res.data.cont / pageSize);
        tableData = res.data.findByPage;
        renderTable(res.data.findByPage);
    })

}

function renderTable(data) {
    var str = '';
    for (var i = 0; i < data.length; i++) {
        var student = data[i];
        str += ` <tr>
            <td>${student.sNo}</td>
            <td>${student.name}</td>
            <td>${student.sex == 0 ? '男' : '女'}</td>
            <td>${student.email}</td>
            <td>${new Date().getFullYear() - student.birth}</td>
            <td>${student.phone}</td>
            <td>${student.address}</td>
            <td>
                <button class="btn edit" data-index="${i}">编辑</button>
                <button class="btn delete" data-index="${i}">删除</button>
            </td>
        </tr>`;
    }
    $('#tbody').html(str);
    $('#page').turnpage({
        nowPage: nowPage,
        allPage: allPage,
        // page 代表的是切换的当前页页码
        changePage: function (page) {
            nowPage = page;
            if (searchWord) {
                searchData(searchWord)
            } else {
                getTableData();
            }
          
        }
    })
}
// 编辑表单的数据回填
function renderEditForm(data) {
  var editForm = $('#studnet-edit-form')[0];
  // data中的属性和页面中的form下面的input的name值一一对应
  for (var prop in data) {
    if (editForm[prop]) {
      editForm[prop].value = data[prop];
    }
  }
}
// 对表单数据进行校验   {name: , sex；,}
function format(data) {
    var resultData = {};
    for (var i = 0; i < data.length; i++) {
        resultData[data[i].name] = data[i].value;
        if (!data[i].value) {
            return {
                status: "error",
                msg: "数据填写不完全， 请检查后提交"
            };
        }
    }
    return resultData;
}
// 数据交互
function transferData(url, data, cb) {
    $.ajax({
        type: "get",
        url: "https://open.duyiedu.com" + url,
        data: $.extend(
            {
                appkey: "DuYimeiqi_1564986205860"
            },
            data
        ),
        // 希望获取到的数据是json对象
        dataType: "json",
        success: function(res) {
            if (res.status == "success") {
               cb(res);
            } else {
                alert(res.msg);
            }
        }
    });
}
bindEvent();
getTableData();