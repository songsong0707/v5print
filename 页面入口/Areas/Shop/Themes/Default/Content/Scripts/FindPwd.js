var emailStatus = false;
var validateCodeStatus = false;

var phoneStatus = false;
var validateCodeStatus1 = false;
var phoneCodeStatus = false;
var smsSeconds = 180;
var intervaSMS;
var smsCodeStatus = false;
var pwdStatus = false;
var vpwdStatus = false;

$(function () {
    $("#btnVerify").click(function () {
        Math.random() * 24
        $("#tImg").attr("src", "/ValidateCode.aspx?Guid=" + Math.random() * 100);
    });
    $("#btnVerify1").click(function () {
        Math.random() * 24
        $("#tImg1").attr("src", "/ValidateCode.aspx?Guid=" + Math.random() * 100);
    });

    $("#email").blur(function () {
        checkfindpwdEmail();
    });

    $("#phone").blur(function () {
        checkfindpwdPhone();
    });

    $("#checkCode").blur(function () {
        checkfValidateCode();
    });

    $("#checkCode1").blur(function () {
        checkfValidateCode1();
    });

    $("#smsCode").blur(function () {
        checkSmsCode();
    });

    $("#password1").blur(function () {
        CheckPwd();
    });

    $("#password2").blur(function () {
        CheckVPwd();
    });

    $("#j-sendSms").click(function () {
        if (!phoneStatus) {
            $("#tipsPhone").removeClass("Validform_correct").addClass("Validform_wrong").html("请填写有效的手机号码");
            return;
        }
        if (!validateCodeStatus1) {
            $("#tipsCheckCode1").addClass("Validform_wrong").html("请输入验证码");
            return;
        }
        if (phoneStatus && validateCodeStatus1) {
            $.ajax({
                url: "/Account/SendSMS",
                type: 'post',
                dataType: 'text',
                timeout: 10000,
                async: false,
                data: {
                    Action: "post", Phone: $("#phone").val()
                },
                success: function (resultData) {
                    if (resultData.split("|")[0] == "True") {
                        smsSeconds = 180;
                        $("#hfPhoneNumber").val(resultData.split("|")[1]);
                        $("#j-sendSms").attr("value", "(" + smsSeconds + ")重新获取");
                        intervaSMS = setInterval("CountDown()", 1000);
                    }
                    else {
                        $("#divcheckCodeTip").removeClass("msg msg-ok msg-naked").removeClass("msg msg-info").addClass("msg msg-err").html("<i class=\"msg-ico\"></i><p>" + resultData.split("|")[1] + "！</p>");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    ShowServerBusyTip("服务器没有返回数据，可能服务器忙，请稍候再试！");
                }

            });
        }
    });

    $("#j-forgetEmailBtn").click(function () {
        var email = $("#email").val();
        var checkCode = $("#checkCode").val();
        $.ajax({
            url: "/Account/AjaxFindPwd",
            type: "post",
            dataType: "text",
            timeout: 10000,
            async: false,
            data: { Action: "email", Email: email, CheckCode: checkCode },
            success: function (resultData) {
                if (resultData == "true") {
                    $("#j-forgetEmailSend").addClass("dn");
                    $("#j-forgetEmailSended").removeClass("dn");
                    var url = "http://mail." + email.split('@')[1];
                    $("#j-emailUrl").attr("href", url);
                    $("#j-isSentEmail").html(email);
                } else {
                    ShowSuccessTip("验证失败");
                }
            },
            errot: function (XMLHttpRequest, textStatus, errorThrown) {
                ShowServerBusyTip("服务器没有返回数据，可能服务器忙，请稍候再试！");
                mailStatus = false;
            }
        })
    });

    $("#j-forgetPhoneBtn").click(function () {
        var phone = $("#phone").val();
        var checkCode = $("#checkCode1").val();
        var phoneCode = $("#smsCode").val();
        $.ajax({
            url: "/Account/AjaxFindPwd",
            type: "post",
            dataType: "text",
            timeout: 10000,
            async: false,
            data: { Action: "phone", Phone: phone, CheckCode: checkCode, PhoneCode:phoneCode },
            success: function (resultData) {
                if (resultData == "true") {
                    $("#j-forgetPhoneForm").addClass("dn");
                    $("#j-resetPassForm").removeClass("dn");
                } else {
                    ShowSuccessTip("验证失败");
                }
            },
            errot: function (XMLHttpRequest, textStatus, errorThrown) {
                ShowServerBusyTip("服务器没有返回数据，可能服务器忙，请稍候再试！");
                mailStatus = false;
            }
        })
    });

    $("#j-resetPassBtn").click(function () {
        var phone = $("#phone").val();
        var checkCode = $("#checkCode1").val();
        var phoneCode = $("#smsCode").val();
        var password1 = $("#password1").val();
        var password2 = $("#password2").val();
        if (phoneStatus && validateCodeStatus1 && smsCodeStatus && pwdStatus && vpwdStatus) {
            $.ajax({
                url: "/Account/ChangePwd",
                type: "post",
                dataType: "json",
                timeout: 10000,
                async: false,
                data: { Action: "phone", Phone: phone, CheckCode: checkCode, PhoneCode: phoneCode, Password1: password1, Password2: password2 },
                success: function (resultData) {
                    console.log(resultData);
                    if (resultData == true) {
                        ShowSuccessTip("密码修改成功，请重新登录！");
                        location.href = "/Account/Login";
                    } else {
                        ShowFailTip("密码修改失败");
                    }
                },
                errot: function (XMLHttpRequest, textStatus, errorThrown) {
                    ShowServerBusyTip("服务器没有返回数据，可能服务器忙，请稍候再试！");
                }
            })
        }
    });
});

//验证邮箱
function checkfindpwdEmail() {
    $("#j-forgetEmailBtn").attr("disabled", "disabled");
    var regs = /^[\w-]+(\.[\w-]+)*\@[A-Za-z0-9]+((\.|-|_)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    var emailval = $("#email").val();
    if (emailval != "") {
        if (!regs.test(emailval)) {
            $("#email").removeClass("Validform_correct").addClass("Validform_error");
            $("#tipsEmail").removeClass("Validform_correct").addClass("Validform_wrong").html("请填写有效的邮箱");
            return false;
        } else {
            $.ajax({
                url: $V5print.BasePath + "Account/HasEmail",
                type: 'post',
                dataType: 'text',
                timeout: 10000,
                data: { Action: "post", Email: emailval },
                success: function (resultData) {
                    if (resultData == "false") {
                        $("#email").removeClass("Validform_correct").addClass("Validform_error");
                        $("#tipsEmail").removeClass("Validform_correct").addClass("Validform_wrong").html("该Email帐号不存在");
                        return false;
                    }
                    if (resultData == "true") {
                        $("#email").addClass("Validform_correct").removeClass("Validform_error");
                        $("#tipsEmail").addClass("Validform_correct").removeClass("Validform_wrong").html("");
                        $("#j-forgetEmailBtn").removeAttr("disabled");
                        return true;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(textStatus);
                    return false;
                }
            });
        }
    } else {
        $("#email").removeClass("Validform_correct").addClass("Validform_error");
        $("#tipsEmail").removeClass("Validform_correct").addClass("Validform_wrong").html("请填写有效的手机号码");
        return false;
    }
}
//验证手机
function checkfindpwdPhone() {
    $("#j-forgetPhoneBtn").attr("disabled", "disabled");
    var val = $("#phone").val();
    if (val != "") {
        $.ajax({
            url: $V5print.BasePath + "Account/HasPhone",
            type: 'post',
            dataType: 'text',
            timeout: 10000,
            data: { Action: "post", Phone: val },
            success: function (resultData) {
                if (resultData == "false") {
                    $("#phone").removeClass("Validform_correct").addClass("Validform_error");
                    $("#tipsPhone").removeClass("Validform_correct").addClass("Validform_wrong").html("该手机号不存在");
                    phoneStatus = false;
                    return false;
                }
                if (resultData == "true") {
                    $("#phone").addClass("Validform_correct").removeClass("Validform_error");
                    $("#tipsPhone").addClass("Validform_correct").removeClass("Validform_wrong").html("");
                    $("#j-forgetPhoneBtn").removeAttr("disabled");
                    phoneStatus = true;
                    return true;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
                phoneStatus = false;
                return false;
            }
        });

    } else {
        $("#phone").removeClass("Validform_correct").addClass("Validform_error");
        $("#tipsPhone").removeClass("Validform_correct").addClass("Validform_wrong").html("请填写有效的手机号码");
        phoneStatus = false;
        return false;
    }
}

function checkfValidateCode() {
    var code = $("#checkCode").val();
    if (code == "" || code.length < 4) {
        validateCodeStatus = false;
        $("#tipsCheckCode").addClass("Validform_wrong").html("请输入验证码");
        $("#checkCode").removeClass("Validform_correct").addClass("Validform_error");
        return;
    }
    //验证注册邮箱是否存在
    $.ajax({
        url: $V5print.BasePath + "Account/VerifiyValidateCode",
        type: 'post',
        dataType: 'text',
        timeout: 10000,
        async: false,
        data: {
            Action: "post", CheckCode: code
        },
        success: function (resultData) {
            if (resultData == "False") {
                $("#tipsCheckCode").addClass("Validform_wrong").html("请输入正确的验证码");
                $("#checkCode").removeClass("Validform_correct").addClass("Validform_error");
                validateCodeStatus = false;
            } else {
                $("#tipsCheckCode").removeClass("Validform_wrong").html("");
                $("#checkCode").addClass("Validform_correct").removeClass("Validform_error");
                validateCodeStatus = true;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            ShowServerBusyTip("服务器没有返回数据，可能服务器忙，请稍候再试！");
            validateCodeStatus = false;
        }
    });
}

function checkfValidateCode1() {
    var code = $("#checkCode1").val();
    if (code == "" || code.length < 4) {
        validateCodeStatus1 = false;
        $("#tipsCheckCode1").addClass("Validform_wrong").html("请输入验证码");
        $("#checkCode1").removeClass("Validform_correct").addClass("Validform_error");
        return;
    }
    $.ajax({
        url: $V5print.BasePath + "Account/VerifiyValidateCode",
        type: 'post',
        dataType: 'text',
        timeout: 10000,
        async: false,
        data: {
            Action: "post", CheckCode: code
        },
        success: function (resultData) {
            if (resultData == "False") {
                $("#tipsCheckCode1").addClass("Validform_wrong").html("请输入正确的验证码");
                $("#checkCode1").removeClass("Validform_correct").addClass("Validform_error");
                validateCodeStatus1 = false;
            } else {
                $("#tipsCheckCode1").removeClass("Validform_wrong").html("");
                $("#checkCode1").addClass("Validform_correct").removeClass("Validform_error");
                validateCodeStatus1 = true;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            ShowServerBusyTip("服务器没有返回数据，可能服务器忙，请稍候再试！");
            validateCodeStatus1 = false;
        }
    });
}

function checkSmsCode() {
    var code = $("#smsCode").val();
    if (code == "") {
        $("#tipsSmsCode").addClass("Validform_wrong").html("请输入验证码");
        $("#smsCode").removeClass("Validform_correct").addClass("Validform_error");
        smsCodeStatus = false;
        return;
    }
    var phone = $("#phone").val();
    if (phone != $("#hfPhoneNumber").val()) {
        $("#tipsSmsCode").addClass("Validform_wrong").html("请输入一致的手机号码");
        $("#smsCode").removeClass("Validform_correct").addClass("Validform_error");
        smsCodeStatus = false;
        return;
    }
    //验证注册邮箱是否存在
    $.ajax({
        url: $V5print.BasePath + "Account/VerifiyCode",
        type: 'post',
        dataType: 'text',
        timeout: 10000,
        async: false,
        data: {
            Action: "post", SMSCode: code, Phone: phone
        },
        success: function (resultData) {
            if (resultData == "False") {
                $("#tipsSmsCode").addClass("Validform_wrong").html("手机效验码不正确");
                $("#smsCode").removeClass("Validform_correct").addClass("Validform_error");
                smsCodeStatus = false;
            } else {
                $("#tipsSmsCode").removeClass("Validform_wrong").html("");
                $("#smsCode").addClass("Validform_correct").removeClass("Validform_error");
                smsCodeStatus = true;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            ShowServerBusyTip("服务器没有返回数据，可能服务器忙，请稍候再试！");
            smsCodeStatus = false;
        }
    });
}

function CountDown() {
    if (smsSeconds < 0) {
        $("#j-sendSms").removeAttr("disabled");
        clearInterval(intervaSMS);
    }
    else {
        $("#j-sendSms").attr("value", "(" + smsSeconds + ")重新获取");
        $("#j-sendSms").attr("disabled", "disabled");
        smsSeconds--;
    }
}

//验证密码
function CheckPwd() {
    var regs = /^[A-Za-z0-9]{6,30}$/;
    var obj = $("#password1");
    var pwdval = obj.val();
    if (pwdval.length == 0) {
        $("#divPwdTip").addClass("Validform_wrong").html("请填写密码");
        obj.removeClass("Validform_correct").addClass("Validform_error");
        pwdStatus = false;
        return;
    }
    if (!regs.test(pwdval)) {
        $("#divPwdTip").addClass("Validform_wrong").html(errormsg);
        obj.removeClass("Validform_correct").addClass("Validform_error");
        pwdStatus = false;
    } else {
        $("#divPwdTip").removeClass("Validform_wrong").html("");
        obj.addClass("Validform_correct").removeClass("Validform_error");
        pwdStatus = true;
    }
    if ($("#password2").val().length > 0) {
        CheckVPwd();
    }
}

//验证确认密码
function CheckVPwd() {
    var obj = $("#password2");
    if (obj.val() != "") {
        if (obj.val() != $("#password1").val()) {
            $("#divVPwdTip").addClass("Validform_wrong").html("两次填写的不一致");
            obj.removeClass("Validform_correct").addClass("Validform_error");
            vpwdStatus = false;
        } else {
            $("#divVPwdTip").removeClass("Validform_wrong").html("");
            obj.addClass("Validform_correct").removeClass("Validform_error");
            vpwdStatus = true;
        }
    } else {
        $("#divVPwdTip").addClass("Validform_wrong").html("请再次填写密码");
        obj.removeClass("Validform_correct").addClass("Validform_error");
        vpwdStatus = false;
    }
}
