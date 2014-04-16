'use strict';

angular.module('karttapp.questions')
.controller('QuestionsController', ['$scope', '$stateParams','$http', '$location', 'Global', 'Question' , function ($scope, $stateParams, $http, $location, Global, Question) {
	$scope.countries = []
	var apu = []
	Question.success(function(data){
		$scope.countries = data
	})
	$scope.questions = []
	$scope.addQuestion = function(){
		var q = {}
		q.answer = $scope.question.answer
		q.question = $scope.question.question
		$scope.questions.push(q)
		console.log('heh')
	}

}]);