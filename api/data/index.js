import { TableClient } from "@azure/data-tables";


export default async function (context, req) {
  const conn = process.env.StorageConnString;
  const client = TableClient.fromConnectionString(conn, req.query.tableName);

  // Ensure table exists
  await client.createTable();

  const partitionKey = "items";
  const rowKey = req.query.id || req.body?.id || "default";

  if (req.method === "GET") {
    try {
      const entity = await client.getEntity(partitionKey, rowKey);
      context.res = { status: 200, body: entity };
    } catch (err) {
      context.res = { status: 404, body: { error: "Not found" } };
    }
    return;
  }

  if (req.method === "POST") {
    const data = req.body || {};

    const entity = {
      partitionKey,
      rowKey,
      ...data
    };

    await client.upsertEntity(entity);

    context.res = {
      status: 200,
      body: { status: "saved", entity }
    };
    return;
  }
}
