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
        this.favoritesFilmData = [];

        // options
        this.offset = 0;
        this.pageLimit = 15;
        this.resCount = 1;
        this.$container = null;
        this.$containerBookmarks = null;
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
                this.searchTags.splice(index, 1);

                this.$container.html('');
                this.offset = 0;
                this.resCount = 1;
                this.renderList();
            }
        };

        this.renderList = function () {
            var filmData = this.getPaginationData(),
                htmlData = '';

            for (var i = 0; i < filmData.length; i++) {
                htmlData += '<p>#' + this.resCount + ': ' + filmData[i].title + this._getStarTemplate(filmData[i].title, false) +'</p>';
                this.resCount++;
            }

            this.$container.append(htmlData);
        };

        this._getStarTemplate = function (filmTitle, renderBookmarks) {
            renderBookmarks = renderBookmarks || false;

            var addStarFavoritesActive = '',
                removeStarFavorites = '';

            if (this.hasFavoritesByName(filmTitle)) {
                removeStarFavorites = ' active';
            } else {
                addStarFavoritesActive = ' active';
            }

            return '\
                <a class="js-star" data-film= "' + filmTitle + '" data-render-bookmarks="'+renderBookmarks+'">\
                    <span title="Добавить в закладки" class="addStarFavorites'+addStarFavoritesActive+'">&#9734;</span>\
                    <span title="Удалить из закладок" class="removeStarFavorites'+removeStarFavorites+'">&#9733;</span>\
                </a>';
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

        this.addFavorites =function (filmName) {
            this.favoritesFilmData.push(filmName);
        };

        this.removeFavorites =function (filmName) {
            var index = this.favoritesFilmData.indexOf(filmName);

            if (index > -1) {
                this.favoritesFilmData.splice(index, 1)
            }
        };

        this.hasFavoritesByName =function (filmName) {
            return this.favoritesFilmData.indexOf(filmName) !== -1;
        };

        this.renderBookmarksList = function () {
            this.$containerBookmarks.html('');

            var htmlData = '';

            for (var i = 0; i < this.favoritesFilmData.length; i++) {
                htmlData += '<p>#' + (i+1) + ': ' + this.favoritesFilmData[i]+ this._getStarTemplate(this.favoritesFilmData[i], true)+'</p>';
            }

            this.$containerBookmarks.html(htmlData);
        };

        /**
         * @param opt
         */
        this.init = function (opt) {
            this.$container = opt.container;
            this.$containerTags = opt.containerTags;
            this.$btnMore = opt.btnMore;
            this.$containerBookmarks = opt.containerBookmarks;
            this.loadJsonData();
            this.loadJsonTags();
        }
    }

    var film = new Film();

    film.init({
        container: $('.js-films'),
        containerBookmarks: $('.js-films-bookmarks'),
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

    $('.js-bookmarks-tab').on('click', function (e) {
        film.renderBookmarksList();
    });

    $('.js-films-tab').on('click', function (e) {
        film.$container.html('');
        film.offset = 0;
        film.resCount = 1;
        film.renderList();
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
        var $this = $(this),
            $addStar = $('.addStarFavorites', $this),
            $removeStar = $('.removeStarFavorites', $this);

        if (!film.hasFavoritesByName($this.data('film'))) {
            film.addFavorites($this.data('film'));
        } else {
            film.removeFavorites($this.data('film'));
        }

        $removeStar.removeClass('active');
        $addStar.removeClass('active');

        if (!film.hasFavoritesByName($this.data('film'))) {
            $addStar.addClass('active');
        } else {
            $removeStar.addClass('active');
        }

        if ($this.data('render-bookmarks')) {
            film.renderBookmarksList();
        }
    });
})(jQuery);

