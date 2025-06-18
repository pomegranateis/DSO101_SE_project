exports.up = function (knex) {
  return knex.schema.createTable("bmi_records", (table) => {
    table.increments("id").primary();
    table.integer("height_cm").notNullable();
    table.integer("weight_kg").notNullable();
    table.integer("age").notNullable();
    table.decimal("bmi", 5, 2).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("bmi_records");
};
