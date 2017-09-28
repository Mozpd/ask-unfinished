$(function () {
    $('#ishow').mouseover(function () {
        $('#ihide').css('display','block');
        $('#ihide').mouseover(function () {
            $('#ihide').css('display','block');
        }).mouseleave(function () {
            $('#ihide').css('display','none');
        })
    }).mouseleave(function () {
        $('#ihide').css('display','none');
    });

    $('.tab-menu li').click(function () {
        console.log(1)
        $('.tab-down section').eq($(this).index()).css('display','block').siblings().css('display','none');
        $('.tab-menu li').eq($(this).index()).addClass('li-active').siblings().removeClass('li-active');
    })

})


