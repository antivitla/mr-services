/**
 *	Директива робота (с кнопками)
 */
;(function (){
	"use strict";
	angular.module("WorkTimeTrackerModule")
		.directive("wttRobot", wttRobotDirective);

	function wttRobotDirective() {
		return {
			controllerAs: "robot",
			controller: ["WorkTimeTrackerRobot", function (WorkTimeTrackerRobot) {
				this.start = function () {
					WorkTimeTrackerRobot.start();
				};
				this.stop = function () {
					WorkTimeTrackerRobot.stop();
				};
				this.status = function () {
					return WorkTimeTrackerRobot.status;
				};
				this.entry = function () {
					return WorkTimeTrackerRobot.entry;
				};
			}]
		};
	}

}());