// Biến khởi tạo
var timeOut_modalCart;
var viewout = true;
var check_show_modal = true;
if(window.template.indexOf('product') > -1){
	// Add a product and show modal cart
	var add_item_show_modalCart = function(id) {
		if( check_show_modal ) {
			check_show_modal = false;
			timeOut_modalCart = setTimeout(function(){ 
				check_show_modal = true;
			}, 3000);
			if ( $('.addtocart-modal').hasClass('clicked_buy') ) {
				var quantity = $('#quantity').val();
			} else {
				var quantity = 1;
			}
			var params = {
				type: 'POST',
				url: '/cart/add.js',
				async: true,
				data: 'quantity=' + quantity + '&id=' + id,
				dataType: 'json',
				success: function(line_item) {
					//	if ( jQuery(window).width() >= 768 ) {
					getCartModal();					
					jQuery('#myCart').modal('show');				
					jQuery('.modal-backdrop').css({'height':jQuery(document).height(),'z-index':'99'});
					//	} else {
					//		window.location = '/cart';
					//	}
					$('.addtocart-modal').removeClass('clicked_buy');
				},
				error: function(XMLHttpRequest, textStatus) {
					alert('Sản phẩm bạn vừa mua đã vượt quá tồn kho');
				}
			};
			jQuery.ajax(params);
		}
	}
	// Plus number quantiy product detail 
	var plusQuantity = function() {
		if ( jQuery('input[name="quantity"]').val() != undefined ) {
			var currentVal = parseInt(jQuery('input[name="quantity"]').val());
			if (!isNaN(currentVal)) {
				jQuery('input[name="quantity"]').val(currentVal + 1);
			} else {
				jQuery('input[name="quantity"]').val(1);
			}
		}else {
			console.log('error: Not see elemnt ' + jQuery('input[name="quantity"]').val());
		}
	}
	// Minus number quantiy product detail 
	var minusQuantity = function() {
		if ( jQuery('input[name="quantity"]').val() != undefined ) {
			var currentVal = parseInt(jQuery('input[name="quantity"]').val());
			if (!isNaN(currentVal) && currentVal > 1) {
				jQuery('input[name="quantity"]').val(currentVal - 1);
			}
		}else {
			console.log('error: Not see elemnt ' + jQuery('input[name="quantity"]').val());
		}
	}
	}
