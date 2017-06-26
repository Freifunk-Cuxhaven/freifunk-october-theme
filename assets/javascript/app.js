// JumpLink functions
jumplink = window.jumplink || {};


/**
 * Cache JQuery selectors we need in different functions, only working outside of barba templates
 */
jumplink.cacheSelectors = function () {
  console.log('cacheSelectors');
  jumplink.cache = {
    // General
    $html                    : $('html'),
    $body                    : $('body'),
    $htmlBody                : $('html, body'),
    $window                  : $(window),
    $document                : $(document),

    $mainNavbar              : $('#main-navbar'),
    $mainFooter              : $('#main-footer'),
    $leftSidebar             : $('#left-sidebar'),
    $rightSidebar            : $('#right-sidebar'),
    $Sidebars                : $('#right-sidebar, #left-sidebar'),
    // $navTree                 : $('#nav-tree'),

    $barbaWrapper            : $('#barba-wrapper'),
    
    // barba
    lastElementClicked       : null,
    // to scroll to last product
    lastProductDataset       : null,
    lastCollectionDataset       : null
  };
};

/**
 * Get the height of the main navbar, useful to set the page padding if the navbar is fixed
 */
jumplink.getNavHeight = function () {
  return jumplink.cache.$mainNavbar.outerHeight(true);
};

/**
 * Init the rightsidebar using simpler-sidebar and transformicons
 * @see http://dcdeiv.github.io/simpler-sidebar/
 * @see http://www.transformicons.com/
 */
jumplink.initRightSidebar = function () {
  // init tree before sidebar to cache tree events in sidebar to close the sidebar
  var closingLinks = '.close-sidebar';
  var align = 'right';
  var trigger = '[data-toggle="sidebar"][data-target="#right-sidebar"]';
  var mask = true;

  var $rightSidebar = jumplink.cache.$rightSidebar.simplerSidebar({
    attr: "simplersidebar",
    init: "closed",
    top: 0,
    align: align, // sidebar.align
    gap: 64, // sidebar.gap
    animation: {
      duration: 500,
      easing: "swing"
    },
    selectors: {
      trigger: trigger, // opener
      quitter: closingLinks // sidebar.closingLinks
    },
    sidebar: {
      width: 300
    },
    mask: {
      display: mask,
      css: {
        backgroundColor: "black",
        opacity: 0.5,
        filter: "Alpha(opacity=50)",
        'z-index': 998,
      }
    },
    events: {
      on: {
        animation: {
          open: function() {
            console.log('open');
            // icon animation for open
            transformicons.transform($('.sidebar-toggler.tcon')[ 0 ]);
          },
          close: function() {
            console.log('close');
            // icon animation for close
            transformicons.revert($('.sidebar-toggler.tcon')[ 0 ]);
          },
          both: function() {

          },
        }
      },
      callbacks: {
        animation: {
          open: function() {

          },
          close: function() {

          },
          both: function() {
            
          },
          freezePage: true
        }
      }
    }
  });
  
  $rightSidebar.show();

  if(jumplink.cache && jumplink.cache.$window && jumplink.cache.$Sidebars) {
    jumplink.cache.$window.resize(function() {
      jumplink.cache.$Sidebars.css( 'padding-top', jumplink.getNavHeight()+'px');
    });
    jumplink.cache.$Sidebars.css( 'padding-top', jumplink.getNavHeight()+'px');
  } else {
    console.error(new Error('jumplink.cache is undefined'));
  }
};

/**
 * Open or close the right sidebar
 */
jumplink.toggleRightSidebar = function () {
  $( jumplink.cache.$rightSidebar ).click();
};

/**
 * Close all opend bootstrap modals
 * @see http://v4-alpha.getbootstrap.com/components/modal/
 */
jumplink.closeAllModals = function () {
  jumplink.cache.$body.removeClass('modal-open').removeAttr('style');
};

/**
 * Set all navs and subnavs on navbar to "not active"
 */
var resetNav = function () {
    jumplink.cache.$mainNavbar.find('li, a').removeClass('active');
    jumplink.cache.$mainFooter.find('a').removeClass('active');
};


/**
 * Find active navs and set them to active
 */
var setNavActive = function(handle) {
    // jumplink.cache.$mainNavbar.find('li.'+handle+', .dropdown-item.'+handle).addClass('active');
    jumplink.cache.$mainNavbar.find('li.'+handle).addClass('active');
    jumplink.cache.$mainNavbar.find('a.'+handle).addClass('active');
    jumplink.cache.$mainFooter.find('a.'+handle).addClass('active');
};

/**
 * Create Leaflet map
 */
