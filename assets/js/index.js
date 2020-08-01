$(function () {
    getUser()
    // 点击退出登录
    let layer = layui.layer
    $('#btnLogout').on('click', function () {
        // 提示用户是否退出
        layer.confirm('确定退出登录?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something    
            // 关闭confirm页面
            layer.close(index);
            // 清空本地存储中的token
            localStorage.removeItem('token')
            // 重新跳转到登录页面
            location.href = '/login.html'
        });
    })
    // 获取用户基本信息
    function getUser() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            // 请求头配置
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！')
                }
                renderAvatar(res.data)
            },
            // 不论成功还是失败都会调用
            // complete: function (res) {
               
            // }
        })
    }
    // 渲染用户头像
    function renderAvatar(user) {
        // 获取文本昵称
        let uname = user.nickname || user.username
        // 渲染昵称
        $('#welcome').html('欢迎&nbsp;&nbsp;' + uname)
        // 渲染用户头像
        if (user.user_pic !== null) {
            // 渲染图片头像
            $('.layui-nav-img').attr('src', user.user_pic).show()
            $('.text-avatar').hide()
        } else {
            // 渲染文本头像
            $('.layui-nav-img').hide()
            let first = uname[0].toUpperCase()
            $('.text-avatar').html(first).show()
        }
    }
})