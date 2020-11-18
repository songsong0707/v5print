var BASE_URL = '/';
/*加载全局JS*/
jQuery.getScript(BASE_URL + "js/json2.js");
jQuery.getScript(BASE_URL + "js/placeholder.js");
jQuery.getScript(BASE_URL + "js/artdialog/artDialog.js");
jQuery.getScript(BASE_URL + "js/mask/mask.js");
jQuery.getScript(BASE_URL + "js/jquery.cookie.js");

$(function(){
	$("<link>").attr({ rel: "stylesheet",type: "text/css",href: BASE_URL + "js/artdialog/skins/default.css"}).appendTo("head");
	
	/*全局页头下拉*/
	$(".vipBox").mouseenter(function(){
		$(".vipFold").show();
		$(".vip").addClass("on");
	});
	$(".vipBox").mouseleave(function(){
		$(".vipFold").hide();
		$(".vip").removeClass("on");
	});
	
	/*回到顶部开始*/
    $(".j-gotop").click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 600);
        return false;
    });
	/*回到顶部结束*/
   
	/*弹出反馈窗口开始*/
    $('.j-popup-trigger2').on('click', function(event){
  	    event.preventDefault();
	    $(this).siblings('.j-popup2').addClass('is-visible');
        
        //ajax 请求是否需要填写验证码
        if($.cookie('cym_ajaxGuest')){
            $.getJSON('/main/getVerification.html',{name:'suggest', method:true, type:'get'},function(data){
                if(data.status == 'y'){
                    $(".j-code-suggest").eq(1).html("");
                    $(".j-popup-container").css("height","450px");
                    $(".j-code-suggest").show().eq(1).append('<input type="text" name="code" class="ipt j-captchaInput" placeholder="验证码" datatype="s4-4" nullmsg="请输入验证码" errormsg="验证码应为4位字符" ajaxurl="/user/check/type/code.html"  style="width:80px;"/>&nbsp;<a href="javascript:;" onclick="this.childNodes[0].src=\'/user/captcha/size/20/width/65/height/36.html?\'+Math.random()*1000;return false;" class="j-captchaCode f-mt15"><img src="/user/captcha/size/20/width/65/height/36.html?'+Math.random()*1000+'" /></a>');
                }else{
                    $(".j-code-suggest").hide().eq(1).html('');
                }
            });
        }
    });
    $('.j-popup2').on('click', function(event){
	    if( $(event.target).is('.j-popup-close2') ) {
		    event.preventDefault();
		    $(this).removeClass('is-visible');
	    }
    });

    $("#j-suggestFormSubmit").click(function(){
        var content = $('#j-suggestForm').find("textarea[name='content']").val();
        var qq = $('#j-suggestForm').find("input[name='qq']").val();
        var code = $('#j-suggestForm').find("input[name='code']").val();
        if(content == ""){
            $.alert("请输入问题或建议内容");
            $('#j-suggestForm').find("textarea[name='content']").focus();
            return false;
        }else if(content.length < 2 || content.length >200){
            $.alert("问题或建议需2-100个字符")
            $('#j-suggestForm').find("textarea[name='content']").focus();
            return false;
        }else if(qq == ""){
            $.alert("请输入QQ号码");
            $('#j-suggestForm').find("textarea[name='qq']").focus();
            return false;
        }else if(!(/^[1-9]\d{3,10}$/.test(qq))){
            $.alert("QQ号码格式有误");
            $('#j-suggestForm').find("textarea[name='qq']").focus();
            return false;
        }
        $.post("/main/info.html", {type: "suggest",content:content, qq:qq, code:code}, function(data){
            //$('.j-popup').mask('hide');
            $(".j-code-suggest").hide().eq(1).html('');
            $.cookie('cym_ajaxGuest', '1', {path: '/', expires : 1});
            $.getJSON('/main/getVerification.html',{name:'suggest', method:true, type:'get'},function(data){
                if(data.status == 'y'){
                    $(".j-code-suggest").eq(1).html("");
                    $(".j-popup-container").css("height","450px");
                    $(".j-code-suggest").show().eq(1).append('<input type="text" name="code" class="ipt j-captchaInput" placeholder="验证码" datatype="s4-4" nullmsg="请输入验证码" errormsg="验证码应为4位字符" ajaxurl="/user/check/type/code.html"  style="width:80px;"/>&nbsp;<a href="javascript:;" onclick="this.childNodes[0].src=\'/user/captcha/size/20/width/65/height/36.html?\'+Math.random()*1000;return false;" class="j-captchaCode f-ml5"><img src="/user/captcha/size/20/width/65/height/36.html?'+Math.random()*1000+'" /></a>');
                }
            });
            if(data.status == 'y'){
                $.alert(data.info, function(){
                    $('.j-popup').removeClass('is-visible');
                    $('#j-suggestForm').find("textarea[name='content']").val('');
                    $('#j-suggestForm').find("input[name='qq']").val('');
                });
                }else{
                    $.alert(data.info);
                }

        }, 'json');
    })

    // 购物车预览弹出
	$('.j-popup-trigger,.j-popup-trigger2').on('click', function(event){
		event.preventDefault();
		$(this).siblings('.j-popup,.j-popup2').addClass('is-visible');
	});
    //close popup
	$('.j-popup,.j-popup2').on('click', function(event){
		if( $(event.target).is('.j-popup-close,.j-popup-close2') || $(event.target).is('.j-popup,.j-popup2') ) {
			event.preventDefault();
			$(this).removeClass('is-visible');
		}
	});
	//close popup when clicking the esc keyboard button
    $(document).keyup(function(event){
	    if(event.which=='27'){
		    $('.j-popup,.j-popup2').removeClass('is-visible');
        }
    });
	/*弹出反馈窗口结束*/
});


