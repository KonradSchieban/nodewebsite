var async       = require('async');
    fs          = require('fs');

function str_is_number(test_str){
    if (!isNaN(parseInt(test_str, 10))) {
        return true;
    }else{
        return false;
    }
}

module.exports = {

    str_is_number: function(test_str){
        if (!isNaN(parseInt(test_str, 10))) {
            return true;
        }else{
            return false;
        }
    },
    
};

