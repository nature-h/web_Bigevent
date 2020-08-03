$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = getZero(dt.getMonth() + 1)
        let d = getZero(dt.getDate())
        let hh = getZero(dt.getHours())
        let mm = getZero(dt.getMinutes())
        let ss = getZero(dt.getSeconds())
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    // 定义补0 的函数
    function getZero(n) {
     return   n > 9 ? n:'0'+n
    }
    // 定义一个查询对象，将来请求数据的时候需要将请求参数提交到服务器
    let q = {
        pagenum: 1,//页面值 默认请求第一页的数据
        pagesize: 2,//每页显示多少条数据
        cate_id: '',//文章分类的id
        state:'', //文章的状态，可选值有：已发布、草稿
    }
    initTable()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method:'get',
            url: '/my/article/list',
            data:  q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                let html = template('table', res)
                $('tbody').html(html)
                // 渲染分页
                renderPage(res.total)
            }
        })
    }
    initCate()
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method:'get',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败!')
                }
                // 调用模板引擎
                let html = template('tip-cate', res)
                console.log(html);
                $('#cate').html(html)
                form.render()
            }
        })
    }
    // 为筛选表单绑定submit
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中年选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        // 重新渲染表格数据
        initTable()
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 渲染分页结构
        laypage.render({
            elem: 'pageBox', // 容器的id
            count: total, //总条数
            limit: q.pagesize,// 每页显示的条数
            curr: q.pagenum,//设置被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits:[2,3,5,10],
            // 分页切换的时候触发的回调
            jump: function (obj, first) {
                // 点击页码值触发first==underfind
                console.log(first);
                console.log(obj.curr);
                // 把最新的页面值赋值到q这个查询对象上
                q.pagenum = obj.curr
                // 把最新的条目数赋值到q这个查询参数对象pagesize属性上
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        let len = $('.btn-delete').length
        console.log(len);
        let id = $(this).data('id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method:'get',
                url:'/my/article/delete/' + id,
                success:function(res){
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    // 判断当前页是否有数据
                    if (len === 1) {
                        // 如果len的值等于1，证明删除完毕后页面上就没有数据了
                       q.pagenum = q.pagenum === 1 ? 1:q.pagenum-1
                    }
                    initTable()
                    layer.close(index);
                }
            })

        });
    })
    // 跳转页面
    $('tbody').on('click', '.btn-edit', function () {
        let id = $(this).data('id')
        location.href = '/article/art_edit.html?Id=' + id
    })
})