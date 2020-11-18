$(function(){
	$("#j-indBanner").slide({mainCell:".list ul",titCell:".num span",effect:"leftLoop",autoPlay:true});
	$("#j-tplList").find("li").find("a.a1").on("click",function(){
		var _index = $(this).index(),$img = $(this).parent().parent().siblings().find(".img");
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
		if($img.length > 1){
			$img.fadeOut();
			$img.eq(_index).fadeIn();
		}
	});
	$("#j-xdList").slide({mainCell:".list",effect:"topLoop",scroll:1,vis:9,autoPlay:true});
});