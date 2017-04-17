$("input[name='socialImageSRC']").change(function () {
  console.log('Promo image choosed');

  var objFormData = new FormData();
  // GET FILE OBJECT 
  var objFile = $(this)[0].files[0];
  // APPEND FILE TO POST DATA
  objFormData.append('userfile', objFile);
  $.ajax({
    url: '/api/upload-image/social',
    type: 'POST',
    contentType: false,
    data: objFormData,
    //JQUERY CONVERT THE FILES ARRAYS INTO STRINGS.SO processData:false
    processData: false,
    beforeSend: function () {
      $('.loading-image').addClass('active');
    },
    success: function (image) {

      $('.loading-image').removeClass('active');
      console.log('Social image success uploaded');
      console.log('URL:' + image);
      // $( ".promo-image-popup img").attr("src", image.url);

      $(".social-image-popup img").remove();
      var myImage = new Image();
      myImage.src = '//' + image.url;

      $(".social-image-popup").append(myImage);

    }
  });
});

$("input[name='promoImageSRC']").change(function () {
  console.log('Social image choosed');

  var objFormData = new FormData();
  // GET FILE OBJECT 
  var objFile = $(this)[0].files[0];
  // APPEND FILE TO POST DATA
  objFormData.append('userfile', objFile);
  $.ajax({
    url: '/api/upload-image/promo',
    type: 'POST',
    contentType: false,
    data: objFormData,
    //JQUERY CONVERT THE FILES ARRAYS INTO STRINGS.SO processData:false
    processData: false,
    beforeSend: function () {
      $('.loading-image').addClass('active');
    },
    success: function (image) {
      $('.loading-image').removeClass('active');
      console.log('Promo image success uploaded');
      console.log('URL:' + image);
      // $( ".promo-image-popup img").attr("src", image.url);

      $(".promo-image-popup img").remove();
      var myImage = new Image();
      myImage.src = '//' + image.url;

      $(".promo-image-popup").append(myImage);
    }
  });
});

$("input[name='acceptConditions']").change(function () {
  console.log('Consitions check toogled');
  if ($(this).is(':checked')) {
    $(".sendPromo").prop("disabled", false);  // checked
  } else {
    $(".sendPromo").prop("disabled", true);  // unchecked
  }
});

$('.button.sendPromo').on('click', function (e) {
  var form = $("form.promotionForm");


  $.ajax({
    type: "POST",
    url: "/api/promotion",
    data: $(form).serialize(),//only input
    success: function (response) {
      console.log(response);
    },
    error: function (error) {
      console.error(error);
    }
  });

  e.preventDefault();
  return false;
});


function cleanFormData() {
  $('form.promotionForm')[0].reset();
  $('.summernote').each(function (i, e) { $(e).summernote("reset") });
}

/*Check if user adds webapp to HomeScreen*/
window.addEventListener('beforeinstallprompt', function (e) {
  // beforeinstallprompt Event fired

  // e.userChoice will return a Promise.
  // For more details read: https://developers.google.com/web/fundamentals/getting-started/primers/promises
  e.userChoice.then(function (choiceResult) {

    console.log(choiceResult.outcome);

    if (choiceResult.outcome == 'dismissed') {
      console.log('User cancelled home screen install');
    } else {
      console.log('User added to home screen');
    }
  });
});


window.onpopstate = function (event) {
  alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
};


var checkPromoId = function (urlId) {
  if (urlId == '') {
    $('#url-check').removeClass('error');
    $('.url-check-alert').hide();
  } else {



    jQuery.ajax({
      type: 'GET',
      url: '//' + window.location.host + '/api/available/' + urlId,
      dataType: 'json',
      beforeSend: function () {
        $('#url-check').parent().addClass('loading');
      },
      success: function (data) {
        if (data.available == true) {
          $('#url-check').removeClass('error');
          $('.url-check-alert').hide();
          $('#url-check').parent().removeClass('loading');

        } else {
          $('#url-check').addClass('error');
          $('.url-check-alert').html('El nombre del enlace ya está en uso.');
          $('.url-check-alert').show();
          console.log("error ajax enlace");
        }
      },
      error: function (error) {
        $('.url-check-alert').html('Compruebe la conexión a Internet!');
        console.error(error);
        $('.url-check-alert').show();
      }
    });

  }
};


