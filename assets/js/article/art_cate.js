$(function () {
    let layer = layui.layer
    let form = layui.form
    initArticle()
    // 获取文章分类列表
    function initArticle() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                let html = template('template', res)
                $('tbody').html(html)
            }
        })
    }
    // 添加类别
    let indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html(),
        })
    })
    // 新增 事件委托
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // console.log('ok');
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArticle()
                layer.msg('新增分类成功!')
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })
    // 修改页面显示
    let indexEdit = null
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html(),
        })
        let id = $(this).attr('data-id')
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    // 修改
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initArticle()
            }
        })
    })

    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败!')
                    }
                    layer.msg('删除成功')
                    layer.close(index);
                    initArticle()
                }
            })
        });
    })
})