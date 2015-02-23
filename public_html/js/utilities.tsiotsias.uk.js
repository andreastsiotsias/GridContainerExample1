/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */                                                                                                                                                                                                  
angular.module('utilities.tsiotsias.uk', [])
    .factory("utilityServices", function() {                                                                                                                                                  
        return {
            getType: function(elem) {
                return Object.prototype.toString.call(elem).slice(8, -1).toLowerCase();
            },
            doSomething: function(inp) {   
                //Do something here
                console.log("Called doSomething function with argument : "+inp);
            },
            doSomethingElse: function(inp) {
                //Do something else here
                console.log("Called doSomethingElse function with argument : "+inp);
            }
        };
    });

