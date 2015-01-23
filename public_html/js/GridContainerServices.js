/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module("gridContainer.tsiotsias.uk")
    .factory('getHTTPDataService', function($http, URL) {
        var getData = function() {
            console.log("URL to extract data from : "+URL);
            return $http({method:"GET", url:URL}).then(function(result){
                return result.data;
            });
        };
        return { getData: getData };
    });

