$(function () {
    let form = layui.form
    // 设置规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 新密码规则
        samePwd :function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        // 确认新密码规则
        rePwd : function (value) {
            if (value !== $('[name=newPwd]').val()) {
              return '两次密码不同！'
          }  
        }
    })
    $('.layui-form').on('submit',function (e) {
        e.preventDefault()
        $.ajax({
            method:'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success:function(res){
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功')
                // 重置
                $('.layui-form')[0].reset()
            }
        })
    })
})