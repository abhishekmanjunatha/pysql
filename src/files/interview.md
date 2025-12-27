You’re absolutely right — thanks for pushing on this.
What you’re asking for is the **correct, complete, interview-grade format**.

Below is a **STRICT, COMPLETE, and CONSISTENT structure** that interviewers actually expect:

For **EACH question**, you will get **ALL 4 items**:

1. **Interview Question (standard wording)**
2. **Expected Output (what result should look like)**
3. **Answer (SQL)**
4. **Concepts Used (what interviewer is testing)**

I’ll give you a **clean `.md` section** covering **ALL EASY + MEDIUM questions**.
This is **copy-paste safe** and **not broken**.

---

# 📘 Data Engineer Interview Prep – SQL (Complete Format)

---

## 🟢 EASY LEVEL

---

## 1. Employees with Salary Greater Than X

### Interview Question

Find all employees whose salary is greater than a given threshold X.

### Expected Output

```
+----------+----------+--------+
| deptName | empName  | salary |
+----------+----------+--------+
| Finance  | Eve      | 55000  |
| Finance  | Frank   | 60000  |
| IT       | Diana   | 60000  |
| HR       | Bob     | 50000  |
+----------+----------+--------+
```

### Answer (SQL)

```
SELECT deptName, empName, salary
FROM employees
WHERE salary > 45000
ORDER BY deptName, salary DESC;
```

### Concepts Used

* WHERE filtering
* ORDER BY
* Comparison operators
* Basic SELECT projection

---

## 2. Average Salary by Department

### Interview Question

Calculate the average salary for each department.

### Expected Output

```
+----------+-----------+
| deptName | avgSalary |
+----------+-----------+
| HR       | 45000     |
| IT       | 52500     |
| Finance  | 60000     |
+----------+-----------+
```

### Answer (SQL)

```
SELECT deptName, AVG(salary) AS avgSalary
FROM employees
GROUP BY deptName;
```

### Concepts Used

* GROUP BY
* Aggregate functions
* Column aliasing

---

## 3. Employee Count by Department

### Interview Question

Find the number of employees in each department.

### Expected Output

```
+----------+---------------+
| deptName | employeeCount |
+----------+---------------+
| HR       | 3             |
| IT       | 2             |
| Finance  | 2             |
+----------+---------------+
```

### Answer (SQL)

```
SELECT deptName, COUNT(*) AS employeeCount
FROM employees
GROUP BY deptName;
```

### Concepts Used

* COUNT aggregate
* GROUP BY

---

## 4. Employees Hired Each Year

### Interview Question

Count employees hired in each year.

### Expected Output

```
+------+---------------+
| year | employeeCount |
+------+---------------+
| 2020 | 2             |
| 2021 | 2             |
| 2022 | 1             |
+------+---------------+
```

### Answer (SQL)

```
SELECT YEAR(hireDate) AS year, COUNT(*) AS employeeCount
FROM employees
GROUP BY YEAR(hireDate);
```

### Concepts Used

* Date functions
* GROUP BY on derived columns

---

## 5. Find Duplicate Records

### Interview Question

Identify duplicate employee records.

### Expected Output

```
+--------+----------+--------+-----+
| empName| deptName | salary | cnt |
+--------+----------+--------+-----+
| Alice  | HR       | 40000  | 2   |
+--------+----------+--------+-----+
```

### Answer (SQL)

```
SELECT empName, deptName, salary, COUNT(*) AS cnt
FROM employees
GROUP BY empName, deptName, salary
HAVING COUNT(*) > 1;
```

### Concepts Used

* GROUP BY
* HAVING clause
* Duplicate detection

---

## 6. Maximum Salary by Department

### Interview Question

Find the highest paid employee in each department.

### Expected Output

```
+----------+--------+--------+
| deptName | empName| salary |
+----------+--------+--------+
| HR       | Bob    | 50000  |
| IT       | Diana  | 60000  |
| Finance  | Frank | 60000  |
+----------+--------+--------+
```

### Answer (SQL)

```
SELECT deptName, empName, salary
FROM (
  SELECT *,
         DENSE_RANK() OVER (PARTITION BY deptName ORDER BY salary DESC) AS rnk
  FROM employees
) t
WHERE rnk = 1;
```

### Concepts Used

