window.initConnectGame = function(){
  setupMap();
}
var scope = null;
var connectGameStarted = false;
var activeCountryPolygon = null;
var map = null;
var question = null;
var answer = null;
var setupMap = function(){
  // tässä vaiheessa angular on jo luonut scopen,
  // joten otetaan se käyttöön
  scope = angular.element($("#ng-view")).scope()
  //Kartan luonti, lat&lng+zoom kohdilleen, jotta näkymä oikein
  //Kartan zoomauksen ja siirtämisen esto?
  map = new GMaps({
    disableDoubleClickZoom: true,
    div:"#gmaps",
    height: '100%',
    lat: 50,
    lng: 20,
    zoom: 4,
    controls:{
      zoomControl: false
    }
  })
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
          activeCountryPolygon = polygon;
          // toimet jos vastaus on oikein
          if(cc == answer){
            if(this.get("CLICKED") == 'undefined' || !this.get("CLICKED")){
              clearTimer();
              this.set("CLICKED",true);
              generatePopup('color-popup');
              // poistetaan vastaus
              for(i in scope.questions){
                if(scope.questions[i].country == cc) scope.questions.splice(i,1);
              }
            } else {
              this.set("CLICKED",false)
              this.setOptions({
                "fillOpacity":0,
                "strokeWeight":0
              })
            }
          // toimet jos vastaus on väärin
          } else {
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
            scope.$apply(function(){
              scope.roundMessages.push({text:"You guessed "+cc+", but that was incorrect"});
            })
          }
        }
      })
      countryPolygon.set("COUNTRYCODE",country.id);
    }
  })
  // värivalikon alustus
  $(".pick-a-color").pickAColor({
    showSpectrum: false,
    showAdvanced: false,
    showSavedColors: false,
    showHexInput: false
  });
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
    // aloitetaan uusi kierros
    newRound();
  })
  // popup aloituksesta
  $("#start-popup .btn").click(function(){
    startGame();
    $.magnificPopup.close();
  })
  if(!connectGameStarted){
    generatePopup('start-popup');
    connectGameStarted = true;
    // helpottamaan testausta
    // setTimeout(function(){ $("#start-popup .btn:first").trigger('click') },200);
  } else {
    // päivitetään kartta
    setTimeout(function(){
      map.refresh();
    },200);
  }
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
}
function newRound(){
  var questions = scope.questions;
  var random = Math.floor(Math.random() * questions.length)
  scope.$apply(function(){
    scope.question = questions[random].name;
    scope.roundMessages = [];
  })
  question = questions[random].name;
  answer = questions[random].country;
  // tyhjätään ja aloitetaan kello
  clearTimer();
  roundClock = window.setInterval(function(){
    var progressBarWidth = progressBar.width();
    progressBar.width(progressBarWidth + 20);
    if(progressBarWidth >= progressBarWrapperWidth) window.clearInterval(roundClock)
  }, 1000)
}
function clearTimer(){
  window.clearInterval(roundClock)
  progressBar.width(0);
}
function generatePopup(popupId){
  $.magnificPopup.open({
    items: {
      src: '#'+popupId
    },
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
