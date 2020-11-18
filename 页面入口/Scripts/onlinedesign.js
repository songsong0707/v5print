var nowPage = 1;
var maxItem = 20;
var maxIndex = 0;
var SelectedItems = $([]),
	offset = {
	    top: 0,
	    left: 0
	};
var arVersion = navigator.appVersion.split("MSIE");
var version = parseFloat(arVersion[1]);

function UnBindEvent() {
    $(".preimg").draggable();
    $(".preimg").draggable("destroy");
    $(".slider").slider();
    $(".slider").slider("destroy");
    $(".SetFontStyleTool select").unbind("change");
    $("#SetFontStyleTool input[type=checkbox]").unbind("change");
    $("#Select_vora").unbind("click");
}

function EventBind() {
    UnBindEvent();
    ReEventBind();
}

function ReEventBind() {
    var editorWidth = parseInt($(".pagePreview").css("width"));
    var pageWidth = parseInt($("#l-page-1").css("width"));
    var marginLeft;
    if (editorWidth / 2 > pageWidth) {
        marginLeft = (parseInt(editorWidth - pageWidth * 2) / 3);
    } else {
        marginLeft = (editorWidth - pageWidth) / 2;
    }
    $(".pagec").css("margin-left", marginLeft);

    var TimeFn1 = null;
    $(".pageContent").click(function (e) {
        clearTimeout(TimeFn1);
        TimeFn1 = setTimeout("", 100);
        if (e.metaKey == false) {
            var pagenumber = $(this).attr("pagenumber");
            SelectPage(pagenumber);
        }
    });

    $(".pageContent").selectable();
    $(".pageContent").on("selectablestart", function (event, ui) {
        SelectedItems = $([]);
        $(".preimg").removeClass("ui-selected");
    });
    $(".pageContent").on("selectableselected", function (event, ui) {
        SelectedItems.push($(ui.selected));
    });
    $(".pageContent").on("selectablestop", function (event, ui) {
        $(".inputtext").removeClass("selectedtext");
        $.each(SelectedItems, function (n, v) {
            var rid = "r" + $(v).attr("id").substring(1);
            $("#" + rid).addClass("selectedtext");
        });
        if (SelectedItems.length > 1) {
            $("#editorTools").show();
        }
    });

    var TimeFn = null;
    $(".preimg").click(function (e) {
        clearTimeout(TimeFn);
        TimeFn = setTimeout("", 300);
        if (e.metaKey == false) {
            $(".preimg").removeClass("ui-selected");
            SelectedItems = $([]);
            SelectedItems.push($(this));
            $(this).addClass("ui-selected");
            $(".inputtext").removeClass("selectedtext");
            var rid = "r" + $(this).attr("id").substring(1);
            $("#" + rid).addClass("selectedtext");
            if ($(this).hasClass("txt")) {
                SetFontStyle($(this).attr("id").split('-')[2], $(this).attr("id").split('-')[4]);
            }
        }
    });
    $(".preimg").draggable({
        containment: "parent"
    });
    $(".preimg").on("dragstart", function (event, ui) {
        if ($(this).hasClass("ui-selected")) {
            SelectedItems = $(".ui-selected").each(function () {
                var el = $(this);
                el.data("offset", el.offset());
            });
        } else {
            SelectedItems = $([]);
            $(".pageContent .preimg").removeClass("ui-selected");
        }
        offset = $(this).offset();
    });
    $(".preimg").on("drag", function (event, ui) {
        var dt = ui.position.top - offset.top,
			dl = ui.position.left - offset.left;
        var cutWidth = 10;
        if (SelectedItems.length > 0) {
            $.each(SelectedItems, function (n, v) {
                var el = $(v),
					off = el.data("offset");

                var docWidth = parseInt(el.parent().css("width"));
                var docHeight = parseInt(el.parent().css("height"));

                var x, y, w, h;
                w =el.get(0).offsetWidth;
                h = el.get(0).offsetHeight;
                if ((off.left + dl) <= cutWidth) {
                    x = cutWidth;
                }
                else if ((off.left + dl + w) >= (docWidth - cutWidth)) {
                    x = (docWidth - cutWidth) - w;
                } else {
                    x = off.left + dl;
                }

                if ((off.top + dt) < cutWidth) {
                    y = cutWidth;
                }
                else if ((off.top + dt + h) > (docHeight - cutWidth)) {
                    y = (docHeight - cutWidth) - h;
                } else {
                    y = off.top + dt;
                }
                el.css({
                    top: y,
                    left: x
                });
                var rightItemId = "#r" + $(el).attr("id").substring(1);
                $(rightItemId).attr("y", y);
                $(rightItemId).attr("x", x);
            });
        } else {
            var el = $(this),
				off = $(this).data("offset");

            var docWidth = parseInt(el.parent().css("width"));
            var docHeight = parseInt(el.parent().css("height"));
            var x = parseInt(el.css("left"));
            var y = parseInt(el.css("top"));
            var w = el.get(0).offsetWidth;
            var h = el.get(0).offsetHeight;

            if (x <= cutWidth) {
                x = cutWidth;
            }
            else if (x + w > (docWidth - cutWidth)) {
                x = (docWidth - cutWidth) - w;
            }

            if (y <= cutWidth) {
                y = cutWidth;
            }
            else if (y + h > (docHeight - cutWidth)) {
                y = (docHeight - cutWidth) - h;
            }
            el.css({
                top: y,
                left: x
            });
            var rightItemId = "#r" + $(el).attr("id").substring(1);
            $(rightItemId).attr("y", el.css("top"));
            $(rightItemId).attr("x", el.css("left"));
        }
    });
    $(".preimg").on("dragstop", function (event, ui) {
        var dt = ui.position.top - offset.top,
			dl = ui.position.left - offset.left;
        var cutWidth = 10;
        if (SelectedItems.length > 0) {
            $.each(SelectedItems, function (n, v) {
                var el = $(v),
					off = el.data("offset");
                var docWidth = parseInt(el.parent().css("width"));
                var docHeight = parseInt(el.parent().css("height"));

                var x, y, w, h;
                w = el.get(0).offsetWidth;
                h = el.get(0).offsetHeight;

                if ((off.left + dl) <= cutWidth) {
                    x = cutWidth;
                }
                else if ((off.left + dl + w) >= (docWidth - cutWidth)) {
                    x = (docWidth - cutWidth) - w;
                } else {
                    x = off.left + dl;
                }

                if ((off.top + dt) < cutWidth) {
                    y = cutWidth;
                }
                else if ((off.top + dt + h) > (docHeight - cutWidth)) {
                    y = (docHeight - cutWidth) - h;
                } else {
                    y = off.top + dt;
                }
                el.css({
                    top: y,
                    left: x
                });

                var rightItemId = "#r" + $(el).attr("id").substring(1);
                $(rightItemId).attr("y", y);
                $(rightItemId).attr("x", x);
            });
        } else {
            var el = $(this),
				off = $(this).data("offset");
            var docWidth = parseInt(el.parent().css("width"));
            var docHeight = parseInt(el.parent().css("height"));

            var x = parseInt(el.css("left"));
            var y = parseInt(el.css("top"));
            var w = el.get(0).offsetWidth;
            var h = el.get(0).offsetHeight;

            if (x <= cutWidth) {
                x = cutWidth;
            }
            else if (x + w > (docWidth - cutWidth)) {
                x = (docWidth - cutWidth) - w;
            }

            if (y <= cutWidth) {
                y = cutWidth;
            }
            else if (y + h > (docHeight - cutWidth)) {
                y = (docHeight - cutWidth) - h;
            }
            el.css({
                top: y,
                left: x
            });

            var rightItemId = "#r" + $(el).attr("id").substring(1);
            $(rightItemId).attr("y", el.css("top"));
            $(rightItemId).attr("x", el.css("left"));
        }
    });

    $(".slider").slider({
        min: 0,
        max: 300,
        value: 100,
        stop: function (event, ui) {
            ResizeImage($(this).attr("id"), ui.value);
        },
        slide: function (event, ui) {
            ResizeImage($(this).attr("id"), ui.value);
        }
    });
    $("#SetFontStyleTool select").change(function () {
        ChangeFontStyle();
    });
    $("#SetFontStyleTool input[type=checkbox]").change(function () {
        ChangeFontStyle();
    });
    $(document).keydown(function (event) {
        MoveSelectItems(event);
    });
    $("#Select_vora").click(function () {
        if ($(this).hasClass("on")) {
            $(".pageBackground strong").hide();
            $(this).removeClass("on");
            $("#Select_vora_text").text("直角预览");
        } else {
            $(".pageBackground strong").show();
            $(this).addClass("on");
            $("#Select_vora_text").text("圆角预览");
        }
    });
}

