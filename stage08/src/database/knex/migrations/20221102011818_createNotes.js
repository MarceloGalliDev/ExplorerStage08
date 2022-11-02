//ORM
//cria e altera as tables
exports.up = knex => knex.schema.createTable("notes", table => { //criando a table com nome de notes
    table.increments("id");
    table.text("title");
    table.text("description");
    table.integer("rating");
    table.integer("user_id").references("id").inTable("users");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

//deleta tables
exports.down = knex => knex.schema.dropTable("notes");
