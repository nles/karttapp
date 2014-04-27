window.Flagger = {
  scope: null,
  flags: [],
  guesses: [],
  selectedFlagCC: null,
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
        startGame(Flagger);
        $.magnificPopup.close();
      },200)
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
      if($.inArray(polygon.get("COUNTRYCODE"), countries) != -1){
        center = Map.getPolygonCenter(polygon);
        flag = "<img src='/public/gamemodes/assets/images/flags/"+cc+".png' />"
        Map.drawOverlay(center.lat(),center.lng(),flag,"fff");
        Flagger.scope.flags.push({countryCode:cc})
      }
      setTimeout(function(){
        Map.map.map.setCenter(new google.maps.LatLng(47.04780089030736, 16.15828997192377))
        Map.map.map.setZoom(4);
      },200);
    }
    var startTimer = window.setInterval(function(){
      var progressBarWidth = progressBar.width();
      progressBar.width(progressBarWidth + 20);
      if(progressBarWidth >= progressBarWrapperWidth){
        window.clearTimeout(startTimer);
        Flagger.hideFlagsFromMap();
      }
    },500)
  },
  hideFlagsFromMap: function(){
    copies = $('<div id="ocs">');
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
  },
  giveHint: function(){
    Map.map.map.setCenter(new google.maps.LatLng(47.04780089030736, 16.15828997192377))
    Map.map.map.setZoom(1);
    $("#gmaps .overlay:not(.guessed)").fadeIn(function(){
      setTimeout(function(){
        $("#gmaps .overlay:not(.guessed)").fadeOut();
      },1000)
    });
  },
  countryClick: function(e,d){
    if(!Flagger.selectedFlagCC){
      addMessage(Flagger,"Start by selecting a flag from the flag menu","info",true);
      return
    }
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
        answerCountry = Map.getCountryNameByCode(cc);
        if(cc == Flagger.selectedFlagCC){
          // toimet jos vastaus on oikein
          // maalataan vastaus keskelle maata
          var flagOnMenu = $("#flag-menu a.selected");
          center = Map.getActivePolygonCenter();
          flag = "<img src='/public/gamemodes/assets/images/flags/"+cc.toLowerCase()+".png' />"
          var overlay = Map.drawOverlay(center.lat(),center.lng(),flag,"fff","flagJustAdded","guessed",true)
          addMessage(Flagger,"You answered <strong>"+answerCountry+"</strong> correctly!","success");
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
            var posOnMap = addedFlag.offset();
            addedFlag.show();
            addedFlagOffset = addedFlag.offset();
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
          }
        } else {
          // toimet jos vastaus on väärin
          Map.guessedPolygons.push(polygon)
          // maalataan
          this.setOptions({
            "fillOpacity":1,
            "strokeWeight":1
          })
          // näytetään viesti
          addMessage(Flagger,"You guessed <strong>"+answerCountry+"</strong>, but that was incorrect","danger");
        }
      }
    }
  },
  setSelectedFlag: function(element){
    $("#flag-menu ul li a").removeClass("selected");
    e = $(element)
    e.addClass("selected")
    this.selectedFlagCC = e.attr("data-cc").toUpperCase();
    // värit takaisin
    $.each(Map.guessedPolygons,function(i,e){
      e.setOptions({"fillOpacity":0,"strokeWeight":0})
    })
  }
}