var initLeadlet = function (handle) {
    var $mapElement = $('#map-'+handle);
    var data = $mapElement.data();
    
    console.log('data', data);
    
    var icon = L.icon({
        iconUrl: data.markerIcon,    
        iconSize:     data.iconSize, // size of the icon
        iconAnchor:   data.iconAnchor, // point of the icon which will correspond to marker's location
    });
    
    var map = L.map('map-'+handle, {
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
    }
    ).setView([data.lat, data.lon], data.zoom);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([data.lat, data.lon], {icon: icon}).addTo(map);
    
    map.on('click', function(e) {
        console.log("Lat: " + e.latlng.lat + ", Lon: " + e.latlng.lng)
    });
};

/**
 * Init a siple carousel using slick
 * @see https://github.com/kenwheeler/slick
 */
var initCarousel = function(handle) {
    var $slick = $('#'+handle+'_carousel');
    
    var slickSettings = {
        infinite: true, 
        autoplay: false,
        dots: true,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                // Extra large devices (large desktops, 75em and up)
                breakpoint: 900,
                settings: {
                    arrows: true,
                }
            },
            {
                // Large devices (desktops, 62em and up)
                breakpoint: 744,
                settings: {
                    arrows: true,
                }
            },
            {
                // Medium devices (tablets, 48em and up)
                breakpoint: 576,
                settings: {
                    arrows: false,
                }
            },
            {
                // Small devices (landscape phones, 34em and up)
                breakpoint: 408,
                settings: {
                    arrows: false,
                }
            }
        ]
    };
    $slick.slick(slickSettings);
};

/**
 * Init product carousel using slick
 * @see https://github.com/kenwheeler/slick
 */
var initProductCarousel = function() {
    var $slick = $('#product_list_carousel_product_carousel');
    var slickSettings = {
        infinite: true, 
        autoplay: false,
        dots: false,
        arrows: true,
        slidesToShow:3,
        slidesToScroll: 1,
        responsive: [
            {
                // Extra large devices (large desktops, 75em and up)
                breakpoint: 900,
                settings: {
                    arrows: true,
                    slidesToShow:3,
                    slidesToScroll: 1,
                }
            },
            {
                // Large devices (desktops, 62em and up)
                breakpoint: 744,
                settings: {
                    arrows: true,
                    slidesToShow:2,
                    slidesToScroll: 1,
                }
            },
            {
                // Medium devices (tablets, 48em and up)
                breakpoint: 576,
                settings: {
                    arrows: false,
                    slidesToShow:1,
                    slidesToScroll: 1,
                }
            },
            {
                // Small devices (landscape phones, 34em and up)
                breakpoint: 408,
                settings: {
                    arrows: false,
                    slidesToShow:1,
                    slidesToScroll: 1,
                }
            }
        ]
    };
    $slick.slick(slickSettings);
}

/**
 * highlight product on click
 */
var initProductList = function() {
    $(".product-grid-item" ).click(function() {
        console.log('product clicked');
        $('.product-grid-item').removeClass('selected');
        $(this).addClass('selected');
    });
};

/**
 * Barba.js template
 */
var initTemplateHome = function (dataset, data) {
    console.log('init home');
    setNavActive('home');
    jumplink.cache.$barbaWrapper.css( 'padding-top', jumplink.getNavHeight()+'px');
    initProductList();
};

/**
 * Barba.js template
 */
var initTemplateStrandbasar = function (dataset, data) {
    console.log('init strandbasar');
    setNavActive('strandbasar');
    setNavActive('laeden');
    jumplink.cache.$barbaWrapper.css( 'padding-top', jumplink.getNavHeight()+'px');
    initLeadlet('strandbasar');
    initCarousel('strandbasar');
};

/**
 * Barba.js template
 */
var initTemplateStrandgut = function (dataset, data) {
    console.log('init strandgut');
    setNavActive('strandgut');
    setNavActive('laeden');
    jumplink.cache.$barbaWrapper.css( 'padding-top', jumplink.getNavHeight()+'px');
    initLeadlet('strandgut', 53.89051, 8.66833, 16, [21, 21]);
    initCarousel('strandgut');
};

/**
 * Barba.js template
 */
var initTemplateProdukte = function (dataset, data) {
    console.log('init produkte', dataset);
    setNavActive('produkte');
    jumplink.cache.$barbaWrapper.css( 'padding-top', jumplink.getNavHeight()+'px');
    initProductList();
    initProductCarousel();
};

