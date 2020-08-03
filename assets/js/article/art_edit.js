$(function () {
    let form = layui.form
    let layer = layui.layer
    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 点击选择封面的按钮出现选择文件
    $('#btnImage').on('click', function () {
        $('#coverFile').click()
    })
    // 上传图片
    $('#coverFile').on('change', function (e) {
        let files = e.target.files
        if (files.length === 0) {
            return
        }
        let newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    let id = location.search.split('=')[1];
    // 渲染页面原始数据
    $.ajax({
        method: 'get',
        url: '/my/article/' + id,
        success: function (res) {
            console.log(res);
            // 5.根据文章信息渲染页面;
            // 5.1 文章标题
            $('[name=title]').val(res.data.title)
            // 5.2 文章分类
            initCate(res.data.cate_id)
            // 5.3 文章内容
            setTimeout(function () {
                tinyMCE.activeEditor.setContent(res.data.content)
            }, 1000)
            // 5.4 文章封面
            $('#image').attr('src', baseUrl + res.data.cover_img)
            // 5.5 Id
            $('[name=Id]').val(res.data.Id)
        }
    })

    // 渲染分类的方法
    function initCate(cate_id) {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                res.cate_id = cate_id
                let html = template('tpl-cate', res)
                $('[name=cate_id]').html(html)
                form.render()
            }
        })
    }
    // 修改或者存为草稿
    let state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })
    // 添加文章
    $('#form-edit').on('submit', function (e) {
        e.preventDefault()
        let fd = new FormData(this)
        fd.append('state', state)
        // 生成二进制图片文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            // 将 Canvas 画布上的内容，转化为文件对象
            .toBlob(function (blob) {
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob);
                console.log(...fd);
                // ajax一定要放到回调函数里面
                // 因为生成文件是耗时操作，异步，所以必须保证发送ajax的时候图片已经生成，所以必须写到回调函数中
                editArticle(fd);
            })
    })
    function editArticle(fd) {
        $.ajax({
            method:'post',
            url: '/my/article/edit',
            processData: false,
            contentType:false,
            data:fd,
            success:function(res){
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                location.href = '/article/art_list.html'
                window.parent.document.querySelector('#article').className = '';
                window.parent.document.querySelector('#list').className = 'layui-this';
            }
        })
    }
})