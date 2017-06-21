(function($){
    // main image slider
    $(document).on('mousedown tap', '[data-hook="update-product-image"]', function(e) {
        var $t         = $(this),
            $mainImage = $('#main-image'),
            newSrc     = $t.find('img').attr('src');

        $t.addClass('active').siblings('.active').removeClass('active');

        $mainImage.attr('src', newSrc);
    });

    $(document).on('mousedown tap', '[data-hook="product-image-navigation"]', function(e) {
        var $t   = $(this),
            $img = $('#main-image'),
            nav  = $t.data('navigate');

        toggleImage($img, nav);
    });


    // modal full screen
    $(document).on('mousedown tap', '[data-toggle-modal="product-image-full-screen"]', function(e) {
        $('[data-modal="product-image-full-screen"]').fadeToggle();

        var src = $('.active[data-hook="update-product-image"]').find('img').attr('src');
        $('#main-modal-image').attr('src', src);
    });

    $(document).on('mousedown tap', '[data-modal]', function (e) {
        var $t = $(e.target);

        if (!$t.hasClass('modal-block-content') && !$t.closest('.modal-block-content').length) {
            $('[data-modal]').fadeOut();
        }
    });

    $(document).on('mousedown tap', '#main-modal-image', function (e) {
        toggleImage($('#main-modal-image'), 'next');
    });

    $(document).on('mousedown tap', '[data-hook="slider-image-navigation"]', function() {
        var $t   = $(this),
            $img = $('#main-modal-image'),
            nav  = $t.data('navigate');

        toggleImage($img, nav);
        $('#main-image').attr('src', $('.active[data-hook="update-product-image"]').find('img').attr('src'));
    });


    // top menu
    $(document).on('mousedown tap', '[data-hook="accordion-toggle"]', function(e) {
        var $t         = $(this),
            $acItem    = $t.parents('.accordion-item'),
            $acContent = $t.siblings('.accordion-item-content');

        $acContent.slideToggle();
        $acItem.toggleClass('closed');
    });

    $(document).on('mousedown tap', '[data-hook="toggle-menu"]', function(e) {
        $('.category-list').slideToggle();
    });

    $(document).on('mousedown tap', '.category-list > li > a', function(e) {
        e.preventDefault();

        if (!$('[data-hook="toggle-menu"]').is(':visible'))
            return;

        $('.category-list').find('.active').toggleClass('active').slideToggle();

        var $currentMenu = $(this).closest('li').find('.sub-menu');
        if (!$currentMenu.is(':visible')) {
            $currentMenu.toggleClass('active').slideToggle();
        }
    });



    // custom functions
    function toggleImage($img, nav) {
        if (nav !== 'prev' && nav !== 'next')
            return;

        var $currentImage = $('.active[data-hook="update-product-image"]'),
            $nextImage = nav == 'prev' ? $currentImage.prev() : $currentImage.next();

        if (!$nextImage.length) {
            var $images = $('[data-hook="update-product-image"]');
            $nextImage = nav == 'prev' ? $images.last() : $images.first();
        }

        $nextImage.addClass('active').siblings('.active').removeClass('active');
        $img.attr('src', $nextImage.find('img').attr('src'));
    }
})(jQuery);