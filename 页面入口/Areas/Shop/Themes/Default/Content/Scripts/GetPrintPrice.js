var reg = /,$/gi;

$(function () {
    $(".j-a-option").click(function () {
        $(this).parent().find('.j-a-option').removeClass('on');
        $(this).addClass('on');
        GetPrice();
    });
    $(".j-c-option").click(function () {
        if ($(this).hasClass('on')) {
            $(this).removeClass('on');
        }
        else {
            $(this).addClass('on');
        }
        GetPrice();
    });
    $(".j-q-option").click(function () {
        $(this).parent().find('.j-q-option').removeClass('on');
        $(this).addClass('on');
        GetPrice();
    });

    $("#j-hasPrint").click(function () {
        $(this).parent().find('.s-option').removeClass('on');
        $(this).addClass('on');
        $("#j-hasPrintBox").show();
        $("#j-hasNoPrintBox").hide();
    });
    $("#j-hasNoPrint").click(function () {
        $(this).parent().find('.s-option').removeClass('on');
        $(this).addClass('on');
        $("#j-hasPrintBox").hide();
        $("#j-hasNoPrintBox").show();
    });
    $("#j-addBuy").click(function () {
        BuyNow();
    });
    $("#j-addCart").click(function () {
        AddCart();
    });

    swfu = new SWFUpload({
        // Backend settings               
        upload_url: "/UploadOrderFile.aspx",
        post_params: {
            "typeid": $("#hid_TypeId").val(),
        },
        // Flash file settings
        file_size_limit: "2048 MB",
        file_types: "*.rar;*.zip;*.psd;*.pdf;*.cdr;*.ai;*.eps",
        file_types_description: "所有格式",
        //            file_upload_limit: "1", //限制上传成功的文件总数-0无限制
        file_queue_limit: "1", //限制文件上传队列中（入队检测通过的文件会添加到上传队列等待上传）允许排队的文件总数。

        // Event handler settings

        file_queued_handler: fileQueued,
        file_queue_error_handler: fileQueueError,

        //upload_start_handler : uploadStart,	// I could do some client/JavaScript validation here, but I don't need to.
        upload_progress_handler: uploadProgress,
        upload_error_handler: uploadError,
        upload_success_handler: uploadSuccess,
        upload_complete_handler: uploadComplete,

        // Button Settings
        button_image_url: "/Scripts/swfupload/uploadbg.png",
        button_placeholder_id: "localUpload",
        button_width: 111,
        button_height: 32,

        // Flash Settings
        flash_url: "/Scripts/swfupload/swfupload.swf",

        custom_settings: {
            progress_target: "fsUploadProgress",
            upload_successful: false
        },

        // Debug settings
        debug: false
    });

    GetPrice();
});

function GetPrice() {
    var attributeValue = "";
    var craftValue = "";
    var quantityValue = "";
    var sheetId = "";

    $.each($(".j-a-option"), function () {
        var obj = $($(this).children(".show").get(0)).attr("val");
        if ($(this).hasClass("on"))
            attributeValue += $(this).attr("data-id") + ",";
    });
    $.each($(".j-c-option"), function () {
        if ($(this).hasClass("on")) {
            craftValue += $(this).attr("data-id") + ",";
        }
    });
    $.each($(".j-q-option"), function () {
        if ($(this).hasClass("on")) {
            quantityValue = $(this).attr("data-id");
        }
    });

    attributeValue = attributeValue.replace(reg, "");
    craftValue = craftValue.replace(reg, "");
    sheetId = $("#hid_SheetId").val();
    quantityValue = quantityValue.replace(reg, "");

    if (attributeValue != "" && attributeValue != "undefined" && quantityValue != "" && quantityValue != "undefined") {
        $.ajax({
            type: "POST",
            url: "/GetPrice.aspx",
            datatype: "json",
            data: {
                attributeValue: attributeValue,
                Crafts: craftValue,
                Quantity: quantityValue,
                SheetId: sheetId
            },
            timeout: 6000,
            async: true,
            success: function (resultData) {
                if (resultData.Status == "Successed") {
                    $("#j-price").text(resultData.TotalPrice);
                }
                else {
                    $("#j-price").text("暂无报价");
                }
            },
            error: function () {
                $("#j-price").text("暂无报价");
            }
        });
    }
}

