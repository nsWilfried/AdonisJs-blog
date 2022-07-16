import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {

  public async up () {
    this.schema.alterTable('users', (table) => {
      table.string("remember_me_token").nullable()
    })
  }

}
