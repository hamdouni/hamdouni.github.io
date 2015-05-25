/*
	@license md-date
	@author hamdouni
	@license 2015 MIT
	@version 0.0.14
	
	See README.md for requirements and use.
*/angular.module('mdDate', []).directive('datePicker', [
  '$filter', '$sce', '$rootScope', '$parse', function($filter, $sce, $rootScope, $parse) {
    var _dateFilter;
    _dateFilter = $filter('date');
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        _modelValue: '=ngModel'
      },
      require: 'ngModel',
      templateUrl: 'md-date.tpl.html',
      link: function(scope, element, attrs, ngModel) {
        var cancelFn, saveFn;
        attrs.$observe('mindate', function(val) {
          if ((val != null) && angular.isDate(val)) {
            return scope.restrictions.mindate = val;
          }
        });
        attrs.$observe('maxdate', function(val) {
          if ((val != null) && angular.isDate(val)) {
            return scope.restrictions.maxdate = val;
          }
        });
        attrs.$observe('placeholder', function(val) {
          if (val != null) {
            return scope._placeholder = val;
          }
        });
        ngModel.$render = function() {
          return scope.setDate(ngModel.$modelValue);
        };
        saveFn = $parse(attrs.onSave);
        cancelFn = $parse(attrs.onCancel);
        scope.save = function() {
          scope._modelValue = moment(scope.date).format("DD/MM/YYYY");
          ngModel.$setDirty();
          scope._showPicker = false;
          return saveFn(scope.$parent, {
            $value: scope.date
          });
        };
        return scope.cancel = function() {
          cancelFn(scope.$parent, {});
          ngModel.$render();
          return scope._showPicker = false;
        };
      },
      controller: [
        '$scope', function(scope) {
          var i;
          scope.restrictions = {
            mindate: void 0,
            maxdate: void 0
          };
          scope.setDate = function(newVal) {
            var t;
            console.log(newVal);
            console.log(moment(newVal, "DD/MM/YYYY"));
            scope.date = newVal != null ? moment(newVal, "DD/MM/YYYY").toDate() : (t = new Date(), new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())));
            console.log("debug:" + scope.date);
            scope.calendar._year = scope.date.getFullYear();
            return scope.calendar._month = scope.date.getMonth();
          };
          scope._showPicker = false;
          scope.calendar = {
            _month: 0,
            _year: 0,
            _months: (function() {
              var j, results;
              results = [];
              for (i = j = 0; j <= 11; i = ++j) {
                results.push(_dateFilter(new Date(0, i), 'MMMM'));
              }
              return results;
            })(),
            offsetMargin: function() {
              return ((new Date(this._year, this._month).getDay() - 1) * 2.7) + "rem";
            },
            isVisible: function(d) {
              return new Date(this._year, this._month, d).getMonth() === this._month;
            },
            "class": function(d) {
              if ((scope.date != null) && new Date(this._year, this._month, d).getTime() === new Date(scope.date.getTime()).setHours(0, 0, 0, 0)) {
                return "selected";
              } else if (new Date(this._year, this._month, d).getTime() === new Date().setHours(0, 0, 0, 0)) {
                return "today";
              } else {
                return "";
              }
            },
            select: function(d) {
              return scope.date.setFullYear(this._year, this._month, d);
            },
            monthChange: function() {
              if ((this._year == null) || isNaN(this._year)) {
                this._year = new Date().getFullYear();
              }
              scope.date.setFullYear(this._year, this._month);
              if (scope.date.getMonth() !== this._month) {
                return scope.date.setDate(0);
              }
            },
            _incMonth: function(months) {
              this._month += months;
              while (this._month < 0 || this._month > 11) {
                if (this._month < 0) {
                  this._month += 12;
                  this._year--;
                } else {
                  this._month -= 12;
                  this._year++;
                }
              }
              return this.monthChange();
            }
          };
          scope.setNow = function() {
            return scope.setDate();
          };
          return scope._mode = 'date';
        }
      ]
    };
  }
]);

'use strict';

