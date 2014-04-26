window.Connect = {
  scope: null,
  roundQuestion: null,
  questions: [],
  correctAnswer: null,
  guessed: [],
  questionGroup: null,
  correctAnswersOpened: [],

  init: function(){
    // tässä vaiheessa angular on jo luonut scopen,
    // joten otetaan se käyttöön
    this.scope = angular.element($("#ng-view")).scope();
    // haetaan scopesta setti kysymyksiä
    if(!this.scope.gameStarted){
      Connect.generatePopup('start-popup');
      // ilmoitellaan scopellekin että nyt mennään
      this.scope.startGame();
    }
    // popup oikeasta vastauksesta
    $("#color-popup .accept-btn").click(function(){
      var selectedColor = $("#color-popup .pick-a-color").val()
      Map.activeCountryPolygon.setOptions({
        "fillColor":"#"+selectedColor,
        "fillOpacity":0.5,
        "strokeWeight":1
      })
      $.magnificPopup.close();
      // maalataan vastaus keskelle maata
      var center = Map.getActivePolygonCenter();
      Map.drawOverlay(center.lat(),center.lng(),Connect.roundQuestion,selectedColor)
      Connect.correctAnswersOpened.push(Connect.correctAnswer)
      // aloitetaan uusi kierros
      Connect.newRound();
    })
  },

  countryClick: function(e,d){
    polygon = this;
    var cc = polygon.get("COUNTRYCODE")
    // sallitaan vain sellaiset joita ei ole jo arvattu tai vastattu
    if($.inArray(cc, Connect.guessed) === -1 && $.inArray(cc, Connect.correctAnswersOpened) === -1){
      // sallitaan vastaus sekunnin välein
      if(Map.allowClick){
        Map.allowClick = false
        window.setTimeout(function(){ Map.allowClick = true },1000);
        Map.guessedCountries.push(cc)
        Map.activeCountryPolygon = polygon;
        Connect.guessed.push(cc)
        // toimet jos vastaus on oikein
        var answerCountry = Map.getCountryNameByCode(cc);
        if(cc == Connect.correctAnswer){
          addMessage(Connect,"You answered <strong>"+answerCountry+"</strong> correctly!","success");
          Connect.scope.$apply(function(){
            Connect.scope.points += 37*(1+Connect.scope.multiplier)*(100-Math.round(progressBar.width()/progressBarWrapper.width()*100));
            Connect.scope.multiplier += 1;
          })
          clearTimer();
          Connect.generatePopup('color-popup');
          $(".message","#color-popup").html("<strong>"+answerCountry+"</strong> was correct! Give a color to the country")
          // poistetaan vastaus
          for(i in Connect.questions){
            if(Connect.questions[i].country == cc) Connect.questions.splice(i,1);
          }
        // toimet jos vastaus on väärin
        } else {
          Map.guessedPolygons.push(polygon)
          // kerroin tyhjäksi
          Connect.scope.$apply(function(){
            Connect.scope.multiplier = 0;
          });
          // maalataan
          this.setOptions({
            "fillOpacity":1,
            "strokeWeight":1
          })
          // animoi liikettä
          center = Map.getActivePolygonCenter()
          for(var i = 1; i <= 5; i++){
            if(i == 5){
              x = 0;
            } else {
              var x = 1/i;
              if(i % 2 == 0) x = x * (-1)
            }
            setTimeout("Map.movePolygon("+x+",0)",50*i)
          }
          // näytetään viesti
          addMessage(Connect,"You guessed <strong>"+answerCountry+"</strong>, but that was incorrect","danger");
        }
      }
    }
  },
  startGame: function(){
    Connect.questionGroup = Connect.scope.groupid
    Connect.questions = Connect.scope.questions;
    $("#start-popup .preloader").show();
    $("#start-popup .popup-content").hide();
    Map.setupMap(Connect,function(){
      // muutama sekunti aikaa valmistautua ;D
      setTimeout(function(){
        $("#overlay-wrapper").show();
        startGame(Connect);
        $.magnificPopup.close();
      },2000)
    })
  },
  newRound: function(){
    if(Connect.questions.length > 0){
      // unohdetaan väärät vastaukset ja poistetaan värit
      Connect.guessed = []
      $.each(Map.guessedPolygons,function(i,p){
        this.setOptions({
          "fillOpacity":0,
          "strokeWeight":0
        });
      });
      Map.guessedPolygons = []
      // arvotaan satunainen kysymys
      var random = Math.floor(Math.random() * Connect.questions.length)
      var roundQuestion = Connect.questions[random]
      Connect.scope.$apply(function(){
        Connect.scope.question = roundQuestion.name;
      })
      Connect.roundQuestion = roundQuestion.name;
      Connect.correctAnswer = roundQuestion.country;
      // tyhjätään ja aloitetaan kello
      clearTimer();
      roundClock = window.setInterval(function(){
        var progressBarWidth = progressBar.width();
        progressBar.width(progressBarWidth + 20);
        if(progressBarWidth >= progressBarWrapperWidth){
          window.clearInterval(roundClock)
          Connect.timeOut();
        }
      }, 1000)
    } else {
      Connect.endGame();
    }
  },
  generatePopup: function(popupId){
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
  },
  timeoutOrSkip: function(){
    clearTimer();
    Connect.scope.$apply(function(){
      Connect.scope.multiplier = 0;
    })
    // etsitään oikea vastaus
    $.each(Map.allPolygons,function(i,p){
        if(p.get("COUNTRYCODE") == Connect.correctAnswer){
          Map.activeCountryPolygon = p
        }
    })
    // poistetaan vastaus
    for(i in Connect.questions){
      if(Connect.questions[i].country == Connect.correctAnswer) Connect.questions.splice(i,1);
    }
  },
  skipQuestion: function(){
    Connect.timeoutOrSkip();
    var answerCountry = Map.getCountryNameByCode(Connect.correctAnswer);
    addMessage(Connect,"Skipped a question. The correct answer was <strong>"+answerCountry+"</strong>","warning")
    Connect.generatePopup('color-popup');
    $(".message","#color-popup").html("Skipped. The answer was <strong>"+answerCountry+"</strong>. Give a color to the country")
  },
  timeOut: function(){
    Connect.timeoutOrSkip();
    var answerCountry = Map.getCountryNameByCode(Connect.correctAnswer);
    addMessage(Connect,"Your time ran out! The correct answer was <strong>"+answerCountry+"</strong>","warning")
    Connect.generatePopup('color-popup');
    $(".message","#color-popup").html("You ran out of time! The answer was <strong>"+answerCountry+"</strong>. Give a color to the country")
  },
  endGame: function(){
    this.scope.score.points = this.scope.points;
    this.scope.score.gameid = this.scope.gameMode;
    Connect.generatePopup('savescore-popup');
  }
}
