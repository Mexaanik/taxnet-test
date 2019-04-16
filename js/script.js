(function($) {
    $(function() {

        $('ul.tabs-caption').on('click', 'button:not(.active)', function() {
            $(this)
                .addClass('active').siblings().removeClass('active')
                .closest('div.tabs').find('div.tabs-content').removeClass('active').eq($(this).index()).addClass('active');
        });

    });
}
)(jQuery);


$(function() {
    $.getJSON("films.json", function (data) {
        $.each(data,function (key,value) {
            var test= '<p>'+value.title+'</p>';
            $('#rez').append(test);
        })
    });

});

$(function () {
   $("p").slice(0,14).show();
   $("#loadMore").on('click', function(e) {
       e.preventDefault();
       $("p:hidden").slice(0,14).slideDown();
   })
});