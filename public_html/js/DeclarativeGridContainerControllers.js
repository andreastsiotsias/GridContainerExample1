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
            var selectedRowID;
            var createButton;
            var retrieveButton;
            var updateButton;
            var deleteButton;
            var dataEntryForm;
            var setDataEntryFormTitle;
            //
            console.log("datasource schema fields : "+
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
                resizeGridToFitContainer();
                // check if the buttons need resetting ...
                if (grid.select().length === 0) {
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
                selectedRow = grid.select();
                selectedRowModel = grid.dataItem(this.select());
                selectedRowData = JSON.stringify(selectedRowModel.toJSON());
                //console.log("Selected row : "+JSON.stringify(grid.dataItem(this.select()).toJSON()));
                //console.log("Selected row with ID : "+selectedRowModel.id+" and Data : "+selectedRowData);
                logObjectContents(selectedRow);
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
                //alert("I am a new button and I haven't been implemented yet ...");
                showDataEntryForm("Create - Enter data below .....");
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
                showDataEntryForm("Edit - Modify data below .....");
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
            //
            // make the data entry form visible
            function showDataEntryForm (title) {
                if (!dataEntryForm) {
                    console.log ("Data Entry form will be created");
                    createDataEntryForm("Create new item");
                }
                else {
                    console.log ("Data Entry form has already been created");
                }
                setDataFormTitle(title);
                $(dataEntryForm).modal('show');
            }
            //
            // hide data entry form
            function hideDataEntryForm () {
                $(dataEntryForm).modal('hide');
            }
            //
            // create the modal data form for the create / update modal dialogue
            function createDataEntryForm (title) {
                dataEntryForm = document.createElement('div');
                dataEntryForm.className = 'modal fade';
                dataEntryForm.setAttribute("id", "dataEntryForm");
                dataEntryForm.setAttribute("tabindex", "-1");
                dataEntryForm.setAttribute("role", "dialog");
                dataEntryForm.setAttribute("aria-labelledby", "dataEntryFormTitle");
                dataEntryForm.setAttribute("aria-hidden", "true");
                // add the actual modal dialogue container
                var dataEntryFormContainer = document.createElement('div');
                dataEntryFormContainer.className = 'modal-dialog modal-sm';
                dataEntryForm.appendChild(dataEntryFormContainer);
                // add the content container
                var dataEntryFormContent = document.createElement('div');
                dataEntryFormContent.className = 'modal-content';
                dataEntryFormContainer.appendChild(dataEntryFormContent);
                // add the header content
                var dataEntryFormHeader = document.createElement('div');
                dataEntryFormHeader.className = 'modal-header';
                dataEntryFormContent.appendChild(dataEntryFormHeader);
                // add the close/exit decoration (button with glyph only) to the dialogue header on top right corner
                var dataEntryFormHeaderExit = document.createElement('button');
                dataEntryFormHeaderExit.className = 'close';
                dataEntryFormHeaderExit.setAttribute("type", "button");
                dataEntryFormHeaderExit.setAttribute("data-dismiss", "modal");
                dataEntryFormHeaderExit.setAttribute("aria-hidden", "true");
                dataEntryFormHeader.appendChild(dataEntryFormHeaderExit);
                // add the 'close window' glyph icon to the button
                var dataEntryFormHeaderExitGlyph = document.createElement('span');
                dataEntryFormHeaderExitGlyph.className = 'glyphicon glyphicon-remove-circle';
                dataEntryFormHeaderExit.appendChild(dataEntryFormHeaderExitGlyph);
                // add the heading label to the dialogue header
                var dataEntryFormHeaderLabel = document.createElement('h5');
                dataEntryFormHeaderLabel.className = 'modal-title';
                dataEntryFormHeaderLabel.setAttribute("id", "locationSelectionTitle");
                dataEntryFormHeaderLabel.textContent = title;
                dataEntryFormHeader.appendChild(dataEntryFormHeaderLabel);
                // add the body content
                var dataEntryFormBody = document.createElement('div');
                dataEntryFormBody.className = 'modal-body';
                dataEntryFormBody.style.maxHeight = "100px";
                dataEntryFormBody.style.overflowY="auto";
                dataEntryFormContent.appendChild(dataEntryFormBody);
                // add the data name/value pairs ......
                var firstAttribute = document.createElement('p');
                firstAttribute.textContent = "First item";
                dataEntryFormBody.appendChild(firstAttribute);
                var secondAttribute = document.createElement('p');
                secondAttribute.textContent = "Second item";
                dataEntryFormBody.appendChild(secondAttribute);
                var thirdAttribute = document.createElement('p');
                thirdAttribute.textContent = "Third item";
                dataEntryFormBody.appendChild(thirdAttribute);
                var fourthAttribute = document.createElement('p');
                fourthAttribute.textContent = "Fourth item";
                dataEntryFormBody.appendChild(fourthAttribute);
            //var locationSelectionOptions = document.createElement('select');
            //locationSelectionOptions.className = 'form-control btn-warning';
            //locationSelectionOptions.setAttribute("id", "locationSelectionOptions");
            //locationSelectionDialogueBody.appendChild(locationSelectionOptions);
                // add the footer content
                var dataEntryFormFooter = document.createElement('div');
                dataEntryFormFooter.className = 'modal-footer';
                dataEntryFormContent.appendChild(dataEntryFormFooter);
                // add the Go button to the footer
                var dataEntryFormGoButton = document.createElement('button');
                dataEntryFormGoButton.className = 'btn btn-primary btn-xs';
                dataEntryFormGoButton.setAttribute("id", "dataEntryFormGoButton");
                dataEntryFormGoButton.setAttribute("type", "button");
                dataEntryFormFooter.appendChild(dataEntryFormGoButton);
                // add a glyph to the Go button
                var dataEntryFormGoButtonGlyph = document.createElement('span');
                dataEntryFormGoButtonGlyph.className = 'glyphicon glyphicon-ok-sign';
                dataEntryFormGoButton.appendChild(dataEntryFormGoButtonGlyph);
                //
                setDataFormTitle = function (title) {
                    dataEntryFormHeaderLabel.textContent = title;
                };
            }
            //
            // destroy the modal data form
            function destroyDataEntryForm () {
                //TO-DO
            }
            //
            // **** HELPER FUNCTION **** Print all keys/value pairs in Object
            function logObjectContents (obj) {
                var keys = Object.keys(obj);
                for (var i = 0; i < keys.length; i++) {
                    console.log("Object key : "+keys[i]+" value : "+obj[keys[i]]);
                }
            }
        }  
    }]);

