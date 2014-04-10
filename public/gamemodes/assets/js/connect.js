window.initConnectGame = function(){
  // tässä vaiheessa angular on jo luonut scopen,
  // joten otetaan se käyttöön
  scope = angular.element($("#ng-view")).scope();
  if(!scope.gameStarted){
    generatePopup('start-popup');
    // ilmoitellaan scopellekin että nyt mennään
    scope.startGame();
  }
  // popup aloituksesta
  $("#start-popup .btn").click(function(){
    questionGroup = $(this).attr('data-group')
    $("#start-popup .preloader").show();
    $("#start-popup .popup-content").hide();
    setupMap(function(){
      // muutama sekunti aikaa valmistautua ;D
      setTimeout(function(){
        $("#overlay-wrapper").show();
        startGame();
        $.magnificPopup.close();
      },2000)
    })
  })
}
window.skipConnectQuestion = function(){
  skipQuestion();
}
var scope = null;
var activeCountryPolygon = null;
var allowAnswer = true;
var map = null;
var question = null;
var answer = null;
var guessed = [];
var questionGroup = null;
var mapStyle = null;
var allPolygons = []
var guessedPolygons = []
var correctAnswersOpened = []

var setupMap = function(callback){
  // haetaan scopesta setti kysymyksiä
  questions = scope.questions[questionGroup];
  //Kartan luonti, lat&lng+zoom kohdilleen, jotta näkymä oikein
  //Kartan zoomauksen ja siirtämisen esto?
  mapStyle = [
    {
     featureType: "water",
     elementType: "labels",
     stylers: [
      {visibility:"off"}
     ]
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [
        {visibility:"off"}
      ]
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [
        {visibility:"off"}
      ]
    },
    {
      featureType: "administrative.locality",
      elementType: "all",
      stylers:[
        {visibility:"off"}
      ]
    },
    {
      featureType: "administrative.province",
      elementType: "all",
      stylers:[
        {visibility:"off"}
      ]
    }
  ];
  map = new GMaps({
    disableDoubleClickZoom: true,
    div:"#gmaps",
    height: '100%',
    lat: 30,
    lng: 20,
    zoom: 3,
    disableDefaultUI:true,
    minZoom: 2,
    maxZoom: 6,
    mapTypeControlOptions:{
      mapTypeIds: [
        'mapstyle'
      ]
    },
    mapTypeId: 'mapstyle'
  })
  map.map.mapTypes.set('mapstyle', new google.maps.StyledMapType(mapStyle,{name:"mapstyle"}))
  //Layeri jokaiselle maalle
  $.getJSON("public/public/data/countries/countries.geo.json",function(data){
    for(i in data.features){
      var country = data.features[i]
      var type = country.geometry.type
      countryPolygon = map.drawPolygon({
        paths: country.geometry.coordinates,
        useGeoJSON: true,
        strokeOpacity: 1,
        strokeWeight: 0,
        fillColor: "#CD5C5C",
        fillOpacity: 0,
        click: function(e,d){
          polygon = this;
          var cc = polygon.get("COUNTRYCODE")
          // sallitaan vain sellaiset joita ei ole jo arvattu tai vastattu
          if($.inArray(cc,guessed) === -1 && $.inArray(cc,correctAnswersOpened) === -1){
            // sallitaan vastaus sekunnin välein
            if(allowAnswer){
              allowAnswer = false
              window.setTimeout(function(){
                allowAnswer = true
              },1000);
              guessed.push(cc)
              activeCountryPolygon = polygon;
              // toimet jos vastaus on oikein
              if(cc == answer){
                answerCountry = getCountryNameByCode(cc);
                addMessage("You answered <strong>"+answerCountry+"</strong> correctly!","success");
                scope.$apply(function(){
                  scope.points += 10*(1+scope.multiplier);
                  scope.multiplier += 1;
                })
                clearTimer();
                generatePopup('color-popup');
                $(".message","#color-popup").html("<strong>"+answerCountry+"</strong> was correct! Give a color to the country")
                // poistetaan vastaus
                for(i in questions){
                  if(questions[i].country == cc) questions.splice(i,1);
                }
              // toimet jos vastaus on väärin
              } else {
                guessedPolygons.push(polygon)
                // kerroin tyhjäksi
                scope.$apply(function(){
                  scope.multiplier = 0;
                });
                // maalataan
                this.setOptions({
                  "fillOpacity":1,
                  "strokeWeight":1
                })
                // animoi liikettä
                center = getActivePolygonCenter()
                for(var i = 1; i <= 5; i++){
                  if(i == 5){
                    x = 0;
                  } else {
                    var x = 1/i;
                    if(i % 2 == 0) x = x * (-1)
                  }
                  setTimeout("movePolygon("+x+",0)",50*i)
                }
                // näytetään viesti
                addMessage("You guessed <strong>"+getCountryNameByCode(cc)+"</strong>, but that was incorrect","danger");
              }
            }
          }
        }
      })
      countryPolygon.set("COUNTRYCODE",country.id);
      allPolygons.push(countryPolygon)
    }
    google.maps.event.addListenerOnce(map.map, 'idle', callback);
  })
  $("#color-popup .accept-btn").click(function(){
    var selectedColor = $("#color-popup .pick-a-color").val()
    activeCountryPolygon.setOptions({
      "fillColor":"#"+selectedColor,
      "fillOpacity":0.5,
      "strokeWeight":1
    })
    $.magnificPopup.close();
    // maalataan vastaus keskelle maata
    center = getActivePolygonCenter();
    drawAnswer(map,center.lat(),center.lng(),question,selectedColor)
    correctAnswersOpened.push(answer)
    // aloitetaan uusi kierros
    newRound();
  })
}
var roundClock = null;
var progressBarWrapper = null;
var progressBarWrapperWidth = null;
var progressBar = null;
function startGame(){
  progressBarWrapper = $("#round-info .progress")
  progressBarWrapperWidth = progressBarWrapper.width();
  progressBar = $("#round-info .progress .progress-bar")
  newRound();
  scope.$apply(function(){
    scope.roundMessages = [];
  })
}
function newRound(){
  if(questions.length > 0){
    // unohdetaan väärät vastaukset ja poistetaan värit
    guessed = []
    $.each(guessedPolygons,function(i,p){
      this.setOptions({
        "fillOpacity":0,
        "strokeWeight":0
      });
    });
    guessedPolygons = []
    // arvotaan satunainen kysymys
    var random = Math.floor(Math.random() * questions.length)
    scope.$apply(function(){
      scope.question = questions[random].name;
    })
    question = questions[random].name;
    answer = questions[random].country;
    // tyhjätään ja aloitetaan kello
    clearTimer();
    roundClock = window.setInterval(function(){
      var progressBarWidth = progressBar.width();
      progressBar.width(progressBarWidth + 20);
      if(progressBarWidth >= progressBarWrapperWidth){
        window.clearInterval(roundClock)
        timeOut();
      }
    }, 1000)
  } else {
    endGame();
  }
}
function timeoutOrSkip(){
  clearTimer();
  scope.$apply(function(){
    scope.multiplier = 0;
  })
  // etsitään oikea vastaus
  $.each(allPolygons,function(i,p){
      if(p.get("COUNTRYCODE") == answer){
        activeCountryPolygon = p
      }
  })
  // poistetaan vastaus
  for(i in questions){
    if(questions[i].country == answer) questions.splice(i,1);
  }
}
function skipQuestion(){
  timeoutOrSkip();
  var answerCountry = getCountryNameByCode(answer);
  addMessage("Skipped this one. The correct answer was <strong>"+answerCountry+"</strong>","warning")
  generatePopup('color-popup');
  $(".message","#color-popup").html("Skipped. The answer was <strong>"+answerCountry+"</strong>. Give a color to the country")
}
function timeOut(){
  timeoutOrSkip();
  var answerCountry = getCountryNameByCode(answer);
  addMessage("Your time ran out! The correct answer was <strong>"+answerCountry+"</strong>","warning")
  generatePopup('color-popup');
  $(".message","#color-popup").html("You ran out of time! The answer was <strong>"+answerCountry+"</strong>. Give a color to the country")
}
function clearTimer(){
  window.clearInterval(roundClock)
  progressBar.width(0);
}
function addMessage(text,type){
  $("#status").show()
  scope.$apply(function(){
    scope.roundMessages.push({text: text, type: type});
  })
  window.setTimeout(function(){
    if($("#status .alert").length > 3) var tooManyMessages = true
    if(tooManyMessages) $("#status .alert:visible:first").fadeOut()
  },1000)
}
function generatePopup(popupId){
  switch(popupId){
    case "color-popup":
      // värivalikon alustus
      var popup = $("#color-popup");
      $("#color-select",popup).html('<input type="text" value="fff" name="country-color" class="pick-a-color form-control">')
      var availableColors = {
        red       : 'ff0000',
        orange    : 'ff6600',
        yellow    : 'ffff00',
        green     : '008000',
        blue      : '0000ff',
        purple    : '800080',
        black     : '000000'
      }
      $(".pick-a-color",popup).pickAColor({
        showSpectrum: false,
        showAdvanced: false,
        showSavedColors: false,
        showHexInput: false,
        basicColors: availableColors
      });
      $(".pick-a-color").bind('change',function(){
        var selected = $(this).val()
        var selectedName = ""
        $.each(availableColors,function(k,v){
          if(v == selected) selectedName = k;
        })
        if(selectedName != '')
          $("#selected-color").text("color "+selectedName+" selected")
      });
      $(".pick-a-color",popup).val("fff")
      var selectedText = $("#color-popup #selected-color")
      selectedText.text(selectedText.attr('data-default-text'))
    break;
  }
  $.magnificPopup.open({
    items: {
      src: '#'+popupId
    },
    modal: true,
    type: 'inline'
  });
}
function drawAnswer(map,lat,lng,text,color){
  map.drawOverlay({
    lat: lat,
    lng: lng,
    content: '<div class="overlay" style="border-color:#'+color+'">'+text+'</div>'
  });
}
function getActivePolygonCenter(){
  var bounds = new google.maps.LatLngBounds();
  var paths = activeCountryPolygon.getPaths();
  paths.forEach(function(path){
    var points = path.getLength()
    for(var i = 0; i < points; i++){
      var coords = path.getAt(i)
      bounds.extend(coords)
    }
  })
  return bounds.getCenter();
}
function movePolygon(x,y){
  activeCountryPolygon.moveTo(new google.maps.LatLng(center.lat()+y, center.lng()+x))
}
function getCountryNameByCode(code){
  var data = scope.country_data
  for(var i in data){
    if(data[i]['alpha-3'] == code) return data[i].name
  }
}
function endGame(){
  generatePopup('savescore-popup');
}
