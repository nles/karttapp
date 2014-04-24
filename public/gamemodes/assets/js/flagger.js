window.Flagger = {
  scope: null,
  flags: [],
  guesses: [],
  init: function(){
    // tässä vaiheessa angular on jo luonut scopen,
    // joten otetaan se käyttöön
    this.scope = angular.element($("#ng-view")).scope();
    if(!this.scope.gameStarted){
      Connect.generatePopup('start-popup');
      // ilmoitellaan scopellekin että nyt mennään
      this.scope.startGame();
    }
  },
  startGame: function(){
    $("#start-popup .preloader").show();
    $("#start-popup .popup-content").hide();
    Map.setupMap(Flagger.countryClick,function(){
      setTimeout(function(){
        $("#overlay-wrapper").show();
        startGame(Flagger);
        $.magnificPopup.close();
      },2)
    })
  },
  skipQuestion: function(){

  },
  newRound: function(){
    var regionData = new Array();
    for(var i in Map.countryData){
      var country = Map.countryData[i];
      if(country["region-code"] == 150){
        regionData.push(country);
      }
    }

    countries = new Array();
    usedIndexes = new Array();
    for(var i = 0; i < 6; i++){
      do {
        index = getRandomInt(0,regionData.length-1);
      } while($.inArray(index,usedIndexes) != -1);
      usedIndexes.push(index);
      countries.push(regionData[index]["alpha-3"]);
    }

    for(var i in Map.allPolygons){
      var polygon = Map.allPolygons[i];
      var cc = polygon.get("COUNTRYCODE").toLowerCase()
      if($.inArray(polygon.get("COUNTRYCODE"),countries) > -1){
        center = Map.getPolygonCenter(polygon);
        flag = "<img src='/public/gamemodes/assets/images/flags/"+cc+".png' />"
        Map.drawOverlay(center.lat(),center.lng(),flag,"fff");
        Flagger.scope.flags.push({countryCode:cc})
      }
    }

    window.setTimeout(function(){
      copies = $('<div id="ocs">')
      $("#gmaps .overlay").each(function(i,e){
        pos = $(e).offset();
        copy = $("<div class='overlay overlay-copy'>"+e.innerHTML+"</div>")
        copy.css("top",pos.top).css("left",pos.left)
        copies.append(copy);
      })
      $('body').append(copies);
      var flagMenuCenter = $("#flag-menu").getCenter()
      $("#gmaps .overlay").hide();
      $("#ocs .overlay-copy").animate({"left":flagMenuCenter.x,"top":flagMenuCenter.y+50,"opacity":0},500)
      var showFlag = function(){
        $("#flag-menu li:hidden:first").fadeIn(100,showFlag);
      }
      showFlag();
      var it = $("#flag-menu .info-text")
      var _itT = it.text();
      it.text(it.attr("data-swap")).attr("data.swap",_itT);
    },5000);

    // jatkoa seuraa ...
    // answers =
  },
  countryClick: function(e,d){
    polygon = this;
    answer = "FIN"
    var cc = polygon.get("COUNTRYCODE")
    // sallitaan vain sellaiset joita ei ole jo arvattu tai vastattu
    if($.inArray(cc,Map.quessedCountries)){
      // sallitaan vastaus sekunnin välein
      if(Map.allowClick){
        Map.allowClick = false
        window.setTimeout(function(){ Map.allowClick = true },1000);
        Map.guessedCountries.push(cc)
        Map.activeCountryPolygon = polygon;
        if(cc == answer){
          // toimet jos vastaus on oikein
          answerCountry = Map.getCountryNameByCode(cc);
          // maalataan vastaus keskelle maata
          center = Map.getActivePolygonCenter();
          flag = "<img src='/public/gamemodes/assets/images/flags/fin.png' />"
          Map.drawOverlay(center.lat(),center.lng(),flag,"fff")
        } else {
          // toimet jos vastaus on väärin
          Map.guessedPolygons.push(polygon)
          // maalataan
          this.setOptions({
            "fillOpacity":1,
            "strokeWeight":1
          })
          // näytetään viesti
          // addMessage("You guessed <strong>"+getCountryNameByCode(cc)+"</strong>, but that was incorrect","danger");
        }
      }
    }
  }
}