function MoveSelectItems(event) {
    if (event.which == 37 || event.which == 38 || event.which == 39 || event.which == 40) {
        var id = event.which;
        if (event && event.preventDefault)
            event.preventDefault();
        else
            window.event.returnValue = false;
        var maxWidth = parseInt($(".pageContent").css("width"))-10;
        var maxHeighth = parseInt($(".pageContent").css("height"))-10;
        switch (id) {
            case 37:
                $.each(SelectedItems, function (n, v) {
                    var robj = "#r" + $(v).attr("id").substring(1);
                    if (parseInt($(v).css("left")) == 0) {
                        $(v).css("left", 0);
                        $(robj).attr("x", 0);
                    } else {
                        $(v).css("left", parseInt($(v).css("left")) - 1);
                        $(robj).attr("x", parseInt($(v).css("left")) - 1);
                    }
                });
                break;
            case 38:
                $.each(SelectedItems, function (n, v) {
                    var robj = "#r" + $(v).attr("id").substring(1);
                    if (parseInt($(v).css("top")) == 0) {
                        $(v).css("top", 0);
                        $(robj).attr("y", 0);
                    } else {
                        $(v).css("top", parseInt($(v).css("top")) - 1);
                        $(robj).attr("y", parseInt($(v).css("top")) - 1);
                    }
                });
                break;
            case 39:
                $.each(SelectedItems, function (n, v) {
                    var robj = "#r" + $(v).attr("id").substring(1);
                    if (parseInt($(v).css("left")) > parseInt(maxWidth - $(v).get(0).offsetWidth)) {
                        $(v).css("left", parseInt(maxWidth - $(v).get(0).offsetWidth));
                        $(robj).attr("x", parseInt(maxWidth - $(v).get(0).offsetWidth));
                    } else {
                        $(v).css("left", parseInt($(v).css("left")) + 1);
                        $(robj).attr("x", parseInt($(v).css("left")) + 1);
                    }

                });
                break;
            case 40:
                $.each(SelectedItems, function (n, v) {
                    var robj = "#r" + $(v).attr("id").substring(1);
                    if (parseInt($(v).css("top")) > parseInt(maxHeighth - $(v).get(0).offsetHeight)) {
                        $(v).css("top", parseInt(maxHeighth - $(v).get(0).offsetHeight));
                        $(robj).attr("y", parseInt(maxHeighth - $(v).get(0).offsetHeight));
                    } else {
                        $(v).css("top", parseInt($(v).css("top")) + 1);
                        $(robj).attr("y", parseInt($(v).css("top")) + 1);
                    }
                });
                break;
        }
    }
}

function Document() {
    this.Pages = ([]);
    this.Name = "测试模板";
    this.TypeId = 3;
    this.SizeId = 1;
    this.GroupId = 1;
    this.FilePath = "";
    this.IsRound = false;
    this.PreviewId = 0;
    this.DocumentNumber = 0;
    this.TemplateNumber = 0;
}

function DocumentPage() {
    this.Background = "";
    this.Texts = ([]);
    this.Images = ([]);
    this.Number = 0;
    this.DocumentNumber = 0;
    this.Thumb = "";
    this.PDF = "";
}

function TextItem() {
    this.Text = "";
    this.CMYKColor = "";
    this.RGBColor = "";
    this.MultiLine = false;
    this.FontName = "";
    this.FontSize = 0;
    this.Fontstyle = "normal";
    this.Fontweight = "normal";
    this.Left = 0;
    this.Top = 0;
    this.ZIndex = 0;
    this.TextTag = 0;
    this.WordSpace = "0";
    this.Width = 400;
    this.Height = 243;
    this.Textdirection = "0";
    this.HAlignType = "";
    this.HAlignValue = "";
    this.VAlignType = "";
    this.VAlignValue = "";
}

function ImageItem() {
    this.Width = 0;
    this.Height = 0;
    this.Left = 0;
    this.Top = 0;
    this.ImageUrl = "";
    this.Percent = 100;
    this.Imagetype = "1";
    this.ZIndex = 10;
    this.HAlignType = "";
    this.HAlignValue = "";
    this.VAlignType = "";
    this.VAlignValue = "";
}

function LoadTemplate() {
    var pagecount = $(".pageItem").length;
    for (i = 1; i < pagecount + 1; i++) {
        var textItemCount = $("#r-page-" + i + " .textitem").length;
        for (j = 0; j < textItemCount; j++) {
            LoadText(i, j);
        }
    }
}

function SelectPage(page) {
    $(".pagenav li").removeClass("select");
    $("#page-title-" + page).addClass("select");
    $(".pageItem").hide();
    $("#r-page-" + page).show();
    $(".pagec").removeClass("selectedpage");
    $("#l-page-" + page).addClass("selectedpage");
    nowPage = page;
    maxIndex = 0;
    maxItem = $("#r-page-" + page + " .textitem").length + $("#r-page-" + page + " .logoitem").length;
    $.each($("#l-page-" + page + " .pageContent img"), function (n, v) {
        if (parseInt($(v).css("z-index")) > maxIndex)
            maxIndex = parseInt($(v).css("z-index"));
    })
}

function SetAdvantageTools() {
    if ($("#AdvantageTools").prop("checked")) {
        $("#editorTools").show();
        $("#AdvantageTips span").text("隐藏高级功能");
    } else {
        $("#editorTools").hide();
        $("#AdvantageTips span").text("显示高级功能");
    }
}

function DeleteItem(page, type, number) {
    $("#l-page-" + page + "-" + type + "-" + number).remove();
    if (type == "text") {
        var obj = $("#SetFontStyleTool");
        obj.hide();
        $("body").append(obj);
        $("#r-page-" + page + "-" + type + "-" + number).parent().remove();
    } else {
        $("#r-page-" + page + "-" + type + "-" + number).parent().parent().remove();
    }
    maxItem = maxItem - 1;
}

function ShowLogoList(page, number) {
    art.dialog.open("/Material/MaterialList.aspx?tid=" + $("#hideTypeId").val() + "&sid=" + $("#hideSizeId").val(), {
        id: "showlogolist",
        title: "网站图库",
        width: 900,
        height: 450,
        fixed: true,
        lock: true,
        ok: function () {
            var percent = $("#hidePercent").val();
            var bValue = art.dialog.data('selectedLogoValue');
            var logo = $.evalJSON(bValue);
            var imgthumb = new Image();
            imgthumb.src = logo.thumbpath;
            if (version < 11) {
                imgthumb.onreadystatechange = function () {
                    var width = imgthumb.width * percent;
                    var height = imgthumb.height * percent;

                    $("#r-page-" + page + "-image-" + number).attr("src", logo.thumbpath);
                    $("#r-page-" + page + "-image-" + number).attr("w", width);
                    $("#r-page-" + page + "-image-" + number).attr("h", height);
                    $("#r-page-" + page + "-image-" + number).attr("ow", width);
                    $("#r-page-" + page + "-image-" + number).attr("oh", height);
                }
            } else {
                imgthumb.onload = function () {
                    if (imgthumb.complete == true) {
                        var width = imgthumb.width * percent;
                        var height = imgthumb.height * percent;
                        $("#r-page-" + page + "-image-" + number).attr("src", logo.thumbpath);
                        $("#r-page-" + page + "-image-" + number).attr("w", width);
                        $("#r-page-" + page + "-image-" + number).attr("h", height);
                        $("#r-page-" + page + "-image-" + number).attr("ow", width);
                        $("#r-page-" + page + "-image-" + number).attr("oh", height);
                    }
                }
            }

            var imgoriginal = new Image();
            imgoriginal.src = logo.originalpath;
            if (version < 11) {
                imgoriginal.onreadystatechange = function () {
                    var width = imgoriginal.width * percent;
                    var height = imgoriginal.height * percent;
                    $("#l-page-" + page + "-image-" + number).attr("src", logo.originalpath);
                    $("#l-page-" + page + "-image-" + number).css("width", width);
                    $("#l-page-" + page + "-image-" + number).css("height", height);
                }
            } else {
                imgoriginal.onload = function () {
                    if (imgoriginal.complete == true) {
                        var width = imgoriginal.width * percent;
                        var height = imgoriginal.height * percent;
                        $("#l-page-" + page + "-image-" + number).attr("src", logo.originalpath);
                        $("#l-page-" + page + "-image-" + number).css("width", width);
                        $("#l-page-" + page + "-image-" + number).css("height", height);
                    }
                }
            }
        }
    });
}

