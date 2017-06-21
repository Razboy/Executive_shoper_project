$(document).ready(function() {
    $('#subcategories').hide();
    /* Save profile */
    $("form#profile").submit(function(e) {
        e.preventDefault();
        var formdata = new FormData(this); // high importance!

        $.ajax({
            async: true,
            type: "POST",
            contentType: false, // high importance!
            url: "/save-profile",
            data: formdata, // high importance!
            processData: false, // high importance!
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            success: function (data) {
                $('#saved-modal').modal('toggle');
            }
        });

    });
    /* ------------------------------------ */


    /* SAVE ALL(5) COMPANIES */
    $('[name^=company]').submit(function (e) {
        var company_id = $(this).find('#company_id');
        event.preventDefault();
        var formdata = new FormData(this); // high importance!

        $.ajax({
            async: true,
            type: "POST",
            contentType: false, // high importance!
            url: "/save-company",
            data: formdata, // high importance!
            processData: false, // high importance!
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            success: function (data) {
                company_id.val(data);
                $('#saved-company-modal').modal('toggle');
            }
        });
    });
    /* ------------------------------------ */


    /* DELETE ALL(5) COMPANIES */
        $('[id^=delete-companies]').on('click', function(event) {
        event.preventDefault();
        var full_id = $( this ).attr('id');
        var id = full_id[full_id.length-1];

        var company_id = $('.company-profile-form'+id).find('#company_id').val();
        $('.company-profile-form'+id).find('.logo-photo img').remove();
        $('.company-profile-form'+id).find('.logo-photo').removeClass('notempty');
        $('.company-profile-form'+id).trigger("reset");

        if ( $('.company-profile-form').hasClass('company-notvisible') ) {
            $('.add-one-more-company-button').css('display', 'block');
        }

        $.ajax({
            type: "POST",
            url: "/delete-company",
            data: { id: company_id},
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            success: function (data) {
                $('.company-profile-form'+id).find('input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').val('');
                $('.company-profile-form'+id).find('textarea').text('');
                if (id > 1) {
                    $('.company-profile-form' + id).removeClass('company-visible').addClass('company-notvisible');
                }
            }
        });
    });
    /* ------------------------------------ */



    /* Button for delete post in profile and in vacancy */
    $('.delete-post-button').on('click', function(event) {
        $('#id').val(this.id)
    });
    /* ------------------------------------ */

    /* Load countries and cities in add vacancy page and in filter page*/
    $('#filter-country').on('change', function(event) {
        var e = document.getElementById("filter-country");
        var country_id = e.options[e.selectedIndex].value;
        var block = $('#filter-city');

        $.ajax({
            type: "POST",
            url : '/get-city',
            data: { country_id: country_id},
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            success : function(cities) {
                block.empty();
                block.append('<option value="all">All</option>');
                block.append(cities);
            }
        });
    });
    /* ------------------------------------ */


    /* PROPOSE POST */
    // Set category_id in propose post
    $('[class$=post-main-category-checkbox]').on('click', function(event) {
        $('#category_id').val($(this).val());
        if ($(this).val() == 'Video') {
            $('#subcategory').val('');
        }
    });

    // Set subcategory name in propose post
    $('[class$=post-sub-category-checkbox]').on('click', function(event) {
        $('#subcategory').val($(this).val());
    });


    /* HIDDEN INPUTS IN ADD VACANCY PAGE */
    $('[id^=company]').on('click', function(event) {
        if ($.isNumeric(this.value)) {
            var company_id = this.value;
            $('#company_id').val(company_id);
        }
    });

    $('[id^=industry]').on('click', function(event) {
        var industry_id = this.value;
        $('#industry_id').val(industry_id);
    });

    $('[id^=category]').on('click', function(event) {
        var category_id = this.value;
        $('#cat_id').val(category_id);
    });

    $('[id^=availability]').on('click', function(event) {
        var availability_id = this.value;
        $('#availability_id').val(availability_id);
    });
    /* ------------------------------------ */



    /* FASHION-JOB FILTER */
    $('.filter-list-industry input').on('click', function(event) {
        var industryId = $(this).attr('value');
        var industries = $('#industries').val();

        if (industries !== '') {
            $('#industries').val(industries + ' ' + industryId);
        } else {
            $('#industries').val(industryId);
        }

        filterVacancies();
    });


    //Add Category checked to selected
    $('.filter-list-category input').on('click', function(event) {
        var categoryId = $(this).attr('value');
        var categories = $('#categories').val();
        if (categories !== '') {
            $('#categories').val(categories + ' ' + categoryId);
        } else {
            $('#categories').val(categoryId);
        }

        filterVacancies();
    });

    //Add selected availability
    $('.filter-list-availability input').on('click', function(event) {
        var availabilityId = $(this).attr('value');
        var availabilities = $('#availability').val();
        if (availabilities !== '') {
            $('#availability').val(availabilities + ' ' + availabilityId);
        } else {
            $('#availability').val(availabilityId);
        }

        filterVacancies();
    });

    //Add selected country
    $( "#filter-country" ).change(function() {
        var country = $( "#filter-country option:selected" ).text();
        $('#country').val(country);
        filterVacancies();
    });

    //Add selected city
    $( "#filter-city" ).change(function() {
        var city = $( "#filter-city option:selected" ).text();
        $('#city').val(city);
        filterVacancies();
    });

    /* Send bU this service email */
    $('#buy-service-yes , #buy-service-send').on('click', function(event) {
        event.preventDefault();
        var formdata = $('#buy-service').serialize();
        $(this).siblings('button, form').remove();
        $(this).siblings('p').text('We will contact you soon');
        $(this).siblings('h4').text('Thank you');
        $(this).remove();

        $.ajax({
            async: true,
            type: "POST",
            url: "/buy-service",
            data: formdata, // high importance!
            processData: false, // high importance!
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            success: function (data) {

            }
        });
    });

});