/*全局选项卡切换控制函数*/
function setTab(name,cursel,n){ 
	for(i=1;i<=n;i++){ 
		var menu=document.getElementById(name+i);
		var con=document.getElementById("con_"+name+"_"+i);
        if(menu != null) {
            if ( con != null) {
                menu.className=(i==cursel?"hover":"");
                con.style.display=(i==cursel?"block":"none");
                };
            };
	    };
    };
	


$(function(){
	//下单页面名片模板部分--总首页内容第三部分名片模板--------隐藏出现
	$(".j-tp-rowArea,.j-tp-columnArea").mouseenter(function(){
		$(this).find(".j-templateTop1").show();
		$(this).find(".j-templateTop2").show();
		$(this).find(".j-templateTop3").show();
	});
	$(".j-tp-rowArea,.j-tp-columnArea").mouseleave(function(){
		$(this).find(".j-templateTop1").hide();
		$(this).find(".j-templateTop2").hide();
		$(this).find(".j-templateTop3").hide();
	});
       
	//总首页右侧选择数量--询价单页面--重设select样式
	$(".j-selectBox").on("change", function() {
	    var o;
	    var $opt = $(this).find('option');
	    $opt.each(function(i) {
	        if ($opt[i].selected == true) {
	            o = $opt[i].innerHTML;
	        }
	    })
	   $(this).find('label').html(o);
	}).trigger('change');
	
	//总首页banner-s  和  新下单页面banner  自动（手动）鼠标交互(鼠标浮上左右按钮滑出)
	$('.j-banner-s,.j-orderBanner').mouseenter(function(){
	    $(this).find('.j-prev').animate({"left":"0px"});
	    $(this).find('.j-next').animate({"right":"0px"});
	});
	$('.j-banner-s,.j-orderBanner').mouseleave(function(){
	    $(this).find('.j-prev').animate({"left":"-31px"});
	    $(this).find('.j-next').animate({"right":"-31px"});
	});
	
	//checkbox样式重设
    $(".j-checkbox").on("click",function(){
        $(this).addClass("on").parent().find(".j-checkbox").not(this).removeClass("on");    
    });
	
	//二维码浮窗控制
	var windowsWidth = $(window).width();
	var cqWidth = windowsWidth/2 + 607;
	$("#j-mobileCq").css({"left":cqWidth});
	
	//国庆公告关闭控制
	$("#j-topAnnounce").find(".close").on("click",function(){
		$("#j-topAnnounce").hide();
	});
});

	 