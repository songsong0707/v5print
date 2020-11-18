var focusmsg = '请填写密码（6-30位数字或字母）';
var errormsg = '密码6-30位，支持“数字、字母”';
var usernameStatus = false;
var emailStatus = false;
var phoneStatus = false;
var pwdStatus = false;
var vpwdStatus = false;
var smsCodeStatus = false;
var validateCodeStatus = false;
var agreementStatus = true;
var checkOK = false;
var isOK = true;
var smsSeconds = 180;
var intervaSMS;

$(function () {

    $("#SubmitRegisterInfo").click(function () {
        if (CheckRegister()) {
            $("#formregister").submit();
        }
    });

    $("#btnSendSMS").click(function () {
        if (!phoneStatus) {
            $("#divPhoneTip").addClass("msg msg-err").html("<i class=\"msg-ico\"></i><p>请输入手机号码！</p>");
            return;
        }
        if (!validateCodeStatus) {
            $("#divVerifyCodeTip").addClass("msg msg-err").html("<i class=\"msg-ico\"></i><p>请输入正确的验证码！</p>");
            return;
        }
        if (phoneStatus && validateCodeStatus) {
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
                        $("#btnSendSMS").attr("value", "(" + smsSeconds + ")重新获取");
                        intervaSMS = setInterval("CountDown()", 1000);
                    }
                    else {
                        $("#divcheckCodeTip").removeClass("msg msg-ok msg-naked").removeClass("msg msg-info").addClass("msg msg-err").html("<i class=\"msg-ico\"></i><p>" + resultData.split("|")[1] + "！</p>");
                        mailStatus = false;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    ShowServerBusyTip("服务器没有返回数据，可能服务器忙，请稍候再试！");
                    mailStatus = false;
                }

            });
        }
    });

    $("#checkCode").blur(function () {
        var code = $(this).val();
        if (code == "") {
            smsCodeStatus = false;
            return;
        }
        var phone = $("#phone").val();
        if (phone != $("#hfPhoneNumber").val()) {
            ShowFailTip("请输入一致的手机号码");
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
                    ShowFailTip("手机效验码不正确");
                    smsCodeStatus = false;
                } else {
                    $("#divVerifyCodeTip").removeClass("msg msg-err").removeClass("msg msg-info").addClass("msg msg-ok msg-naked").html("<i class=\"msg-ico\"></i><p>&nbsp;</p>");
                    smsCodeStatus = true;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                ShowServerBusyTip("服务器没有返回数据，可能服务器忙，请稍候再试！");
                mailStatus = false;
            }

        });
    });

    $("#VerifiyValidateCode").blur(function () {
        var code = $(this).val();
        var temp = $(this);
        if (code == "" || code.length < 4) {
            validateCodeStatus = false;
            $("#divVerifyCodeTip").addClass("Validform_wrong").html("请输入验证码");
            temp.removeClass("Validform_correct").addClass("Validform_error");
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
                    $("#divVerifyCodeTip").addClass("Validform_wrong").html("请输入正确的验证码");
                    temp.removeClass("Validform_correct").addClass("Validform_error");
                    validateCodeStatus = false;
                } else {
                    $("#divVerifyCodeTip").removeClass("Validform_wrong").html("");
                    temp.addClass("Validform_correct").removeClass("Validform_error");
                    validateCodeStatus = true;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                ShowServerBusyTip("服务器没有返回数据，可能服务器忙，请稍候再试！");
                mailStatus = false;
            }
        });
    });

    $("#username").keypress(function (event) {
        if (event.which == 13) {
            $("#SubmitRegisterInfo").trigger("click");
        }
    }).blur(function () {
        CheckUserName($(this));
    });

    $("#phone").keypress(function (event) {
        if (event.which == 13) {
            $("#SubmitRegisterInfo").trigger("click");
        }
    }).blur(function () {
        CheckPhone($(this));
    });

    $("#email").keypress(function (event) {
        if (event.which == 13) {
            $("#SubmitRegisterInfo").trigger("click");
        }
    }).blur(function () {
        CheckEmail($(this));
    });

    $("#pwd").keypress(function (event) {
        if (event.which == 13) {
            $("#SubmitRegisterInfo").trigger("click");
        }
    }).blur(function () {
        CheckPwd($(this));
    });

    $("#vpwd").keypress(function (event) {
        if (event.which == 13) {
            $("#SubmitRegisterInfo").trigger("click");
        }
    }).blur(function () {
        CheckVPwd($(this));
    });
    
    $("#loginVerifyCodeImg").click(function () {
        $("#loginVerifyCodeImg").find("img").attr("src", "/ValidateCode.aspx?flag=" + NewGuid());
    });
});

function CheckRegister() {
    var regmode = $("#hfRegMode").val();
    if (regmode == "Phone")
    {
        if (!pwdStatus || !vpwdStatus || !phoneStatus || !smsCodeStatus || !validateCodeStatus) {
            checkOK = false;
        } else {
            checkOK = true;
        }
    }
    else if (regmode == "Email")
    {
        if (!pwdStatus || !vpwdStatus || !emailStatus || !validateCodeStatus) {
            checkOK = false;
        } else {
            checkOK = true;
        }
    }
    else
    {
        if (!pwdStatus || !vpwdStatus || !usernameStatus || !validateCodeStatus) {
            checkOK = false;
        } else {
            checkOK = true;
        }
    }
    return checkOK;
}