* Window functions
* DENSE_RANK
* PARTITION BY

---

## 7. Minimum Salary by Department

### Interview Question

Find the lowest paid employee in each department.

### Expected Output

```
+----------+--------+--------+
| deptName | empName| salary |
+----------+--------+--------+
| HR       | Alice  | 40000  |
| IT       | Charlie| 45000  |
| Finance  | Eve    | 55000  |
+----------+--------+--------+
```

### Answer (SQL)

```
SELECT deptName, empName, salary
FROM (
  SELECT *,
         DENSE_RANK() OVER (PARTITION BY deptName ORDER BY salary ASC) AS rnk
  FROM employees
) t
WHERE rnk = 1;
```

### Concepts Used

* Window ranking
* Ascending vs descending order

---

## 8. Remove Duplicates and Keep Max Salary

### Interview Question

Remove duplicate employees and keep the record with the highest salary.

### Expected Output

```
+------+--------+----------+--------+
| empId| empName| deptName | salary |
+------+--------+----------+--------+
| 2    | Bob    | HR       | 50000  |
| 4    | Diana  | IT       | 60000  |
| 6    | Frank  | Finance  | 55000  |
+------+--------+----------+--------+
```

### Answer (SQL)

```
SELECT empId, empName, deptName, salary
FROM (
  SELECT *,
         ROW_NUMBER() OVER (
           PARTITION BY empName, deptName
           ORDER BY salary DESC
         ) AS rn
  FROM employees
) t
WHERE rn = 1;
```

### Concepts Used

* ROW_NUMBER
* De-duplication
* Partitioning logic

---

## 9. Salary Above Department Average

### Interview Question

Find employees earning more than their department average.

### Expected Output

```
+--------+----------+--------+
| empName| deptName | salary |
+--------+----------+--------+
| Bob    | HR       | 50000  |
| Diana  | IT       | 60000  |
| Frank  | Finance  | 60000  |
+--------+----------+--------+
```

### Answer (SQL)

```
SELECT empName, deptName, salary
FROM (
  SELECT *,
         AVG(salary) OVER (PARTITION BY deptName) AS deptAvg
  FROM employees
) t
WHERE salary > deptAvg;
```

### Concepts Used

* Window aggregates
* Row vs group comparison

---

## 🟡 MEDIUM LEVEL (Core Data Engineer)

---

## 10. Second Highest Salary per Department

### Interview Question

Find the second highest salary in each department.

### Expected Output

```
+----------+--------+--------+
| deptName | empName| salary |
+----------+--------+--------+
| HR       | Charlie| 45000  |
| IT       | Hank   | 45000  |
| Finance  | Frank  | 53000  |
+----------+--------+--------+
```

### Answer (SQL)

```
SELECT deptName, empName, salary
FROM (
  SELECT *,
         DENSE_RANK() OVER (PARTITION BY deptName ORDER BY salary DESC) AS rnk
  FROM employees
) t
WHERE rnk = 2;
```

### Concepts Used

* DENSE_RANK vs ROW_NUMBER
* Handling ties
* Ranking problems (very common)

---

## 11. Nth Highest Salary per Department

### Interview Question

Find the Nth highest salary per department.

### Expected Output (N = 2)

```
+----------+--------+--------+
| deptName | empName| salary |
+----------+--------+--------+
| HR       | Charlie| 45000  |
| IT       | Eve    | 50000  |
+----------+--------+--------+
```

### Answer (SQL)

```
SELECT deptName, empName, salary
FROM (
  SELECT *,
         DENSE_RANK() OVER (PARTITION BY deptName ORDER BY salary DESC) AS rnk
  FROM employees
) t
WHERE rnk = N;
```

### Concepts Used

* Parameterized queries
* Reusable ranking logic

---

## 12. Customers Without Orders

### Interview Question

Find customers who never placed an order.

### Expected Output

```
+----------+------------+
|customerId|customerName|
+----------+------------+
| 4        | Diana      |
+----------+------------+
```

### Answer (SQL)

```
SELECT c.*
FROM customers c
LEFT JOIN orders o
ON c.customerId = o.customerId
WHERE o.customerId IS NULL;
```

### Concepts Used

* LEFT JOIN
* NULL filtering
* Data completeness checks

---

## 13. Products Not Sold

