import re
import json

def parse_markdown(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by "## " to get sections
    sections = re.split(r'^## ', content, flags=re.MULTILINE)
    
    challenges = []
    
    setup_sql = """
-- Employees & Departments
CREATE TABLE departments (deptId INTEGER, deptName VARCHAR);
INSERT INTO departments VALUES (1, 'HR'), (2, 'IT'), (3, 'Finance'), (40, 'Invalid'), (50, 'Missing');

CREATE TABLE employees (empId INTEGER, empName VARCHAR, deptName VARCHAR, salary INTEGER, hireDate DATE, deptId INTEGER);
INSERT INTO employees VALUES 
(1, 'Alice', 'HR', 40000, '2020-01-15', 1),
(2, 'Bob', 'HR', 50000, '2020-05-20', 1),
(3, 'Charlie', 'IT', 45000, '2021-03-10', 2),
(4, 'Diana', 'IT', 60000, '2021-08-01', 40),
(5, 'Eve', 'Finance', 55000, '2022-02-14', 50),
(6, 'Frank', 'Finance', 60000, '2021-11-30', 3),
(7, 'Alice', 'HR', 40000, '2020-01-15', 1),
(8, 'Hank', 'IT', 45000, '2021-06-01', 2);

-- Salary History
CREATE TABLE salary_history (empId INTEGER, empName VARCHAR, salary INTEGER, effectiveDate DATE);
INSERT INTO salary_history VALUES
(1, 'Alice', 40000, '2020-01-15'),
(1, 'Alice', 42000, '2021-01-15'),
(1, 'Alice', 45000, '2022-01-15'),
(2, 'Bob', 48000, '2020-05-20'),
(2, 'Bob', 52000, '2021-05-20');

-- Emp History
CREATE TABLE emp_history (empId INTEGER, empName VARCHAR, deptName VARCHAR, effectiveDate DATE);
INSERT INTO emp_history VALUES
(1, 'Alice', 'IT', '2019-01-01'),
(1, 'Alice', 'HR', '2020-01-15'),
(3, 'Charlie', 'HR', '2020-03-10'),
(3, 'Charlie', 'IT', '2021-03-10');

-- Customers & Orders
CREATE TABLE customers (customerId INTEGER, customerName VARCHAR);
INSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'), (4, 'Diana'), (5, 'Eve');

CREATE TABLE orders (orderId INTEGER, customerId INTEGER, orderDate DATE, amount INTEGER, orderAmount INTEGER);
INSERT INTO orders VALUES
(101, 1, '2021-01-01', 200, 200),
(102, 1, '2021-02-01', 300, 300),
(103, 1, '2021-03-01', 6000, 6000),
(104, 2, '2020-12-20', 150, 150),
(105, 2, '2021-01-20', 200, 200),
(106, 3, '2022-01-01', 5500, 5500),
(107, 3, '2022-02-01', 6000, 6000);

-- Products & Sales
CREATE TABLE products (productId INTEGER, productName VARCHAR);
INSERT INTO products VALUES (101, 'Laptop'), (102, 'Mouse'), (103, 'Keyboard'), (104, 'Monitor');

CREATE TABLE sales (saleId INTEGER, productId INTEGER, saleDate DATE);
INSERT INTO sales VALUES (1, 101, '2022-01-01'), (2, 103, '2022-01-02');
"""

    for section in sections:
        if not section.strip():
            continue
            
        lines = section.split('\n')
        title_line = lines[0].strip()
        
        # Check if it's a challenge section (starts with a number)
        if not re.match(r'^\d+\.', title_line):
            continue
            
        title = title_line
        
        # Extract parts
        question_match = re.search(r'### Interview Question\s+(.*?)\s+###', section, re.DOTALL)
        expected_output_match = re.search(r'### Expected Output\s+(.*?)\s+###', section, re.DOTALL)
        answer_match = re.search(r'### Answer \(SQL\)\s+```(?:sql)?\s+(.*?)\s+```', section, re.DOTALL)
        concepts_match = re.search(r'### Concepts Used\s+(.*?)(?:$|---)', section, re.DOTALL)
        
        if not (question_match and answer_match):
            continue
            
        question = question_match.group(1).strip()
        answer = answer_match.group(1).strip()
        concepts = concepts_match.group(1).strip() if concepts_match else ""
        
        # Extract expected output table
        expected_output = ""
        if expected_output_match:
            # Look for code block in expected output
            code_block = re.search(r'```\n(.*?)\n```', expected_output_match.group(1), re.DOTALL)
            if code_block:
                expected_output = code_block.group(1)
        
        # Clean up concepts
        concepts_list = [c.strip('* ').strip() for c in concepts.split('\n') if c.strip()]
        concepts_str = "\n".join([f"• {c}" for c in concepts_list])
        
        # Description is just the question
        description = question
        
        challenge = {
            "id": f"challenge-{title.split('.')[0]}",
            "title": title,
            "description": description,
            "task": question,
            "initialCode": "-- Write your query here\n",
            "setupSql": setup_sql,
            "expectedSql": answer,
            "expectedOutput": expected_output,
            "solution": answer,
            "hint": f"Try using these concepts:\n\n{concepts_str}",
            "concepts": concepts_list
        }
        challenges.append(challenge)
        
    return challenges

challenges = parse_markdown('src/files/interview.md')

ts_content = """export interface Challenge {
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

export const challenges: Challenge[] = """ + json.dumps(challenges, indent=2) + ";"

with open('src/lib/challenges.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Generated {len(challenges)} challenges.")
