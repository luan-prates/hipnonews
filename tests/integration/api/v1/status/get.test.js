test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status")
  expect(response.status).toBe(200);

  const responseBoby = await response.json();

  expect(responseBoby.updated_at).toBeDefined();
  expect(responseBoby.dependencies.database.version).toBeDefined();
  expect(responseBoby.dependencies.database.max_connections).toBeDefined();
  expect(responseBoby.dependencies.database.count_connections).toBeDefined();

  const parsedUpdetedAt = new Date(responseBoby.updated_at).toISOString();
  expect(responseBoby.updated_at).toEqual(parsedUpdetedAt)
  
  expect(responseBoby.dependencies.database.version).toEqual("16.0")

  expect(responseBoby.dependencies.database.max_connections).toEqual(100)

  expect(responseBoby.dependencies.database.count_connections).toEqual(1)

});