function BuyNow() {
    var attributeValue = "";
    var craftValue = "";
    var quantityValue = "";
    var fileId = $("#hid_FileId").val();
    var fileName = $("#hid_FileName").val();
    var sheetId = $("#hid_SheetId").val();
    var typeId = $("#hid_TypeId").val();
    var orderType = $("#hid_OrderType").val();

    $.each($(".j-a-option"), function () {
        var obj = $($(this).children(".show").get(0)).attr("val");
        if ($(this).hasClass("on"))
            attributeValue += $(this).attr("data-id") + ",";
    });
    $.each($(".j-c-option"), function () {
        if ($(this).hasClass("on")) {
            craftValue += $(this).attr("data-id") + ",";
        }
    });
    $.each($(".j-q-option"), function () {
        if ($(this).hasClass("on")) {
            quantityValue = $(this).attr("data-id");
        }
    });

    attributeValue = attributeValue.replace(reg, "");
    craftValue = craftValue.replace(reg, "");
    quantityValue = quantityValue.replace(reg, "");

    if (CheckLoginStatus() == 1) {
        var amount = $("#j-price").text();
        if (amount != "" && amount != "0.00" && amount != "暂无报价") {
            var loading = layer.load('正在提交订单');
            $.ajax({
                url: "/ShoppingCart/AddCart",
                type: "POST",
                datatype: "json",
                data: {
                    typeId: typeId,
                    attributes: attributeValue,
                    quantityId: quantityValue,
                    crafts: craftValue,
                    sheetId: sheetId,
                    fileId: fileId,
                    filename: fileName,
                    orderType: orderType,
                    submitType: "0"
                },
                timeout: 6000,
                success: function (data) {
                    if (data != "No") {
                        layer.close(loading);
                        location.href = "/Order/SubmitOrder";
                    }
                }
            });
        }
        else {
            ShowFailTip("您还没有报价！");
        }
    } else {
        ShowLoginBox('BuyNow()');
    }
}
function AddCart() {
    var attributeValue = "";
    var craftValue = "";
    var quantityValue = "";
    var fileId = $("#hid_FileId").val();
    var fileName = $("#hid_FileName").val();
    var sheetId = $("#hid_SheetId").val();
    var typeId = $("#hid_TypeId").val();
    var orderType = $("#hid_OrderType").val();

    $.each($(".j-a-option"), function () {
        var obj = $($(this).children(".show").get(0)).attr("val");
        if ($(this).hasClass("on"))
            attributeValue += $(this).attr("data-id") + ",";
    });
    $.each($(".j-c-option"), function () {
        if ($(this).hasClass("on")) {
            craftValue += $(this).attr("data-id") + ",";
        }
    });
    $.each($(".j-q-option"), function () {
        if ($(this).hasClass("on")) {
            quantityValue = $(this).attr("data-id");
        }
    });

    attributeValue = attributeValue.replace(reg, "");
    craftValue = craftValue.replace(reg, "");
    quantityValue = quantityValue.replace(reg, "");

    if (CheckLoginStatus() == 1) {
        var amount = $("#j-price").text();
        if (amount != "" && amount != "0.00" && amount != "暂无报价") {
            var loading = layer.load('正在提交订单');
            $.ajax({
                url: "/ShoppingCart/AddCart",
                type: "POST",
                datatype: "json",
                data: {
                    typeId: typeId,
                    attributes: attributeValue,
                    quantityId: quantityValue,
                    crafts: craftValue,
                    sheetId: sheetId,
                    fileId: fileId,
                    filename: fileName,
                    orderType: orderType,
                    submitType: "1"
                },
                timeout: 6000,
                success: function (data) {
                    layer.close(loading);
                    if (data.toLowerCase() == "yes") {
                        ShowSuccessTip("加入购物车成功！");
                    } else {
                        ShowFailTip('加入购物车失败！');
                    }
                },
                error: function () {
                    ShowFailTip('加入购物车失败！');
                }
            });
        }
        else {
            ShowFailTip("您还没有报价！");
        }
    } else {
        ShowLoginBox('AddCart()');
    }
}
