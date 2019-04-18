(function ($) {
    $('ul.tabs-caption').on('click', 'button:not(.active)', function () {
        $(this)
            .addClass('active').siblings().removeClass('active')
            .closest('div.tabs').find('div.tabs-content').removeClass('active').eq($(this).index()).addClass('active');
    });

    /**
     * @constructor
     */
    function Film() {
        this.filmData = [];

        this.offset = 0;
        this.pageLimit = 15;

        this.$container = null;

        var self = this;

        this.loadJsonData = function () {
            setTimeout(function () {
                self.filmData = filmDataJson;
                self.renderList();
            }, 100);

            // $.getJSON('films.json', function (data) {
            //     self._filmData = data;
            //     self.renderList();
            // });
        };

        this.getPaginationData = function () {
            var resData = [],
                limit = (this.offset + this.pageLimit - 1);
            var dataSearch = $('.js-search').val();
            console.log(dataSearch);


            if (limit > this.filmData.length) {
                limit = this.filmData.length - 1;
            }

            for (var i = this.offset; this.offset <= limit; i++) {
                for (var j = 0; j < this.filmData.length; j++) {
                    if (dataSearch === this.filmData['title']){
                        console.log(dataSearch);
                        resData.push(this.filmData[i]);
                    }
                }

                // ---

                this.offset++;
            }

            return resData;
        };

        this.renderList = function () {
            var filmData = this.getPaginationData(),
                htmlData = '',
                idx = this.offset - filmData.length + 1;

            for (var i = 0; i < filmData.length; i++) {
                htmlData += '<p>#'+idx+': '+filmData[i].title+'</p>';
                idx++;
            }

            this.$container.append(htmlData);
        };

        this.endFilmList = function () {
            return this.filmData.length <= this.offset;
        };

        this.init = function ($container) {
            this.$container = $container;
            this.loadJsonData();
        }
    }

    var film = new Film();

    film.init($('.js-films'));

    $('.js-load-more-btn').on('click', function (e) {
        e.preventDefault();

        film.renderList();

        if (film.endFilmList()) {
            $(this).hide();
        }
    })

})(jQuery);

