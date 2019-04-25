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
        // data provider
        this.filmData = [];
        this.tagsData = [];

        // options
        this.offset = 0;
        this.pageLimit = 15;
        this.resCount = 1;
        this.$container = null;
        this.$btnMore = null;

        // search values
        this.searchQuery = null;
        this.searchTags = [];

        var self = this;

        this.loadJsonData = function () {
            setTimeout(function () {
                self.filmData = filmDataJson;
                self.renderList();
            }, 100);
        };

        this.loadJsonTags = function () {
            setTimeout(function () {
                self.tagsData = tagsDataJson;
                self.renderTags();
            }, 100);
        };

        this.getPaginationData = function () {
            var resData = [],
                limit = (this.offset + this.pageLimit - 1);

            if (limit > this.filmData.length) {
                limit = this.filmData.length - 1;
            }

            if (this.searchTags.length > 0 || this.searchQuery) {
                for (var item = 1; item <= this.pageLimit + 1;) {
                    if (this.endFilmList()) {
                        break;
                    }

                    var title = this.filmData[this.offset].title.toLowerCase(),
                        tags = this.filmData[this.offset].tags;

                    if (this._queryFilter({
                        title: title,
                        tags: tags
                    })) {
                        if (item <= this.pageLimit) {
                            resData.push(this.filmData[this.offset]);
                        }

                        item++;
                    }

                    this.offset++;
                }
            } else {
                for (var i = this.offset; this.offset <= limit; i++) {
                    resData.push(this.filmData[i]);

                    this.offset++;
                }
            }

            if (this.endFilmList()) {
                this.$btnMore.hide();
            } else {
                this.$btnMore.show();
            }

            return resData;
        };

        this._queryFilter = function (queryParams) {
            var res = false;

            if (this.searchQuery) {
                if (queryParams.title.indexOf(this.searchQuery.toLowerCase()) !== -1) {
                    res = true;
                } else {
                    return false;
                }
            }

            if (this.searchTags.length > 0) {
                if (this._inTags(this.searchTags, queryParams.tags)) {
                    res = true;
                } else {
                    return false;
                }
            }

            return res;
        };

        this._inTags = function (search, tags) {
            for (var i = 0; i < search.length; i++) {
                if (tags.indexOf(search[i]) !== -1) {
                    return true;
                }
            }
            return false;
        };

        /**
         * @param value
         */
        this.setSearchQuery = function (value) {
            this.searchQuery = value ? value : null;
            this.$container.html('');
            this.offset = 0;
            this.resCount = 1;
            this.renderList();
        };

        this.setTagsQuery = function (tagName) {
            if (tagName) {
                this.searchTags.push(tagName);
                this.$container.html('');
                this.offset = 0;
                this.resCount = 1;
                this.renderList();
            }
        };

        /**
         * @param tagName - selected tag name
         */
        this.unsetTagsQuery = function (tagName) {
            var index = this.searchTags.indexOf(tagName);

            if (index > -1) {
                this.$container.html('');
                this.offset = 0;
                this.resCount = 1;
                this.renderList();

                this.searchTags.splice(index, 1)
            }
        };

        this.renderList = function () {
            var filmData = this.getPaginationData(),
                htmlData = '';

            for (var i = 0; i < filmData.length; i++) {
                htmlData += '<p>#' + this.resCount + ': ' + filmData[i].title + '<a class="js-star">' + '<span title="Добавить в закладки" class="addStarFavorites active">' + '&#9734;' + '</span>' + '<span title="Удалить из закладок" class="removeStarFavorites">' + '&#9733;' + '</span>' + '</a> ' + '</p>';
                this.resCount++;
            }

            this.$container.append(htmlData);
        };

        this.renderTags = function () {
            var htmlData = '';

            for (var i = 0; i < this.tagsData.length; i++) {
                htmlData += '<label  for="id' + i + '">' + '<input type="checkbox" class="js-checkbox" value="' + this.tagsData[i] + '" id="id' + i + '">' + '\t&#160;' + this.tagsData[i] + '</label>' + '\t&#160;';
            }

            this.$containerTags.append(htmlData);
        };

        /**
         * @returns {boolean}
         */
        this.endFilmList = function () {
            return this.filmData.length <= this.offset;
        };

        /**
         * @param opt
         */
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
    });


    $('.js-search').on('input', function (e) {
        film.setSearchQuery($(this).val());
    });

    $(document).on('change', '.js-checkbox', function (e) {
        var $this = $(this);

        if ($this.is(':checked')) {
            film.setTagsQuery($this.val());
        } else {
            film.unsetTagsQuery($this.val());
        }
    });

    $(document).on('click', '.js-star', function (e) {
        e.preventDefault();
        var $this = $(this);
        $addStar = $('.addStarFavorites', $this);
        $removeStar = $('.removeStarFavorites', $this);

        if ($removeStar.hasClass('active')) {
            $removeStar.removeClass('active');
        } else {
            $removeStar.addClass('active');
        }
        if ($addStar.hasClass('active')) {
            $addStar.removeClass('active');
        } else {
            $addStar.addClass('active');
        }
    });
})(jQuery);

