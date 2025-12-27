import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import duckdb_mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_eh_wasm from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import duckdb_eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
    mvp: {
        mainModule: duckdb_wasm,
        mainWorker: duckdb_mvp_worker,
    },
    eh: {
        mainModule: duckdb_eh_wasm,
        mainWorker: duckdb_eh_worker,
    },
};

let db: duckdb.AsyncDuckDB | null = null;
let conn: duckdb.AsyncDuckDBConnection | null = null;

export async function initDuckDB() {
    if (db && conn) return { db, conn };

    const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
    const worker = new Worker(bundle.mainWorker!);
    const logger = new duckdb.ConsoleLogger();
    db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    conn = await db.connect();
    
    return { db, conn };
}

export async function runQuery(query: string) {
    if (!conn) throw new Error("Database not initialized");
    return await conn.query(query);
}

export async function runQueryToParquet(query: string): Promise<Uint8Array> {
    if (!conn) throw new Error("Database not initialized");
    // Copy to parquet
    await conn.query(`COPY (${query}) TO 'output.parquet' (FORMAT PARQUET)`);
    // Read the file back as buffer
    const buffer = await db!.copyFileToBuffer('output.parquet');
    return buffer;
}

export async function resetTable(setupSql: string) {
    if (!conn) throw new Error("Database not initialized");
    // Drop all tables to ensure clean state (simplified for now)
    // In a real app, we might want to be more selective or use schemas
    const tables = await conn.query("SHOW TABLES");
    if (tables.numRows > 0) {
        const tableNames = tables.toArray().map((r: any) => r.name);
        for (const t of tableNames) {
            await conn.query(`DROP TABLE IF EXISTS ${t}`);
        }
    }
    
    // Run the setup SQL
    // Split by semicolon to run multiple statements if needed, 
    // though DuckDB-WASM might handle multiple statements in one go.
    // Safest is to run them sequentially if they are separate commands.
    const statements = setupSql.split(';').filter(s => s.trim().length > 0);
    for (const stmt of statements) {
        await conn.query(stmt);
    }
}

export async function importCSV(file: File, tableName: string) {
    if (!db || !conn) throw new Error("Database not initialized");
    
    await db.registerFileHandle(file.name, file, duckdb.DuckDBDataProtocol.BROWSER_FILEREADER, true);
    
    // Create table from CSV
    // We use read_csv_auto to infer types
    await conn.query(`CREATE TABLE "${tableName}" AS SELECT * FROM read_csv_auto('${file.name}')`);
}

export async function getDatabaseSchema() {
    if (!conn) throw new Error("Database not initialized");
    
    const result = await conn.query(`
        SELECT table_name, column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'main' 
        ORDER BY table_name, ordinal_position;
    `);
    
    const rows = result.toArray().map((r: any) => r.toJSON());
    
    // Group by table name
    const schemaMap = new Map<string, { name: string, type: string }[]>();
    
    rows.forEach((row: any) => {
        if (!schemaMap.has(row.table_name)) {
            schemaMap.set(row.table_name, []);
        }
        schemaMap.get(row.table_name)?.push({
            name: row.column_name,
            type: row.data_type
        });
    });
    
    return Array.from(schemaMap.entries()).map(([tableName, columns]) => ({
        tableName,
        columns,
        // Assign a random color for UI consistency if needed, or deterministic based on name
        color: ['blue', 'purple', 'orange', 'pink', 'gray'][tableName.length % 5]
    }));
}