// Modal Cart
function getCartModal(){
	var cart = null;
	jQuery('#cartform').hide();
	jQuery('#myCart #exampleModalLabel').text("Giỏ hàng");
	jQuery.getJSON('/cart.js', function(cart, textStatus) {
		if(cart) {
			jQuery('#cartform').show();
			//jQuery('.line-item:not(.original)').remove();
			jQuery.each(cart.items,function(i,item){
				var total_line = 0;
				var total_line = item.quantity * item.price;
				tr = jQuery('.original').clone().removeClass('original').appendTo('table#cart-table tbody');
				if(item.image != null)
					tr.find('.item-image').html("<img src=" + Haravan.resizeImage(item.image,'small') + ">");
				else
					tr.find('.item-image').html("<img src='//theme.hstatic.net/1000383440/1000607590/14/no_image.jpg?v=263'>");
				vt = item.variant_options;
				if(vt.indexOf('Default Title') != -1)
					vt = '';
				tr.find('.item-title').children('a').html(item.product_title + '<br><span>' + vt + '</span>').attr('href', item.url);
				tr.find('.item-quantity').html("<input id='quantity1' name='updates[]' min='1' type='number' value=" + item.quantity + " class='' />");
				if ( typeof(formatMoney) != 'undefined' ){
					tr.find('.item-price').html(Haravan.formatMoney(total_line, formatMoney));
				}else {
					tr.find('.item-price').html(Haravan.formatMoney(total_line, ''));
				}
				tr.find('.item-delete').html("<a href='javascript:void(0);' onclick='deleteCart(" + (i+1) + ")' ><i class='fa fa-times'></i></a>");
			});
			jQuery('.item-total').html(Haravan.formatMoney(cart.total_price, formatMoney));
			jQuery('.modal-title').children('b').html(cart.item_count);
			jQuery('.count-holder .count').html( '(' + cart.item_count + ')' );

			if(cart.item_count == 0){				
				jQuery('#exampleModalLabel').html('Giỏ hàng của bạn đang trống. Mời bạn tiếp tục mua hàng.');
				jQuery('#cart-view').html('<tr><td>Hiện chưa có sản phẩm</td></tr>');
				jQuery('#cartform').hide();
			}
			else{			
				jQuery('#exampleModalLabel').html('Bạn có ' + cart.item_count + ' sản phẩm trong giỏ hàng.');
				jQuery('#cartform').removeClass('hidden');
				jQuery('#cart-view').html('');
			}
			if ( jQuery('#cart-pos-product').length > 0 ) {
				jQuery('#cart-pos-product span').html(cart.item_count + ' sản phẩm');
			}
			// Get product for cart view

			jQuery.each(cart.items,function(i,item){
				clone_item(item,i);
			});
			jQuery('#total-view-cart').html(Haravan.formatMoney(cart.total_price, formatMoney));
		} 	
	});
	$('#site-overlay').addClass("active");
	$('.main-body').addClass("sidebar-move");
	$('#site-nav--mobile').addClass("active");
	$('#site-nav--mobile').removeClass("show-filters").removeClass("show-search").addClass("show-cart");
}
//clone item cart
function clone_item(product,i){
	var item_product = jQuery('#clone-item-cart').find('.item_2');
	if ( product.image == null ) {
		item_product.find('img').attr('src','//theme.hstatic.net/1000383440/1000607590/14/no_image.jpg?v=263').attr('alt', product.url);
	} else {
		item_product.find('img').attr('src',Haravan.resizeImage(product.image,'small')).attr('alt', product.url);
	}
	item_product.find('a:not(.remove-cart)').attr('href', product.url).attr('title', product.title);
	item_product.find('.pro-title-view').html(product.title);
	item_product.find('.pro-quantity-view').html(product.quantity);
	item_product.find('.pro-price-view').html(Haravan.formatMoney(product.price,formatMoney));
	item_product.find('.remove-cart').html("<a href='javascript:void(0);' onclick='deleteCart(" + (i+1) + ")' ><i class='fa fa-times'></i></a>");
	var title = '';
	if(product.variant_options.indexOf('Default Title') == -1){
		$.each(product.variant_options,function(i,v){
			title = title + v + ' / ';
		});
		title = title + '@@';
		title = title.replace(' / @@','')
		item_product.find('.variant').html(title);
	}else {
		item_product.find('.variant').html('');
	}
	item_product.clone().removeClass('hidden').prependTo('#cart-view');
}
// Delete variant in modalCart
function deleteCart(line){
	var params = {
		type: 'POST',
		url: '/cart/change.js',
		data: 'quantity=0&line=' + line,
		dataType: 'json',
		success: function(cart) {
			getCartModal();
		},
		error: function(XMLHttpRequest, textStatus) {
			Haravan.onError(XMLHttpRequest, textStatus);
		}
	};
	jQuery.ajax(params);
}
// Update product in modalCart
jQuery(document).on("click","#update-cart-modal",function(event){
	event.preventDefault();
	if (jQuery('#cartform').serialize().length <= 5) return;
	jQuery(this).html('Đang cập nhật');
	var params = {
		type: 'POST',
		url: '/cart/update.js',
		data: jQuery('#cartform').serialize(),
		dataType: 'json',
		success: function(cart) {
			if ((typeof callback) === 'function') {
				callback(cart);
			} else {
				getCartModal();
			}
			jQuery('#update-cart-modal').html('Cập nhật');
		},
		error: function(XMLHttpRequest, textStatus) {
			Haravan.onError(XMLHttpRequest, textStatus);
		}
	};
	jQuery.ajax(params);
});
/* fixHeightProduct */
function fixHeightProduct(data_parent, data_target, data_image) {
	var box_height = 0;
	var box_image = 0;
	var boxtarget = data_parent + ' ' + data_target;
	var boximg = data_parent + ' ' + data_target + ' ' + data_image;
	jQuery(boximg).css('height', 'auto');
	jQuery($(boxtarget)).css('height', 'auto');
	jQuery($(boxtarget)).removeClass('fixheight');
	jQuery($(boxtarget)).each(function() {
		if (jQuery(this).find($(data_image)).height() > box_image) {
			box_image = jQuery(this).find($(data_image)).height();
		}
	});
	if (box_image > 0) {
		jQuery(boximg).height(box_image);
	}
	jQuery($(boxtarget)).each(function() {
		if (jQuery(this).height() > box_height) {
			box_height = jQuery(this).height();
		}
	});
	jQuery($(boxtarget)).addClass('fixheight');
	if (box_height > 0) {
		jQuery($(boxtarget)).height(box_height);
	}
	try {
		fixheightcallback();
	} catch (ex) {}
}
jQuery(document).ready(function(){
	// Get number item for cart header
	//$.get('/cart.js').done(function(cart){
	//$('.cart-menu .count').html(cart.item_count);
	//});
	// Image Product Loaded fix height
	setTimeout(function(){
		jQuery('.wrapper-collection-1 .content-product-list .image-resize').imagesLoaded(function() {
			fixHeightProduct('.wrapper-collection-1 .content-product-list', '.product-resize', '.image-resize');
			jQuery(window).resize(function() {
				fixHeightProduct('.wrapper-collection-1 .content-product-list', '.product-resize', '.image-resize');
			});
		});
	}, 7000);
	setTimeout(function(){
		jQuery('.wrapper-collection-2 .content-product-list .image-resize').imagesLoaded(function() {
			fixHeightProduct('.wrapper-collection-2 .content-product-list', '.product-resize', '.image-resize');
			jQuery(window).resize(function() {
				fixHeightProduct('.wrapper-collection-2 .content-product-list', '.product-resize', '.image-resize');
			});
		});
	}, 7000);
	jQuery('.list-productRelated .content-product-list .image-resize').imagesLoaded(function() {
		fixHeightProduct('.list-productRelated .content-product-list', '.product-resize', '.image-resize');
		jQuery(window).resize(function() {
			fixHeightProduct('.list-productRelated .content-product-list', '.product-resize', '.image-resize');
		});
	});
	jQuery('.search-list-results .image-resize').imagesLoaded(function() {
		fixHeightProduct('.search-list-results', '.product-resize', '.image-resize');
		jQuery(window).resize(function() {
			fixHeightProduct('.search-list-results', '.product-resize', '.image-resize');
		});
	});
	jQuery('#collection-body .content-product-list .image-resize').imagesLoaded(function() {
		fixHeightProduct('#collection-body .content-product-list', '.product-resize', '.image-resize');
		jQuery(window).resize(function() {
			fixHeightProduct('#collection-body .content-product-list', '.product-resize', '.image-resize');
		});
	});	
});
// Footer 
$(document).ready(function() {
	if (jQuery(window).width() < 768) {
		jQuery('.main-footer .footer-col .footer-title').on('click', function(){
			jQuery(this).toggleClass('active').parent().find('.footer-content').stop().slideToggle('medium');
		});
		// icon Footer
		$('a.btn-fter').click(function(e){
			if ( $(this).attr('aria-expanded') == 'false' ) {
				e.preventDefault();
				$(this).attr('aria-expanded','true');
				$('.main-footer').addClass('bg-active');
			} else {
				$(this).attr('aria-expanded','false');
				$('.main-footer').removeClass('bg-active');
			}
		});
	}
});
if (template.indexOf('blog') > -1 || template.indexOf('collection') > -1 || template.indexOf('article') > -1) {
	// Mainmenu sidebar
	$(document).on("click", "span.icon-subnav", function(){
		if ($(this).parent().hasClass('active')) {
			$(this).parent().removeClass('active');
			$(this).siblings('ul').slideUp();
		} else {
			if( $(this).parent().hasClass("level0") || $(this).parent().hasClass("level1")){
				$(this).parent().siblings().find("ul").slideUp();
				$(this).parent().siblings().removeClass("active");
			}
			$(this).parent().addClass('active');
			$(this).siblings('ul').slideDown();
		}
	});
}
//Click event to scroll to top
jQuery(document).on("click", ".back-to-top", function(){
	jQuery(this).removeClass('show');
	jQuery('html, body').animate({
		scrollTop: 0			
	}, 800);
});
/* scroll */
jQuery(window).scroll(function() {
	/* scroll top */
	if ( jQuery('.back-to-top').length > 0 && jQuery(window).scrollTop() > 500 ) {
		jQuery('.back-to-top').addClass('show');
	} else {
		jQuery('.back-to-top').removeClass('show');
	}
	/* scroll header */
	if (jQuery(window).width() < 768) {
		var scroll = $(window).scrollTop();
		if (scroll < 320) {
			$(".main-header").removeClass("scroll-menu");	
		} else {
			$(".main-header").addClass("scroll-menu");		
		}
	} else {
		//var height_header =	$('.main-header').height();
		//if( jQuery(window).scrollTop() >= height_header ) {			
		//jQuery('.main-header').addClass('affix-mobile');
		//}	else {
		//jQuery('.main-header').removeClass('affix-mobile');
		//}
	}
});
$('a[data-spy=scroll]').click(function(){
	event.preventDefault() ;
	$('body').animate({scrollTop: ($($(this).attr('href')).offset().top - 20) + 'px'}, 500);
})
function smoothScroll(a, b){
	$('body,html').animate({
		scrollTop : a
	}, b);
}
// Buynow
var buy_now = function(id) {
	var quantity = 1;
	var params = {
		type: 'POST',
		url: '/cart/add.js',
		data: 'quantity=' + quantity + '&id=' + id,
		dataType: 'json',
		success: function(line_item) {
			if(template == 'cart'){
				var x = $('.layout-cart').offset().top;
				smoothScroll(x-100, 500);
				setTimeout(function(){
					window.location.reload();
				},300);
			}else{
				window.location = '/checkout';
			}
		},
		error: function(XMLHttpRequest, textStatus) {
			Haravan.onError(XMLHttpRequest, textStatus);
		}
	};
	jQuery.ajax(params);
}
// Add to cart
$(document).on('click','.add-to-cart', function() {
	var min_qty = 1;
	var variant_id = $(this).attr('data-variantid');
	var params = {
		type: 'POST',
		url: '/cart/add.js',
		async: true,
		data: 'quantity=' + min_qty + '&id=' + variant_id,
		dataType: 'json',
		success: function(line_item) {
			if (template.indexOf('cart') > -1) {
				window.location.reload();
			} else {
				getCartModal();
			}
		},
		error: function(XMLHttpRequest, textStatus) {
			Haravan.onError(XMLHttpRequest, textStatus);
		}
	};
	jQuery.ajax(params);
});
// Menu sidebar Collection
$(document).ready(function(){
	$(".node a ").click(function(){
		var target = $(this).parent().children(".tree-menu-sub");
		$(target).slideToggle();
	});
});
// Slide
jQuery(document).ready(function(){
	$('#home-slider .owl-carousel').owlCarousel({
		items:1,
		nav: true,
		dots: false,
		lazyLoad:true,
		touchDrag: true,
		autoplay:true,
    autoplayTimeout:5000,
		loop: false,
		responsive:{
			0:{
				items:1
			},
			768:{
				items:1
			},
			1024:{
				items:1
			}
		}
	});
	/*if (jQuery(window).width() > 991) {
		$('#collection-slide').owlCarousel({
			items:4,
			nav:true,
			dots:false,
			responsive:{
				0:{
					items:2,
					margin: 15
				},
				480:{
					items:2,
					margin: 15
				},
				768:{
					items:3,
					margin: 15
				},
				992:{
					items:4,
					margin: 30
				},
				1200:{
					items:4,
					margin: 30
				}
			},
			pagination: false,
			slideSpeed : 800,
			addClassActive: true,
			scrollPerPage: false,
			touchDrag: true,
			autoplay: false,
			loop: false,
			lazyLoad: true,
		});

		$('#collection-slide2').owlCarousel({
			items:4,
			nav:true,
			dots:false,
			responsive:{
				0:{
					items:2,
					margin: 15
				},
				480:{
					items:2,
					margin: 15
				},
				768:{
					items:3,
					margin: 15
				},
				992:{
					items:4,
					margin: 30
				},
				1200:{
					items:4,
					margin: 30
				}
			},
			pagination: false,
			slideSpeed : 800,
			addClassActive: true,
			scrollPerPage: false,
			touchDrag: true,
			autoplay: false,
			loop: false,
			lazyLoad: true,
		});
	}*/
});
if (template.indexOf('collection') > -1) {
	// Dropdown Title
	jQuery('.title_block').click(function(){
		$(this).next().slideToggle('medium');
	});    
	$(document).on("click",".dropdown-filter", function(){
		if ( $(this).parent().attr('aria-expanded') == 'false' ) {
			$(this).parent().attr('aria-expanded','true');
		} else {
			$(this).parent().attr('aria-expanded','false');
		}
	});
}
/* Search ultimate destop -mobile*/
$('.ultimate-search').submit(function(e) {
	e.preventDefault();
	var q = $(this).find('input[name=q]').val();
	var q_follow = 'product';
	var query = encodeURIComponent('(title:product**' + q + ')');
	if( !q ) {
		window.location = '/search?type='+ q_follow +'&q=*';
		return;
	}	else {
		window.location = '/search?type=' + q_follow +'&q=filter=' + query;
		return;
	}
});
var $input = $('.ultimate-search input[type="text"]');
$input.bind('keyup change paste propertychange', function() {
	var key = $(this).val(),
			$parent = $(this).parents('.wpo-wrapper-search'),
			$results = $(this).parents('.wpo-wrapper-search').find('.smart-search-wrapper');
	if(key.length > 0 ){
		$(this).attr('data-history', key);
		var q_follow = 'product',
				str = '';
		str = '/search?q=filter=(title:product**' + key + ')&view=ultimate-product';
		$.ajax({
			url: str,
			type: 'GET',
			async: true,
			success: function(data){
				$results.find('.resultsContent').html(data);
			}
		})
		$results.fadeIn();
	}else{
		$results.fadeOut();
	}
})