/*Map chooser*/
var marker;
var mapInput = document.getElementById('pac-input');

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {
      lat: 59.325,
      lng: 18.070
    }
  });


  // Create the search box and link it to the UI element.
  var searchBox = new google.maps.places.SearchBox(mapInput);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(mapInput);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  // Handle new searches and change marker in map
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();
    var place = places[0];
    console.log(place.formatted_address);
    marker.setMap(null);
    var bounds = new google.maps.LatLngBounds();
    marker = new google.maps.Marker({
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location
    });
    //Change address on input on marker drag
    marker.addListener('dragend', markerDragHandler);


    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }


    map.fitBounds(bounds);
  });

  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.BOUNCE,
    position: {
      lat: 59.327,
      lng: 18.067
    }
  });
  /* marker.addListener('click', toggleBounce);*/

  //Change address on input on marker drag
  marker.addListener('dragend', markerDragHandler);

}

function markerDragHandler() {
  var geocoder = new google.maps.Geocoder();
  console.log('changed position');
  var position = marker.getPosition();
  console.log(position.toJSON());

  document.getElementById('lat').value = position.lat;
  document.getElementById('lng').value = position.lng;
  // document.getElementById('postcode').value = ;
  // document.getElementById('address').value = ;
  geocoder.geocode({
    'location': position
  }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        console.log(results[0].formatted_address);
        mapInput.value = results[0].formatted_address;
        var zipcode;
        for (var i = 0; i < results.length; i++) {
          for (var j = 0; j < results[i].address_components.length; j++) {
            for (var k = 0; k < results[i].address_components[j].types.length; k++) {
              if (results[i].address_components[j].types[k] == "postal_code") {
                zipcode = results[i].address_components[j].short_name;

                document.getElementById('postcode').value = zipcode;
              }
            }
          }
        }
        document.getElementById('address').value = results[0].formatted_address;
      } else {
        console.log('No results found');
      }
    } else {
      console.log('Geocoder failed due to: ' + status);
    }
  });
}


