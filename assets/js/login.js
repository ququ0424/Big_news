$(function () {
    // 点击去注册账号链接
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })

    // 点击去登录链接
    $("#link_login").on("click", function () {
        $(".reg-box").hide();
        $(".login-box").show();
    })


    // 从layui中获取form对象
    var form = layui.form;
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        // 效验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return 一个提示消息即可
            var pwd = $('.reg-box [name=password]').val();

            if (pwd !== value) {
                return '两次密码不一致';
            }
        }

    })


    // 监听注册表单的提交事件
    var layer = layui.layer;
    $("#form_reg").on("submit", function (e) {
        e.preventDefault();
        // 发起ajax的POST请求
        $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function (res) {
            if (res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message)
            }
            // console.log('注册成功！');
            layer.msg("注册成功，请登录！");
            // 模拟人的点击行为
            $("#link_login").click();
        });

        // ajax方法
        //     $.ajax({
        //         type:"POST",
        //         url:'/api/reguser',
        //         data:{
        //             username:$('#form_reg [name=username]').val(),
        //             password: $('#form_reg [name=password]').val()
        //         },
        //         success:function(res) {
        //         if(res.status!==0) {
        //             return console.log(res.message);
        //         }
        //         console.log('注册成功！');
        //         }
        //     })
    })



    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("登录失败！");
                }
                layer.msg("登录成功!");
                // console.log(res.token);

                // 将登录成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token', res.token);

                // 跳转到后台主页
                location.href = '/myindex.html';
            }
        })
    })

})