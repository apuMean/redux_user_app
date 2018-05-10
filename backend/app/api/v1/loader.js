
'use strict';

exports.loadModel =loadModel;

function loadModel(path){
    var path = "./modules"+path;
    try{        
        return require(path)
    }catch(err){
        __debug(err);
        throw new Error("Couldn't load Model with path '"+path+"/");
    }
}