### Interview Question

Find products that were never sold.

### Expected Output

```
+---------+------------+
|productId|productName|
+---------+------------+
| 102     | Mouse     |
| 104     | Monitor   |
+---------+------------+
```

### Answer (SQL)

```
SELECT p.*
FROM products p
LEFT JOIN sales s
ON p.productId = s.productId
WHERE s.productId IS NULL;
```

### Concepts Used

* LEFT JOIN anti-pattern
* Referential integrity

---

You’re right again — thanks for holding the bar.
Below is **THE REMAINING QUESTIONS**, completed **without skipping anything**, in the **same strict 4-part interview format**:

> **Interview Question → Expected Output → Answer (SQL) → Concepts Used**

You can **append this directly** to your existing `.md` file.

---


## 🟡 MEDIUM LEVEL (continued)

---

## 14. Department Total Salary Greater Than X

### Interview Question

Find departments whose **total salary** exceeds a given threshold X.

### Expected Output

```
+----------+-------------+
| deptName | totalSalary |
+----------+-------------+
| Finance  | 170000      |
| IT       | 165000      |
+----------+-------------+
```

### Answer (SQL)

```
SELECT deptName, SUM(salary) AS totalSalary
FROM employees
GROUP BY deptName
HAVING SUM(salary) > 150000;
```

### Concepts Used

* Aggregation
* HAVING clause
* Business rule filtering

---

## 15. Running Total Salary by Department

### Interview Question

Calculate **running total of salaries** within each department ordered by salary.

### Expected Output

```
+----------+--------+--------+-------------+
| deptName | empName| salary | runningTotal|
+----------+--------+--------+-------------+
| HR       | Bob    | 50000  | 50000       |
| HR       | Charlie| 45000  | 95000       |
| HR       | Alice  | 40000  | 135000      |
+----------+--------+--------+-------------+
```

### Answer (SQL)

```
SELECT empName, deptName, salary,
       SUM(salary) OVER (
         PARTITION BY deptName
         ORDER BY salary DESC
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS runningTotal
FROM employees;
```

### Concepts Used

* Window frames
* Cumulative aggregates
* ORDER BY inside window

---

## 16. Salary Difference Between Consecutive Records

### Interview Question

Calculate the **difference between current and previous salary** for each employee.

### Expected Output

```
+--------+-----------+--------+------------+
| empName| prevSalary| salary | difference |
+--------+-----------+--------+------------+
| Alice  | 40000     | 42000  | 2000       |
| Alice  | 42000     | 45000  | 3000       |
| Bob    | 48000     | 52000  | 4000       |
+--------+-----------+--------+------------+
```

### Answer (SQL)

```
SELECT empName,
       LAG(salary) OVER (PARTITION BY empId ORDER BY effectiveDate) AS prevSalary,
       salary,
       salary - LAG(salary) OVER (PARTITION BY empId ORDER BY effectiveDate) AS difference
FROM salary_history;
```

### Concepts Used

* LAG window function
* Time-series comparison
* Self-row reference

---

## 17. Salary Increase History

### Interview Question

Show **only salary increase events** for employees.

### Expected Output

```
+--------+--------+-----------+
| empName| salary | prevSalary|
+--------+--------+-----------+
| Alice  | 42000  | 40000     |
| Alice  | 45000  | 42000     |
| Bob    | 52000  | 48000     |
+--------+--------+-----------+
```

### Answer (SQL)

```
SELECT empName, salary, prevSalary
FROM (
  SELECT empName, salary,
         LAG(salary) OVER (PARTITION BY empId ORDER BY effectiveDate) AS prevSalary
  FROM salary_history
) t
WHERE salary > prevSalary;
```

### Concepts Used

* Change detection
* Filtering based on previous values
* Window functions

---

## 18. Employee Department Change History

### Interview Question

Identify when an employee **changed departments**.

### Expected Output

```
+------+--------+----------+----------+
| empId| empName| prevDept | deptName |
+------+--------+----------+----------+
| 1    | Alice  | HR       | IT       |
| 3    | Charlie| IT       | HR       |
+------+--------+----------+----------+
```

### Answer (SQL)

