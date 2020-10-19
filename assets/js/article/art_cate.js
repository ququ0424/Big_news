$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initArticleList();



    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlstr = template('tpl-table', res);
                $('tbody').html(htmlstr);
            }
        })
    }



    // 给添加类别按钮注册点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })


    // 通过代理事件，为表单绑定事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
                initArticleList();
                layer.msg('新增分类成功！');
                layer.close(indexAdd);
            }
        })
    })




    // 通过代理事件，为编辑按钮绑定事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function (e) {
        e.preventDefault();
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })





    // 通过代理事件，为表单编辑的表单绑定提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改分类数据失败！')
                }
                layer.msg('修改分类数据成功！');
                layer.close(indexEdit);
                initArticleList();
            }
        })
    })






    //通过代理事件，为删除按钮绑定事件
    $('tbody').on('click', '.btn-del', function (e) {
        e.preventDefault()
        var id = $(this).attr('data-id');
        //提示用户是否要删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类数据失败！')
                    }
                    layer.msg('删除分类数据成功！')
                    layer.close(index);
                    initArticleList()
                }
            })


        });


    })
})