$('input[name="follow"]').on('change', function(){
	$('.ultimate-search input[type="text"]').trigger('change');
})
$('input[name="follow_mobile"]').on('change', function(){
	$('.ultimate-search input[type="text"]').trigger('change');
})
$('body').click(function(evt) {
	var target = evt.target;
	if (target.id !== 'ajaxSearchResults' && target.id !== 'inputSearchAuto') {
		$(".ajaxSearchResults").hide();
	}
	if (target.id !== 'ajaxSearchResults-mb' && target.id !== 'inputSearchAuto-mb') {
		$(".ajaxSearchResults").hide();
	}
});
$('body').on('click', '.ultimate-search input[type="text"]', function() {
	if ($(this).is(":focus")) {
		if ($(this).val() != '') {
			$(".ajaxSearchResults").show();
		}
	} else {

	}
})

jQuery(document).ready(function(){
	var $window = $(window);
	var $html   = $('html');
	var $body   = $('body');
	var $header = $('.main-body > header', $body);

	var offset_sticky_header  = 400;
	var offset_down           = 100;

	$window.scroll(function() {
		if ($window.width() > 750) {
			if ($window.scrollTop() >= offset_sticky_header) {
				if (!$html.hasClass('sticky-header')) {
					$body.css('padding-top', $header.height());
					$html.addClass('sticky-header');
				}
			} else {
				$html.removeClass('sticky-header');
				$body.css('padding-top', 0);
			}
		}

		$body.toggleClass('down', $window.scrollTop() >= offset_down);
	}).scroll();

});

