/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module("gridContainer.tsiotsias.uk")
    .controller("GridController", ['$rootScope','$scope', '$element', '$attrs', 'getHTTPDataService',
        function($rootScope, $scope, $element, $attrs, getHTTPDataService) {
            var httpDataPromise = getHTTPDataService.getData("Products.json");
            httpDataPromise.then(function(result) {  // this is only run after $http completes
            httpData = result;
            initialiseGrid();
        });
        function initialiseGrid(){
            console.log("Initialising grid");
            var gridElement = $element[0];
            $(gridElement).kendoGrid({
                columns: [{
                    field: "FirstName",
                    title: "First Name"
                },
                {
                    field: "LastName",
                    title: "Last Name"
                }],
                dataSource: {
                    data: [{
                        FirstName: "Joe",
                        LastName: "Smith"
                    },
                    {
                        FirstName: "Jane",
                        LastName: "Smith"
                    }]
                },
                groupable: true,
                scrollable: true,
                sortable: true,
                pageable: true
            });
        }
    
        }]);

