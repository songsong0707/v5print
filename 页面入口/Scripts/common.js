//显示ajax登录层，并告知服务器登录
var loginbox;
function ShowLoginBox(func) {
    art.dialog.data("functionname", func);
    loginbox=art.dialog.open('/Account/AjaxLogin', {
        id: "ajaxlogopage", title: '登录提示', width: 700, height:350, lock: true, fixed: true, close: function () {
            var username = art.dialog.data("LoginName");
            if (username != undefined && username != "")
            {
                $('#hd-login').load('/Partial/Login');
                eval(func);
            }
        }
    });
}
//获取用户登录状态
function CheckLoginStatus() {
    var status = 0;
    $.ajax({
        url: "/Partial/GetLoginStatus",
        type: "POST",
        dataType: 'html',
        timeout: 50000,
        cache: false,
        async: false,      //是否ajax同步
        success: function (data) {
            if (data != "0") {
                status = 1;
            } else {
                status = 0;
            }
        },
        error: function () {
            alert("服务器出错");
        }
    });
    return status;
}

function RunOpenerFunction(func) {
    $('#hd-login').load('/Partial/Login');
    eval(func);
}

function BeginGetSession(oauth,func) {
    var width = 800;
    var height = 500;
    var left = (screen.width - width) / 2;
    var top = (screen.height - height) / 2;
    window.open('/social/' + oauth + '?type=back', 'newwindow', 'height=' + height + ',width=' + width + ',top=' + top + ',left=' + left + ',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no, status=no');
    var id = setInterval(function () {
        $.ajax({
            url: "/Partial/GetLoginStatus",
            type: "POST",
            dataType: 'html',
            timeout: 6000,
            cache: false,
            success: function (data) {
                if (data != "0") {
                    clearInterval(id);
                    parent.RunOpenerFunction(func);
                    art.dialog.close();
                }
            }
        });
    }, 100);
}

function SetCookie(name, value, Days)//两个参数，一个是cookie的名子，一个是值
{
    if (Days == null)
        Days = 99 * 365; //此 cookie 将被保存 99年
    var exp = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name)//取cookies函数        
{
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;
}

function delCookie(name)//删除cookie
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function checkin() {
    if (CheckLoginStatus() == 1) {
        $.ajax({
            url: "/UserCenter/AjaxCheckIn",
            type: "POST",
            dataType: 'html',
            timeout: 6000,
            cache: false,
            success: function (data) {
                if (data == "true") {
                    $("#checkInPlace").html("<span style='background: #85c143;line-height: 30px;display:block;width:40px; padding-left: 10px;padding-right: 10px;font-family: 微软雅黑;margin-right: 10px;color: #fff;font-size: 12px;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px;'>已签到</span>");
                    $.ajax({
                        url: "/UserCenter/AjaxGetPoints",
                        type: "POST",
                        dataType: 'html',
                        timeout: 6000,
                        cache: false,
                        success: function (data) {
                            if (data > 0) {
                                $("#MyPoints").html(data);
                            }
                        }
                    });
                }
                else {
                    $("#checkInPlace").html("<a href='javascript:;' style='background: #dd4250;line-height: 30px;display:block;width:50px; padding-left: 10px;padding-right: 10px;font-family: 微软雅黑;margin-right: 10px;color: #fff;font-size: 12px;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px;' id='checkInStatus' onclick='checkin()'>立即签到</a>");
                }
            }
        });
    } else {
        ShowLoginBox('checkin()');
    }
}
