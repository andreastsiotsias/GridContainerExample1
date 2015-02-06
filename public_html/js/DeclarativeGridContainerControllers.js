/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module("declarativeGridContainer.tsiotsias.uk")
    .controller("DeclarativeGridController", ['$rootScope','$scope', '$element', '$attrs', 'getHTTPDataService',
        function($rootScope, $scope, $element, $attrs, getHTTPDataService) {
            var httpDataPromise = getHTTPDataService.getData("ProductSummary.json");
            // show the spinning wheel ....
            $('#loading').show();
            // Now wait until the promise is fulfilled
            httpDataPromise.then(function(result) {  // this is only run after $http completes
            var httpData = result;
            initialiseGrid(httpData);
            // hide the spinning wheel ....
            $('#loading').hide();
        });
        function initialiseGrid(gridData){
            var gridElement = $element[0];
            var gridContainerElement = $(gridElement).parent()[0];
            var gridContainerHeight = $(gridElement).parent().height();
            var pageAble = { refresh: true, pageSizes: [5, 10, 15, 20, 25], input: false  };
            $(gridElement).kendoGrid({
                dataSource: {
                    data: gridData,
                    pageSize: 15
                },
                toolbar: [
                    "create", "cancel", "save"
                ],
                columns: [
                {
                    field: "Part_Number",
                    title: "Item Number",
                    width: 120
                }, 
                {
                    field: "Part_Name",
                    title: "Item Name",
                    filterable: false
                }, 
                {
                    field: "Revision",
                    title: "Version",
                    width: 80,
                    filterable: true
                },  
                {
                    field: "Phase",
                    title: "Status",
                    width: 130,
                    filterable: true
                },
                {
                    field: "Description",
                    title: "Item Notes",
                    filterable: false
                },
                {   
                    command: [{
                        name: "edit",
                        text: { 
                            edit: "Edit",               // This is the localization for Edit button
                            update: "Save",             // This is the localization for Update button
                            cancel: "Cancel changes"    // This is the localization for Cancel button
                        }
                    },
                    { 
                        name: "destroy", 
                        text: "Delete Office"           // This is the localization for Delete button
                    }
                ],
                    title: "&nbsp;",
                    width: "300px"
                }],
                autoBind: true,
                batch: false,
                columnMenu: true,
                selectable: "multiple, row",
                groupable: false,
                scrollable: true,
                sortable: true,
                pageable: pageAble,
                resizable: true,
                filterable: true,
                editable: {
                    mode: "popup"
                },
                height: gridContainerHeight
            });
            var grid = $(gridElement).data("kendoGrid");
            // deal with pager change events
            var gridPager = grid.pager;
            gridPager.bind("change", pager_change);
            // deal with data source change events
            var gridDataSource = grid.dataSource;
            gridDataSource.bind("change", dataSource_change);
            // deal with saveChanges events
            grid.bind("saveChanges", grid_saveChanges);
            // deal with edit events
            grid.bind("edit", grid_edit);
            // deal with dataBinding events
            grid.bind("dataBind", grid_dataBind);
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
            //
            // manage the saveChanges event
            function grid_saveChanges(e) {
                if (!confirm("Are you sure you want to save all changes?")) {
                    e.preventDefault();
                    alert("Changes Discarded !");
                }
                else {
                    alert("Changes Saved !");
                }
            }
            //
            // manage the edit event on a row
            function grid_edit(e) {
                alert("Grid Edit");
            }
            //
            // manage the databinding event on a row
            function grid_dataBind (e) {
                alert("Grid Data Bind");
            }
        }  
    }]);

