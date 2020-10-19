$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;


    // 定义一个美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }


    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }





    // 定义一个查询的的参数对象
    // 将来请求数据的时候 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,//页码值，默认请求第一页的数据
        pagesize: 2,//每页显示多少条数据，默认每页显示两条
        cate_id: '', //文章分类的Id
        state: ''  //文章的发布状态
    }

    initTable();
    initCate();

    // 渲染列表数据页面
    function initTable() {
        $.ajax({
            method: 'GET',
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                // 使用模板引擎渲染列表结构
                var htmlstr = template('tpl-table', res);
                $('tbody').html(htmlstr);
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }




    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染模板的可选项
                var htmlstr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlstr);
                form.render();
            }
        })
    }


    // 为筛选表单绑定submit事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        // 获取表单选项中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据筛选条件 重新渲染表格的数据
        initTable();
    })



    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()方法渲染分页的结构
        laypage.render({
            elem: 'pageBox',  //分页容器的id
            count: total,  //总数据条数
            limit: q.pagesize,  //每页显示几条数据
            curr: q.pagenum,  //默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发jump回调
            // 触发jump回调的方式有两种：
            // 1.点击页码的时候，会触发
            // 2.只要调用了laypage.render()方法，就会触发
            jump: function (obj, first) {
                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到q这个参数对象中
                q.pagesize = obj.limit;


                // 可以通过first的值，来判断是通过哪种方式触发的jump回调
                // 如果first的值是true，证明是方式2触发的
                // 否则就是方式1触发的
                if (!first) {
                    initTable();
                }
            }
        })
    }




    // 通过代理的方式，给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-del', function () {
        var len = $('.btn-del').length;

        // 获取到文章的id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值-1之后，再重新调用initTable()方法
                    if (len === 1) {
                        // 如果页码值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })


    // 通过代理的方式，给编辑按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id');
        location.href = '/article/art_edit.html?id=' + id;
    })




})