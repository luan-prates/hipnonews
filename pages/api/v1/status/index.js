import database from "infra/database.js";

async function status(request, response){
  const updatedAt = new Date().toISOString();
  
  const pgVersion = await database.query('SHOW server_version;');
  const pgVersionValue = pgVersion.rows[0].server_version;
  
  const maxConnections = await database.query('SHOW max_connections');
  const maxConnectionsValue = parseInt(maxConnections.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const countOpenedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const countOpenedConnectionsValue = countOpenedConnections.rows[0].count;


  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: pgVersionValue,
        max_connections: maxConnectionsValue,
        count_connections: countOpenedConnectionsValue,
      }
    },
  });
}

export default status;
