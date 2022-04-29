const { Model } = require('objection');

module.exports = app =>{

    Model.knex(app.db)

    class Produto extends Model {
        static get tableName() {
          return 'produtos';
        }

        static get idColumn() {
            return 'id';
        }
        

        static get jsonSchema() {
            return {
                type: 'object',

            }
        }

        static get relationMappings() {
            return {

            }

        }

    }


    return Produto 
}
