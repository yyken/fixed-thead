(function(angular) {
  'use strict';

  angular
    .module('fixed-thead',[])
    .directive('fixedThead', directive);

  directive.$inject = ['$timeout'];

  function directive($timeout) {
    var directive = {
      transclude: 'element',
      replace: true,
      restrict: 'A',
      template: '<div class="fixed-table-container">' +
        '<div class="header-background"></div>' +
        '<div class="fixed-table-container-inner" ng-transclude></div>' +
        '</div>',
      scope: {
        gridConfig: '=fixedThead'
      },
      link: linkFunc
    };

    return directive;

    function linkFunc($scope, $elem, $attrs, $ctrl) {
      var elem = $elem[0];
      var colNum = elem.querySelectorAll('thead tr:first-child th').length;

      var defautWidths = [];
      for(var i =0; i<colNum; i++){
        defautWidths.push(100/colNum + '%')
      }
      //console.log(defautWidths)
      var widths = $scope.gridConfig ? $scope.gridConfig.widths : defautWidths
      widths = widths ? widths : defautWidths

      fixHeaderWidths();
      // wait for data to load and then transform the table
      $scope.$watch(tableDataLoaded, function(isTableDataLoaded) {
        if (isTableDataLoaded) {
          transformTable();
        }
      });

      function tableDataLoaded() {
        // first cell in the tbody exists when data is loaded but doesn't have a width
        // until after the table is transformed
        var firstCell = elem.querySelector('tbody tr:first-child td:first-child');
        return firstCell && !firstCell.style.width;
      }

      function fixHeaderWidths(){


        angular.forEach(elem.querySelectorAll('thead > tr'), function(trElem, i) {

          angular.forEach(widths, function(width, cIdx) {

            var th = trElem.querySelector('th:nth-child(' + (cIdx + 1) + ')');
            if (!th) return;

            th.style.width = width;

            var thInner = th.querySelector('.th-inner');

            if (!thInner) {
              var thElm = angular.element(th);
              var box = angular.element('<div class="th-inner"></div>')
                .css('width', width)

              if (cIdx == 0) {
                box.css('border-width', 0)
              }

              if (thElm.children().length == 0 && !thElm.text().trim()) {
                box.html('&nbsp;')
              }
              else{
                box.append(thElm.contents())
              }

              thElm.append(box);
            } else {
              thInner.style.width = width;
            }

          });
        });
      }

      function transformTable() {
        // reset display styles so column widths are correct when measured below
        angular.element(elem.querySelectorAll('thead, tbody, tfoot')).css('display', '');

        // wrap in $timeout to give table a chance to finish rendering
        $timeout(function() {



          angular.forEach(elem.querySelectorAll('tbody > tr'), function(trElem, i) {

            angular.forEach(widths, function(width, cIdx) {
              trElem.querySelector('td:nth-child(' + (cIdx + 1) + ')').style.width = width;
            });

          });

        });
      }
    }
  }

  Controller.$inject = ['dependencies'];

  function Controller(dependencies) {
    var vm = this;

    activate();

    function activate() {

    }
  }
})(angular);