function AddNewLogo() {
    var productId = $("#hideTypeId").val();
    art.dialog.open("/Material/MaterialList.aspx?tid=" + $("#hideTypeId").val() + "&sid=" + $("#hideSizeId").val(), {
        id: "newlogouploadiframe",
        title: '网站图库',
        width: 900,
        height: 450,
        fixed: true,
        lock: true,
        ok: function () {
            var bValue = art.dialog.data('selectedLogoValue');
            var img = new Image();
            var logo = $.evalJSON(bValue);
            var percent = $("#hidePercent").val();
            img.src = logo.originalpath;
            if (version < 11) {
                img.onreadystatechange = function () {
                    var width = img.width * percent;
                    var height = img.height * percent;

                    maxItem++;
                    maxIndex++;
                    var imgstr = "<li class=\"logoitem\">" +
						"<div class=\"logoleft\">" +
						"<img src=\"" + logo.thumbpath + "\" id=\"r-page-" + nowPage + "-image-" + maxItem + "\" ow=\"" + width + "\" oh=\"" + height + "\" w=\"" + width + "\" h=\"" + height + "\" t=\"1\" x=\"20\" y=\"20\" ox=\"20\" oy=\"20\" z=\"" + maxIndex + "\" p=\"100\" ht=\"0\" hv=\"0\" vt=\"0\" vv=\"0\" enable=\"1\">" +
						"</div>" +
						"<div class=\"logoright\">" +
						"<div class=\"uploadlogo\"><a href=\"javascript:;\" class=\"button\" id=\"r-page-" + nowPage + "-choose-" + maxItem + "\" onclick=\"ShowLogoList(" + nowPage + "," + maxItem + ");\">设置LOGO</a><a href=\"javascript:;\" class=\"button\" id=\"r-page-" + nowPage + "-upload-" + maxItem + "\" onclick=\"TransparentImg(" + nowPage + "," + maxItem + ");\">去除底色</a></div>" +
						"<div class=\"resizelogo\"><span>调整大小：</span><span class=\"slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all\" id=\"r-page-" + nowPage + "-slider-" + maxItem + "\" aria-disabled=\"false\"><a class=\"ui-slider-handle ui-state-default ui-corner-all\" href=\"#\" style=\"left: 33.33333333333333%;\"></a></span><a href=\"javascript:;\" class=\"hidelogo\" id=\"hide-" + nowPage + "-image-" + maxItem + "\" title=\"删除\" onclick='DeleteItem(" + nowPage + ",\"image\"," + maxItem + ");'></a></div>" +
						"</div>" +
						"</li>";

                    $("#r-page-" + nowPage + " .logoItems ul").append(imgstr);

                    var imgitem = "<img src=\"" + logo.originalpath + "\" class=\"preimg img ui-draggable\" id=\"l-page-" + nowPage + "-image-" + maxItem + "\" style=\"left:20px; top:20px;width: " + width + "px; height:" + height + "px; z-index:" + maxIndex + ";\">";

                    $("#l-page-" + nowPage + " .pageContent").append(imgitem);

                    maxItem = maxItem + 1;

                    EventBind();

                    $(".slider").slider({
                        min: 0,
                        max: 300,
                        value: 100,
                        stop: function (event, ui) {
                            ResizeImage($(this).attr("id"), ui.value);
                        },
                        slide: function (event, ui) {
                            ResizeImage($(this).attr("id"), ui.value);
                        }
                    });
                }
            } else {
                img.onload = function () {
                    if (img.complete == true) {
                        var width = img.width * percent;
                        var height = img.height * percent;

                        maxItem++;
                        maxIndex++;
                        var imgstr = "<li class=\"logoitem\">" +
							"<div class=\"logoleft\">" +
							"<img src=\"" + logo.thumbpath + "\" id=\"r-page-" + nowPage + "-image-" + maxItem + "\" ow=\"" + width + "\" oh=\"" + height + "\" w=\"" + width + "\" h=\"" + height + "\" t=\"1\" x=\"20\" y=\"20\" ox=\"20\" oy=\"20\" z=\"" + maxIndex + "\" p=\"100\" ht=\"0\" hv=\"0\" vt=\"0\" vv=\"0\" enable=\"1\">" +
							"</div>" +
							"<div class=\"logoright\">" +
							"<div class=\"uploadlogo\"><a href=\"javascript:;\" class=\"button\" id=\"r-page-" + nowPage + "-choose-" + maxItem + "\" onclick=\"ShowLogoList(" + nowPage + "," + maxItem + ");\">设置LOGO</a><a href=\"javascript:;\" class=\"button\" id=\"r-page-" + nowPage + "-upload-" + maxItem + "\" onclick=\"TransparentImg(" + nowPage + "," + maxItem + ");\">去除底色</a></div>" +
							"<div class=\"resizelogo\"><span>调整大小：</span><span class=\"slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all\" id=\"r-page-" + nowPage + "-slider-" + maxItem + "\" aria-disabled=\"false\"><a class=\"ui-slider-handle ui-state-default ui-corner-all\" href=\"#\" style=\"left: 33.33333333333333%;\"></a></span><a href=\"javascript:;\" class=\"hidelogo\" id=\"hide-" + nowPage + "-image-" + maxItem + "\" title=\"删除\" onclick='DeleteItem(" + nowPage + ",\"image\"," + maxItem + ");'></a></div>" +
							"</div>" +
							"</li>";

                        $("#r-page-" + nowPage + " .logoItems ul").append(imgstr);

                        var imgitem = "<img src=\"" + logo.originalpath + "\" class=\"preimg img ui-draggable\" id=\"l-page-" + nowPage + "-image-" + maxItem + "\" style=\"left:20px; top: 20px;width: " + width + "px; height:" + height + "px; z-index:" + maxIndex + ";\">";

                        $("#l-page-" + nowPage + " .pageContent").append(imgitem);

                        maxItem = maxItem + 1;

                        EventBind();

                        $(".slider").slider({
                            min: 0,
                            max: 300,
                            value: 100,
                            stop: function (event, ui) {
                                ResizeImage($(this).attr("id"), ui.value);
                            },
                            slide: function (event, ui) {
                                ResizeImage($(this).attr("id"), ui.value);
                            }
                        });
                    }
                }
            }
        },
        cancel: function () { }
    });


}

function TransparentImg(page, number) {
    var path = $("#r-page-" + page + "-image-" + number).attr("src");
    $.ajax({
        type: "POST",
        url: "/TransparentImg.aspx",
        datatype: "json",
        data: "oldpath=" + encodeURIComponent(path),
        success: function (data) {
            var imgsrc = "/Upload/Design/Logos/Originals/" + data;
            var lObj = $("#l-page-" + page + "-image-" + number);
            var rObj = $("#r-page-" + page + "-image-" + number);
            $(lObj).attr("src", imgsrc);
            $(rObj).attr("src", imgsrc);
        },
        error: function () {
            art.dialog.tips('保存失败！');
        }
    });
}

function ResizeImage(id, value) {
    var slidervalues = id.split('-');
    var sliderpage = slidervalues[2];
    var slidertype = slidervalues[3];
    var slideritem = slidervalues[4];

    var lObj = $("#l-page-" + sliderpage + "-image-" + slideritem);
    var rObj = $("#r-page-" + sliderpage + "-image-" + slideritem);

    var oW = parseFloat($(rObj).attr("ow"));
    var oH = parseFloat($(rObj).attr("oh"));
    //var oX = parseFloat($(rObj).attr("ox"));
    //var oY = parseFloat($(rObj).attr("oy"));

    var nW = parseFloat(oW * value / 100);
    var nH = parseFloat(oH * value / 100);
     
    //var nX = oX + oW / 2 - nW/2;
    //var nY = oY + oH / 2 - nH/2;

    $(rObj).attr("w", nW).attr("h", nH);
    //$(rObj).attr("x", nX).attr("y", nY);
    $(lObj).css("width", nW).css("height", nH);
    //$(lObj).css("left", nX).css("top", nY);
}