angular.module('mdDate').run(['$templateCache', function($templateCache) {

  $templateCache.put('md-date.tpl.html', '<div class="md-date"><md-input-container flex="flex"><label>{{_placeholder}}</label><md-icon md-font-icon="fa-calendar" ng-click="_showPicker=!_showPicker" class="fa fa-lg"></md-icon><input ng-model="_modelValue"></md-input-container><div ng-show="_showPicker" class="voile"></div><div ng-show="_showPicker" class="picker"><div class="control"><div class="full-title">{{display.fullTitle()}}</div><div class="slider"><div class="date-control"><div class="title"><md-button ng-click="calendar._incMonth(-1)" aria-label="Previous Month" style="float: left"><i class="fa fa-caret-left"></i></md-button><span class="month-part">{{date | date:\'MMMM\'}}<select ng-model="calendar._month" ng-change="calendar.monthChange()" ng-options="calendar._months.indexOf(month) as month for month in calendar._months"></select></span><input ng-model="calendar._year" ng-change="calendar.monthChange()" type="number" class="year-part"><md-button ng-click="calendar._incMonth(1)" aria-label="Next Month" style="float: right"><i class="fa fa-caret-right"></i></md-button></div><div class="headers"><div class="day-cell">L</div><div class="day-cell">M</div><div class="day-cell">M</div><div class="day-cell">J</div><div class="day-cell">V</div><div class="day-cell">S</div><div class="day-cell">D</div></div><div class="days"><md-button ng-style="{\'margin-left\': calendar.offsetMargin()}" ng-class="calendar.class(1)" ng-show="calendar.isVisible(1)" ng-click="calendar.select(1)" class="day-cell">1</md-button><md-button ng-class="calendar.class(2)" ng-show="calendar.isVisible(2)" ng-click="calendar.select(2)" class="day-cell">2</md-button><md-button ng-class="calendar.class(3)" ng-show="calendar.isVisible(3)" ng-click="calendar.select(3)" class="day-cell">3</md-button><md-button ng-class="calendar.class(4)" ng-show="calendar.isVisible(4)" ng-click="calendar.select(4)" class="day-cell">4</md-button><md-button ng-class="calendar.class(5)" ng-show="calendar.isVisible(5)" ng-click="calendar.select(5)" class="day-cell">5</md-button><md-button ng-class="calendar.class(6)" ng-show="calendar.isVisible(6)" ng-click="calendar.select(6)" class="day-cell">6</md-button><md-button ng-class="calendar.class(7)" ng-show="calendar.isVisible(7)" ng-click="calendar.select(7)" class="day-cell">7</md-button><md-button ng-class="calendar.class(8)" ng-show="calendar.isVisible(8)" ng-click="calendar.select(8)" class="day-cell">8</md-button><md-button ng-class="calendar.class(9)" ng-show="calendar.isVisible(9)" ng-click="calendar.select(9)" class="day-cell">9</md-button><md-button ng-class="calendar.class(10)" ng-show="calendar.isVisible(10)" ng-click="calendar.select(10)" class="day-cell">10</md-button><md-button ng-class="calendar.class(11)" ng-show="calendar.isVisible(11)" ng-click="calendar.select(11)" class="day-cell">11</md-button><md-button ng-class="calendar.class(12)" ng-show="calendar.isVisible(12)" ng-click="calendar.select(12)" class="day-cell">12</md-button><md-button ng-class="calendar.class(13)" ng-show="calendar.isVisible(13)" ng-click="calendar.select(13)" class="day-cell">13</md-button><md-button ng-class="calendar.class(14)" ng-show="calendar.isVisible(14)" ng-click="calendar.select(14)" class="day-cell">14</md-button><md-button ng-class="calendar.class(15)" ng-show="calendar.isVisible(15)" ng-click="calendar.select(15)" class="day-cell">15</md-button><md-button ng-class="calendar.class(16)" ng-show="calendar.isVisible(16)" ng-click="calendar.select(16)" class="day-cell">16</md-button><md-button ng-class="calendar.class(17)" ng-show="calendar.isVisible(17)" ng-click="calendar.select(17)" class="day-cell">17</md-button><md-button ng-class="calendar.class(18)" ng-show="calendar.isVisible(18)" ng-click="calendar.select(18)" class="day-cell">18</md-button><md-button ng-class="calendar.class(19)" ng-show="calendar.isVisible(19)" ng-click="calendar.select(19)" class="day-cell">19</md-button><md-button ng-class="calendar.class(20)" ng-show="calendar.isVisible(20)" ng-click="calendar.select(20)" class="day-cell">20</md-button><md-button ng-class="calendar.class(21)" ng-show="calendar.isVisible(21)" ng-click="calendar.select(21)" class="day-cell">21</md-button><md-button ng-class="calendar.class(22)" ng-show="calendar.isVisible(22)" ng-click="calendar.select(22)" class="day-cell">22</md-button><md-button ng-class="calendar.class(23)" ng-show="calendar.isVisible(23)" ng-click="calendar.select(23)" class="day-cell">23</md-button><md-button ng-class="calendar.class(24)" ng-show="calendar.isVisible(24)" ng-click="calendar.select(24)" class="day-cell">24</md-button><md-button ng-class="calendar.class(25)" ng-show="calendar.isVisible(25)" ng-click="calendar.select(25)" class="day-cell">25</md-button><md-button ng-class="calendar.class(26)" ng-show="calendar.isVisible(26)" ng-click="calendar.select(26)" class="day-cell">26</md-button><md-button ng-class="calendar.class(27)" ng-show="calendar.isVisible(27)" ng-click="calendar.select(27)" class="day-cell">27</md-button><md-button ng-class="calendar.class(28)" ng-show="calendar.isVisible(28)" ng-click="calendar.select(28)" class="day-cell">28</md-button><md-button ng-class="calendar.class(29)" ng-show="calendar.isVisible(29)" ng-click="calendar.select(29)" class="day-cell">29</md-button><md-button ng-class="calendar.class(30)" ng-show="calendar.isVisible(30)" ng-click="calendar.select(30)" class="day-cell">30</md-button><md-button ng-class="calendar.class(31)" ng-show="calendar.isVisible(31)" ng-click="calendar.select(31)" class="day-cell">31</md-button></div></div></div></div><div layout="row" layout-align="space-between center" class="buttons"><md-button ng-click="setNow()" aria-label="Set To Current Date">Aujourd\'hui</md-button><md-button ng-click="cancel()" aria-label="Cancel">Annuler</md-button><md-button ng-click="save()" aria-label="Save">OK</md-button></div></div></div>');

}]);