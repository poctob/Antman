module.exports = class Model {
    sanitize(model) {
        Object.keys(model).forEach((key) => (model[key] == null) && delete model[key]);
    }

    generateUpdateExpression(model, expression, values) {

        if (model) {
            expression = 'set ';
            values = {};

            for (var propName in model) {
                var propValue = model[propName];
                expression += propName + ' = :' + propName + ', ';
                values[':' + propName] = propValue;
            }
        }

    }

    convertCurrencyStringsToNumbers(model, props) {
        
        if (model && props) {
            props.forEach( (prop) => {
                if (model[prop]){
                    model[prop] = Number((''+ model[prop]).replace(/[^0-9.-]+/g, ""));
                }
            });
        }

        return model;
    }
}