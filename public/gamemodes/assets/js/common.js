window.Map = {
  map: null,
  allowClick: true,
  allPolygons: [],
  guessedCountries: [],
  guessedPolygons: [],
  activeCountryPolygon: null,
  countryData: {},
  setupMap: function(countryClickAction,callback){
    //Kartan luonti, lat&lng+zoom kohdilleen, jotta näkymä oikein
    //Kartan zoomauksen ja siirtämisen esto?
    var mapStyle = [
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
    this.map = new GMaps({
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
    this.map.map.mapTypes.set('mapstyle', new google.maps.StyledMapType(mapStyle,{name:"mapstyle"}))
    //Layeri jokaiselle maalle
    $.getJSON("public/public/data/countries/countries.geo.json",function(data){
      for(i in data.features){
        var country = data.features[i]
        var type = country.geometry.type
        countryPolygon = Map.map.drawPolygon({
          paths: country.geometry.coordinates,
          useGeoJSON: true,
          strokeOpacity: 1,
          strokeWeight: 0,
          fillColor: "#CD5C5C",
          fillOpacity: 0,
          click: countryClickAction
        })
        countryPolygon.set("COUNTRYCODE",country.id);
        Map.allPolygons.push(countryPolygon)
      }
      google.maps.event.addListenerOnce(Map.map.map, 'idle', callback);
    })
    // maakohtaiset tiedot
    $.getJSON("/public/public/data/countries/country_data.json",function(data){
      Map.countryData = data;
    });
  },
  getActivePolygonCenter: function(){
    return this.getPolygonCenter(this.activeCountryPolygon);
  },
  getPolygonCenter: function(polygon){
    var bounds = new google.maps.LatLngBounds();
    var paths = polygon.getPaths();
    paths.forEach(function(path){
      var points = path.getLength()
      for(var i = 0; i < points; i++){
        var coords = path.getAt(i)
        bounds.extend(coords)
      }
    })
    return bounds.getCenter();
  },
  movePolygon: function(x,y){
    this.activeCountryPolygon.moveTo(new google.maps.LatLng(center.lat()+y, center.lng()+x))
  },
  drawOverlay: function(lat,lng,text,color){
    this.map.drawOverlay({
      lat: lat,
      lng: lng,
      content: '<div class="overlay" style="border-color:#'+color+'">'+text+'</div>'
    });
  },
  getCountryNameByCode: function(code){
    for(var i in Map.countryData){
      if(Map.countryData[i]['alpha-3'] == code) return Map.countryData[i].name
    }
  }
}

var roundClock = null;
var progressBarWrapper = null;
var progressBarWrapperWidth = null;
var progressBar = null;

function startGame(game){
  progressBarWrapper = $("#round-info .progress")
  progressBarWrapperWidth = progressBarWrapper.width();
  progressBar = $("#round-info .progress .progress-bar")
  game.newRound();
  game.scope.$apply(function(){
    game.scope.roundMessages = [];
  })
}

function clearTimer(){
  window.clearInterval(roundClock)
  progressBar.width(0);
}

function addMessage(game,text,type){
  $("#status").show()
  game.scope.$apply(function(){
    game.scope.roundMessages.push({text: text, type: type});
  })
  window.setTimeout(function(){
    if($("#status .alert").length > 3) var tooManyMessages = true
    if(tooManyMessages) $("#status .alert:visible:first").fadeOut()
  },1000)
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

jQuery.fn.getCenter = function () {
  var center = new Object();
  var pos = $(this).offset();
  center.x = ((pos.left + $(this).outerWidth()) / 2);
  center.y = ((pos.top + $(this).outerHeight()) / 2);
  return center;
}
