/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module("gridContainer.tsiotsias.uk")
    .controller("GridController", ['$rootScope','$scope', '$element', '$attrs', 'getHTTPDataService',
        function($rootScope, $scope, $element, $attrs, getHTTPDataService) {
            var httpDataPromise = getHTTPDataService.getData("ProductSummary.json");
            // Now wait until the promise is fulfilled
            httpDataPromise.then(function(result) {  // this is only run after $http completes
            var httpData = result;
            initialiseGrid(httpData);
        });
        function initialiseGrid(gridData){
            var gridElement = $element[0];
            var gridContainerElement = $(gridElement).parent()[0];
            var gridContainerHeight = $(gridElement).parent().height();
            $(gridElement).kendoGrid({
                dataSource: {
                    data: gridData,
                    pageSize: 15
                },
                groupable: true,
                scrollable: true,
                sortable: true,
                pageable: { refresh: true, pageSizes: [5, 10, 15, 20]  },
                resizable: true,
                filterable: true,
                editable: true,
                height: gridContainerHeight
            });
            // put a listener onto the grid container element
            console.log("Grid Container Element is : "+gridContainerElement.id);
            console.log("Grid Container Element height is : "+gridContainerElement.clientHeight);
            window.addEventListener("resize", function () {
                alert("Window was resized to height : "+window.innerHeight);
            });
        }
    
        }]);

