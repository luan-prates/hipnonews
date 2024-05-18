import migrationRunner from 'node-pg-migrate'
import {join} from "node:path"
import database from 'infra/database';

export default async function migrations(request, response){
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  let dbClient;
  try{
    dbClient = await database.getNewClient();
    const defaultMigrationsOptions = {
      dbClient:dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
      noLock: false,
    }

    if(request.method === 'GET'){
      const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
      return response.status(200).json(pendingMigrations);
    }

    if(request.method === 'POST'){
      const migratedMIgrations = await migrationRunner({
        ...defaultMigrationsOptions,
        dryRun: false,
      });

      if(migratedMIgrations.length > 0) {
        return response.status(201).json(migratedMIgrations);
      }

      return response.status(200).json(migratedMIgrations);
  }

} catch (error) {
  console.error(error)
  throw error;
} finally {
  await dbClient.end();
}
}