function SaveTemplateData() {
    var document = new Document();
    document.Name = $("#hideTemplateName").val();

    document.Author = "";
    document.Addtime = "";
    document.TemplateNumber = $("#hideTemplateNumber").val();
    document.DocumentNumber = $("#hideDocumentNumber").val();

    document.PreviewId = $("#hidePreviewId").val();
    document.TypeId = $("#hideTypeId").val();
    document.SizeId = $("#hideSizeId").val();
    document.GroupId = 1;
    document.FilePath = "";

    if ($("#isround").prop("checked"))
        document.IsRound = true;
    else
        document.IsRound = false;


    $.each($(".pageItem"), function (p, pageitem) {
        var page = new DocumentPage();
        var pageid = $(pageitem).attr("id").split('-')[2];
        page.Number = pageid;
        var back = $("#l-page-" + pageid).find(".pageBackground input").eq(0).val();
        page.Background = back.substring(back.lastIndexOf('/') - 6);
        $.each($(pageitem).find(".logoitem"), function (i, imageItem) {
            var ojb = $(imageItem).find("img");
            $.each($(ojb), function (n, v) {
                if ($(v).attr("enable") == "1") {
                    var imageObj = new ImageItem();
                    imageObj.Width = parseInt($(v).attr("w"));
                    imageObj.Height = parseInt($(v).attr("h"));
                    imageObj.Imagetype = $(v).attr("t");
                    imageObj.ImageUrl = $(v).attr("src").substring($(v).attr("src").lastIndexOf('/') - 6);
                    imageObj.Left = parseInt($(v).attr("x"));
                    imageObj.Top = parseInt($(v).attr("y"));
                    imageObj.ZIndex = parseInt($(v).attr("z"));
                    imageObj.Percent = $(v).attr("p");
                    imageObj.HAlignType = $(v).attr("ht");
                    imageObj.HAlignValue = $(v).attr("hv");
                    imageObj.VAlignType = $(v).attr("vt");
                    imageObj.VAlignValue = $(v).attr("vv");
                    page.Images.push(imageObj);
                }
            });
        });
        $.each($(pageitem).find(".textitem"), function (t, textItem) {
            var ojb = $(textItem).find("input");
            $.each($(ojb), function (n, v) {
                if ($(v).attr("enable") == "1") {
                    var textObj = new TextItem();
                    textObj.Text = $(v).val();
                    textObj.Left = parseInt($(v).attr("x"));
                    textObj.Top = parseInt($(v).attr("y"));
                    textObj.Width = parseInt($(v).attr("w"));
                    textObj.Height = parseInt($(v).attr("h"));
                    textObj.RGBColor = $(v).attr("rc");
                    textObj.CMYKColor = $(v).attr("cc");
                    textObj.FontName = $(v).attr("fn");
                    textObj.FontSize = parseInt($(v).attr("fz"));

                    var textWeightStr = $(v).attr("fw");
                    var textWeightValue = 0;
                    if (textWeightStr.toLowerCase() == "bold" || textWeightStr == "1") {
                        textWeightValue = 1;
                    }
                    var textStyleStr = $(v).attr("fs");
                    var textStyleValue = 0;
                    if (textStyleStr.toLowerCase() == "italic" || textStyleStr == "1") {
                        textStyleValue = 1;
                    }
                    textObj.Fontweight = parseInt(textWeightValue);
                    textObj.Fontstyle = parseInt(textStyleValue);

                    textObj.WordSpace = $(v).attr("s");
                    textObj.MultiLine = false;
                    textObj.Textdirection = $(v).attr("td");
                    textObj.TextTag = $(v).attr("tt");
                    textObj.ZIndex = parseInt($(v).attr("z"));
                    textObj.HAlignType = $(v).attr("ht");
                    textObj.HAlignValue = $(v).attr("hv");
                    textObj.VAlignType = $(v).attr("vt");
                    textObj.VAlignValue = $(v).attr("vv");

                    if ($(v).attr("tt") == '1' || $(v).attr("tt") == '20' || $(v).attr("tt") == '19') {
                        document.Name = $(v).val();
                    }
                    page.Texts.push(textObj);
                }
            });
        });
        document.Pages.push(page);
    });
    var data = $.toJSON(document);
    return data;
}

function SaveTemplate(isprint, action) {
    if (CheckLoginStatus() == 1) {
        var json = SaveTemplateData();
        var loading = layer.load('正在保存');
        $.ajax({
            type: "POST",
            url: "/SaveTemplate.aspx",
            datatype: "json",
            data: { data: json, action: action },
            success: function (data) {
                if (data > 0) {
                    if (isprint == 1) {
                        window.location = "/Print/Document/" + data;
                    } else if (isprint == 0) {
                        var htmlstr = "<div><div><span class='icon-succ02'></span><span style=' color: #7ABD54; font-size: 18px; font-family: \5FAE\8F6F\96C5\9ED1; font-weight: normal; margin-bottom: 15px; '>保存成功，您可以在“会员中心>>我的文件”查看！</span></div><div style='margin-top:20px;'><a href='/Print/Document/" + data + "' class='btn btn-primary' style='margin-right:10px;width:130px;'>立即印刷</a><a href='/Document/Design/" + data + "' class='btn btn-dake' style='width:130px;'>继续编辑</a><a href='/Usercenter/MyDocuments' target='_blank' style='margin-left:30px;'>查看模板</a><div></div>";
                        art.dialog({
                            content: htmlstr,
                            fixed: true,
                            lock: true
                        });
                    } else {
                        $('#mydocumentlist').load('/Document/MyDocument/' + $("#hideTypeId").val());
                    }                   
                } else {
                    art.dialog.tips("保存失败，请重试！");
                }
                layer.close(loading);
            },
            error: function () {
                layer.close(loading);
                art.dialog.tips('保存失败！');
            }
        });
    } else {
        ShowLoginBox('SaveTemplate(' + isprint + ',"' + action + '")');
    }
}

function AddPrint(id, action) {
    $.ajax({
        url: 'AjaxPage/ChangePrintList.aspx',
        type: 'POST',
        data: 'id=' + id + '&action=' + action,
        dataType: 'html',
        timeout: 60000,
        success: function (data) {
            MyPrintList();
        }
    });
}

function LoadText(page, number) {
    var lObj = $("#l-page-" + page + "-text-" + number);
    var rObj = $("#r-page-" + page + "-text-" + number);
    var pageWidth = parseInt($("#l-page-" + page).css("width"));
    var pageHeight = parseInt($("#l-page-" + page).css("htight"));

    var textValue = $(rObj).val();
    var textFamily = $(rObj).attr("fn");
    var textSize = parseInt($(rObj).attr("fz"));
    var textColor = $(rObj).attr("rc");
    var textBold = $(rObj).attr("fw");
    var textItalic = $(rObj).attr("fs");
    var textMultiline = $(rObj).attr("m");
    var textSpace = $(rObj).attr("s");

    var textHAlignType = $(rObj).attr("ht");
    var textHAlignValue = $(rObj).attr("hv");
    var textVAlignType = $(rObj).attr("vt");
    var textVAlignValue = $(rObj).attr("vv");
    var textWidth = $(rObj).attr("w");
    var textHeight = $(rObj).attr("h");
    var textLeft = $(rObj).attr("x");
    var textTop = $(rObj).attr("y");

    var imgsrc = GetImg(textValue, textFamily, textSize, textColor, textBold, textItalic);
    var image = new Image();
    image.src = imgsrc;
    $(lObj).attr("src", imgsrc);
}

function GetText(page, number) {
    var lObj = $("#l-page-" + page + "-text-" + number);
    var rObj = $("#r-page-" + page + "-text-" + number);

    var textValue = $(rObj).val();
    var textFamily = $(rObj).attr("fn");
    var textSize = parseInt($(rObj).attr("fz"));
    var textColor = $(rObj).attr("rc");
    var textBold = $(rObj).attr("fw");
    var textItalic = $(rObj).attr("fs");
    var textMultiline = $(rObj).attr("m");
    var textSpace = $(rObj).attr("s");

    var textHAlignType = $(rObj).attr("ht");
    var textHAlignValue = $(rObj).attr("hv");
    var textVAlignType = $(rObj).attr("vt");
    var textVAlignValue = $(rObj).attr("vv");

    var imgsrc = GetImg(textValue, textFamily, textSize, textColor, textBold, textItalic);
    var image = new Image();
    image.src = imgsrc;

    var pageWidth = parseInt($("#l-page-" + page).css("width"));
    var pageHeight = parseInt($("#l-page-" + page).css("htight"));

    var oX = parseInt($(rObj).attr("x"));
    var oY = parseInt($(rObj).attr("y"));
    var oWidth = parseInt($(rObj).attr("w"));
    var oHeight = parseInt($(rObj).attr("h"));

    var nX = oX;
    var nY = oY;
    var nWidth = oWidth;
    var nHeight = oHeight;

    if (version < 11) {
        //ie浏览器
        image.onreadystatechange = function () {
            if (image.readyState == "complete") {
                nWidth = image.width;
                nHeight = image.height;

                if (textHAlignType == "self") {
                    if (textHAlignValue == "left")//左对齐，文字往右走
                    {
                        nX = oX;
                        nY = oY;
                    }
                    else if (textHAlignValue == "center")//居中对齐，文字往两边走
                    {
                        nX = oX + oWidth / 2 - nWidth / 2;
                        nY = oY;
                    }
                    else//右对齐，文字往左走
                    {
                        nX = oX + oWidth - nWidth;
                        nY = oY;
                    }
                }
                else if (textHAlignType == "page") {
                    if (textHAlignValue == "left")//左对齐，文字往右走
                    {
                        nX = oX;
                        nY = oY;
                    }
                    else if (textHAlignValue == "center")//居中对齐，文字往两边走
                    {
                        nX = pageWidth / 2 - nWidth / 2;
                        nY = oY;
                    }
                    else//右对齐，文字往左走
                    {
                        nX = oX + oWidth - nWidth;
                        nY = oY;
                    }
                }
                $(lObj).css('left', nX + 'px').css("top", nY + "px");
                $(rObj).attr("x", nX).attr('y', nY).attr("w", nWidth).attr("h", nHeight);
            }
        }
    }
    else {
        //非ie浏览器
        image.onload = function () {
            if (image.complete == true) {
                nWidth = image.width;
                nHeight = image.height;

                if (textHAlignType == "self") {
                    if (textHAlignValue == "left")//左对齐，文字往右走
                    {
                        nX = oX;
                        nY = oY;
                    }
                    else if (textHAlignValue == "center")//居中对齐，文字往两边走
                    {
                        nX = oX + oWidth / 2 - nWidth / 2;
                        nY = oY;
                    }
                    else//右对齐，文字往左走
                    {
                        nX = oX + oWidth - nWidth;
                        nY = oY;
                    }
                }
                else if (textHAlignType == "page")
                {
                    if (textHAlignValue == "left")//左对齐，文字往右走
                    {
                        nX = oX;
                        nY = oY;
                    }
                    else if (textHAlignValue == "center")//居中对齐，文字往两边走
                    {
                        nX = pageWidth / 2 - nWidth / 2;
                        nY = oY;
                    }
                    else//右对齐，文字往左走
                    {
                        nX = oX + oWidth - nWidth;
                        nY = oY;
                    }
                }
                $(lObj).css('left', nX + 'px').css("top", nY + "px");
                $(rObj).attr("x", nX).attr('y', nY).attr("w", nWidth).attr("h", nHeight);
            }
        }
    }
    $(lObj).attr("src", imgsrc);
}

