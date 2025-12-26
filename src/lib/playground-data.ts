export const EMPLOYEE_DATASET_SQL = `
-- Create Departments
CREATE TABLE departments (
    dept_id INTEGER PRIMARY KEY,
    dept_name VARCHAR,
    location VARCHAR
);

INSERT INTO departments VALUES
    (1, 'Engineering', 'New York'),
    (2, 'Sales', 'San Francisco'),
    (3, 'Marketing', 'London'),
    (4, 'HR', 'New York'),
    (5, 'Finance', 'Chicago'),
    (6, 'Operations', 'Austin');

-- Create Employees
CREATE TABLE employees (
    emp_id INTEGER PRIMARY KEY,
    name VARCHAR,
    dept_id INTEGER,
    salary INTEGER,
    hire_date DATE,
    manager_id INTEGER
);

INSERT INTO employees VALUES
    (101, 'Alice Johnson', 1, 120000, '2020-01-15', NULL),
    (102, 'Bob Smith', 1, 95000, '2021-03-10', 101),
    (103, 'Charlie Brown', 2, 80000, '2021-06-01', 106),
    (104, 'Diana Prince', 3, 85000, '2019-11-20', NULL),
    (105, 'Evan Wright', 1, 110000, '2020-05-15', 101),
    (106, 'Frank Castle', 2, 150000, '2018-02-01', NULL),
    (107, 'Grace Lee', 4, 75000, '2022-01-10', NULL),
    (108, 'Henry Ford', 1, 98000, '2021-08-15', 101),
    (109, 'Ian Malcolm', 1, 105000, '2020-09-01', 101),
    (110, 'Julia Roberts', 2, 82000, '2021-11-05', 106),
    (111, 'Kevin Hart', 3, 78000, '2022-02-20', 104),
    (112, 'Laura Croft', 1, 115000, '2019-05-12', 101),
    (113, 'Mike Ross', 5, 90000, '2021-01-15', NULL),
    (114, 'Nancy Drew', 4, 72000, '2022-06-30', 107),
    (115, 'Oscar Wilde', 3, 88000, '2020-12-01', 104),
    (116, 'Paul Atreides', 6, 95000, '2021-07-20', NULL),
    (117, 'Quentin Tarantino', 2, 140000, '2018-10-10', 106),
    (118, 'Rachel Green', 4, 76000, '2022-03-15', 107),
    (119, 'Steve Rogers', 6, 92000, '2021-09-10', 116),
    (120, 'Tony Stark', 1, 200000, '2017-01-01', NULL),
    (121, 'Ursula K. Le Guin', 3, 86000, '2020-04-25', 104),
    (122, 'Vito Corleone', 6, 110000, '2019-08-15', 116),
    (123, 'Walter White', 1, 108000, '2020-11-20', 101),
    (124, 'Xena Warrior', 2, 83000, '2021-12-12', 106),
    (125, 'Yoda', 5, 120000, '2018-05-04', 113),
    (126, 'Zorro', 6, 94000, '2021-10-31', 116),
    (127, 'Ada Lovelace', 1, 130000, '2019-02-14', 120),
    (128, 'Bruce Wayne', 5, 160000, '2018-06-20', 113),
    (129, 'Clark Kent', 3, 81000, '2022-01-05', 104),
    (130, 'Darth Vader', 6, 100000, '2020-03-15', 116);

-- Create Projects (Many-to-Many relationship)
CREATE TABLE projects (
    project_id INTEGER PRIMARY KEY,
    project_name VARCHAR,
    budget INTEGER
);

INSERT INTO projects VALUES
    (1, 'Website Redesign', 50000),
    (2, 'Mobile App', 100000),
    (3, 'Data Migration', 30000),
    (4, 'Cloud Infrastructure', 200000),
    (5, 'AI Integration', 150000),
    (6, 'Security Audit', 40000),
    (7, 'Internal Tools', 60000);

CREATE TABLE employee_projects (
    emp_id INTEGER,
    project_id INTEGER,
    hours_logged INTEGER
);

INSERT INTO employee_projects VALUES
    (101, 1, 120), (102, 1, 80), (105, 2, 150), (101, 2, 40), (103, 3, 60),
    (109, 1, 45), (112, 2, 100), (120, 4, 200), (127, 4, 180), (123, 4, 160),
    (106, 3, 20), (117, 3, 50), (124, 3, 30), (104, 1, 10), (111, 1, 15),
    (115, 1, 25), (121, 1, 20), (129, 1, 10), (113, 5, 120), (125, 5, 100),
    (128, 5, 140), (116, 6, 80), (119, 6, 60), (122, 6, 70), (126, 6, 50),
    (130, 6, 90), (107, 7, 40), (114, 7, 30), (118, 7, 35), (108, 2, 110),
    (102, 4, 20), (105, 4, 30), (120, 5, 50), (127, 5, 60), (101, 7, 10);

-- Create a JSON logs table for advanced parsing practice
CREATE TABLE system_logs (
    log_id INTEGER,
    event_data JSON
);

INSERT INTO system_logs VALUES
    (1, '{"event": "login", "user": "alice", "ts": "2023-01-01T10:00:00Z"}'),
    (2, '{"event": "error", "code": 500, "details": {"module": "auth", "retry": true}}'),
    (3, '{"event": "logout", "user": "alice", "duration": 3600}'),
    (4, '{"event": "login", "user": "bob", "ts": "2023-01-01T10:05:00Z"}'),
    (5, '{"event": "view_page", "user": "bob", "page": "/dashboard", "ts": "2023-01-01T10:06:00Z"}'),
    (6, '{"event": "click", "user": "bob", "element": "submit_btn", "ts": "2023-01-01T10:07:00Z"}'),
    (7, '{"event": "error", "code": 404, "details": {"path": "/api/v1/users/999"}}'),
    (8, '{"event": "login", "user": "charlie", "ts": "2023-01-01T10:10:00Z"}'),
    (9, '{"event": "purchase", "user": "charlie", "amount": 150.00, "items": ["item1", "item2"]}'),
    (10, '{"event": "logout", "user": "bob", "duration": 1200}'),
    (11, '{"event": "login", "user": "diana", "ts": "2023-01-01T10:15:00Z"}'),
    (12, '{"event": "view_page", "user": "diana", "page": "/settings", "ts": "2023-01-01T10:16:00Z"}'),
    (13, '{"event": "update_profile", "user": "diana", "changes": {"email": "diana.new@example.com"}}'),
    (14, '{"event": "logout", "user": "diana", "duration": 900}'),
    (15, '{"event": "login", "user": "evan", "ts": "2023-01-01T10:20:00Z"}'),
    (16, '{"event": "error", "code": 403, "details": {"reason": "insufficient_permissions"}}'),
    (17, '{"event": "login", "user": "frank", "ts": "2023-01-01T10:25:00Z"}'),
    (18, '{"event": "export_data", "user": "frank", "format": "csv", "rows": 5000}'),
    (19, '{"event": "logout", "user": "frank", "duration": 1800}'),
    (20, '{"event": "system_maintenance", "status": "started", "ts": "2023-01-01T11:00:00Z"}');
`;

