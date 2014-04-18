'use strict';

angular.module('karttapp.questions')
.controller('QuestionsController', ['$scope', '$stateParams','$http', '$location', 'Global', 'Question', 'Group' , function ($scope, $stateParams, $http, $location, Global, Question, Group) {
	$scope.countries = []
	$scope.groupid = null;
	Question.success(function(data){
		$scope.countries = data
	})
	$scope.questions = []
	$scope.setGroupid = function(){
		Group.query({},function(groups){
			if(groups.length == 0){
				$scope.groupid = 1;
			}else{
				$scope.groupid = groups[groups.length-1].id + 1
			}
		})
	}
	$scope.addQuestion = function(){
		var q = {}
		q.answer = $scope.question.answer
		q.question = $scope.question.question
		$scope.questions.push(q)
		console.log(q)
		$scope.question = {}
	}
	$scope.saveQuestions = function(){
		//save group
		$http.post('saveGroup',{
			id: this.groupid,
			name: this.group.name,
			likes: 0
		})

		//save each question
		for(var i = 0 ; i<this.questions.length ; i++){
			$http.post('saveQuestion',{
				groupid: this.groupid,
				question: this.questions[i].question,
				answer: this.questions[i].answer['alpha-3']
			})
		}
		this.groupid = null;
		this.questions = [];
		this.group.name = ""
		this.setGroupid();
	}

}]);