function AddNewText() {
    maxItem++;
    maxIndex++;
    var inputstr = "<li class=\"textitem\" id=\"r-page-" + nowPage + "-li-" + maxItem + "\">" +
		"<input type=\"text\" class=\"inputtext\" value=\"这里输入文字\" x=\"10\" y=\"10\" w=\"182\" h=\"35\" rc=\"rgb(0, 0, 0)\" " +
		"cc=\"0-0-0-100\" s=\"0\" fn=\"黑体\" fz=\"14\" fw=\"0\" fs=\"0\"" +
		"m=\"False\" td=\"1\" tt=\"8\" z=\"" + maxIndex + "\" ht=\"0\" hv=\"0\" vt=\"0\" vv=\"0\"" +
		"id=\"r-page-" + nowPage + "-text-" + maxItem + "\" enable=\"1\" onblur=\"GetText(" + nowPage + "," + maxItem + ");\" onfocus=\"SetFontStyle(" + nowPage + "," + maxItem + ");\" onkeyup=\"GetText(" + nowPage + "," + maxItem + ")\">" +
		"<a href=\"javascript:;\" class=\"hidelogo\" title=\"删除\" id=\"hide-" + nowPage + "-text-" + maxItem + "\" onclick=\"DeleteItem(" + nowPage + ",'text'," + maxItem + ");\"></a>" +
		"</li>";
    $("#r-page-" + nowPage + " .textItems ul").append(inputstr);
    var imgsrc = GetImg("这里输入文字", "黑体", 14, "rgb(0, 0, 0)", "0", "0");
    //
    var imgitem = "<img " +
		" src=\"" + imgsrc + "\" " +
		" id=\"l-page-" + nowPage + "-text-" + maxItem + "\"" +
		" class=\"preimg txt ui-draggable\"" +
		" style=\"left:10px;top:10px;z-index:" + maxIndex + ";\"" +
		" />";
    $("#l-page-" + nowPage + " .pageContent").append(imgitem);
    EventBind();
    maxItem = maxItem + 1;
}

function GetImg(textValue, textFamily, textSize, textColor, textBold, textItalic) {
    var imgsrc = "/GetText.aspx?Text=" + encodeURIComponent(textValue) + "&FontName=" + encodeURIComponent(textFamily) + "&FontSize=" + textSize + "&RGBColor=" + encodeURIComponent(textColor) + "&Fontweight=" + textBold + "&Fontstyle=" + textItalic;
    return imgsrc;
}

function SetFontStyle(page, index) {
    var textobj = $("#r-page-" + page + '-text-' + index);
    var selectItem = $("#r-page-" + page + '-li-' + index);
    $(selectItem).append($('#SetFontStyleTool'));
    $('#SetFontStyleTool').show();
    $('#ddlFontList').val($(textobj).attr('fn'));
    $('#FontSizeList').val($(textobj).attr('fz'));

    if ($(textobj).attr('fw') == "1" || $(textobj).attr('fw').toLowerCase() == "bold") {
        $("#IsBold").next().addClass("ui-state-active");
        $("#IsBold").next().attr("aria-pressed", true);
        $("#IsBold").prop("checked", true);
    } else {
        $("#IsBold").next().removeClass("ui-state-active");
        $("#IsBold").next().attr("aria-pressed", false);
        $("#IsBold").prop("checked", false);
    }
    if ($(textobj).attr('fs') == "1" || $(textobj).attr('fs').toLowerCase() == "italic") {
        $("#IsItalic").next().addClass("ui-state-active");
        $("#IsItalic").next().attr("aria-pressed", true);
        $("#IsItalic").prop("checked", true);
    } else {
        $("#IsItalic").next().removeClass("ui-state-active");
        $("#IsItalic").next().attr("aria-pressed", false);
        $("#IsItalic").prop("checked", false);
    }

    $("#ColorPickerBox").css("background-color", $(textobj).attr('rc'));
    $(selectItem).parent().find('li').removeClass("textitemFocus");
    $(selectItem).addClass("textitemFocus");
    var lid = "l" + textobj.attr("id").substring(1);
    $(".preimg").removeClass("ui-selected");
    $(".inputtext").removeClass("selectedtext");
    $("#" + lid).addClass("ui-selected");
    //$(textobj)[0].focus();
}

function ChangeFontStyle() {
    var obj = $("#FontSizeList").parent().parent().find('input');
    if ($("#ddlFontList").val() != "") {
        $(obj).attr('fn', $("#ddlFontList").val());
    }
    if ($("#FontSizeList").val() != "") {
        $(obj).attr('fz', $("#FontSizeList").val());
    }
    if ($("#IsBold").prop("checked"))
        $(obj).attr('fw', 1);
    else
        $(obj).attr('fw', 0);
    if ($("#IsItalic").prop("checked"))
        $(obj).attr('fs', 1);
    else
        $(obj).attr('fs', 0);
    var id = $(obj).attr("id");
    var pageid = id.split('-')[2];
    var itemid = id.split('-')[4];
    GetText(pageid, itemid);
}

function SetFontColor() {
    var obj = $("#ColorPickerBox").parent().parent().find('input');
    $(obj).attr("rc", currentColor);
    $(obj).attr("cc", currentColorCMYK);
    $("#ColorPickerBox").css("background-color", currentColor);
    var id = $(obj).attr("id");
    var pageid = id.split('-')[2];
    var itemid = id.split('-')[4];
    GetText(pageid, itemid);
}

function SaveGroupName() {
    var groupName = encodeURIComponent($("#txtGroupName").val());
    var productId = $("#hideTypeId").val();
    var isDefault = 0;
    $.ajax({
        type: "POST",
        url: "AjaxPage/AddGroup.ashx",
        datatype: "json",
        data: "GroupName=" + groupName + "&ProductId=" + productId + "&IsDefault=" + isDefault,
        success: function (data) {
            var group = $.evalJSON(data);
            var optionstr = "<option value=" + group.Id + ">" + group.Name + "</option>";
            $("#ddlDocumentGroupList").append(optionstr);
            $("#ddlDocumentGroupList").val(group.Id);
            $("#newdocumentgroupinfo").hide();
        },
        error: function () {
            alert("保存失败");
        }
    });
}

function GetMyDocuments() {
    $('#mydocumentlist').load('/Design/MyDocumentList');
}

function AddNewGroup() {
    $("#newdocumentgroupinfo").show();
}

function ShowTemplateContent() {
    $("#TemplateContentTitle").removeClass("hover");
    $("#MyDocumentTitle").removeClass("hover");
    $("#TemplateContentTitle").addClass("hover");
    $("#TemplateContent").show();
    $("#MyDocumentList").hide();
    $(this).addClass("current");
}

function ShowMyDocumentList() {
    $("#TemplateContentTitle").removeClass("hover");
    $("#MyDocumentTitle").removeClass("hover");
    $("#MyDocumentTitle").addClass("hover");
    $("#MyDocumentList").show();
    $("#TemplateContent").hide();
    $(this).addClass("current");
}

