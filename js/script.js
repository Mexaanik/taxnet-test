(function ($) {
        $(function () {

            $('ul.tabs-caption').on('click', 'button:not(.active)', function () {
                $(this)
                    .addClass('active').siblings().removeClass('active')
                    .closest('div.tabs').find('div.tabs-content').removeClass('active').eq($(this).index()).addClass('active');
            });

        });
    }
)(jQuery);

function Film() {
    this._filmData = [];
    this._pageLimit = 15;
    this._page = 1;
    this.$container = null;
    var self = this;

    this.getFilmData = function () {
        $.getJSON('films.json', function (data) {
            self._filmData = data;
            self.renderList();
        });
    };

    this.getPaginationData = function () {
        var a = self._filmData;
        var index;
        for (index = 0; index <= a.length; ++index) {
            console.log(a[index]);
        }
        if (index <= 14){
            return a[index];
        }
        return a;
    };

    this.renderList = function () {
        var test = this.getPaginationData;
        $('#rez').append(test);
    };

    // $.getJSON("films.json", function (data) {
    //     $.each(data, function (key, value) {
    //         if (key <= 14) {
    //             test = '<p>' + value.title + '</p>';
    //             $('#rez').append(test);
    //             self._filmData = test.slice();
    //         }
    //     });
    // });
    //
    // this.getFilmData = function () {
    //     $.getJSON("films.json", function (data) {
    //         $.each(data,function (key,value) {
    //             var test= '<p>'+value.title+'</p>';
    //             $('#rez').append(test);
    //         })
    //     })
    // }
    //
    // this.renderFilm = function () {
    //     $("p").slice(0,14).show();
    //     $("#loadMore").on('click', function(e) {
    //         e.preventDefault();
    //         var elementId = $("p:hidden");
    //         if (elementId.length > 1) {
    //             $("p:hidden").slice(0, 14).slideDown();
    //         } else {
    //             $('p:hidden').slice(0,14).slideDown();
    //             $("#loadMore").fadeOut();
    //         }
    //     })
    // }
}

var film = new Film();
film.getFilmData();
// film.getPaginationData();
