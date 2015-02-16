/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module("declarativeGridContainer.tsiotsias.uk")
    .controller("DeclarativeGridController", ['$rootScope','$scope', '$element', '$attrs', 'getHTTPDataService',
        function($rootScope, $scope, $element, $attrs, getHTTPDataService) {
            console.log("Grid Descriptor URL : "+$attrs.descriptor);
            // show the spinning wheel ....
            //$('#loading').show();
            //
            var httpDataPromise = getHTTPDataService.getData($attrs.descriptor);
            // Now wait until the promise is fulfilled
            httpDataPromise.then(function(result) {  // this is only run after $http completes
            var httpData = result;
            initialiseGrid(httpData);
            // hide the spinning wheel ....
            //$('#loading').hide();
            //
        });
        function initialiseGrid(gridDescriptor){
            var gridElement = $element[0];
            var gridContainerElement = $(gridElement).parent()[0];
            // now bypass the Height attribute passed in via the definition
            var gridContainerHeight = $(gridElement).parent().height();
            gridDescriptor.height = gridContainerHeight;
            // build the grid based on the descriptor file which was HTTP'd in
            $(gridElement).kendoGrid(gridDescriptor);
            // store the grid in a variable
            var grid = $(gridElement).data("kendoGrid");
            // store a few more variables which will com in handy later
            var gridPager = grid.pager;
            var gridDataSource = grid.dataSource;
            var selectedRow;
            var selectedRowModel;
            var selectedRowData;
            var createButton;
            var retrieveButton;
            var updateButton;
            var deleteButton;
            //
            console.log("datasource schema fields : "+
                    //Object.getOwnPropertyNames(gridDataSource.options.schema.model.fields));
                Object.keys(gridDataSource.options.schema.model.fields));
            //
            // add the CRUD buttons on the pager area
            addCRUDButtonsToPager();
            // Now start dealing with events ..... there are several of them
            // deal with pager change events
            gridPager.bind("change", pager_change);
            // deal with data source change events
            gridDataSource.bind("change", dataSource_change);
            // deal with grid save events
            grid.bind("save", grid_save);
            // deal with grid row selection events
            grid.bind("change", grid_selection);
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
            function dataSource_change(evt) {
                console.log("dataSource change event : "+evt.action);
                if (evt.action === 'add' || evt.action === 'remove') {
                    resizeGridToFitContainer();
                }
                else {
                    console.log("No need to resize grid");
                    console.log("But we will disable the CRUD buttons");
                    disableCRUDButtons();
                }
            }
            //
            // manage the save from an individual row
            function grid_save(evt) {
                console.log("row save event");
                //evt.preventDefault();
            }
            //
            // manage the selection of a row in the grid
            function grid_selection(evt) {
                selectedRow = this.select();
                selectedRowModel = grid.dataItem(this.select());
                selectedRowData = JSON.stringify(selectedRowModel.toJSON());
                //console.log("Selected row : "+JSON.stringify(grid.dataItem(this.select()).toJSON()));
                console.log("Selected row with Data : "+selectedRowData);
                enableCRUDButtons();
            }
            //
            // add a button to the pager area
            function addCRUDButtonsToPager () {
                // create the buttons in sequence
                // CREATE
                createButton = document.createElement('Button');
                createButton.textContent = 'Create New';
                createButton.style.marginLeft = "100px";
                gridPager.element[0].appendChild(createButton);
                createButton.addEventListener("click", createNewData);
                // RETRIEVE
                retrieveButton = document.createElement('Button');
                retrieveButton.textContent = 'Details';
                retrieveButton.style.marginLeft = "5px";
                gridPager.element[0].appendChild(retrieveButton);
                retrieveButton.addEventListener("click", retrieveData);
                // UPDATE
                updateButton = document.createElement('Button');
                updateButton.textContent = 'Edit/Modify';
                updateButton.style.marginLeft = "5px";
                gridPager.element[0].appendChild(updateButton);
                updateButton.addEventListener("click", updateData);
                // DELETE
                deleteButton = document.createElement('Button');
                deleteButton.textContent = 'Delete';
                deleteButton.style.marginLeft = "5px";
                gridPager.element[0].appendChild(deleteButton);
                deleteButton.addEventListener("click", deleteData);
                // set CRUD default button state
                disableCRUDButtons();
            }
            //
            // create new data row function
            function createNewData () {
                console.log("Pressed Create New");
                alert("I am a new button and I haven't been implemented yet ...");
            }
            //
            // retrieve data row function
            function retrieveData () {
                console.log("Pressed Details");
                alert("I am a new button and I haven't been implemented yet ...");
            }
            //
            // update data row function
            function updateData () {
                console.log("Pressed Edit/Modify");
                alert("I am a new button and I haven't been implemented yet ...");
            }
            //
            // delete data row function
            function deleteData () {
                console.log("Pressed Delete");
                alert("I am a new button and I haven't been implemented yet ...");
            }
            //
            // enable CRUD buttons
            function enableCRUDButtons () {
                retrieveButton.disabled = false;
                updateButton.disabled = false;
                deleteButton.disabled = false;
            }
            //
            // disable CRUD Buttons
            function disableCRUDButtons () {
                retrieveButton.disabled = true;
                updateButton.disabled = true;
                deleteButton.disabled = true;
            }
        }  
    }]);

