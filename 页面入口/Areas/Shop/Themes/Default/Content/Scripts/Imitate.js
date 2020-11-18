var swfu;
$(function () {
    swfu = new SWFUpload({
        // Backend settings               
        upload_url: "/UploadNormalFile.aspx",
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
        button_image_url: "/Scripts/swfupload/btnimg_01.png",
        button_placeholder_id: "localUpload",
        button_width: 70,
        button_height: 30,

        // Flash Settings
        flash_url: "/Scripts/swfupload/swfupload.swf",

        custom_settings: {
            progress_target: "fsUploadProgress",
            upload_successful: false
        },

        // Debug settings
        debug: false
    });
});

function Download(templateid) {
    if (CheckLoginStatus() == 1)
    {
        art.dialog.open('/Imitate/Download/' + templateid,
        {
            title: '下载提示',
            lock: true,
            fixed: true,
            drag: false,
            opacity: 0.5,
            width: 450,
            height: 200
        });
    } else {
        ShowLoginBox('Download(' + templateid + ')');
    }
}

//function swfUploadLoaded() {
//}


// Called by the submit button to start the upload
function doSubmit(e) {

    e = e || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.cancelBubble = true;

    try {
        swfu.startUpload();
    } catch (ex) {

    }

    var btnSubmit = document.getElementById("btnSubmit");
    btnSubmit.disabled = true; //防止重复提交
    return false;
}

// Called by the queue complete handler to submit the form
//function uploadDone() {
//    try {
//        document.forms[0].submit();
//    } catch (ex) {
//        alert("表单提交错误");
//    }
//}

//function fileDialogStart() {
//    //    var txtFileName = document.getElementById("txtFileName");
//    //    txtFileName.value = "";

//    // this.cancelUpload();
//}

function fileQueueError(file, errorCode, message) {
    try {
        // Handle this error separately because we don't want to create a FileProgress element for it.
        switch (errorCode) {
            case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                alert("一次选择的文件数太多!\n" + (message === 0 ? "已达上传限制." : "一次只能选择 " + (message > 1 ? "" + message + " 个文件" : "一个文件")));
                return;
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                alert("您选择的文件太大了.");
                this.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                return;
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                alert("不能选择0字节的文件，请重新选择.");
                this.debug("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                return;
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                alert("不支持该文件格式上传");
                this.debug("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                return;
            default:
                alert("上传发生错误，请稍候再试.");
                this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                return;
        }
    } catch (e) {
    }
}

function fileQueued(file) {
    try {
        swfu.startUpload();
    }
    catch (e) {

    }
}
//function fileDialogComplete(numFilesSelected, numFilesQueued) {
//}

var lastLoads = 0;
function uploadProgress(file, bytesLoaded, bytesTotal) {
    try {
        var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);

        var thisLoads = bytesLoaded - lastLoads;
        lastLoads = bytesLoaded;

        file.id = "singlefile"; // This makes it so FileProgress only makes a single UI element, instead of one for each file
        var progress = new FileProgress(file, this.customSettings.progress_target);
        progress.setProgress(percent);
        progress.toggleCancel(true, true);

        var thisloads2 = '';
        if (thisLoads >= 1024 * 1024) {
            thisloads2 = (parseFloat(thisLoads) / parseFloat(1024 * 1024)).toFixed(2) + " MB/S";
        }
        else if (thisLoads >= 1024) {
            thisloads2 = (parseFloat(thisLoads) / parseFloat(1024)).toFixed(2) + " KB/S";
        } else {
            thisloads2 = thisLoads + " Byte/S";
        }

        progress.setStatus('正在上传...    <span style="">' + thisloads2 + '</span> ');
    } catch (e) {
    }
}

function uploadSuccess(file, serverData) {
    try {
        file.id = "singlefile"; // This makes it so FileProgress only makes a single UI element, instead of one for each file
        var progress = new FileProgress(file, this.customSettings.progress_target);
        progress.setComplete();
        progress.setStatus("上传成功.");

        progress.toggleCancel(true, true);

        if (serverData === " ") {
            this.customSettings.upload_successful = false;
        } else {
            this.customSettings.upload_successful = true;
            var obj = $.evalJSON(serverData);
            $("#hid_upfile").val(obj.data);
  
            //默认情况下asp.net不允许提交包含有html代码的表单，在不修改服务端的前提下，可以在这里一并处理
        }
    }
    catch (e) {

    }
}

function uploadComplete(file) {
    try {
        if (this.customSettings.upload_successful) {
            //this.setButtonDisabled(false);
            //            uploadDone();
            //            file.id = "singlefile";
            //            this.customSettings.file_upload_limit = 5;
            //            this.cancelUpload();

        } else {
            file.id = "singlefile"; // This makes it so FileProgress only makes a single UI element, instead of one for each file
            var progress = new FileProgress(file, this.customSettings.progress_target);
            progress.setError();
            progress.setStatus("File rejected");
            progress.toggleCancel(true, true);

            //            var txtFileName = document.getElementById("txtFileName");
            //            txtFileName.value = "";

            //alert("文件上传错误，服务器未接收.");
        }
    } catch (e) {
    }
}

function uploadError(file, errorCode, message) {
    try {
        if (errorCode === SWFUpload.UPLOAD_ERROR.FILE_CANCELLED) {
            // Don't show cancelled error boxes
            return;
        }

        //        var txtFileName = document.getElementById("txtFileName");
        //        txtFileName.value = "";

        // Handle this error separately because we don't want to create a FileProgress element for it.
        switch (errorCode) {
            case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
                alert("swfupload配置错误");
                this.debug("Error Code: No backend file, File name: " + file.name + ", Message: " + message);
                return;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                alert("一次只能上传一个文件");
                this.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                return;
            case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
            case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                break;
            default:

                alert("上传出错，请稍候再试:" + "Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                // return;
        }

        file.id = "singlefile"; // This makes it so FileProgress only makes a single UI element, instead of one for each file
        var progress = new FileProgress(file, this.customSettings.progress_target);
        progress.setError();
        progress.toggleCancel(false);

        switch (errorCode) {
            case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                progress.setStatus("上传错误");
                this.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                progress.setStatus("上传失败");
                this.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                progress.setStatus("服务器IO错误");
                this.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                progress.setStatus("安全问题");
                this.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                progress.setStatus("上传被取消");
                this.debug("Error Code: Upload Cancelled, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                progress.setStatus("上传已停止");
                this.debug("Error Code: Upload Stopped, File name: " + file.name + ", Message: " + message);
                break;
        }


    } catch (ex) {
    }
}

function delUp() {
    swfu.cancelUpload(null, false);
    $("#fsUploadProgress").html("");

    if ($("#hid_FileName").length > 0) {
        $("#hid_FileName").val("");
    }
}

function BuyNow() {
    if (CheckLoginStatus() == 1) {
        var loading = layer.load('正在保存');

        $.ajax({
            url: "/ShoppingCart/AddCart",
            type: "POST",
            datatype: "json",
            data: {
                typeId: $("#hid_TypeId").val(),
                ImitateDesignId: $("#hid_ImitateDesignId").val(),
                orderType: $("#hid_OrderType").val(),
                submitType: 1,
                filename: $("#hid_upfile").val(),
                description: $("#require").val()
            },
            timeout: 6000,
            success: function (data) {
                if (data != "No") {
                    layer.close(loading);
                    location.href = "/Order/SubmitOrder";
                } else {
                    ShowFailTip('加入购物车失败！');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                ShowFailTip(XMLHttpRequest.readyState);
            }
        });
    } else {
        ShowLoginBox('BuyNow()');
    }
}

