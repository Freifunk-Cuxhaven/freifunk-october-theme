// JumpLink functions
jumplink = window.jumplink || {};

// Do not use window.alert!
(function(proxied) {
  window.alert = function() {
    // do something here
    return proxied.apply(this, arguments);
  };
})(console.log);

/**
 * featureTest( 'position', 'sticky' )
 * @see https://github.com/filamentgroup/fixed-sticky/blob/master/fixedsticky.js
 */
jumplink.featureTest = function ( property, value, noPrefixes ) {
  // Thanks Modernizr! https://github.com/phistuck/Modernizr/commit/3fb7217f5f8274e2f11fe6cfeda7cfaf9948a1f5
  var prop = property + ':',
    el = document.createElement( 'test' ),
    mStyle = el.style;

  if( !noPrefixes ) {
    mStyle.cssText = prop + [ '-webkit-', '-moz-', '-ms-', '-o-', '' ].join( value + ';' + prop ) + value + ';';
  } else {
    mStyle.cssText = prop + value;
  }
  return mStyle[ property ].indexOf( value ) !== -1;
}

/**
 * Detect if current device is a touch device
 * 
 * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
 */
jumplink.isTouchDevice = function () {
  if(platform.name === 'Epiphany') {
    return false;
  }
  return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
}

/**
 * Preloading images with jQuery with callback after image is loaded
 * 
 * @see http://stackoverflow.com/a/476681/1465919
 * @see https://perishablepress.com/3-ways-preload-images-css-javascript-ajax/
 */
jumplink.preloadImage = function ($element, src, srcOrignal, cb) {
  return $(new Image()).attr("src", src).load(function() {
    $image = $(this);
    $image.unbind('load');
    return cb($element, src, srcOrignal, $image);
  });
}

/**
 * Preloading array of image sources
 * 
 * @see jumplink.preloadImage
 * @see https://perishablepress.com/3-ways-preload-images-css-javascript-ajax/
 */
jumplink.preloadImages = function (arrayOfImages) {
  $(arrayOfImages).each(function() {
    jumplink.preloadImage(this);
  });
}

/**
 * Replace no images
 * Useful to replace Shopify Images with a custom placeholder image
 */
jumplink.replaceNoImageSrc = function() {
  var $images = $('[src*="no-image-"]');
  $images.each(function(index) {
    var $this = $(this);
    $this.attr('src', window.product.noImageSrc);
  });
}

jumplink.replaceNoImageBackground = function() {
  var $images = $('[style*="no-image-"]');
  $images.each(function(index) {
    var $this = $(this);
    $this.attr('style', 'background-image: url(' + window.product.noImageSrc + ');');
  });
}

jumplink.replaceNoImage = function() {
  jumplink.replaceNoImageSrc();
  jumplink.replaceNoImageBackground();
}

/**
 * Get hash from address bar
 */
jumplink.getHash = function () {
  return window.location.hash;
};

/**
 * Change hash from address bar
 */
jumplink.updateHash = function (hash) {
  return window.location.hash = hash;
};

/**
 * Remove hash from address bar
 */
jumplink.removeHash = function () {
  return history.pushState("", document.title, window.location.pathname + window.location.search);
};

/**
 * get hostname an path of address bar
 * @see http://stackoverflow.com/a/736970/1465919
 */
jumplink.getUrlLocation = function(href) {
  var l = document.createElement("a");
  l.href = href;
  return l;
};

jumplink.getCurrentLocation = function(href) {
  return jumplink.getUrlLocation(window.location);
};

/**
 * Cause back button to close Bootstrap modal windows
 * @see https://gist.github.com/thedamon/9276193
 */
