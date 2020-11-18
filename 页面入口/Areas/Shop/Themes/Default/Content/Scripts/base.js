$(function(){

	$("#j-topuser").on("mouseenter",function(){
		$(this).parent().addClass("on");
	}).on("mouseleave",function(){
		$(this).parent().removeClass("on");
	});
	$("#j-allprint").on("mouseenter",function(){
		$(this).addClass("on");
	}).on("mouseleave",function(){
		$(this).removeClass("on");
		$("#j-subBox").hide();
	});
	$("#j-subList").find("li").on("mouseenter",function(){
		var _target = $(this).attr("data-target");
		$("#j-subList").find("li").removeClass("active");
		$(this).addClass("active");
		var $subBoxLeft = $("#j-subprint").find("div.j-subBoxLeft"),$subBoxRight = $("#j-subprint").find("div.j-subBoxRight");
		$("#j-subBox").find("div.j-data").each(function(){
			var __target = $(this).attr("data-target");
			if(_target == __target){
				$(this).show();
			}else{
				$(this).hide();
			}
		});
		if($("#j-subBox").css("display") == "none"){
			$("#j-subBox").css({
				"display":"block",
				"width":0
			}).delay(10).animate({
				"width":285
			},300,function(){
				$("#j-subBox").delay(100).animate({
					"width":662
				},300);
			});
		}
	});
	$("#j-subBox").find(".j-close").on("click",function(){
		$("#j-subBox").hide();
	});
	var topNavTime;
	$("#j-topNav").find("li.li1").on("mouseenter",function(){
		if(topNavTime){
			clearTimeout(topNavTime);
		}
		var _target = $(this).attr("data-target");
		$("#j-topNav").find("li.li1").removeClass("on");
		$(this).addClass("on");
		$("#j-subNav").find("div.j-data").each(function(){
			var __target = $(this).attr("data-target");
			if(_target == __target){
				$(this).show();
			}else{
				$(this).hide();
			}
		});
		if($("#j-subNav .list").find('li').length > 0){
			$("#j-subNav").slideDown();
		}
	}).on("mouseleave",function(){
		$("#j-topNav").find("li.li1").removeClass("on");
		topNavTime = setTimeout(function(){
			$("#j-subNav").slideUp();
		},300);
	});
	$("#j-subNav").on("mouseenter",function(){
		if(topNavTime){
			clearTimeout(topNavTime);
		}
	}).on("mouseleave",function(){
		topNavTime = setTimeout(function(){
			$("#j-subNav").slideUp();
		},300);
	});
	$(".j-gotop").click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 600);
		return false;
	});


    /*弹出意见反馈窗口开始*/
    $('.j-suggest').on('click', function () {
        $('.j-suggestWindow').fadeIn();
        $('.j-suggestMask').fadeIn();
        $('.j-suggestWindow').find('.j-popupClose').on('click', function () {
            $('.j-suggestWindow').fadeOut();
            $('.j-suggestMask').fadeOut();
        });
    });

});