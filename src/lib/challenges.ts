export interface Challenge {
  id: string;
  title: string;
  description: string;
  task: string;
  initialCode: string;
  setupSql: string; // SQL to run to prepare the environment (create tables, insert data)
  expectedSql: string; // SQL that produces the correct result (for validation)
}

export const challenges: Challenge[] = [
  {
    id: "1-dirty-csv",
    title: "The Dirty CSV",
    description: "A data dump from the legacy system has arrived. It's a mess. We need to extract valid user emails for the newsletter.",
    task: "Select the `name` and `email` of all users. Exclude rows where the email is missing (NULL) or invalid (does not contain '@'). Normalize names to Title Case.",
    initialCode: `-- View the raw data
SELECT * FROM raw_users;

-- TODO: Write your cleaning query here
-- Expected columns: name, email
`,
    setupSql: `
      CREATE TABLE raw_users (id INTEGER, name VARCHAR, email VARCHAR);
      INSERT INTO raw_users VALUES 
        (1, 'alice smith', 'alice@example.com'),
        (2, 'bob jones', 'bob.jones@provider'),
        (3, 'charlie', NULL),
        (4, 'DAVE', 'dave@example.com'),
        (5, 'Eve', 'eve@example.com');
    `,
    expectedSql: `
      SELECT 
        initcap(name) as name, 
        email 
      FROM raw_users 
      WHERE email IS NOT NULL AND email LIKE '%@%'
      ORDER BY id;
    `
  },
  {
    id: "2-json-logs",
    title: "Parsing JSON Logs",
    description: "Our application logs events in JSON format. We need to flatten this data for the analytics team.",
    task: "The `app_logs` table has a `payload` column containing JSON strings. Extract the `event_type` and `user_id` from the JSON. Filter for 'login' events only.",
    initialCode: `-- View the raw logs
SELECT * FROM app_logs;

-- TODO: Extract event_type and user_id from the payload column
`,
    setupSql: `
      CREATE TABLE app_logs (id INTEGER, timestamp VARCHAR, payload VARCHAR);
      INSERT INTO app_logs VALUES 
        (1, '2023-01-01 10:00:00', '{"event_type": "login", "user_id": 101, "meta": {"browser": "chrome"}}'),
        (2, '2023-01-01 10:05:00', '{"event_type": "click", "user_id": 101, "element": "button"}'),
        (3, '2023-01-01 10:10:00', '{"event_type": "login", "user_id": 102, "meta": {"browser": "firefox"}}'),
        (4, '2023-01-01 10:15:00', '{"event_type": "logout", "user_id": 101}');
    `,
    expectedSql: `
      SELECT 
        json_extract_string(payload, '$.event_type') as event_type,
        CAST(json_extract_string(payload, '$.user_id') as INTEGER) as user_id
      FROM app_logs
      WHERE json_extract_string(payload, '$.event_type') = 'login'
      ORDER BY id;
    `
  }
];
