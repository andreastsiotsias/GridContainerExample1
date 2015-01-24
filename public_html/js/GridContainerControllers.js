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
            var grid = $(gridElement).data("kendoGrid");
            // deal with pager change events
            var gridPager = grid.pager;
            gridPager.bind("change", pager_change);
            // deal with data source change events
            var gridDataSource = grid.dataSource;
            gridDataSource.bind("change", dataSource_change);
            //
            var dataArea = $(gridElement).find(".k-grid-content");
            var gridDecorationsHeight = gridContainerElement.clientHeight - dataArea.height();
            console.log("<-- Initialisation --->");
            console.log("Grid Container Element is : "+gridContainerElement.id);
            console.log("Grid Container Element height is : "+gridContainerElement.clientHeight);
            console.log("Grid decorations height is : "+gridDecorationsHeight);
            console.log(">---End Initialisation ---<");
            // put a listener onto the grid container element
            window.addEventListener("resize", resizeGridToFitContainer);
            //
            // Function to resize the grid to keep it within the bounds of the grid container
            function resizeGridToFitContainer () {
                //alert("Window was resized to height : "+window.innerHeight);
                console.log("<-- Resize --->");
                console.log("Grid container element height is : "+gridContainerElement.clientHeight);
                console.log("Grid Data Area OLD height is : "+dataArea.height());
                dataArea.height(gridContainerElement.clientHeight-gridDecorationsHeight);
                console.log("Grid Data Area NEW height is : "+dataArea.height());
                console.log(">---End Resize ---<");
            }
            //
            // manage the change in page .... and the resize issue .....
            function pager_change() {
                console.log("pager change event");
                //resizeGridToFitContainer();
            }
            //
            // manage the change in data being displayed
            function dataSource_change() {
                console.log("dataSource change event");
                resizeGridToFitContainer();
            }
        }
        
        
        
        }]);