/* Load posts in blog categories */
function loadPosts(click) {
    var data = click.split('_');
    var page = parseInt(data[0]) + 1;
    var category = data[1];
    var search = data[2];
    var tag = data[3];

    $.ajax({
        type: "POST",
        url: "/load-posts",
        data: { category: category, page: page, search:search, tag:tag},
        beforeSend: function(request) {
            return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
        },
        success: function(articles) {
            var button = document.getElementById(click)
            button.remove();
            var block = $('#articles');
            block.append(articles);
            equalheight('.latest-news-item:not(.slide-latest-news-item)');
        }
    });
}
/* ------------------------------------ */


/* Load posts in profile */
function profilePosts(element) {
    var data = element.split('+');
    var page = data[0];
    var user_id = data[1];
    var category = data[2];
    var qty = data[3];

    $.ajax({
        type: "POST",
        url: "/profile-posts",
        data: { page: page, user_id: user_id, category: category, qty: qty},
        beforeSend: function(request) {
            return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
        },
        success: function(articles){
            var button = document.getElementById(element);
            button.remove();
            var block = $('#articles');
            block.append(articles);
        }
    });
}
/* ------------------------------------ */

/* Like post */
function Like(post_id, where) {
    if (!where) { var where = 'post_'; }
    $.ajax({
        type: "POST",
        url: "/like",
        data: { post_id: post_id },
        beforeSend: function(request) {
            return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
        },
        success: function() {
            counter = parseInt($("#"+where+post_id).text());
            counter +=1;
            $('#'+where+post_id).text(counter);
        }
    })
}
/* ------------------------------------ */


/* Load vacancies in fashion-job */
function loadVacancies(page) {
    $.ajax({
        type: "POST",
        url: "/load-vacancies",
        data: { page: page},
        beforeSend: function(request) {
            return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
        },
        success: function(vacancies) {
            var button = document.getElementById(page);
            button.remove();
            var block = $('.vacancies-list');
            block.append(vacancies);
        }
    });
}
/* ------------------------------------ */