export const PLAYGROUND_SCHEMA = [
  {
    tableName: 'employees',
    color: 'blue',
    columns: [
      { name: 'emp_id', type: 'INTEGER', pk: true },
      { name: 'name', type: 'VARCHAR' },
      { name: 'dept_id', type: 'INTEGER', fk: 'departments.dept_id' },
      { name: 'salary', type: 'INTEGER' },
      { name: 'hire_date', type: 'DATE' },
      { name: 'manager_id', type: 'INTEGER', fk: 'employees.emp_id' }
    ]
  },
  {
    tableName: 'departments',
    color: 'purple',
    columns: [
      { name: 'dept_id', type: 'INTEGER', pk: true },
      { name: 'dept_name', type: 'VARCHAR' },
      { name: 'location', type: 'VARCHAR' }
    ]
  },
  {
    tableName: 'projects',
    color: 'orange',
    columns: [
      { name: 'project_id', type: 'INTEGER', pk: true },
      { name: 'project_name', type: 'VARCHAR' },
      { name: 'budget', type: 'INTEGER' }
    ]
  },
  {
    tableName: 'employee_projects',
    color: 'pink',
    columns: [
      { name: 'emp_id', type: 'INTEGER', fk: 'employees.emp_id' },
      { name: 'project_id', type: 'INTEGER', fk: 'projects.project_id' },
      { name: 'hours_logged', type: 'INTEGER' }
    ]
  },
  {
    tableName: 'system_logs',
    color: 'gray',
    columns: [
      { name: 'log_id', type: 'INTEGER', pk: true },
      { name: 'event_data', type: 'JSON' }
    ]
  }
];
