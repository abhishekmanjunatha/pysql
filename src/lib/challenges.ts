export interface Challenge {
  id: string;
  title: string;
  description: string;
  task: string;
  initialCode: string;
  setupSql: string;
  expectedSql: string;
  expectedOutput?: string;
  solution: string;
  hint: string;
  concepts: string[];
}

export const challenges: Challenge[] = [
  {
    "id": "challenge-1",
    "title": "1. Employees with Salary Greater Than X",
    "description": "Find all employees whose salary is greater than a given threshold X.",
    "task": "Find all employees whose salary is greater than a given threshold X.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT deptName, empName, salary\nFROM employees\nWHERE salary > 45000\nORDER BY deptName, salary DESC;",
    "expectedOutput": "+----------+----------+--------+\n| deptName | empName  | salary |\n+----------+----------+--------+\n| Finance  | Eve      | 55000  |\n| Finance  | Frank   | 60000  |\n| IT       | Diana   | 60000  |\n| HR       | Bob     | 50000  |\n+----------+----------+--------+",
    "solution": "SELECT deptName, empName, salary\nFROM employees\nWHERE salary > 45000\nORDER BY deptName, salary DESC;",
    "hint": "Try using these concepts:\n\n\u2022 WHERE filtering\n\u2022 ORDER BY\n\u2022 Comparison operators\n\u2022 Basic SELECT projection",
    "concepts": [
      "WHERE filtering",
      "ORDER BY",
      "Comparison operators",
      "Basic SELECT projection"
    ]
  },
  {
    "id": "challenge-2",
    "title": "2. Average Salary by Department",
    "description": "Calculate the average salary for each department.",
    "task": "Calculate the average salary for each department.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT deptName, AVG(salary) AS avgSalary\nFROM employees\nGROUP BY deptName;",
    "expectedOutput": "+----------+-----------+\n| deptName | avgSalary |\n+----------+-----------+\n| HR       | 45000     |\n| IT       | 52500     |\n| Finance  | 60000     |\n+----------+-----------+",
    "solution": "SELECT deptName, AVG(salary) AS avgSalary\nFROM employees\nGROUP BY deptName;",
    "hint": "Try using these concepts:\n\n\u2022 GROUP BY\n\u2022 Aggregate functions\n\u2022 Column aliasing",
    "concepts": [
      "GROUP BY",
      "Aggregate functions",
      "Column aliasing"
    ]
  },
  {
    "id": "challenge-3",
    "title": "3. Employee Count by Department",
    "description": "Find the number of employees in each department.",
    "task": "Find the number of employees in each department.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT deptName, COUNT(*) AS employeeCount\nFROM employees\nGROUP BY deptName;",
    "expectedOutput": "+----------+---------------+\n| deptName | employeeCount |\n+----------+---------------+\n| HR       | 3             |\n| IT       | 2             |\n| Finance  | 2             |\n+----------+---------------+",
    "solution": "SELECT deptName, COUNT(*) AS employeeCount\nFROM employees\nGROUP BY deptName;",
    "hint": "Try using these concepts:\n\n\u2022 COUNT aggregate\n\u2022 GROUP BY",
    "concepts": [
      "COUNT aggregate",
      "GROUP BY"
    ]
  },
  {
    "id": "challenge-4",
    "title": "4. Employees Hired Each Year",
    "description": "Count employees hired in each year.",
    "task": "Count employees hired in each year.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT YEAR(hireDate) AS year, COUNT(*) AS employeeCount\nFROM employees\nGROUP BY YEAR(hireDate);",
    "expectedOutput": "+------+---------------+\n| year | employeeCount |\n+------+---------------+\n| 2020 | 2             |\n| 2021 | 2             |\n| 2022 | 1             |\n+------+---------------+",
    "solution": "SELECT YEAR(hireDate) AS year, COUNT(*) AS employeeCount\nFROM employees\nGROUP BY YEAR(hireDate);",
    "hint": "Try using these concepts:\n\n\u2022 Date functions\n\u2022 GROUP BY on derived columns",
    "concepts": [
      "Date functions",
      "GROUP BY on derived columns"
    ]
  },
  {
    "id": "challenge-5",
    "title": "5. Find Duplicate Records",
    "description": "Identify duplicate employee records.",
    "task": "Identify duplicate employee records.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT empName, deptName, salary, COUNT(*) AS cnt\nFROM employees\nGROUP BY empName, deptName, salary\nHAVING COUNT(*) > 1;",
    "expectedOutput": "+--------+----------+--------+-----+\n| empName| deptName | salary | cnt |\n+--------+----------+--------+-----+\n| Alice  | HR       | 40000  | 2   |\n+--------+----------+--------+-----+",
    "solution": "SELECT empName, deptName, salary, COUNT(*) AS cnt\nFROM employees\nGROUP BY empName, deptName, salary\nHAVING COUNT(*) > 1;",
    "hint": "Try using these concepts:\n\n\u2022 GROUP BY\n\u2022 HAVING clause\n\u2022 Duplicate detection",
    "concepts": [
      "GROUP BY",
      "HAVING clause",
      "Duplicate detection"
    ]
  },
  {
    "id": "challenge-6",
    "title": "6. Maximum Salary by Department",
    "description": "Find the highest paid employee in each department.",
    "task": "Find the highest paid employee in each department.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT deptName, empName, salary\nFROM (\n  SELECT *,\n         DENSE_RANK() OVER (PARTITION BY deptName ORDER BY salary DESC) AS rnk\n  FROM employees\n) t\nWHERE rnk = 1;",
    "expectedOutput": "+----------+--------+--------+\n| deptName | empName| salary |\n+----------+--------+--------+\n| HR       | Bob    | 50000  |\n| IT       | Diana  | 60000  |\n| Finance  | Frank | 60000  |\n+----------+--------+--------+",
    "solution": "SELECT deptName, empName, salary\nFROM (\n  SELECT *,\n         DENSE_RANK() OVER (PARTITION BY deptName ORDER BY salary DESC) AS rnk\n  FROM employees\n) t\nWHERE rnk = 1;",
    "hint": "Try using these concepts:\n\n\u2022 Window functions\n\u2022 DENSE_RANK\n\u2022 PARTITION BY",
    "concepts": [
      "Window functions",
      "DENSE_RANK",
      "PARTITION BY"
    ]
  },
  {
    "id": "challenge-7",
    "title": "7. Minimum Salary by Department",
    "description": "Find the lowest paid employee in each department.",
    "task": "Find the lowest paid employee in each department.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT deptName, empName, salary\nFROM (\n  SELECT *,\n         DENSE_RANK() OVER (PARTITION BY deptName ORDER BY salary ASC) AS rnk\n  FROM employees\n) t\nWHERE rnk = 1;",
    "expectedOutput": "+----------+--------+--------+\n| deptName | empName| salary |\n+----------+--------+--------+\n| HR       | Alice  | 40000  |\n| IT       | Charlie| 45000  |\n| Finance  | Eve    | 55000  |\n+----------+--------+--------+",
    "solution": "SELECT deptName, empName, salary\nFROM (\n  SELECT *,\n         DENSE_RANK() OVER (PARTITION BY deptName ORDER BY salary ASC) AS rnk\n  FROM employees\n) t\nWHERE rnk = 1;",
    "hint": "Try using these concepts:\n\n\u2022 Window ranking\n\u2022 Ascending vs descending order",
    "concepts": [
      "Window ranking",
      "Ascending vs descending order"
    ]
  },
  {
    "id": "challenge-8",
    "title": "8. Remove Duplicates and Keep Max Salary",
    "description": "Remove duplicate employees and keep the record with the highest salary.",
    "task": "Remove duplicate employees and keep the record with the highest salary.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT empId, empName, deptName, salary\nFROM (\n  SELECT *,\n         ROW_NUMBER() OVER (\n           PARTITION BY empName, deptName\n           ORDER BY salary DESC\n         ) AS rn\n  FROM employees\n) t\nWHERE rn = 1;",
    "expectedOutput": "+------+--------+----------+--------+\n| empId| empName| deptName | salary |\n+------+--------+----------+--------+\n| 2    | Bob    | HR       | 50000  |\n| 4    | Diana  | IT       | 60000  |\n| 6    | Frank  | Finance  | 55000  |\n+------+--------+----------+--------+",
    "solution": "SELECT empId, empName, deptName, salary\nFROM (\n  SELECT *,\n         ROW_NUMBER() OVER (\n           PARTITION BY empName, deptName\n           ORDER BY salary DESC\n         ) AS rn\n  FROM employees\n) t\nWHERE rn = 1;",
    "hint": "Try using these concepts:\n\n\u2022 ROW_NUMBER\n\u2022 De-duplication\n\u2022 Partitioning logic",
    "concepts": [
      "ROW_NUMBER",
      "De-duplication",
      "Partitioning logic"
    ]
  },
  {
    "id": "challenge-9",
    "title": "9. Salary Above Department Average",
    "description": "Find employees earning more than their department average.",
    "task": "Find employees earning more than their department average.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT empName, deptName, salary\nFROM (\n  SELECT *,\n         AVG(salary) OVER (PARTITION BY deptName) AS deptAvg\n  FROM employees\n) t\nWHERE salary > deptAvg;",
    "expectedOutput": "+--------+----------+--------+\n| empName| deptName | salary |\n+--------+----------+--------+\n| Bob    | HR       | 50000  |\n| Diana  | IT       | 60000  |\n| Frank  | Finance  | 60000  |\n+--------+----------+--------+",
    "solution": "SELECT empName, deptName, salary\nFROM (\n  SELECT *,\n         AVG(salary) OVER (PARTITION BY deptName) AS deptAvg\n  FROM employees\n) t\nWHERE salary > deptAvg;",
    "hint": "Try using these concepts:\n\n\u2022 Window aggregates\n\u2022 Row vs group comparison",
    "concepts": [
      "Window aggregates",
      "Row vs group comparison"
    ]
  },
  {
    "id": "challenge-10",
    "title": "10. Second Highest Salary per Department",
    "description": "Find the second highest salary in each department.",
    "task": "Find the second highest salary in each department.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT deptName, empName, salary\nFROM (\n  SELECT *,\n         DENSE_RANK() OVER (PARTITION BY deptName ORDER BY salary DESC) AS rnk\n  FROM employees\n) t\nWHERE rnk = 2;",
    "expectedOutput": "+----------+--------+--------+\n| deptName | empName| salary |\n+----------+--------+--------+\n| HR       | Charlie| 45000  |\n| IT       | Hank   | 45000  |\n| Finance  | Frank  | 53000  |\n+----------+--------+--------+",
    "solution": "SELECT deptName, empName, salary\nFROM (\n  SELECT *,\n         DENSE_RANK() OVER (PARTITION BY deptName ORDER BY salary DESC) AS rnk\n  FROM employees\n) t\nWHERE rnk = 2;",
    "hint": "Try using these concepts:\n\n\u2022 DENSE_RANK vs ROW_NUMBER\n\u2022 Handling ties\n\u2022 Ranking problems (very common)",
    "concepts": [
      "DENSE_RANK vs ROW_NUMBER",
      "Handling ties",
      "Ranking problems (very common)"
    ]
  },
  {
    "id": "challenge-11",
    "title": "11. Nth Highest Salary per Department",
    "description": "Find the Nth highest salary per department.",
    "task": "Find the Nth highest salary per department.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT deptName, empName, salary\nFROM (\n  SELECT *,\n         DENSE_RANK() OVER (PARTITION BY deptName ORDER BY salary DESC) AS rnk\n  FROM employees\n) t\nWHERE rnk = N;",
    "expectedOutput": "+----------+--------+--------+\n| deptName | empName| salary |\n+----------+--------+--------+\n| HR       | Charlie| 45000  |\n| IT       | Eve    | 50000  |\n+----------+--------+--------+",
    "solution": "SELECT deptName, empName, salary\nFROM (\n  SELECT *,\n         DENSE_RANK() OVER (PARTITION BY deptName ORDER BY salary DESC) AS rnk\n  FROM employees\n) t\nWHERE rnk = N;",
    "hint": "Try using these concepts:\n\n\u2022 Parameterized queries\n\u2022 Reusable ranking logic",
    "concepts": [
      "Parameterized queries",
      "Reusable ranking logic"
    ]
  },
  {
    "id": "challenge-12",
    "title": "12. Customers Without Orders",
    "description": "Find customers who never placed an order.",
    "task": "Find customers who never placed an order.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT c.*\nFROM customers c\nLEFT JOIN orders o\nON c.customerId = o.customerId\nWHERE o.customerId IS NULL;",
    "expectedOutput": "+----------+------------+\n|customerId|customerName|\n+----------+------------+\n| 4        | Diana      |\n+----------+------------+",
    "solution": "SELECT c.*\nFROM customers c\nLEFT JOIN orders o\nON c.customerId = o.customerId\nWHERE o.customerId IS NULL;",
    "hint": "Try using these concepts:\n\n\u2022 LEFT JOIN\n\u2022 NULL filtering\n\u2022 Data completeness checks",
    "concepts": [
      "LEFT JOIN",
      "NULL filtering",
      "Data completeness checks"
    ]
  },
  {
    "id": "challenge-13",
    "title": "13. Products Not Sold",
    "description": "Find products that were never sold.",
    "task": "Find products that were never sold.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT p.*\nFROM products p\nLEFT JOIN sales s\nON p.productId = s.productId\nWHERE s.productId IS NULL;",
    "expectedOutput": "+---------+------------+\n|productId|productName|\n+---------+------------+\n| 102     | Mouse     |\n| 104     | Monitor   |\n+---------+------------+",
    "solution": "SELECT p.*\nFROM products p\nLEFT JOIN sales s\nON p.productId = s.productId\nWHERE s.productId IS NULL;",
    "hint": "Try using these concepts:\n\n\u2022 LEFT JOIN anti-pattern\n\u2022 Referential integrity",
    "concepts": [
      "LEFT JOIN anti-pattern",
      "Referential integrity"
    ]
  },
  {
    "id": "challenge-14",
    "title": "14. Department Total Salary Greater Than X",
    "description": "Find departments whose **total salary** exceeds a given threshold X.",
    "task": "Find departments whose **total salary** exceeds a given threshold X.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT deptName, SUM(salary) AS totalSalary\nFROM employees\nGROUP BY deptName\nHAVING SUM(salary) > 150000;",
    "expectedOutput": "+----------+-------------+\n| deptName | totalSalary |\n+----------+-------------+\n| Finance  | 170000      |\n| IT       | 165000      |\n+----------+-------------+",
    "solution": "SELECT deptName, SUM(salary) AS totalSalary\nFROM employees\nGROUP BY deptName\nHAVING SUM(salary) > 150000;",
    "hint": "Try using these concepts:\n\n\u2022 Aggregation\n\u2022 HAVING clause\n\u2022 Business rule filtering",
    "concepts": [
      "Aggregation",
      "HAVING clause",
      "Business rule filtering"
    ]
  },
  {
    "id": "challenge-15",
    "title": "15. Running Total Salary by Department",
    "description": "Calculate **running total of salaries** within each department ordered by salary.",
    "task": "Calculate **running total of salaries** within each department ordered by salary.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT empName, deptName, salary,\n       SUM(salary) OVER (\n         PARTITION BY deptName\n         ORDER BY salary DESC\n         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n       ) AS runningTotal\nFROM employees;",
    "expectedOutput": "+----------+--------+--------+-------------+\n| deptName | empName| salary | runningTotal|\n+----------+--------+--------+-------------+\n| HR       | Bob    | 50000  | 50000       |\n| HR       | Charlie| 45000  | 95000       |\n| HR       | Alice  | 40000  | 135000      |\n+----------+--------+--------+-------------+",
    "solution": "SELECT empName, deptName, salary,\n       SUM(salary) OVER (\n         PARTITION BY deptName\n         ORDER BY salary DESC\n         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n       ) AS runningTotal\nFROM employees;",
    "hint": "Try using these concepts:\n\n\u2022 Window frames\n\u2022 Cumulative aggregates\n\u2022 ORDER BY inside window",
    "concepts": [
      "Window frames",
      "Cumulative aggregates",
      "ORDER BY inside window"
    ]
  },
  {
    "id": "challenge-16",
    "title": "16. Salary Difference Between Consecutive Records",
    "description": "Calculate the **difference between current and previous salary** for each employee.",
    "task": "Calculate the **difference between current and previous salary** for each employee.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT empName,\n       LAG(salary) OVER (PARTITION BY empId ORDER BY effectiveDate) AS prevSalary,\n       salary,\n       salary - LAG(salary) OVER (PARTITION BY empId ORDER BY effectiveDate) AS difference\nFROM salary_history;",
    "expectedOutput": "+--------+-----------+--------+------------+\n| empName| prevSalary| salary | difference |\n+--------+-----------+--------+------------+\n| Alice  | 40000     | 42000  | 2000       |\n| Alice  | 42000     | 45000  | 3000       |\n| Bob    | 48000     | 52000  | 4000       |\n+--------+-----------+--------+------------+",
    "solution": "SELECT empName,\n       LAG(salary) OVER (PARTITION BY empId ORDER BY effectiveDate) AS prevSalary,\n       salary,\n       salary - LAG(salary) OVER (PARTITION BY empId ORDER BY effectiveDate) AS difference\nFROM salary_history;",
    "hint": "Try using these concepts:\n\n\u2022 LAG window function\n\u2022 Time-series comparison\n\u2022 Self-row reference",
    "concepts": [
      "LAG window function",
      "Time-series comparison",
      "Self-row reference"
    ]
  },
  {
    "id": "challenge-17",
    "title": "17. Salary Increase History",
    "description": "Show **only salary increase events** for employees.",
    "task": "Show **only salary increase events** for employees.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT empName, salary, prevSalary\nFROM (\n  SELECT empName, salary,\n         LAG(salary) OVER (PARTITION BY empId ORDER BY effectiveDate) AS prevSalary\n  FROM salary_history\n) t\nWHERE salary > prevSalary;",
    "expectedOutput": "+--------+--------+-----------+\n| empName| salary | prevSalary|\n+--------+--------+-----------+\n| Alice  | 42000  | 40000     |\n| Alice  | 45000  | 42000     |\n| Bob    | 52000  | 48000     |\n+--------+--------+-----------+",
    "solution": "SELECT empName, salary, prevSalary\nFROM (\n  SELECT empName, salary,\n         LAG(salary) OVER (PARTITION BY empId ORDER BY effectiveDate) AS prevSalary\n  FROM salary_history\n) t\nWHERE salary > prevSalary;",
    "hint": "Try using these concepts:\n\n\u2022 Change detection\n\u2022 Filtering based on previous values\n\u2022 Window functions",
    "concepts": [
      "Change detection",
      "Filtering based on previous values",
      "Window functions"
    ]
  },
  {
    "id": "challenge-18",
    "title": "18. Employee Department Change History",
    "description": "Identify when an employee **changed departments**.",
    "task": "Identify when an employee **changed departments**.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT empId, empName, prevDept, deptName\nFROM (\n  SELECT empId, empName, deptName,\n         LAG(deptName) OVER (PARTITION BY empId ORDER BY effectiveDate) AS prevDept\n  FROM emp_history\n) t\nWHERE prevDept IS NOT NULL\n  AND prevDept <> deptName;",
    "expectedOutput": "+------+--------+----------+----------+\n| empId| empName| prevDept | deptName |\n+------+--------+----------+----------+\n| 1    | Alice  | HR       | IT       |\n| 3    | Charlie| IT       | HR       |\n+------+--------+----------+----------+",
    "solution": "SELECT empId, empName, prevDept, deptName\nFROM (\n  SELECT empId, empName, deptName,\n         LAG(deptName) OVER (PARTITION BY empId ORDER BY effectiveDate) AS prevDept\n  FROM emp_history\n) t\nWHERE prevDept IS NOT NULL\n  AND prevDept <> deptName;",
    "hint": "Try using these concepts:\n\n\u2022 Slowly changing dimensions (SCD)\n\u2022 LAG\n\u2022 Historical tracking",
    "concepts": [
      "Slowly changing dimensions (SCD)",
      "LAG",
      "Historical tracking"
    ]
  },
  {
    "id": "challenge-19",
    "title": "19. Invalid Department Employees",
    "description": "Find employees assigned to **invalid / missing departments**.",
    "task": "Find employees assigned to **invalid / missing departments**.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT e.*\nFROM employees e\nLEFT JOIN departments d\nON e.deptId = d.deptId\nWHERE d.deptId IS NULL;",
    "expectedOutput": "+------+--------+--------+--------+\n| empId| empName| deptId | salary |\n+------+--------+--------+--------+\n| 4    | Diana  | 40     | 60000  |\n| 5    | Eve    | 50     | 55000  |\n+------+--------+--------+--------+",
    "solution": "SELECT e.*\nFROM employees e\nLEFT JOIN departments d\nON e.deptId = d.deptId\nWHERE d.deptId IS NULL;",
    "hint": "Try using these concepts:\n\n\u2022 LEFT JOIN\n\u2022 Data quality validation\n\u2022 Referential integrity",
    "concepts": [
      "LEFT JOIN",
      "Data quality validation",
      "Referential integrity"
    ]
  },
  {
    "id": "challenge-20",
    "title": "20. Customer First Purchase",
    "description": "Find the **first purchase** made by each customer.",
    "task": "Find the **first purchase** made by each customer.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT customerId, orderId, orderDate\nFROM (\n  SELECT *,\n         ROW_NUMBER() OVER (\n           PARTITION BY customerId\n           ORDER BY orderDate\n         ) AS rn\n  FROM orders\n) t\nWHERE rn = 1;",
    "expectedOutput": "+----------+--------+------------+\n|customerId|orderId | orderDate  |\n+----------+--------+------------+\n| 1        | 101    | 2021-01-01 |\n| 2        | 104    | 2020-12-20 |\n| 3        | 106    | 2022-01-01 |\n+----------+--------+------------+",
    "solution": "SELECT customerId, orderId, orderDate\nFROM (\n  SELECT *,\n         ROW_NUMBER() OVER (\n           PARTITION BY customerId\n           ORDER BY orderDate\n         ) AS rn\n  FROM orders\n) t\nWHERE rn = 1;",
    "hint": "Try using these concepts:\n\n\u2022 ROW_NUMBER\n\u2022 Earliest record selection\n\u2022 Partitioning logic",
    "concepts": [
      "ROW_NUMBER",
      "Earliest record selection",
      "Partitioning logic"
    ]
  },
  {
    "id": "challenge-21",
    "title": "21. Customers With At Least 2 High-Value Orders",
    "description": "Find customers who placed **at least two orders above X amount**.",
    "task": "Find customers who placed **at least two orders above X amount**.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT customerId, COUNT(*) AS largeOrderCount\nFROM orders\nWHERE amount > 5000\nGROUP BY customerId\nHAVING COUNT(*) >= 2;",
    "expectedOutput": "+----------+----------------+\n|customerId|largeOrderCount |\n+----------+----------------+\n| 1        | 2              |\n| 3        | 2              |\n+----------+----------------+",
    "solution": "SELECT customerId, COUNT(*) AS largeOrderCount\nFROM orders\nWHERE amount > 5000\nGROUP BY customerId\nHAVING COUNT(*) >= 2;",
    "hint": "Try using these concepts:\n\n\u2022 Conditional filtering\n\u2022 HAVING clause\n\u2022 Business metrics",
    "concepts": [
      "Conditional filtering",
      "HAVING clause",
      "Business metrics"
    ]
  },
  {
    "id": "challenge-22",
    "title": "22. Customers Without Orders",
    "description": "Identify customers who **never placed any orders**.",
    "task": "Identify customers who **never placed any orders**.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT c.customerId, c.customerName\nFROM customers c\nLEFT JOIN orders o\nON c.customerId = o.customerId\nWHERE o.customerId IS NULL;",
    "expectedOutput": "+----------+------------+\n|customerId|customerName|\n+----------+------------+\n| 4        | Diana      |\n+----------+------------+",
    "solution": "SELECT c.customerId, c.customerName\nFROM customers c\nLEFT JOIN orders o\nON c.customerId = o.customerId\nWHERE o.customerId IS NULL;",
    "hint": "Try using these concepts:\n\n\u2022 LEFT JOIN anti-pattern\n\u2022 Missing data detection",
    "concepts": [
      "LEFT JOIN anti-pattern",
      "Missing data detection"
    ]
  },
  {
    "id": "challenge-23",
    "title": "23. Top N Customers by Total Spend",
    "description": "Find **top N customers** by total spending.",
    "task": "Find **top N customers** by total spending.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT customerId, customerName, totalSpent\nFROM (\n  SELECT customerId, customerName,\n         SUM(orderAmount) AS totalSpent,\n         ROW_NUMBER() OVER (\n           ORDER BY SUM(orderAmount) DESC\n         ) AS rn\n  FROM orders\n  GROUP BY customerId, customerName\n) t\nWHERE rn <= 4;",
    "expectedOutput": "+----------+------------+-----------+\n|customerId|customerName|totalSpent |\n+----------+------------+-----------+\n| 4        | Diana      | 300.00    |\n| 2        | Bob        | 350.00    |\n| 1        | Alice      | 200.50    |\n| 5        | Eve        | 200.00    |\n+----------+------------+-----------+",
    "solution": "SELECT customerId, customerName, totalSpent\nFROM (\n  SELECT customerId, customerName,\n         SUM(orderAmount) AS totalSpent,\n         ROW_NUMBER() OVER (\n           ORDER BY SUM(orderAmount) DESC\n         ) AS rn\n  FROM orders\n  GROUP BY customerId, customerName\n) t\nWHERE rn <= 4;",
    "hint": "Try using these concepts:\n\n\u2022 Ranking\n\u2022 Aggregation + window\n\u2022 Top-N pattern (very common)",
    "concepts": [
      "Ranking",
      "Aggregation + window",
      "Top-N pattern (very common)"
    ]
  },
  {
    "id": "challenge-24",
    "title": "24. Products Not Sold",
    "description": "Find products that were **never sold**.",
    "task": "Find products that were **never sold**.",
    "initialCode": "-- Write your query here\n",
    "setupSql": "\n-- Employees & Departments\nCREATE TABLE departments (deptId INTEGER, deptName VARCHAR);\nINSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');\n\nCREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);\nINSERT INTO employees VALUES \n(1, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(2, 'Bob', 'HR', 50000, '2020-05-20', 1),\n(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),\n(4, 'Diana', 'IT', 60000, '2021-08-01', 40),\n(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),\n(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),\n(7, 'Alice', 'HR', 40000, '2020-01-15', 1),\n(8, 'Hank', 'IT', 45000, '2021-06-01', 2);\n\n-- Salary History\nCREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);\nINSERT INTO salary_history VALUES\n(1, 'Alice', 40000, '2020-01-15'),\n(1, 'Alice', 42000, '2021-01-15'),\n(1, 'Alice', 45000, '2022-01-15'),\n(2, 'Bob', 48000, '2020-05-20'),\n(2, 'Bob', 52000, '2021-05-20');\n\n-- Emp History\nCREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);\nINSERT INTO emp_history VALUES\n(1, 'Alice', 'IT', '2019-01-01'),\n(1, 'Alice', 'HR', '2020-01-15'),\n(3, 'Charlie', 'HR', '2020-03-10'),\n(3, 'Charlie', 'IT', '2021-03-10');\n\n-- Customers & Orders\nCREATE TABLE customers (customerId INTEGER, customerName VARCHAR);\nINSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');\n\nCREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);\nINSERT INTO orders VALUES\n(101, 1, '2021-01-01', 200, 200),\n(102, 1, '2021-02-01', 300, 300),\n(103, 1, '2021-03-01', 6000, 6000),\n(104, 2, '2020-12-20', 150, 150),\n(105, 2, '2021-01-20', 200, 200),\n(106, 3, '2022-01-01', 5500, 5500),\n(107, 3, '2022-02-01', 6000, 6000);\n\n-- Products & Sales\nCREATE TABLE products (productId INTEGER, productName VARCHAR);\nINSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');\n\nCREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);\nINSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');\n",
    "expectedSql": "SELECT p.productId, p.productName\nFROM products p\nLEFT JOIN sales s\nON p.productId = s.productId\nWHERE s.productId IS NULL;",
    "expectedOutput": "+---------+------------+\n|productId|productName|\n+---------+------------+\n| 102     | Mouse     |\n| 104     | Monitor   |\n+---------+------------+",
    "solution": "SELECT p.productId, p.productName\nFROM products p\nLEFT JOIN sales s\nON p.productId = s.productId\nWHERE s.productId IS NULL;",
    "hint": "Try using these concepts:\n\n\u2022 LEFT JOIN\n\u2022 Anti-join logic\n\u2022 Inventory gap analysis",
    "concepts": [
      "LEFT JOIN",
      "Anti-join logic",
      "Inventory gap analysis"
    ]
  }
];