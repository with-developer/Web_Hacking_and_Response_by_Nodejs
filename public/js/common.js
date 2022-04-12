$(document).ready(function(){
    
    /* main_swiper */
    var main_swiper = new Swiper('.mainSlideSwiper .swiper-container', {
        autoplay: {
            delay: 5000,
          },
        effect: 'fade',
        fadeEffect: {
            crossFade: false
          },
        loop: true,
        pagination: {
        el: '.mainSlideSwiper .swiper-pagination',
        clickable: true,
        },
        navigation: {
            nextEl: '.mainSlideSwiper .swiper-button-next',
            prevEl: '.mainSlideSwiper .swiper-button-prev',
        }
    });

    /* news swiper */
    var news_swiper = new Swiper('.newsSwipeList .swiper-container', {
        slidesPerView: 2,
        spaceBetween: 12,
        slidesPerGroup:1,
        autoResize : true,
        loop: true,
        //autoHeight : true,
        breakpoints: {
            640: {
                slidesPerView: 3, 
                spaceBetween: 20, // 우측 여백
            }
        },
        navigation: {
            nextEl: '.newsSwipeList .swiper-button-next',
            prevEl: '.newsSwipeList .swiper-button-prev',
        },
    });

    /* main header */
    var header = $("header");
    var myWindow = $(window);
    var headNavi = $("header nav .menuList");
    
    headNavi.on("mouseenter",function(){
        header.addClass("on");
    });
    headNavi.on("mouseleave",function(){
        header.removeClass("on");
    });

    myWindow.on("scroll",function(){
        var st = myWindow.scrollTop();
        if(st>0) { 
            header.addClass("scroll");
        } else {
            header.removeClass("scroll");
        }
    });


    /* common tab */
    $(".tabList li").click(function() {
        var idx = $(this).index();
        $(".tabList li").removeClass("on");
        $(".tabList li").eq(idx).addClass("on");
        $(".tabCont > div").hide();
        $(".tabCont > div").eq(idx).show();
      })

    /* mobile 전체메뉴 */
    $(".btn_allMenu").click(function() {
        $(this).toggleClass('close');
        $("header nav").toggleClass('open');
        $("#wrap").toggleClass('fixed');
    })

    $(".menuList li > a.moMenu").click(function() {
        $(this).toggleClass('open');
    })
    
    /* 팝업 */
    $(".btn_popUp").click(function(){
        var pop_id = $(this).attr("id");
        $('#'+pop_id+'.popSect').fadeIn(300);
    });

    $(".popSect .popClose").click(function(){
        $(".popSect").fadeOut(300);
    });

    /* 문의하기 */
    $(".sendBtn button").click(function () { 
        var phoneConfirm = new RegExp(/^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/);
        var agreeCh01 = $("input[name='sendName']");
        var agreeCh02 = $("input[name='sendMail']");
        var agreeCh03 = $("input[name='sendTel']");
        var agreeCh04 = $("input[name='sendCompany']");
        var agreeCh05 = $("select[name='sendType'] option:not(.default):selected");
        var agreeCh06 = $("textarea[name='sendText']");
        
        if(!$(agreeCh01).val()){
            alert("성명을 입력해주세요.");
            $(agreeCh01).focus();
            return false;
        }
        if(!$(agreeCh02).val()){
            alert("이메일을 입력해주세요.");
            $(agreeCh02).focus();
            return false;
        }
        if (!$(agreeCh03).val()) {
            alert("전화번호를 입력해주세요.");
            $(agreeCh03).focus();
            return false;
        }
        if (!phoneConfirm.test($(agreeCh03).val())) {
            alert("전화번호 형식이 올바르지 않습니다.");
            $(agreeCh03).focus();
            return false;
        }
        if(!$(agreeCh04).val()){
            alert("회사명 또는 소속기관명을 입력해주세요.");
            $(agreeCh04).focus();
            return false;
        }
        if(!$(agreeCh05).val()){
            alert("산업군을 선택해주세요.");
            $("select[name='sendType']").focus();
            return false;
        }
        if(!$(agreeCh06).val()){
            alert("문의내용을 입력해주세요.");
            $(agreeCh06).focus();
            return false;
        }

        if(!$(".agreeBox .com-checkbox").is(":checked")) { 
            alert('개인정보 수집 및 이용에 동의하여 주십시오.');
            return false;
        }
        
        var formData = new FormData($("#question_from")[0]);
        
        $.ajax({
            url : "/terms-question-action",
            type : 'POST',
            data : formData,
            dataType: 'json',
            processData: false,
            contentType: false,                        
            success : function(data){
                if (data.status == 'success') {
                	alert("문의사항이 정상적으로 접수되었습니다.\n\n문의하신 내용을 확인 후 빠르게 답변드리겠습니다.")
                	document.location.href = "/terms-question";
                }
            }
        });
        
     });
     

});