function ShowContent(id) {
    $(".contenttitle").removeClass("current");
    $("#title" + id).addClass("current");
    $(".goods-desc-con").hide();
    $("#content" + id).show();
}

function showGuide(step) {
    var showObj = null;
    var mask = document.getElementById("divMask");
    var _html = "";
    $("#divMaskGuide").show();
    $("#pagePreview").removeClass("zindex1000");
    $("#editorTools").removeClass("zindex1000");
    $("#baseEditorPanels").removeClass("zindex1000");
    $("#editorBottum").removeClass("zindex1000");

    switch (step) {
        case 1:
            _html += "<img id=\"imgeMask\" src=\"/Areas/Shop/Themes/XiaoMi/Content/images/tip2.png\" border=\"0\" usemap=\"#MapMask\"/>";
            _html += "        <map name=\"MapMask\" id=\"MapMask\">";
            _html += "          <area shape=\"rect\" coords=\"77,199,177,232\" href=\"javascript:void(0)\" onclick=\"showGuide(2)\" />";
            _html += "        </map>";
            $("#baseEditorPanels").addClass("zindex1000");
            mask.className = "tipsb";
            break;
        case 2:
            _html += "<img id=\"imgeMask\" src=\"/Areas/Shop/Themes/XiaoMi/Content/images/tip1.png\" border=\"0\" usemap=\"#MapMask\"/>";
            _html += "        <map name=\"MapMask\" id=\"MapMask\">";
            _html += "          <area shape=\"rect\" coords=\"117,222,220,258\" href=\"javascript:void(0)\" onclick=\"showGuide(3)\" />";
            _html += "        </map>";
            $("#pagePreview").addClass("zindex1000");
            mask.className = "tipsa";
            break;
        case 3:
            _html += "<img id=\"imgeMask\" src=\"/Areas/Shop/Themes/XiaoMi/Content/images/tip3.png\" border=\"0\" usemap=\"#MapMask\"/>";
            _html += "        <map name=\"MapMask\" id=\"MapMask\">";
            _html += "          <area shape=\"rect\" coords=\"73,227,176,260\" href=\"javascript:void(0)\" onclick=\"hideGuide()\" />";
            _html += "        </map>";
            mask.className = "tipsc";
            $("#editorBottum").addClass("zindex1000");
            break;
    }
    mask.innerHTML = _html;
}

function hideGuide() {
    $("#divMaskGuide").hide();
    $("#pagePreview").removeClass("zindex1000");
    $("#editorTools").removeClass("zindex1000");
    $("#baseEditorPanels").removeClass("zindex1000");
    $("#editorBottum").removeClass("zindex1000");
    SetCookie("V5printDesignGuideCookie", 1);
}

/////*
////设置字体的对齐方向
////*/
var SetAlignLeft = function () {
    $.each(SelectedItems, function (n, value) {
        $(value).css("text-align", "left");
        $(value).attr("haligntype", "self");
        $(value).attr("halignvalue", "left");
    });
}
var SetAlignRight = function () {
    $.each(SelectedItems, function (n, value) {
        $(value).css("text-align", "right");
        $(value).attr("haligntype", "self");
        $(value).attr("halignvalue", "right");
    });
}
var SetAlignCenter = function () {
    $.each(SelectedItems, function (n, value) {
        $(value).css("text-align", "center");
        $(value).attr("haligntype", "self");
        $(value).attr("halignvalue", "center");
    });
}
/////*
////设定两个及以上各元素的对齐方式
////*/
var HoriLeft = function () {
    var minLeft = 1000;
    $.each(SelectedItems, function (n, value) {
        var meLeft = parseInt($(value).css("left"));
        if (meLeft < minLeft)
            minLeft = meLeft;
    });
    $.each(SelectedItems, function (n, value) {
        $(value).css("left", minLeft).css("text-align", "left");
        var rightItemId = "#r" + $(value).attr("id").substring(1);
        $(rightItemId).attr("ht", "0");
        $(rightItemId).attr("hv", "0");
        $(rightItemId).attr("x", minLeft);
    });
}

var HoriRight = function () {
    var maxRight = 0;
    $.each(SelectedItems, function (n, value) {
        var meLeft = parseInt($(value).css("left"));
        var meWidth = parseInt($(value).css("width"));
        var meOffsetWidth = parseInt($(value).get(0).offsetWidth);
        var oWidth = 0;
        if ($(value).css("width").toUpperCase() != "AUTO")
            oWidth = meWidth;
        else
            oWidth = meOffsetWidth;
        if (meLeft + oWidth > maxRight)
            maxRight = meLeft + oWidth;
    });
    $.each(SelectedItems, function (n, value) {
        var meWidth = parseInt($(value).css("width"));
        var meOffsetWidth = parseInt($(value).get(0).offsetWidth);
        var oWidth = 0;
        if ($(value).css("width") && $(value).css("width").toUpperCase() != "AUTO") {
            oWidth = meWidth;
        } else {
            oWidth = meOffsetWidth;
        }
        $(value).css("left", maxRight - oWidth).css("text-align", "right");

        var rightItemId = "#r" + $(value).attr("id").substring(1);
        $(rightItemId).attr("ht", "0");
        $(rightItemId).attr("hv", "2");
        $(rightItemId).attr("x", maxRight - oWidth);
    });
}

var VertTop = function () {
    var minTop = 1000;
    $.each(SelectedItems, function (n, value) {
        var meTop = parseInt($(value).css("top"));
        if (meTop < minTop)
            minTop = meTop;
    });
    $.each(SelectedItems, function (n, value) {
        $(value).css("top", minTop);

        var rightItemId = "#r" + $(value).attr("id").substring(1);
        $(rightItemId).attr("vt", "0");
        $(rightItemId).attr("vv", "1");
        $(rightItemId).attr("y", minTop);
    });
}

var VertBottom = function () {
    var maxBottom = 0;
    $.each(SelectedItems, function (n, value) {
        var meTop = parseInt($(value).css("top"));
        var oHeight = 0;
        if ($(value).css("height") && $(value).css("height").toUpperCase() != "AUTO") {
            oHeight = parseInt($(value).css("height"));
        } else {
            oHeight = parseInt($(value).get(0).offsetHeight);
        }
        if (meTop + oHeight > maxBottom)
            maxBottom = meTop + oHeight;
    });
    $.each(SelectedItems, function (n, value) {
        var meTop = parseInt($(value).css("top"));
        var oHeight = 0;
        if ($(value).css("height") && $(value).css("height").toUpperCase() != "AUTO") {
            oHeight = parseInt($(value).css("height"));
        } else {
            oHeight = parseInt($(value).get(0).offsetHeight);
        }
        $(value).css("top", maxBottom - oHeight);

        var rightItemId = "#r" + $(value).attr("id").substring(1);
        $(rightItemId).attr("vt", "0");
        $(rightItemId).attr("vv", "1");
        $(rightItemId).attr("y", maxBottom - oHeight);
    });
}

var HoriCenter = function () {
    var minTop = 1000;
    var maxBottom = 0;

    $.each(SelectedItems, function (n, value) {
        var meTop = parseInt($(value).css("top"));
        var meLeft = parseInt($(value).css("left"));
        var meWidth = parseInt($(value).css("width"));
        var meHeight = parseInt($(value).css("height"));
        var meOffsetWidth = parseInt($(value).get(0).offsetWidth);
        var meOffsetHeight = parseInt($(value).get(0).offsetHeight);

        var oHeight = 0;
        if ($(value).css("height") && $(value).css("height").toUpperCase() != "AUTO")
            oHeight = meHeight;
        else
            oHeight = meOffsetHeight;
        if (meTop < minTop)
            minTop = meTop;
        if (meTop + oHeight > maxBottom)
            maxBottom = meTop + oHeight;
    });

    var centerValue = (maxBottom + minTop) / 2;
    $.each(SelectedItems, function (n, value) {
        var meTop = parseInt($(value).css("top"));
        var meLeft = parseInt($(value).css("left"));
        var meWidth = parseInt($(value).css("width"));
        var meHeight = parseInt($(value).css("height"));
        var meOffsetWidth = parseInt($(value).get(0).offsetWidth);
        var meOffsetHeight = parseInt($(value).get(0).offsetHeight);

        var oHeight = 0;
        if ($(value).css("height") && $(value).css("height").toUpperCase() != "AUTO")
            oHeight = meHeight;
        else
            oHeight = meOffsetHeight;
        $(value).css("top", centerValue - parseInt(oHeight / 2));


        var rightItemId = "#r" + $(value).attr("id").substring(1);
        $(rightItemId).attr("ht", "0");
        $(rightItemId).attr("hv", "1");
        $(rightItemId).attr("y", centerValue - parseInt(oHeight / 2));
    });
}

