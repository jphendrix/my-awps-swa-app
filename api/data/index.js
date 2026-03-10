import { TableClient } from "@azure/data-tables";

export default async function (context, req) {
  const conn = process.env.StorageConnString;

  if (!conn) {
    context.res = { status: 500, body: "Missing STORAGE_CONN_STRING" };
    return;
  }

  const tableName = (req.query.tableName || "").trim().toLowerCase();

  if (!tableName) {
    context.res = { status: 400, body: "Missing tableName" };
    return;
  }

  context.log("Using table:", tableName);

  const client = TableClient.fromConnectionString(conn, tableName);

  // Ensure table exists
  await client.createTable();

  const partitionKey = "items";
  const rowKey = req.body?.id || req.query.id;

  if (!rowKey) {
    context.res = { status: 400, body: "Missing id" };
    return;
  }

  if (req.method === "POST") {
    const entity = {
      partitionKey,
      rowKey,
      ...req.body
    };

    await client.upsertEntity(entity);

    context.res = { status: 200, body: { status: "saved", entity } };
    return;
  }
}
