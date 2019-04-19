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
        this.searchQuery = null;
        this.resCount = 1;
        this.tagsData = [];
        this.$container = null;
        this.$btnMore = null;

        var self = this;

        this.loadJsonData = function () {
            setTimeout(function () {
                self.filmData = filmDataJson;
                self.renderList();
            }, 100);

            // $.getJSON('films.json', function (data) {
            //     self.filmData = data;
            //     self.renderList();
            // });
        };

        this.loadJsonTags = function () {
            setTimeout(function () {
                self.tagsData = tagsDataJson;
                self.renderTags();
            }, 100);
        };

        // $.getJSON('tags.json', function (data) {
        //     self.tagsData = data;
        //     self.renderTags();
        // });

        this.renderTags = function () {
            var htmlData = '';

            for (var i = 0; i < this.tagsData.length; i++) {
                htmlData += '<label  for="id' + i + '">' + '<input type="checkbox" class="js-checkbox" value="' + this.tagsData[i] + '" id="id' + i + '">' + '\t&#160;' + this.tagsData[i] + '</label>' + '\t&#160;';
            }

            this.$containerTags.append(htmlData);
        };


        this.getPaginationData = function () {
            var resData = [],
                limit = (this.offset + this.pageLimit - 1);

            if (limit > this.filmData.length) {
                limit = this.filmData.length - 1;
            }

            if (this.searchQuery) {
                for (var item = 1; item <= this.pageLimit + 1;) {
                    if (this.endFilmList()) {
                        break;
                    }

                    var title = this.filmData[this.offset].title.toLowerCase(),
                        showButtonMore = false;

                    if (title.indexOf(this.searchQuery.toLowerCase()) !== -1) {
                        if (item <= this.pageLimit) {
                            resData.push(this.filmData[this.offset]);
                        } else {
                            showButtonMore = true;
                        }

                        item++;
                    }

                    this.offset++;
                }

                if (showButtonMore) {
                    this.$btnMore.show();
                } else {
                    this.$btnMore.hide();
                }
            } else {
                for (var i = this.offset; this.offset <= limit; i++) {
                    resData.push(this.filmData[i]);

                    this.offset++;
                }

                this.$btnMore.show();
            }

            return resData;
        };

        this.setSearchQuery = function (v) {
            this.searchQuery = v ? v : null;
            this.$container.html('');
            this.offset = 0;
            this.resCount = 1;
            this.renderList();
        };

        this.setSearchTags = function () {
            this.$container.html('');
            this.offset = 0;
            this.resCount = 1;
            this.renderList();

            //честно спизжено с интернета не понмаю как работает
            this.tagsArr = $.map($(":checkbox:checked"), function (el) {
                return $(el).val();
            });
            console.log(this.tagsArr);
        };


        this.renderList = function () {
            var filmData = this.getPaginationData(),
                htmlData = '';

            for (var i = 0; i < filmData.length; i++) {
                htmlData += '<p>#' + this.resCount + ': ' + filmData[i].title + '</p>';
                this.resCount++;
            }

            this.$container.append(htmlData);
        };

        this.endFilmList = function () {
            return this.filmData.length <= this.offset;
        };

        this.init = function (opt) {
            this.$container = opt.container;
            this.$containerTags = opt.containerTags;
            this.$btnMore = opt.btnMore;
            this.loadJsonData();
            this.loadJsonTags();
        }
    }

    var film = new Film();

    film.init({
        container: $('.js-films'),
        btnMore: $('.js-load-more-btn'),
        containerTags: $('.js-tags')
    });

    film.$btnMore.on('click', function (e) {
        e.preventDefault();

        film.renderList();

        if (film.endFilmList()) {
            film.$btnMore.hide();
        }
    });


    $('.js-search').on('input', function (e) {
        film.setSearchQuery($(this).val());
    });

    $(document).on('change', '.js-checkbox', function (e) {
        film.setSearchTags($(this).val());
    });

})(jQuery);

