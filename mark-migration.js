const { Sequelize } = require('sequelize');

const db = new Sequelize('test', 'postgres', '123', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

async function markMigration() {
  try {
    await db.query(
      "INSERT INTO \"SequelizeMeta\" (name) VALUES ('20251120084914-create-users-table.js') ON CONFLICT DO NOTHING"
    );
    console.log('✅ Migration marked as completed');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.close();
  }
}

markMigration();
