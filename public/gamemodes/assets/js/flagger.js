window.Flagger = {
  scope: null,
  init: function(){
    // tässä vaiheessa angular on jo luonut scopen,
    // joten otetaan se käyttöön
    this.scope = angular.element($("#ng-view")).scope();
    if(!this.scope.gameStarted){
      Connect.generatePopup('start-popup');
      // ilmoitellaan scopellekin että nyt mennään
      this.scope.startGame();
    }
    // popup aloituksesta
    $("#start-popup .btn").click(function(){
      $("#start-popup .preloader").show();
      $("#start-popup .popup-content").hide();
      Map.setupMap(Flagger.countryClick,function(){
        setTimeout(function(){
          $("#overlay-wrapper").show();
          startGame(Flagger);
          $.magnificPopup.close();
        },2)
      })
    })
  },
  skipQuestion: function(){

  },
  newRound: function(){
    // tästä alkaa...
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
