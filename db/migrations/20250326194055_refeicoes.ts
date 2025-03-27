import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('Refeicoes', (table) => {
        table.uuid('id').primary()
        table.uuid('user_id').references('users.id').notNullable()
        table.string('nome').notNullable()
        table.string('descricao').notNullable()
        table.boolean('inclusoDieta').notNullable()
        table.date('date').notNullable()
        table.timestamps(true, true)
      })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('Refeicoes')

}

