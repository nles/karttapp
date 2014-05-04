window.Flagger = {
  scope: null,
  flags: [],
  guesses: [],
  regionCode: [],
  selectedFlagCC: null,
  guessingStarted: false,
  init: function(){
    // tässä vaiheessa angular on jo luonut scopen,
    // joten otetaan se käyttöön
    this.scope = angular.element($("#ng-view")).scope();
    this.scope.flags = new Array();
    if(!this.scope.gameStarted){
      Connect.generatePopup('start-popup');
      // ilmoitellaan scopellekin että nyt mennään
      this.scope.startGame();
    }
  },
  startGame: function(){
    $("#start-popup .preloader").show();
    $("#start-popup .popup-content").hide();
    Map.setupMap(Flagger,function(){
      setTimeout(function(){
        $("#overlay-wrapper").show();
        $("#points-and-multiply").hide();
        $.magnificPopup.close();
      },200)
    })
  },
  regionSelect: function(trigger){
    var subRegionCode = parseInt($(trigger).attr("data-src"))
    switch(subRegionCode){
      case 150: // Europe
        Flagger.regionCode = subRegionCode;
        Flagger.regionFocus = new google.maps.LatLng(47.04780089030736, 16.15828997192377)
      break;
      case 002:// Africa
        Flagger.regionCode = subRegionCode;
        Flagger.regionFocus = new google.maps.LatLng(1.2303741774326145, 21.796875)
      break;
      case 142: // Asia
        Flagger.regionCode = subRegionCode;
        Flagger.regionFocus = new google.maps.LatLng(37.16031654673677, 72.59765625)
      break;
      case 009: // Oceania
        Flagger.regionCode = subRegionCode;
        Flagger.regionFocus = new google.maps.LatLng(-27.215556209029675, 149.94140625)
      break;
      case 019: // Americas
        Flagger.regionCode = subRegionCode;
        Flagger.regionFocus = new google.maps.LatLng(18.979025953255267, -81.2109375)
      break;
    }
    $("#round-info").show();
    $("#memorize-info").show();
    $("#round-starter").hide();
    startGame(Flagger);
  },
  startGuessing: function(){
    window.clearTimeout(window.startTimer);
    Flagger.hideFlagsFromMap();
    $("#round-info").hide();
    $("#points-and-multiply").show();
    Flagger.guessingStarted = true;
  },
  skipQuestion: function(){

  },
  newRound: function(){
    var regionData = new Array();
    for(var i in Map.countryData){
      var country = Map.countryData[i];
      if(country["region-code"] == Flagger.regionCode){
        regionData.push(country);
      }
    }

    var countries = new Array();
    var usedIndexes = new Array();
    for(var i = 0; i < 6; i++){
      do {
        var index = getRandomInt(0,regionData.length-1);
      } while($.inArray(index,usedIndexes) != -1);
      usedIndexes.push(index);
      countries.push(regionData[index]["alpha-3"]);
    }

    for(var i in Map.allPolygons){
      var polygon = Map.allPolygons[i];
      var cc = polygon.get("COUNTRYCODE").toLowerCase()
      if($.inArray(polygon.get("COUNTRYCODE"), countries) != -1){
        var center = Map.getPolygonCenter(polygon);
        var flag = "<img src='/public/gamemodes/assets/images/flags/"+cc+".png' />"
        Map.drawOverlay(center.lat(),center.lng(),flag,"fff");
        Flagger.scope.flags.push({countryCode:cc})
      }
      Map.map.map.setZoom(1);
    }
    var progressPercentWidth = 0;
    window.startTimer = window.setInterval(function(){
      progressPercentWidth += 0.75;
      progressBar.width(progressPercentWidth + "%");
      if(progressPercentWidth >= 100){
        Flagger.startGuessing();
      }
    },100)
  },
  hideFlagsFromMap: function(){
    var copies = $('<div id="ocs">');
    $("#gmaps .overlay").each(function(i,e){
      var pos = $(e).offset();
      var copy = $("<div class='overlay overlay-copy'>"+e.innerHTML+"</div>")
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
    $("#skip-memorizing").hide();
  },
  giveHint: function(){
    Flagger.scope.$apply(function(){
      Flagger.scope.multiplier = 1;
    });
    Map.map.map.setCenter(Flagger.regionFocus)
    Map.map.map.setZoom(1);
    $("#gmaps .overlay:not(.guessed)").fadeIn(function(){
      setTimeout(function(){
        $("#gmaps .overlay:not(.guessed)").fadeOut();
      },1000)
    });
  },
  countryClick: function(e,d){
    if(!Flagger.guessingStarted) return
    if(!Flagger.selectedFlagCC){
      addMessage(Flagger,"Start by selecting a flag from the flag menu","info",true);
      return
    }
    var polygon = this;
    var cc = polygon.get("COUNTRYCODE")
    // sallitaan vain sellaiset joita ei ole jo arvattu tai vastattu
    if($.inArray(cc,Map.guessedCountries)){
      // sallitaan vastaus sekunnin välein
      if(Map.allowClick){
        Map.allowClick = false
        window.setTimeout(function(){ Map.allowClick = true },1000);
        Map.guessedCountries.push(cc)
        Map.activeCountryPolygon = polygon;
        var answerCountry = Map.getCountryNameByCode(cc);
        if(cc == Flagger.selectedFlagCC){
          // toimet jos vastaus on oikein
          //pisteiden lasku
          Flagger.scope.$apply(function(){
            Flagger.scope.points += 100 * Flagger.scope.multiplier;
            Flagger.scope.multiplier += 1;
          })
          // maalataan vastaus keskelle maata
          var flagOnMenu = $("#flag-menu a.selected");
          var center = Map.getActivePolygonCenter();
          var flag = "<img src='/public/gamemodes/assets/images/flags/"+cc.toLowerCase()+".png' />"
          var overlay = Map.drawOverlay(center.lat(),center.lng(),flag,"fff","flagJustAdded","guessed",true)
          addMessage(Flagger,"You answered <strong>"+answerCountry+"</strong> correctly!","success",false,true);
          // poistetaan maalaukset
          $.each(Map.guessedPolygons,function(i,e){
            e.setOptions({"fillOpacity":0,"strokeWeight":0})
          })
          // lennätä kartta kohdilleen
          var flyToPlace = function(){
            var flyingMap = flagOnMenu.clone()
            $('body').append(flyingMap)
            var addedFlag = $("#flagJustAdded")
            var posOnMenu= flagOnMenu.offset();
            addedFlag.show();
            var addedFlagOffset = addedFlag.offset();
            flyingMap
              .css("position","fixed")
              .css("z-index",1000)
              .css("left",posOnMenu.left+2)
              .css("top",posOnMenu.top+2)
            var flyToTop = addedFlagOffset.top-(addedFlag.height()/2)
            var flyToLeft = addedFlagOffset.left-(addedFlag.width()/2)
            //
            addedFlag.hide().removeAttr("id");
            flyingMap.animate({"top":flyToTop,"left":flyToLeft},500,function(){
              addedFlag.show();
              overlay.draw();
              flyingMap.hide();
            })
          }
          // suoritetaan asetettu kun overlay on paikoillaan...
          setTimeout(function(){ flyToPlace(); removeFromMenu(); },100)
          // poista flag-menusta
          var removeFromMenu = function(){
            Flagger.scope.$apply(function(){
              $.each(Flagger.scope.flags,function(i,e){
                if(e && cc === e.countryCode.toUpperCase()) Flagger.scope.flags.splice(i,1)
              })
            })
            //lopeta peli
            if(Flagger.scope.flags.length === 0){
              Flagger.endGame();
            }
          }
        } else {
          // toimet jos vastaus on väärin
          Flagger.scope.$apply(function(){
            Flagger.scope.multiplier = 1;
          });
          Map.guessedPolygons.push(polygon)
          // maalataan
          this.setOptions({
            "fillOpacity":1,
            "strokeWeight":1
          })
          // näytetään viesti
          addMessage(Flagger,"You guessed <strong>"+answerCountry+"</strong>, but that was incorrect","danger",false,true);
        }
      }
    }
  },
  setSelectedFlag: function(element){
    $("#flag-menu ul li a").removeClass("selected");
    var e = $(element)
    e.addClass("selected")
    this.selectedFlagCC = e.attr("data-cc").toUpperCase();
    // värit takaisin
    $.each(Map.guessedPolygons,function(i,e){
      e.setOptions({"fillOpacity":0,"strokeWeight":0})
    })
  },
  endGame: function(){
    Flagger.scope.score.groupid = Flagger.regionCode
    Flagger.scope.score.points = Flagger.scope.points
    Connect.generatePopup('savescore-popup');
  }
}