var initTemplateStrandkorbvermietung = function (dataset, data) {
    console.log('init strandkorbvermietung');
    setNavActive('strandkorbvermietung');
    jumplink.cache.$barbaWrapper.css( 'padding-top', jumplink.getNavHeight()+'px');
    initLeadlet('strandkorbvermietung');
};

var initTemplateDefault = function (dataset, data) {
    console.log('init default');
    setNavActive(dataset.namespace);
    jumplink.cache.$barbaWrapper.css( 'padding-top', jumplink.getNavHeight()+'px');
};

/**
 * Run JavaScript for for special template
 * E.g. templates/product.liquid
 */
var initTemplate = {
  'willkommen': initTemplateHome,
  'strandbasar': initTemplateStrandbasar,
  'strandgut': initTemplateStrandgut,
  'produkte': initTemplateProdukte,
  'strandkorbvermietung': initTemplateStrandkorbvermietung,
};

/**
 * Init Javascripts insite of barba.js
 * 
 * @note see init() for inits outsite of barba.js 
 */
var initTemplates = function () {

  Barba.Dispatcher.on('linkClicked', function(el) {
    jumplink.cache.lastElementClicked = el;
  });

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container) {
    // console.log('newPageReady');
    var data = {}; // var data = ProductJS.Utilities.parseDatasetJsonStrings(container.dataset);

    jumplink.closeAllModals();
    jumplink.initDataApi();
    resetNav();

    if(typeof(Hyphenator) !== 'undefined') {
      Hyphenator.run();
    }

    var template = initTemplateDefault;
    if(initTemplate[currentStatus.namespace]) {
        template = initTemplate[currentStatus.namespace];
    } else {
        console.warn("Template not defined: "+currentStatus.namespace+' use default template');
    }
    
    templateDestoryer = template(container.dataset, data);
    
    if(typeof(templateDestoryer) !== 'undefined') {
        Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container) {
          templateDestoryer.destory();
          Barba.Dispatcher.off( 'newPageReady', this );
        });
    } else {
        // console.warn("template "+currentStatus.namespace+" needs a destroy function!");
    }    
  });
};

/**
 * Barba.js Slide and fade transition
 * Slide for product pages
 * fade for all others
 * 
 * @see http://barbajs.org/demo/nextprev/nextprev.js
 */