function CheckPhone(obj) {
    var regs = /^(1(([34578][0-9])|(47)|[8][0126789]))\d{8}$/;
    var phoneval = obj.val();
    if (phoneval != "") {
        if (!regs.test(phoneval)) {
            $("#divPhoneTip").addClass("Validform_wrong").html("请填写有效的手机号码");
            obj.removeClass("Validform_correct").addClass("Validform_error");
            phoneStatus = false;
        }
        else {
            //验证手机是否存在
            $.ajax({
                url: $V5print.BasePath + "Account/IsExistPhone",
                type: 'post',
                dataType: 'text',
                timeout: 10000,
                async: false,
                data: {
                    Action: "post", Phone: phoneval
                },
                success: function (resultData) {
                    if (resultData == "true") {
                        $("#divPhoneTip").removeClass("Validform_wrong").html("");
                        obj.removeClass("Validform_error").addClass("Validform_correct");
                        phoneStatus = true;
                    }
                    else {
                        $("#divPhoneTip").addClass("Validform_wrong").html("该手机号码已被注册");
                        obj.removeClass("Validform_correct").addClass("Validform_error");
                        phoneStatus = false;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    ShowServerBusyTip("服务器没有返回数据，可能服务器忙，请稍候再试！");
                    phoneStatus = false;
                }

            });
        }
    } else {
        phoneStatus = false;
    }
    return;
}
//验证邮箱
function CheckEmail(obj) {
    var regs = /^[\w-]+(\.[\w-]+)*\@[A-Za-z0-9]+((\.|-|_)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    var emailval = obj.val();
    if (emailval != "") {
        if (!regs.test(emailval)) {
            $("#divEmailTip").addClass("Validform_wrong").html("请填写有效的Email");
            obj.removeClass("Validform_correct").addClass("Validform_error");
            emailStatus = false;
        } else {
            //验证注册邮箱是否存在
            $.ajax({
                url: $V5print.BasePath + "Account/IsExistEmail",
                type: 'post',
                dataType: 'text',
                timeout: 10000,
                async: false,
                data: {
                    Action: "post", Email: emailval
                },
                success: function (resultData) {
                    if (resultData == "true") {
                        $("#divEmailTip").removeClass("Validform_wrong").html("");
                        obj.removeClass("Validform_error").addClass("Validform_correct");
                        emailStatus = true;
                    }
                    else {
                        $("#divEmailTip").addClass("Validform_wrong").html("该Email已经被注册");
                        obj.removeClass("Validform_correct").addClass("Validform_error");
                        emailStatus = false;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    ShowServerBusyTip("服务器没有返回数据，可能服务器忙，请稍候再试！");
                    emailStatus = false;
                }

            });
        }
    } else {
        $("#divEmailTip").addClass("Validform_wrong").html("请填写有效的Email地址");
        obj.removeClass("Validform_correct").addClass("Validform_error");
        emailStatus = false;
    }
    return;
}
//验证用户名
function CheckUserName(obj) {
    var i = 0;
    var usernamevalue = obj.val();
    if (usernamevalue.indexOf(";") > -1 || usernamevalue.indexOf(",") > -1 || usernamevalue.indexOf("'") > -1) {
        ShowFailTip('大神，请您手下留情！');
        $(this).val("");
        i++;
        if (i >= 3) {
            ShowFailTip('别玩了，这样有意思吗？');
        }
        usernameStatus = false;
        return;
    }

    if (usernamevalue != "") {
        //验证昵称是否存在
        $.ajax({
            url: $V5print.BasePath + "Account/IsExistUserName",
            type: 'post',
            dataType: 'text',
            timeout: 10000,
            async: false,
            data: {
                Action: "post",
                userName: usernamevalue
            },
            success: function (resultData) {
                if (resultData == "true") {
                    $("#divUserNameTip").removeClass("Validform_wrong").html("");
                    obj.addClass("Validform_correct").removeClass("Validform_error");
                    usernameStatus = true;
                } else {
                    $("#divUserNameTip").addClass("Validform_wrong").html("该用户名已被其他用户抢先使用");
                    obj.removeClass("Validform_correct").addClass("Validform_error");
                    usernameStatus = false;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                ShowServerBusyTip("服务器没有返回数据，可能服务器忙，请稍候再试！");
                usernameStatus = false;
            }
        });
    } else {
        $("#divUserNameTip").addClass("Validform_wrong").html("请填写用户名");
        obj.removeClass("Validform_correct").addClass("Validform_error");
        usernameStatus = false;
    }
    return;
}
//验证密码
function CheckPwd(obj) {
    var regs = /^[A-Za-z0-9]{6,30}$/;
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
    if($("#vpwd").val().length>0)
    {
        CheckVPwd($("#vpwd"));
    }
}

//验证确认密码
function CheckVPwd(obj) {
    if (obj.val() != "") {
        if (obj.val() != $("#pwd").val()) {
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

function CountDown() {
    if (smsSeconds < 0) {
        isOK = true;
        $("#btnSendSMS").removeAttr("disabled");
        clearInterval(intervaSMS);
    }
    else {
        $("#btnSendSMS").attr("value", "(" + smsSeconds + ")重新获取");
        $("#btnSendSMS").attr("disabled", "disabled");
        isOK = false;
        smsSeconds--;
    }
}

//生成GUID
function NewGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}