$(document).ready(function(){
	$('.powerd__haravan').on('hover',function(){
		$(this).attr('href','//www.haravan.com');	
	})
	$('.powerd__haravan').on('click',function(){
		$(this).attr('href','//www.haravan.com/?ref=xyz');
		location.reload();
	});
})
// Menu mobile
$(document).ready(function(){
	/*
	$('#site-menu-handle').click(function() {
		//$('#site-overlay').show();
		$('body').toggleClass('open-menu');
		$('html').toggleClass('open-menu');
	})
	$('body').on('touchstart click', '#site-overlay', function(e) {
		e.preventDefault();
		$(this).hide();
		if ($('body').hasClass('open-menu')) {
			$('body').removeClass('open-menu');
			$('html').removeClass('open-menu');
		}
	})
	*/
	$('.list-root li a').click(function(e){
		if ($(this).find('i').length){
			e.preventDefault();
			var menu_child_id = $(this).parent().data('menu-root');
			$('.list-root').addClass('mm-subopened');
			$('#' + menu_child_id).addClass('mm-opened');
		} 
	})
	$('.list-child li:first-child a').click(function(){
		$(this).parents('.list-child').removeClass('mm-opened');
		$('.list-root').removeClass('mm-subopened');
	})
	$('.list-child li.level-2 a').click(function(e){
		if ($(this).find('i').length){
			e.preventDefault();
			var menu_sub_id = $(this).parent().data('menu-root');
			$('li.level-2').addClass('mm-subopened');
			$('#' + menu_sub_id).addClass('mm-sub');
		} 
	})
	$('.sub-child li:first-child a').click(function(){
		$(this).parents('.sub-child').removeClass('mm-sub');
		$('.list-child').removeClass('mm-subopened');
	})
	$(document).on("click",".sub-child li.level-3 a",function(e){
		if ($(this).find('i').length){
			e.preventDefault();
			var menu_subnav_id = $(this).parent().data('menu-root');
			$('li.level-3').addClass('mm-open-3');
			$('#' +  menu_subnav_id).addClass('mm-sub-3');
		} 
	});
	$(document).on("click",".sub-child-3 li:first-child a",function(e){
		$(this).parents('.sub-child-3').removeClass('mm-sub-3');
		$('.sub-child').removeClass('mm-open-3');
	});
});