var VertMiddle = function () {
    var minLeft = 1000;
    var maxRight = 0;

    $.each(SelectedItems, function (n, value) {
        var meTop = parseInt($(value).css("top"));
        var meLeft = parseInt($(value).css("left"));
        var meWidth = parseInt($(value).css("width"));
        var meHeight = parseInt($(value).css("height"));
        var meOffsetWidth = parseInt($(value).get(0).offsetWidth);
        var meOffsetHeight = parseInt($(value).get(0).offsetHeight);

        if ($(value).css("width") && $(value).css("width").toUpperCase() != "AUTO") {
            oWidth = meWidth;
        } else {
            oWidth = meOffsetWidth;
        }

        if (meLeft < minLeft)
            minLeft = meLeft;
        if (meLeft + oWidth > maxRight)
            maxRight = meLeft + oWidth
    });

    var centerValue = (maxRight + minLeft) / 2;
    $.each(SelectedItems, function (n, value) {
        var meWidth = parseInt($(value).css("width"));
        var meOffsetWidth = parseInt($(value).get(0).offsetWidth);
        var oWidth = 0;
        if ($(value).css("width") && $(value).css("width").toUpperCase() != "AUTO")
            oWidth = meWidth;
        else
            oWidth = meOffsetWidth;
        $(value).css("left", centerValue - parseInt(oWidth / 2));
        $(value).css("text-align", "center");

        var rightItemId = "#r" + $(value).attr("id").substring(1);
        $(rightItemId).attr("vt", "0");
        $(rightItemId).attr("vv", "1");
        $(rightItemId).attr("x", centerValue - parseInt(oWidth / 2));
    });
}
/////*
////设置3个及以上元素的分布方式
////*/
var HoriAverage = function () {
    var index = 0;
    var maxRight = 0;
    var minLeft = 1000;
    var addWidth = 0;
    var leftArr = $([]);
    if (SelectedItems.length > 2) {
        $.each(SelectedItems, function (n, value) {
            var meTop = parseInt($(value).css("top"));
            var meLeft = parseInt($(value).css("left"));
            var meWidth = parseInt($(value).css("width"));
            var meHeight = parseInt($(value).css("height"));
            var meOffsetWidth = parseInt($(value).get(0).offsetWidth);
            var meOffsetHeight = parseInt($(value).get(0).offsetHeight);

            var oWidth = 0;

            if ($(value).css("width") && $(value).css("width").toUpperCase() != "AUTO") {
                oWidth = meWidth;
            } else {
                oWidth = meOffsetWidth;
            }

            if (meLeft < minLeft)
                minLeft = meLeft;
            if (meLeft + oWidth > maxRight)
                maxRight = meLeft + oWidth;
            addWidth += oWidth;
            leftArr.push($(value));
            index++;
        });

        this.OrderByLeft(leftArr);
        var totalSpace = maxRight - minLeft - addWidth;
        if (totalSpace >= 0 && leftArr.length >= 2) {
            var perSpace = parseInt(totalSpace / (leftArr.length - 1));
            var currentLeft = parseInt($(leftArr[0]).css("left"));
            $.each(leftArr, function (n, value) {
                var meWidth = 0;
                if ($(value).css("width") && $(value).css("width").toUpperCase() != "AUTO") {
                    meWidth = parseInt($(value).css("width"));
                } else {
                    meWidth = parseInt($(value).get(0).offsetWidth);
                }
                $(value).css("left", currentLeft);
                var rightItemId = "#r" + $(value).attr("id").substring(1);
                $(rightItemId).attr("x", currentLeft);
                currentLeft += meWidth + perSpace;
            });
        }
    } else {
        alert("排列请至少选择3个对象");
    }
}
/*
竖直方向平均分布
*/
var VertAverage = function () {
    var index = 0;
    var maxBottom = 0;
    var minTop = 1000;
    var addHeight = 0;
    var topArr = [];
    if (SelectedItems.length > 2) {
        $.each(SelectedItems, function (n, value) {
            var meTop = parseInt($(value).css("top"));
            var meLeft = parseInt($(value).css("left"));
            var meWidth = parseInt($(value).css("width"));
            var meHeight = parseInt($(value).css("height"));
            var meOffsetWidth = parseInt($(value).get(0).offsetWidth);
            var meOffsetHeight = parseInt($(value).get(0).offsetHeight);
            var oHeight = 0;
            if ($(value).css("height") && $(value).css("height").toUpperCase() != "AUTO") {
                oHeight = meHeight;
            } else {
                oHeight = meOffsetHeight;
            }
            if (meTop < minTop)
                minTop = meTop;
            if (meTop + oHeight > maxBottom)
                maxBottom = meTop + oHeight;
            addHeight += oHeight;
            topArr[index] = $(value);
            index++;
        });

        this.OrderByTop(topArr);
        var totalSpace = maxBottom - minTop - addHeight;
        if (totalSpace >= 0 && topArr.length >= 2) {
            var perSpace = parseInt(totalSpace / (topArr.length - 1));
            var currentTop = parseInt($(topArr[0]).css("top"));
            $.each(topArr, function (n, value) {
                var meHeight = 0;
                if ($(value).css("height") && $(value).css("height").toUpperCase() != "AUTO") {
                    meHeight = parseInt($(value).css("height"));
                } else {
                    meHeight = parseInt($(value).get(0).offsetHeight);
                }
                $(value).css("top", currentTop);
                var rightItemId = "#r" + $(value).attr("id").substring(1);
                $(rightItemId).attr("y", currentTop);

                currentTop += meHeight + perSpace;
            });
        }
    } else {
        alert("排列请至少选择3个对象");
    }
}
//////对齐方式辅助处理
var OrderByLeft = function (leftArr) {
    for (var i = 0; i < leftArr.length - 1; i++) {
        for (var j = 0; j < leftArr.length - 1; j++) {
            var left1 = parseInt($(leftArr[j]).css("left"));
            var left2 = parseInt($(leftArr[j + 1]).css("left"));
            if (left1 > left2) {
                this.Swap(j, j + 1, leftArr);
            }
        }
    }
}
var OrderByTop = function (topArr) {
    for (var i = 0; i < topArr.length - 1; i++) {
        for (var j = 0; j < topArr.length - 1; j++) {
            var top1 = parseInt($(topArr[j]).css("top"));
            var top2 = parseInt($(topArr[j + 1]).css("top"));
            if (top1 > top2) {
                this.Swap(j, j + 1, topArr);
            }
        }
    }

}
var Swap = function (index1, index2, objArr) {
    var tempobj = objArr[index1];
    objArr[index1] = objArr[index2];
    objArr[index2] = tempobj;
}
/////*
////元素相对于页面的对齐方式
////*/
var ToPageLeft = function () {
    $.each(SelectedItems, function (n, value) {
        $(value).css("left", 0);
        $(value).css("text-align", "left");
        $(value).attr("haligntype", "page");
        $(value).attr("halignvalue", "left");
    });
}
var ToPageTop = function () {
    $.each(SelectedItems, function (n, value) {
        $(value).css("top", 0);
        $(value).attr("valigntype", "page");
        $(value).attr("valignvalue", "top");
    });
}
var ToPageRight = function () {
    var pageWidth = parseInt($(".TemplatePageContent").css("width"));
    $.each(SelectedItems, function (n, value) {
        var meWidth = parseInt($(value).css("width"));
        $(value).css("left", pageWidth - meWidth);
        $(value).css("text-align", "right");
        $(value).attr("haligntype", "page");
        $(value).attr("halignvalue", "right");
    });
}
var ToPageBottom = function () {
    var pageHeight = parseInt($(".TemplatePageContent").css("height"));
    $.each(SelectedItems, function (n, value) {
        var meHeight = parseInt($(value).css("height"));
        $(value).css("top", pageHeight - meHeight);
        $(value).attr("valigntype", "page");
        $(value).attr("valignvalue", "bottom");
    });
}
var ToPageCenter = function () {
    var pageWidth = parseInt($(".TemplatePageContent").css("width"));

    $.each(SelectedItems, function (n, value) {
        var meWidth = parseInt($(value).css("width"));
        $(value).css("left", (pageWidth - meWidth) / 2);
        $(value).css("text-align", "center");
        $(value).attr("haligntype", "page");
        $(value).attr("halignvalue", "center");
    });
}
var ToPageMiddle = function () {
    var pageHeight = parseInt($(".TemplatePageContent").css("height"));

    $.each(SelectedItems, function (n, value) {
        var meHeight = parseInt($(value).css("height"));
        $(value).css("top", (pageHeight - meHeight) / 2);
        $(value).attr("valigntype", "page");
        $(value).attr("valignvalue", "middle");
    });
}

