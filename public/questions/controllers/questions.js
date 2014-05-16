'use strict';

angular.module('karttapp.questions')
.controller('QuestionsController', ['$scope', '$stateParams','$http', '$location', 'Countries', 'Group' , function ($scope, $stateParams, $http, $location, Countries, Group) {
	$scope.countries = []
	$scope.groupid = null;
	Countries.success(function(data){
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
		q.country = $scope.question.country
		q.name = $scope.question.name
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