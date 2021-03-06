
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
    try
    {
        $("#uploadtips").hide();
        swfu.startUpload();
    }
    catch (e)
    {

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
    try
    {
        var obj = $.evalJSON(serverData);
        if (serverData != "" && obj.STATUS == "SUCCESS")
        {
            file.id = "singlefile"; // This makes it so FileProgress only makes a single UI element, instead of one for each file
            var progress = new FileProgress(file, this.customSettings.progress_target);
            progress.setComplete();
            progress.setStatus("上传成功.");
            progress.toggleCancel(true, true);
            this.customSettings.upload_successful = true;

            $("#hid_FileId").val(obj.FileId);
            $("#hid_FileName").val(obj.FileName);
            $.dialog.data('fileidvalue', obj.FileId);
            $.dialog.data('filenamevalue', obj.FileName);
            $.dialog.data('filepathvalue', obj.FilePath);
            $.dialog.data('uploadstatus', obj.STATUS);
            $.dialog.close();
            //默认情况下asp.net不允许提交包含有html代码的表单，在不修改服务端的前提下，可以在这里一并处理
        }
        else
        {
            this.customSettings.upload_successful = false;
        }
    }
    catch (e)
    {

    }
}

function uploadComplete(file) {
    try {
        if (this.customSettings.upload_successful)
        {
            //this.setButtonDisabled(false);
            //uploadDone();
            //file.id = "singlefile";
            //this.customSettings.file_upload_limit = 5;
            //this.cancelUpload();
        }
        else
        {
            file.id = "singlefile"; // This makes it so FileProgress only makes a single UI element, instead of one for each file
            var progress = new FileProgress(file, this.customSettings.progress_target);
            progress.setError();
            progress.setStatus("上传失败");
            progress.toggleCancel(true,true);

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

    if ($("#hid_FileId").length > 0) {
        $("#hid_FileId").val("");
        $("#hid_FileName").val("");
    }
}