jumplink.initModalHistoryBack = function (modalSelector) {

  if(!modalSelector) {
    modalSelector = ".modal";
  }

  $(modalSelector).on("shown.bs.modal", function()  { // any time a modal is shown
    var urlReplace = "#" + $(this).attr('id'); // make the hash the id of the modal shown
    history.pushState(null, null, urlReplace); // push state that hash into the url
  });

  // If a pushstate has previously happened and the back button is clicked, hide any modals.
  $(window).on('popstate', function() { 
    $(modalSelector).modal('hide');
  });
}

/**
 * Get Image of E-Mail by Gravawtar
 * @see https://stackoverflow.com/questions/705344/loading-gravatar-using-$
 */
jumplink.getGravatar = function (emailOrHash, classes, withHash, placeholder) {
  var src = null;

  if(typeof(emailOrHash) === 'undefined' || emailOrHash === null || !emailOrHash.length) {
    return console.error("Gravatar need an email or hash");
  }

  if(typeof(withHash) === 'undefined' || withHash !== true) {
    emailOrHash = md5(emailOrHash);
  }

  src = '//www.gravatar.com/avatar/' + emailOrHash;

  if(placeholder) {
    src += '?d=' + encodeURI('https:'+placeholder);
  }

  //console.log("getGravatar", emailOrHash, classes, withHash, placeholder, src);

  var $image = $('<img>').attr({src: src}).addClass(classes);
  return $image;
}

/**
 * 
 */
jumplink.initGravatarElements = function (selector, classes) {
  if(!classes) {
    classes = "";
  }
  $articles = $(selector);
  $articles.find('gravatar').each(function(index, gravatar) {
    var $gravatar = $(gravatar);
    var emailOrHash = null;
    var withHash = false;
    var placeholder = null;
    var data = $gravatar.data();

    if(data.placeholders) {
      placeholder = data.placeholders[ProductJS.Utilities.rand(0, data.placeholders.length-1)];
    }

    //console.log("data", data);

    if( data.email ) {
      emailOrHash = $gravatar.data('email');
      withHash = false;
    }

    if( data.hash ) {
      emailOrHash = $gravatar.data('hash');
      withHash = true;
    }

    if(data.replace) {
      $image = jumplink.getGravatar(emailOrHash, classes+" "+$gravatar.attr('class'), withHash, placeholder);    
      $gravatar.replaceWith($image);
    } else {
      $image = jumplink.getGravatar(emailOrHash, classes, withHash, placeholder);    
      $gravatar.empty().append($image);
    }
    
  });
}

/**
 * Set each element of $elements to the height of the heightest element to have all elements with the same height 
 */
jumplink.sameHeightElements = function ($elements, defaultHeight) {
    if(!defaultHeight) {
      defaultHeight = 'auto';
    }
    var t = 0;
    var t_elem;
    // get heightest height
    $elements.each(function () {
        $this = $(this);
        // reset height
        $this.css('min-height', defaultHeight);
        if ( $this.outerHeight() > t ) {
            t_elem=this;
            t=$this.outerHeight();
        }
    });
    
    // set all smaller cards to the height of the heightest card
    $elements.each(function () {
        $this = $(this);
        if($this.outerHeight() != t) {
            $this.css('min-height', t);
        }
    });
}

/**
 * Performs a smooth page scroll to an anchor on the same page.y
 * @see https://css-tricks.com/snippets/jquery/smooth-scrolling/
 */
jumplink.initSmoothPageScroll = function () {
    var pathname = window.location.pathname;
    var selectpathname = pathname.replace('/', '\\/')+"#";
    var selector = "a[href*='"+selectpathname+"']:not([href='#'])";
    
    $(selector).click(function() {
        
        var href = $.attr(this, 'href');
        var index = href.indexOf('#');
        var id = href.substring(index, href.length);
        
        $('html, body').animate({
            scrollTop: $( id ).offset().top
        }, 500);
        return true;
    });
}

/**
 * Close all opend bootstrap modals
 * @see http://v4-alpha.getbootstrap.com/components/modal/
 */
jumplink.closeAllModals = function () {
  jumplink.cache.$body.removeClass('modal-open').removeAttr('style');
};