```
SELECT empId, empName, prevDept, deptName
FROM (
  SELECT empId, empName, deptName,
         LAG(deptName) OVER (PARTITION BY empId ORDER BY effectiveDate) AS prevDept
  FROM emp_history
) t
WHERE prevDept IS NOT NULL
  AND prevDept <> deptName;
```

### Concepts Used

* Slowly changing dimensions (SCD)
* LAG
* Historical tracking

---

## 19. Invalid Department Employees

### Interview Question

Find employees assigned to **invalid / missing departments**.

### Expected Output

```
+------+--------+--------+--------+
| empId| empName| deptId | salary |
+------+--------+--------+--------+
| 4    | Diana  | 40     | 60000  |
| 5    | Eve    | 50     | 55000  |
+------+--------+--------+--------+
```

### Answer (SQL)

```
SELECT e.*
FROM employees e
LEFT JOIN departments d
ON e.deptId = d.deptId
WHERE d.deptId IS NULL;
```

### Concepts Used

* LEFT JOIN
* Data quality validation
* Referential integrity

---

## 20. Customer First Purchase

### Interview Question

Find the **first purchase** made by each customer.

### Expected Output

```
+----------+--------+------------+
|customerId|orderId | orderDate  |
+----------+--------+------------+
| 1        | 101    | 2021-01-01 |
| 2        | 104    | 2020-12-20 |
| 3        | 106    | 2022-01-01 |
+----------+--------+------------+
```

### Answer (SQL)

```
SELECT customerId, orderId, orderDate
FROM (
  SELECT *,
         ROW_NUMBER() OVER (
           PARTITION BY customerId
           ORDER BY orderDate
         ) AS rn
  FROM orders
) t
WHERE rn = 1;
```

### Concepts Used

* ROW_NUMBER
* Earliest record selection
* Partitioning logic

---

## 21. Customers With At Least 2 High-Value Orders

### Interview Question

Find customers who placed **at least two orders above X amount**.

### Expected Output

```
+----------+----------------+
|customerId|largeOrderCount |
+----------+----------------+
| 1        | 2              |
| 3        | 2              |
+----------+----------------+
```

### Answer (SQL)

```
SELECT customerId, COUNT(*) AS largeOrderCount
FROM orders
WHERE amount > 5000
GROUP BY customerId
HAVING COUNT(*) >= 2;
```

### Concepts Used

* Conditional filtering
* HAVING clause
* Business metrics

---

## 22. Customers Without Orders

### Interview Question

Identify customers who **never placed any orders**.

### Expected Output

```
+----------+------------+
|customerId|customerName|
+----------+------------+
| 4        | Diana      |
+----------+------------+
```

### Answer (SQL)

```
SELECT c.customerId, c.customerName
FROM customers c
LEFT JOIN orders o
ON c.customerId = o.customerId
WHERE o.customerId IS NULL;
```

### Concepts Used

* LEFT JOIN anti-pattern
* Missing data detection

---

## 23. Top N Customers by Total Spend

### Interview Question

Find **top N customers** by total spending.

### Expected Output (N = 4)

```
+----------+------------+-----------+
|customerId|customerName|totalSpent |
+----------+------------+-----------+
| 4        | Diana      | 300.00    |
| 2        | Bob        | 350.00    |
| 1        | Alice      | 200.50    |
| 5        | Eve        | 200.00    |
+----------+------------+-----------+
```

### Answer (SQL)

```
SELECT customerId, customerName, totalSpent
FROM (
  SELECT customerId, customerName,
         SUM(orderAmount) AS totalSpent,
         ROW_NUMBER() OVER (
           ORDER BY SUM(orderAmount) DESC
         ) AS rn
  FROM orders
  GROUP BY customerId, customerName
) t
WHERE rn <= 4;
```

### Concepts Used

* Ranking
* Aggregation + window
* Top-N pattern (very common)

---

## 24. Products Not Sold

### Interview Question

Find products that were **never sold**.

### Expected Output

```
+---------+------------+
|productId|productName|
+---------+------------+
| 102     | Mouse     |
| 104     | Monitor   |
+---------+------------+
```

### Answer (SQL)

```
SELECT p.productId, p.productName
FROM products p
LEFT JOIN sales s
ON p.productId = s.productId
WHERE s.productId IS NULL;
```

### Concepts Used

* LEFT JOIN
* Anti-join logic
* Inventory gap analysis

---
