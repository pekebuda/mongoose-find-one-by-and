/***************************************************************************
 * @description
 * 
 * @param {Object} arguments[0]: propiedades (pares clave-valor) con que ejecutar 
 * la busqueda del elemento en MongoDB. 
 * @param {Array} _.tail(arguments): valores pasados como argumentos al metodo 
 * de instancia invocado (incluyendo posiblemente un callback exigible por 
 * dicho metodo)
 * 
 * @return {Error || Boolean}: En caso de exito, devuelve via callback true. 
 * En otro caso, ejecuta dicho callback con el Error generado. 
 */
var _               = require('lodash')
;



module.exports = function(schema, options){
    const SEARCH_KEY = options.searchKey;
    const METHOD_NAME = options.methodName;
    const STATIC_NAME = "findOneBy" + _.upperFirst(SEARCH_KEY) + "And" + _.upperFirst(METHOD_NAME);
    schema.statics[STATIC_NAME] = findOneByAnd;
    
    
    function findOneByAnd(){
        const SEARCH_VALUE = arguments[0];
        const METHOD_ARGUMENTS = _.tail(arguments);
        const CALLBACK = _.isFunction(_.last(METHOD_ARGUMENTS))? _.last(METHOD_ARGUMENTS): null;
        this.findOne()
            .where(SEARCH_KEY).equals(SEARCH_VALUE)
            .exec(function(e, r){
                    if (e) { 
                        if (CALLBACK) {return CALLBACK(e, null)} 
                        else {throw e} 
                    } else if (r === null) {
                        if (CALLBACK) {return CALLBACK(new Error("MismatchError querying from " + STATIC_NAME), null) } 
                        else {throw new Error("MismatchError querying from " + STATIC_NAME)}
                    } else { 
                        return r[METHOD_NAME].apply(r, METHOD_ARGUMENTS);
                    }
                }
            );
    }
};