/* Load vacancies in profile */
function profileVacancies(element) {
    var data = element.split('+');
    var page = data[0];
    var user_id = data[1];

    $.ajax({
        type: "POST",
        url: "/profile-vacancies",
        data: { page: page, user_id: user_id},
        beforeSend: function(request) {
            return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
        },
        success: function(articles) {
            var button = document.getElementById(element);
            button.remove();
            var block = $('#articles');
            block.append(articles);
        }
    });
}
/* ------------------------------------ */


function filterVacancies(page) {

    page = page || 0;

    var industries = $('#industries').val();
    var categories = $('#categories').val();
    var availabilities = $('#availability').val();
    var country = $('#country').val();
    var city = $('#city').val();

    $.ajax({
        type: "POST",
        url: "/filter-vacancies",
        data: { industries: industries, categories: categories, availabilities: availabilities, country:country, city:city, ajax_page: page},
        beforeSend: function(request) {
            return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
        },
        success: function(response) {
            response = JSON.parse(response);
            var vacancies = response['vacancies'];
            var count = response['count'];

            $('.results-vacancies').empty();
            $('.results-vacancies').append('<span>'+count+'</span> results');

            var block = $('.vacancies-list');
            if (page == 0) {
                block.empty();
            }
            var button = $('.more-vacancies');
            button.empty();

            block.append(vacancies);
        }
    });
}


function searchVacancies(data) {
    var array = data.split('+');
    var page_id = array[0];
    var search = array[1];

    $.ajax({
        type: "POST",
        url: "/search-vacancies",
        data: { page: page_id, search: search},
        beforeSend: function(request) {
            return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
        },
        success: function(vacancies) {
            var block = $('.vacancies-list');
            var button = $('.more-vacancies');
            button.empty();

            block.append(vacancies);
        }
    });

}

/* Delete removes filters from vacancies */
function replaceAll(str, find, splitBy) {
    splitedStr = str.split(splitBy);

    var resultStr = '';
    for (var i = 0; i < splitedStr.length; i++) {
        if (splitedStr[i] != find) {
            resultStr += splitedStr[i] + ' ';
        }
    }

    return resultStr.substring(0, resultStr.length - 1);
}


function getIndustryId(string) {

    if (string.indexOf("Fashion") != -1) var id = 1;
    if (string.indexOf("Beauty") != -1) var id = 2;
    if (string.indexOf("Advertising") != -1) var id = 3;
    if (string.indexOf("Apparel") != -1) var id = 4;
    if (string.indexOf("Communications") != -1) var id = 5;
    if (string.indexOf("Consulting") != -1) var id = 6;
    if (string.indexOf("Retail") != -1) var id = 7;
    if (string.indexOf("Manufacturing") != -1) var id = 8;
    if (string.indexOf("Health") != -1) var id = 9;

    return id;
}


function getCategoryId(string) {
    if (string.indexOf("Retail") != -1) var id = 1;
    if (string.indexOf("Marketing") != -1) var id = 2;
    if (string.indexOf("Design") != -1) var id = 3;
    if (string.indexOf("Product") != -1) var id = 4;
    if (string.indexOf("Administration") != -1) var id = 5;

    return id;
}


function getAvailabilityId(string) {
    if (string.indexOf("freelance") != -1) var id = 0;
    if (string.indexOf("internship") != -1) var id = 1;

    return id;
}

function liveSearch(search, what)
{
    $.ajax({
        type: "POST",
        url: "/live-search",
        data: { search: search, what: what},
        dataType: 'json',
        beforeSend: function(request) {
            return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
        },
        success: function(data){

            var x = data.length;
            var availableTags = [];
            for ( i = 0; i < x; i++)
            {
                availableTags.push(data[i])
            }

            $( "#search" ).autocomplete({
                source: availableTags,
                messages: {
                    noResults: '',
                    results: function() {}
                }
            });
        },
        error: function(data){

        }
    });
}
