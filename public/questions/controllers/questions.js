'use strict';

angular.module('karttapp.questions')
.controller('QuestionsController', ['$scope', '$stateParams','$http', '$location', 'Countries', 'Group' , function ($scope, $stateParams, $http, $location, Countries, Group) {
	//init countries
	$scope.countries = []
	//init groupid
	$scope.groupid = null;
	//get countries and save data to $scope.countries
	Countries.success(function(data){
		$scope.countries = data
	})
	//init questions
	$scope.questions = []
	//defines new groupid for questiongroup
	//saves it to $scope.groupid
	$scope.setGroupid = function(){
		Group.query({},function(groups){
			if(groups.length == 0){
				$scope.groupid = 1;
			}else{
				$scope.groupid = groups[groups.length-1].id + 1
			}
		})
	}
	//add question to $scope.questions
	$scope.addQuestion = function(){
		var q = {}
		q.country = $scope.question.country
		q.name = $scope.question.name
		$scope.questions.push(q)
		$scope.question = {}
	}
	//save questiongroup and questions to database
	//finally inits all variables
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
				name: this.questions[i].name,
				country: this.questions[i].country['alpha-3']
			})
		}
		this.groupid = null;
		this.questions = [];
		this.group.name = ""
		this.setGroupid();
	}

}]);