const { Model } = require('objection');

module.exports = app =>{

    const items = app;

    

    class Compra extends Model {
        static get tableName() {
          return 'compras';
        }

        static get jsonSchema() {
            return {
                type: 'object',
                properties:{
                    total: { type: 'number'},
                    tipo_pagamento: { type: 'string', minLength: 1, maxLength: 60 },
                    status: { type: 'string' },
                }
            }
        }

    }

    return Compra 
}