$(document).ready(function () {


  function modifyPromotion(promo_id) {

    jQuery.ajax({
      type: 'GET',
      url: '//' + window.location.host + '/api/promotion/' + promo_id,
      dataType: 'json',
      success: function (promotion) {

        $("input[name='updatePromotionId']").val(promo_id);

        $("textarea[name='promoTitle']").val(promotion.promoTitle);

        $(".promo-image-popup img").attr("src", promotion.promoImage);

        $("textarea[name='promoDescription']").summernote('code', promotion.promoDescription);
        $("textarea[name='promoLegalCond']").summernote('code', promotion.promoLegalCond);

        $("input[name='showLocalization']").val(promotion.showLocalization);
        $("input[name='lat']").val(promotion.lat);
        $("input[name='lng']").val(promotion.lng);
        $("input[name='postalCode']").val(promotion.postalCode);
        $("input[name='fullAddress']").val(promotion.fullAddress);

        $("textarea[name='promoContactDetails']").summernote('code', promotion.promoContactDetails);

        $("input[name='promoId']").val(promotion.promoId);  //promotion URL
        $("input[name='promoId']").prop("disabled", true);  //promotion URL

        $(".social-image-popup img").attr("src", promotion.socialImage);

        $('#rangestart').calendar('set date', new Date(promotion.startDate), true, false);
        $('#rangeend').calendar('set date', new Date(promotion.endDate), true, false);

        $("input[name='winnersNumber']").val(promotion.winnersNumber);
        $("input[name='itemMeanPrice']").val(promotion.itemMeanPrice);

        $("input[name='facebookTrackingPixel']").val(promotion.facebookTrackingPixel);
        $("input[name='googleTrackingPixel']").val(promotion.googleTrackingPixel);

      },
      error: function (error) {
        console.error(error);
      }
    });
  }


  $('.modifyPromo').click(function () {

    var id = $(this).data('id');
    console.log('modifyPromo: ' + id);
    modifyPromotion(id);
    showEditPromo();
  });


  //Create promotion button
  $('.add-promo').on('click', function () {
    cleanFormData();
    showEditPromo();
    $("input[name='promoId']").prop("disabled", false);  //promotion URL
    //Set today at calendar
    $('#rangestart').calendar('set date', new Date(), true, false);
    $('#rangeend').calendar('set date', new Date(), true, false);
  })


  /*Particiapants table (with DataTable)*/
  $('#participants-table').DataTable({

    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.10.13/i18n/Spanish.json'
    }

  });

  /*Promo url checker*/
  var timeOut;
  $('#url-check').keyup(function (e) {
    clearTimeout(timeOut);
    var urlId = $(this).val();
    timeOut = setTimeout(function () {
      checkPromoId(urlId);
    }, 400);
  });
  //Replace unwanted characters with dash (-)
  $('#url-check').on('keydown keyup change focus blur', function (e) {
    $(this).val($(this).val().replace(/[^a-zA-Z0-9_.-]/g, '-'));
  });


  /*Step menu bar*/
  var showListPromo = function () {
    window.history.pushState({ promociones: 'promociones' }, 'Mis promociones', '/promociones');

    $('.list-promo').show();
    $('.list-promo-step').addClass('active');

    $('.edit-promo').hide();
    $('.stats-promo').hide();
    $('.edit-promo-step').removeClass('active');
    $('.stats-promo-step').removeClass('active');

  };

  var showEditPromo = function () {
    window.history.pushState({ promociones: 'editar-promoción' }, 'Editar promoción', '/editar-promocion');
    $('.edit-promo').show();
    $('.edit-promo-step').addClass('active');

    $('.stats-promo').hide();
    $('.list-promo').hide();
    $('.stats-promo-step').removeClass('active');
    $('.list-promo-step').removeClass('active');
  };

  var showStatsPromo = function () {
    window.history.pushState({ promociones: 'estadísticas' }, 'Estadísticas', '/estadisticas');
    $('.stats-promo').show();
    $('.stats-promo-step').addClass('active');

    $('.list-promo').hide();
    $('.edit-promo').hide();
    $('.list-promo-step').removeClass('active');
    $('.edit-promo-step').removeClass('active');
  };



  $('.list-promo-step').click(function () {
    showListPromo();
  });

  $('.edit-promo-step').click(function () {
    showEditPromo();
  });

  $('.stats-promo-step').click(function () {
    showStatsPromo();
  });


  $('.add-promo').click(function () {
    showEditPromo();
  });

  var formState = 0;
  $('.form-navigate .next').click(function () {
    if (formState === 0) {
      $('.form-navigate .back').removeClass('disabled');
      //$('.form-navigate .next').addClass('disabled');
      $('.second-form').show();
      $('.first-form').hide();

      //Show submit button
      $('.sendPromo').show();
      $('.form-navigate .next').hide();
      formState = 1;
    }
  });

  $('.form-navigate .back').click(function () {
    if (formState === 1) {
      $('.form-navigate .next').show();
      $('.sendPromo').hide();
      $('.form-navigate .next').removeClass('disabled');
      $('.form-navigate .back').addClass('disabled');
      $('.first-form').show();
      $('.second-form').hide();
      formState = 0;
    }
  });

  /*Prevent Enter on title textarea*/
  $('.promo-title').on('keydown keyup change focus blur', function (e) {
    if (e.type === 'change') {
      // this event is triggered when the text is changed through drag and drop too,
      // or by pasting something inside the textarea;
      // remove carriage returns (\r) and newlines (\n):
      $(this).val($(this).val().replace(/\r?\n/g, ' '));
    }
    if (e.which === 13) {
      // the enter key has been pressed, avoid producing a carriage return from it:
      e.preventDefault();
    }
  });

  /*Limit characters on promotion title*/
  $('.promo-title').keyup(function () {
    var len = $(this).val().length;
    var text_max = 140;

    if (len >= text_max) {
      $(this).val($(this).val().substring(0, text_max));
      $('#textarea_feedback').text('0 caracteres restantes. Has alcanzado el límite.');
    } else if (len === text_max - 1) {
      $('#textarea_feedback').text('1 carácter restante.');
    } else {
      $('#textarea_feedback').text((text_max - len) + ' caracteres restantes');
    }

  });






  /*Statistics - Chart.js*/
  Chart.defaults.global.responsive = true;
  Chart.defaults.global.maintainAspectRatio = false;

  var ctx = document.getElementById("lineChart");

  var barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        "00h",
        "01h",
        "02h",
        "03h",
        "04h",
        "05h",
        "06h",
        "07h",
        "08h",
        "09h",
        "10h",
        "11h",
        "12h",
        "13h",
        "14h",
        "15h",
        "16h",
        "17h",
        "18h",
        "19h",
        "20h",
        "21h",
        "22h",
        "23h",
        "24h",


      ],
      datasets: [{
        label: 'Participantes',
        data: [
          1,
          0,
          0,
          0,
          0,
          1,
          2,
          8,
          19,
          14,
          16,
          10,
          31,
          54,
          10,
          20,
          5,
          0,
          3,
          1,
          0,
          19,
          16,
          9
        ],
        backgroundColor: "#ffe0e6",
        borderColor: "#ff89a2",
        borderWidth: 1
      }, {
        label: 'Visualizaciones',
        data: [
          5,
          4,
          0,
          0,
          1,
          4,
          9,
          15,
          24,
          30,
          23,
          23,
          56,
          100,
          88,
          30,
          13,
          5,
          30,
          10,
          15,
          40,
          73,
          10
        ],
        backgroundColor: "#fff5dd",
        borderColor: "#ffda7d",
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          stacked: false,
        }],
        xAxes: [{
          gridLines: {
            display: false
          }
        }]


      }
    }
  });






  /*File picker===============================*/
  $('.ui.file.input').find('input:text, .ui.button')
    .on('click', function (e) {
      $(e.target).parent().find('input:file').click();
    });

  //For multiple files format
  $('input:file', '.ui.file.input')
    .on('change', function (e) {
      var file = $(e.target);
      var name = '';

      for (var i = 0; i < e.target.files.length; i++) {
        name += e.target.files[i].name + ', ';
      }
      // remove trailing ","
      name = name.replace(/,\s*$/, '');

      $('input:text', file.parent()).val(name);
    });


  /*Calendar range*/
  var spanishCalendarText = {
    days: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    today: 'Hoy',
    now: 'Ahora',
    am: 'AM',
    pm: 'PM',
    noampm: ' h', //custom added text
    datetimeSeparator: ' - ' //custom added text
  };

  /*Time format template*/
  var timeFormat = function (date, settings, forCalendar) {
    if (!date) {
      return '';
    }
    var hour = date.getHours();
    var minute = date.getMinutes();
    var ampm = '';
    if (settings.ampm) {
      ampm = ' ' + (hour < 12 ? settings.text.am : settings.text.pm);
      hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    } else {
      ampm = settings.text.noampm;
    }
    return hour + ':' + (minute < 10 ? '0' : '') + minute + ampm;
  };
  /*Date format template*/
  var dateFormat = function (date, settings) {
    if (!date) return '';
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return day + '/' + month + '/' + year;
  };
  /*DateTimeFormat template*/
  var dateTimeFormat = function (date, settings) {
    if (!date) {
      return '';
    }
    var day = settings.type === 'time' ? '' : settings.formatter.date(date, settings);
    var time = settings.type.indexOf('time') < 0 ? '' : settings.formatter.time(date, settings, false);
    var separator = settings.type === 'datetime' ? settings.text.datetimeSeparator || ' ' : '';
    return day + separator + time;
  };

  //First calendar
  var calendar1SelectedDate = $('#rangestart').calendar('get date');

  $('#rangestart').calendar({
    //type: 'date',
    firstDayOfWeek: 1,
    ampm: false,
    endCalendar: $('#rangeend'),
    onChange: function (date, text) {
      //$('#rangeend').calendar('set startDate', date);
      console.log("start date: " + date);
      //$('#rangeend').calendar.settings.maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5);
      $('#rangeend').focus(false);
      console.log($('#rangeend').calendar.settings.maxDate);
      endcalendar.maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 15);
      $('#rangeend').calendar(endcalendar);
      $('#rangeend').calendar('refresh');

      //Update form values
      $('.startDateHidden').val($('#rangestart').calendar('get date').toISOString());
      $('.endDateHidden').val($('#rangeend').calendar('get date').toISOString());

    },
    minDate: new Date(),
    disableYear: true,
    text: spanishCalendarText,
    formatter: {
      date: dateFormat,
      time: timeFormat,
      datetime: dateTimeFormat
    }
  });

  //Set today at first calendar
  $('#rangestart').calendar('set date', new Date(2015, 5, 25, 0, 0, 0, 0), true, false);

  //Second calendar
  var endcalendar = {
    //type: 'date',
    firstDayOfWeek: 1,
    ampm: false,
    startCalendar: $('#rangestart'),
    // endCalendar:  new Date($('#rangestart').calendar('get date').getFullYear(), $('#rangestart').calendar('get date').getMonth(), $('#rangestart').calendar('get date').getDate() + 5),
    //maxDate: new Date(), 
    //  today: true,
    disableYear: true,
    onChange: function (date, text) {

      console.log("end date: " + date);


      //Update form values
      $('.startDateHidden').val($('#rangestart').calendar('get date').toISOString());
      $('.endDateHidden').val($('#rangeend').calendar('get date').toISOString());

    },
    //maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
    //maxDate: new Date($('#rangestart').calendar('get date').getFullYear(), $('#rangestart').calendar('get date').getMonth(), $('#rangestart').calendar('get date').getDate() + 5),
    //endCalendar: $('#rangestart'),
    text: spanishCalendarText,
    formatter: {
      date: dateFormat,
      time: timeFormat,
      datetime: dateTimeFormat
    }

  };

  $('#rangeend').calendar(endcalendar);
  $('#rangeend').calendar('set date', new Date(), true, false);



  $('.startDateHidden').val($('#rangestart').calendar('get date').toISOString());
  $('.endDateHidden').val($('#rangeend').calendar('get date').toISOString());







  /*Checkbox input*/
  $('.ui.checkbox').checkbox();



  /*Popup UI*/
  //Social networks Image
  $('.file2-label')
    .popup({
      popup: '.social-image-popup',
      lastResort: true,
      position: 'right center'
    });

  $('.file1-label')
    .popup({
      popup: '.promo-image-popup',
      lastResort: true,
      position: 'right center'
    });


  /*Textarea Editor*/
  $('.summernote').summernote({
    height: 100, // set editor height
    minHeight: 40, // set minimum height of editor
    maxHeight: null, // set maximum height of editor
    disableDragAndDrop: true,
    shortcuts: false,
    focus: false, // set focus to editable area after initializing summernote
    fontSizes: ['8', '9', '10', '11', '12', '14', '18' /*, '24'*/],
    lang: 'es-ES', // default: 'en-US'
    toolbar: [
      // [groupName, [list of button]]
      ['style', ['bold', 'italic', 'underline']],
      ['font', ['Lato', 'Roboto', 'Arial', 'Arial Black', 'Comic Sans MS']],
      ['fontsize', ['fontsize']],
      ['para', ['ul', 'ol', 'paragraph']],
      // ['misc', ['emojiList']]
    ],
    callbacks: {
      onPaste: function (e) {
        var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');

        e.preventDefault();

        // Firefox fix
        setTimeout(function () {
          document.execCommand('insertText', false, bufferText);
        }, 10);
      }
    }
  });





});