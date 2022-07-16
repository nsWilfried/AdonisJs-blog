import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {

  public async up () {
    this.schema.alterTable("posts", (table) => {
      table.integer('user_id').unsigned().references("users.id").onDelete('CASCADE')
    })
  }
}