function clearEventBubble(evt) {
    var Event = evt || event;
    if (Event.stopPropagation) evt.stopPropagation();
    else window.Event.cancelBubble = true;
    if (Event.preventDefault) evt.preventDefault();
    else window.Event.returnValue = false;
    return false;
}

/////*
////颜色选择器
////*/
var currentColor = "#8B0016";
var currentColorCMYK = "0-100-100-45";
var hexch = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F');

var table1 = ['0-100-100-45#8B0016', '0-100-100-25#B2001F', '0-100-100-15#C50023', '0-100-100-0#DF0029', '0-85-70-0#E54646', '0-65-50-0#EE7C6B', '0-45-30-0#F5A89A', '0-20-10-0#FCDAD5'];

var table2 = ['0-90-80-45#8E1E20', '0-90-80-25#B6292B', '0-90-80-15#C82E31', '0-90-80-0#E33539', '0-70-65-0#EB7153', '0-55-50-0#F19373', '0-40-35-0#F6B297', '0-20-20-0#FCD9C4'];

var table3 = ['0-60-100-45#945305', '0-60-100-25#BD6B09', '0-60-100-15#D0770B', '0-60-100-0#EC870E', '0-50-80-0#F09C42', '0-40-60-0#F5B16D', '0-25-40-0#FACE9C', '0-15-20-0#FDE2CA'];

var table4 = ['0-40-100-45#976D00', '0-40-100-25#C18C00', '0-40-100-15#D59B00', '0-40-100-0#F1AF00', '0-30-80-0#F3C246', '0-25-60-0#F9CC76', '0-15-40-0#FCE0A6', '0-10-20-0#FEEBD0'];

var table5 = ['0-0-100-45#9C9900', '0-0-100-25#C7C300', '0-0-100-15#DCD800', '0-0-100-0#F9F400', '0-0-80-0#FCF54C', '0-0-60-0#FEF889', '0-0-40-0#FFFAB3', '0-0-25-0#FFFBD1'];

var table6 = ['60-0-100-45#367517', '60-0-100-25#489620', '60-0-100-15#50A625', '60-0-100-0#5BBD2B', '50-0-80-0#83C75D', '30-0-60-0#AFD788', '25-0-40-0#C8E2B1', '12-0-20-0#E6F1D8'];

var table7 = ['100-0-90-45#006241', '100-0-90-25#007F54', '100-0-90-15#008C5E', '100-0-90-0#00A06B', '80-0-75-0#00AE72', '60-0-55-0#67BF7F', '45-0-35-0#98D0B9', '25-0-20-0#C9E4D6'];

var table8 = ['100-0-40-45#00676B', '100-0-40-25#008489', '100-0-40-15#009298', '100-0-40-0#00A6AD', '80-0-30-0#00B2BF', '60-0-25-0#6EC3C9', '45-0-20-0#99D1D3', '25-0-10-0#CAE5E8'];

var table9 = ['100-60-0-45#103667', '100-60-0-25#184785', '100-60-0-15#1B4F93', '100-60-0-0#205AA7', '85-50-0-0#426EB4', '65-40-0-0#7388C1', '50-25-0-0#94AAD6', '30-15-0-0#BFCAE6'];

var table10 = ['100-90-0-45#211551', '100-90-0-25#2D1E69', '100-90-0-15#322275', '100-90-0-0#3A2885', '85-80-0-0#511F90', '75-65-0-0#635BA2', '60-55-0-0#8273B0', '45-40-0-0#A095C4'];

var table11 = ['80-100-0-45#38044B', '80-100-0-25#490761', '80-100-0-15#52096C', '80-100-0-0#5D0C7B', '65-85-0-0#79378B', '55-65-0-0#8C63A4', '40-50-0-0#AA87B8', '25-30-0-0#C9B5D4'];

var table12 = ['40-100-0-45#64004B', '40-100-0-25#780062', '40-100-0-15#8F006D', '40-100-0-0#A2007C', '35-80-0-0#AF4A92', '25-60-0-0#C57CAC', '20-40-0-0#D2A6C7', '10-20-0-0#E8D3E3'];

var table13 = ['0-0-0-100#000000', '0-0-0-65#707070', '0-0-0-55#898989', '0-0-0-45#A0A0A0', '0-0-0-35#B7B7B7', '0-0-0-30#C2C2C2', '0-0-0-20#D7D7D7', '0-0-0-0#FFFFFF'];

function LoadColorPicker() {
    art.dialog({
        title: '颜色选择',
        content: document.getElementById("morecolor"),
        lock: true,
        ok: function () {
            SetFontColor();
        },
        okVal: "确定",
        cancelVal: '关闭',
        cancel: true

    });

    var color = $("#color");
    for (var i = 1; i <= 13; i++) {
        var obj = eval("table" + i);
        for (var j = 0; j < obj.length; j++) {
            var colorarr = obj[j];
            var strcmyk = colorarr.split("#")[0];
            var arrcmyk = strcmyk.split("-");
            if (arrcmyk.length != 4) {
                alert("error");
                break;
            }
            var c = arrcmyk[0];
            var m = arrcmyk[1];
            var y = arrcmyk[2];
            var k = arrcmyk[3];
            var rgb = "#" + colorarr.split("#")[1];

            var div = document.createElement("DIV");

            div.style.backgroundColor = rgb;
            div.style.float = "left";
            div.style.width = div.style.height = "20px";
            div.style.left = (i - 1) * 20 + "px";
            div.style.top = j * 20 + "px";
            div.style.position = "absolute";
            div.setAttribute("rgb", rgb);
            div.setAttribute("cmyk", strcmyk);

            div.onmousemove = SetColor;
            div.onmousedown = SetCurrentColor;
            color.append(div);
        }
    }
}

function SetColor() {
    var cmykvalue = $(this).attr("cmyk");
    var rgbvalue = $(this).attr("rgb");
    $("#rgbValue").val(rgbvalue);
    $("#showcolor").css("background", rgbvalue);
    var cmyk = cmykvalue.split('-');
    $("#cvalue").val(cmyk[0]);
    $("#mvalue").val(cmyk[1]);
    $("#yvalue").val(cmyk[2]);
    $("#kvalue").val(cmyk[3]);
}

function ShowCurrentColor() {
    $("#showcolor").css("background", currentColor);
    $("#rgbValue").val(currentColor);

    var cmyk = currentColorCMYK.split("-");
    $("#cvalue").val(cmyk[0]);
    $("#mvalue").val(cmyk[1]);
    $("#yvalue").val(cmyk[2]);
    $("#kvalue").val(cmyk[3]);
}

function SetCurrentColor() {
    currentColor = $(this).attr("rgb");
    currentColorCMYK = $(this).attr("cmyk");
    var cmyk = currentColorCMYK.split("-");
    $("#cvalue").val(cmyk[0]);
    $("#mvalue").val(cmyk[1]);
    $("#yvalue").val(cmyk[2]);
    $("#kvalue").val(cmyk[3]);
}

function cmykToRgb(c, m, y, k) {

    var rkfs = Math.round((1 - Math.min(1, (c / 100.0) * (1 - k / 100.0) + k / 100.0)) * 255);
    var gkfs = Math.round((1 - Math.min(1, (m / 100.0) * (1 - k / 100.0) + k / 100.0)) * 255);
    var bkfs = Math.round((1 - Math.min(1, (y / 100.0) * (1 - k / 100.0) + k / 100.0)) * 255);
    var value = "#" + ToHex(rkfs) + "" + ToHex(gkfs) + "" + ToHex(bkfs);

    return value;
}

function ToHex(n) {
    var h, l;

    n = Math.round(n);
    l = n % 16;
    h = Math.floor((n / 16)) % 16;
    return (hexch[h] + hexch[l]);
}

function verify(oldValue) {
    var value;
    var pattern = /^\d{1,3}$/;
    if (pattern.test(oldValue)) {
        var v = parseInt(oldValue);
        if (v > 100) {
            value = 100;
        } else {
            value = v;
        }
    }
    if (!value) value = 0;
    return value;
}

function SetCmykToRgb() {
    var c = verify(document.getElementById("cvalue").value);
    var m = verify(document.getElementById("mvalue").value);
    var y = verify(document.getElementById("yvalue").value);
    var k = verify(document.getElementById("kvalue").value);
    var rgbValue = cmykToRgb(c, m, y, k);
    document.getElementById("showcolor").style.backgroundColor = rgbValue;
    document.getElementById("rgbValue").value = rgbValue;
    currentColor = rgbValue;
    currentColorCMYK = c + "-" + m + "-" + y + "-" + k;
    window.status = currentColor + " " + currentColorCMYK;
}