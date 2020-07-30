$(function () {
    // 点击‘去注册账号’的连接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击‘去登录’的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    // 从layui中获取form对象
    let form = layui.form
    let layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 属性的值可以是数组，也可以是函数
        // 自定义了一个pwd校验规则
        'pwd': [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两个密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
          let pwd =  $('.reg-box [name=password]').val()
            if (pwd !== value) {
              return '两次密码不一致!'
          }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method:'post',
            url: '/api/reguser',
            // data : $('#form_reg').serialize(),
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success:function(res){
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('注册成功!请登录');
                // 注册成功跳转到登录页面
                $('#link_login').click()
                // 清空表单
                $('#form_reg')[0].reset()
            }
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            method:'post',
            url: '/api/login',
            data: $(this).serialize(),
            success:function(res){
                if (res.status !== 0) return layer.msg('登录失败')
                layer.msg('登录成功')
                let token = res.token;
                // 讲登录成功得到的token 字符串，保存到本地
                localStorage.setItem('token',token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})