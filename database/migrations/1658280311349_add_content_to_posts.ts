import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {

  public async up () {
    this.schema.alterTable ("posts", (table) => {
        table.text('content', 'longtext').notNullable().defaultTo('Rien dans la description')
    })
  }

}
