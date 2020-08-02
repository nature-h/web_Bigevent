$(function () {
    let layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    // 为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        // console.log(e);
        // 获取用户所上传的图片
        let fileList = e.target.files
        console.log(fileList);
        if (fileList.length === 0) {
            return layer.msg('请上传图片！')
        }
        // 拿到用户选择的图片
        let file = e.target.files[0]
        // 将文件转换成路径
        let newImgURL = URL.createObjectURL(file)
        $image.cropper('destroy') // 销毁旧的裁剪区域   
            .attr('src', newImgURL) // 重新设置图片路径   
            .cropper(options) // 重新初始化裁剪区域
    })
    // 为确定按钮绑定点击事件 头像上传
    $('#btnUpload').on('click', function () {
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串  
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('更新头像成功')
                window.parent.getUser()
            }
        })
    })
})