// 注意：每次调用$.get() $.ajax() 或者 $.ajax() 的时候
// 会先调用ajaxPrefilter这个函数
// 这个函数中。可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url);
    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete回调函数
    options.complete = function (res) {
         console.log(res);
         if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
             // 强制清空token
             localStorage.removeItem('token')
             // 强制跳转
             location.href = '/login.html'
         }
    }
})