var initBarbaTransition = function() {
  var MovePage = Barba.BaseTransition.extend({
    start: function() {
      /**
       * This function is automatically called as soon the Transition starts
       * this.newContainerLoading is a Promise for the loading of the new container
       * (Barba.js also comes with an handy Promise polyfill!)
       */
      this.$oldContainer = $(this.oldContainer);
      this.originalThumb = jumplink.cache.lastElementClicked; // for what is this?
      this.$lastElementClicked = $(jumplink.cache.lastElementClicked);
      this.url = this.$lastElementClicked.attr('href');

      // As soon the loading is finished and the old page is faded out, let's fade the new page
      Promise
        .all([this.newContainerLoading, this.beforeMove()])
        .then(this.scrollTop())
        .then(this.afterMove.bind(this));
    },

    // logic before any effect applies
    beforeMove: function() {

      // if true use slide effect else use fade out effect
      if(this.$oldContainer.data().namespace === 'product' && (this.$lastElementClicked.hasClass('next') || this.$lastElementClicked.hasClass('prev')) ) {
        // slide effekt, in this step do nothing
        var deferred = Barba.Utils.deferred();
        deferred.resolve();
        return deferred.promise;
      } else {
        // fade out
        return this.fadeOut();
      }

    },

    afterMove: function() {
      this.$newContainer = $(this.newContainer);
      
      // var minHeight = jumplink.setBarbaContainerMinHeight(this.newContainer);
      
      if( this.$oldContainer.data().namespace === 'product' && this.$newContainer.data().namespace === 'product' && (!this.url || this.url.indexOf('src=recomatic') === -1) && !this.$lastElementClicked.hasClass('cart-link')) {
        // slide effekt
        return this.slidePages();
      } else {
        // fade out
        return this.fadeIn();
      }
    },

    // slide effect implementation
    slidePages: function() {
      var _this = this;
      var goingForward = true;

      if ( _this.$oldContainer.data().productUrl === _this.$newContainer.data().productNextUrl ) {
        goingForward = false;
      }

      var minHeight = jumplink.setBarbaContainerMinHeight(_this.$newContainer);
      var top = jumplink.getNavHeight();

      jumplink.cache.$html.css({'overflow': 'hidden'});
      jumplink.cache.$body.css({'overflow-x': 'hidden'});

      jumplink.freezeElements(_this.$oldContainer, _this.$newContainer, {
        // 'margin-left': '7.5px',
      });

      TweenLite.set(this.newContainer, {
        visibility: 'visible',
        xPercent: goingForward ? 100 : -100,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        'padding-top': top,
        'min-height': minHeight,
      });

      TweenLite.to(_this.oldContainer, 0.6, { xPercent: goingForward ? -100 : 100 });
      TweenLite.to(_this.newContainer, 0.6, { xPercent: 0, onComplete: function() {

        TweenLite.set(_this.newContainer, {
          clearProps: 'all',
        });

        TweenLite.set(_this.newContainer, {
          'min-height': minHeight
        });

        jumplink.unfreezeElements();

        jumplink.cache.$html.css({'overflow': ''});
        jumplink.cache.$body.css({'overflow-x': ''});

        _this.done();
      }});

    },

    // fade out effect implementation
    fadeOut: function() {
      /**
       * this.oldContainer is the HTMLElement of the old Container
       */
      return this.$oldContainer.animate({ opacity: 0 }).promise();
    },

    // fade new content in effect
    fadeIn: function() {
      /**
       * this.newContainer is the HTMLElement of the new Container
       * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden-xs-up)
       * Please note, newContainer is available just after newContainerLoading is resolved!
       */
      var _this = this;

      this.$oldContainer.hide();

      // var minHeight = jumplink.setBarbaContainerMinHeight(this.$newContainer);

      this.$newContainer.css({
        visibility : 'visible',
        opacity : 0,
        // 'min-height': minHeight,
      });

      var offset = 0;
      var target = 0;
      var position = { y: window.pageYOffset };
      var $lastPosition = null;

      // scroll to old product in collection if last page was a product
      if( this.$oldContainer.data().namespace === 'product' && this.$newContainer.data().namespace === 'collection') {
        // console.log('scroll to last product');
        $lastPosition = $('#'+jumplink.cache.lastProductDataset.handle);
        if($lastPosition.length >= 1) {
          target = $lastPosition.offset().top - offset;
        }
      }

      // scroll to old collection
      if( this.$oldContainer.data().namespace === 'collection' && this.$newContainer.data().namespace === 'list-collections') {
        // console.log('scroll to last collection');
        $lastPosition = $('#'+jumplink.cache.lastCollectionDataset.handle);
        if($lastPosition.length >= 1) {
          target = $lastPosition.offset().top - offset;
        }
      }

      // scroll to old position or 0
      TweenLite.to(position, 0.4, {
        y: target,
        onUpdate: function() {
          if (position.y === 0) {

          }
          window.scroll(0, position.y);
        },
        onComplete: function() {

        }
      });

      this.$newContainer.animate({ opacity: 1 }, 400, function() {
        /**
         * Do not forget to call .done() as soon your transition is finished!
         * .done() will automatically remove from the DOM the old Container
         */
        _this.done();
      });
    },

    // scroll to top of the page
    scrollTop: function() {
      var deferred = Barba.Utils.deferred();
      var position = { y: window.pageYOffset };

      TweenLite.to(position, 0.4, {
        y: 0,
        onUpdate: function() {
          if (position.y === 0) {
            deferred.resolve();
          }

          window.scroll(0, position.y);
        },
        onComplete: function() {
          deferred.resolve();
        }
      });

      return deferred.promise;
    },

  });
  return MovePage;
}

/**
 * Init barba itself
 */
var initBarba = function () {
    console.log('init barba');

  /*
   * Update Google Google Analytics if page is changed with barba
   * 
   * æsee https://developers.google.com/analytics/devguides/collection/analyticsjs/events
   */
  Barba.Dispatcher.on('initStateChange', function(currentStatus) {
    if(window.ga) {
      ga('set', 'location', currentStatus.url);
      ga('send', 'pageview');
    }

    if(typeof(fbq) === 'function') {
      fbq('track', 'ViewContent');
      //console.log("fbq('track', 'ViewContent');");
    }
    	
  });

  /**
   * Next step, you have to tell Barba to use the new Transition
   */
  Barba.Pjax.getTransition = function() {
    /**
     * Here you can use your own logic!
     * For example you can use different Transition based on the current page or link...
     */
    var MovePage = initBarbaTransition();
    return MovePage;
  };
  
  // activate precache
  Barba.Prefetch.init();
  initTemplates();
  Barba.Pjax.start();
}

/*
 * Init Javascripts outsite of barba.js
 * 
 * @note see initTemplates() for inits insite of barba.js 
 */
var init = function ($) {
    jumplink.cacheSelectors();
    jumplink.initRightSidebar();
    initBarba();
}

// run init as soon as jQuery is ready
$(init);