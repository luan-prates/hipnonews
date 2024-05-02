import migrationRunner from 'node-pg-migrate'
import {join} from "node:path"
import database from 'infra/database';

export default async function status(request, response){
  const dbClient = await database.getNewClient();
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
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  if(request.method === 'POST'){
    const migratedMIgrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });

    await dbClient.end();

    if(migratedMIgrations.length > 0) {
      return response.status(201).json(migratedMIgrations);
    }

    return response.status(200).json(migratedMIgrations);
  }

  response.status(405).end();
}