var _               = require('lodash')
;



module.exports = function(schema, options){
    const SEARCH_KEY = options.searchKey;
    const METHOD_NAME = options.methodName;
    const STATIC_NAME = "findOneBy" + _.upperFirst(SEARCH_KEY) + "And" + _.upperFirst(METHOD_NAME);
    schema.statics[STATIC_NAME] = findOneByAnd;
    
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
    function findOneByAnd(){
        const SEARCH_VALUE = arguments[0];
        const METHOD_ARGUMENTS = _.tail(arguments);
        
        this
            .findOne()
            .where(SEARCH_KEY).equals(SEARCH_VALUE)
            .exec(function(e, r){
                    if (e) { return cb(e, null) }
                    else if (r === null) { return cb(new Error("MismatchError querying from " + STATIC_NAME), null) } 
                    else { return r[METHOD_NAME].apply(r, METHOD_ARGUMENTS) }
                }
            );
    }
};