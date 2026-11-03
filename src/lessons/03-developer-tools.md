# 03: Developer Tools: Terminal, Git, SQL, and APIs

> **Before you start:** [01](01-big-picture-and-data.md) (data, tables, JSON, CSV) and [02](02-python-programming.md) (Python basics, dicts, pip, virtual environments).
>
> **After this file you can:** move around your computer with the terminal, save and share code with Git and GitHub, query databases with SQL, and talk to web services through APIs, including LLM APIs.

These four tools show up in nearly every data and AI job. Nobody expects you to be an expert on day one. You do need to be comfortable with the basics.

---

## Table of contents

1. [The terminal (command line)](#1-the-terminal-command-line)
2. [Essential terminal commands](#2-essential-terminal-commands)
3. [Environment variables and secrets](#3-environment-variables-and-secrets)
4. [Git: version control](#4-git-version-control)
5. [GitHub: sharing and collaborating](#5-github-sharing-and-collaborating)
6. [Databases and SQL basics](#6-databases-and-sql-basics)
7. [SQL: filtering, sorting, aggregating](#7-sql-filtering-sorting-aggregating)
8. [SQL: joins](#8-sql-joins)
9. [SQL: subqueries, CTEs, window functions](#9-sql-subqueries-ctes-window-functions)
10. [SQL from Python](#10-sql-from-python)
11. [How the web works: HTTP](#11-how-the-web-works-http)
12. [APIs and REST](#12-apis-and-rest)
13. [Calling an API from Python](#13-calling-an-api-from-python)
14. [Check yourself](#14-check-yourself)
15. [New words in this file](#15-new-words-in-this-file)

---

## 1. The terminal (command line)

**Idea:** The **terminal** (also called the **command line**, **shell** or **console**) is a text window where you type commands to control your computer, instead of clicking with the mouse.

**Why bother?** Most AI work happens on remote servers (cloud machines with GPUs) that have **no graphical screen at all**, only a terminal. Also, many tools (pip, git, docker, python scripts) are run from the terminal.

- **Linux/Mac:** open "Terminal". The shell is usually **bash** or **zsh**.
- **Windows:** use "PowerShell", or better, install **WSL** (Windows Subsystem for Linux) to get a real Linux terminal.
- **Colab:** put `!` before a command in a cell: `!ls`.

When you see `$` at the start of a line in tutorials, that's the **prompt**. Don't type the `$`.

**Linux** is the operating system that runs almost all servers and cloud machines. Learning its commands is a great investment.

---

## 2. Essential terminal commands

### Files and folders

Folders are also called **directories**.

```bash
pwd                     # Print Working Directory: where am I?
ls                      # list files in the current folder
ls -la                  # list ALL files (including hidden ones) with details
cd projects             # Change Directory: go into "projects"
cd ..                   # go up one level
cd ~                    # go to your home folder
mkdir data              # make a new directory called "data"
touch notes.txt         # create an empty file
cp a.txt b.txt          # copy a file
mv a.txt docs/          # move a file (also used to rename: mv old.txt new.txt)
rm b.txt                # remove (delete) a file. No recycle bin! Careful.
rm -r old_folder        # remove a folder and everything inside. Be VERY careful.
```

**Paths:** `.` = current folder, `..` = parent folder, `~` = home folder, `/` = the very top (root) of the file system.

### Looking at files

```bash
cat notes.txt           # print the whole file
head -n 5 data.csv      # first 5 lines (great for peeking at big CSV files)
tail -n 5 log.txt       # last 5 lines
tail -f log.txt         # keep showing new lines as they're added (watching training logs)
wc -l data.csv          # count lines (rows) in a file
less big.txt            # scroll through a file (press q to quit)
```

### Searching

```bash
grep "error" log.txt            # show lines containing "error"
grep -r "import torch" .        # search all files in this folder and subfolders
find . -name "*.csv"            # find all CSV files
```

### Pipes and redirection

- `|` (**pipe**) sends one command's output into another command.
- `>` writes output to a file (overwrites). `>>` appends.

```bash
cat log.txt | grep "error" | wc -l     # how many error lines?
python train.py > output.txt           # save the program's output to a file
```

### Running programs and managing them

```bash
python script.py                 # run a Python script
python script.py --epochs 10     # pass arguments
nvidia-smi                       # show GPU usage (on machines with NVIDIA GPUs)
top                              # live view of running programs (q to quit)
htop                             # nicer version of top
Ctrl + C                         # stop the running program
nohup python train.py &          # run in background, keeps running after you log out
```

### Remote machines

```bash
ssh user@192.168.1.10            # log into a remote server
scp model.pt user@server:/models/   # copy a file to a server
```

**SSH** (Secure Shell) is how you connect to cloud GPU machines.

### Permissions

```bash
chmod +x run.sh      # make a script executable
sudo apt install git # run as administrator (on Ubuntu Linux)
```

**Tip:** press **Tab** to auto-complete file names, and the **↑** arrow key to repeat previous commands.

---

## 3. Environment variables and secrets

**Idea:** An **environment variable** is a named value stored in your terminal session that programs can read. They're commonly used for **secrets** like API keys (section 12), which you must **never** write directly in your code.

**Why?** If you put `api_key = "sk-abc123..."` in code and push it to GitHub, bots will find it within minutes and use your account (and your money).

```bash
export OPENAI_API_KEY="sk-abc123..."     # set it (Mac/Linux)
echo $OPENAI_API_KEY                     # check it
```

```python
import os
key = os.environ["OPENAI_API_KEY"]       # read it in Python
```

**`.env` files:** a common pattern is to put secrets in a file called `.env`:

```
OPENAI_API_KEY=sk-abc123...
DATABASE_URL=postgresql://user:pass@localhost/db
```

and load it with the `python-dotenv` package:

```python
from dotenv import load_dotenv
load_dotenv()               # reads .env into environment variables
```

**Always add `.env` to `.gitignore`** (section 4) so it's never uploaded.

---

## 4. Git: version control

### The problem

```
report_final.docx
report_final_v2.docx
report_final_v2_REALLY_FINAL.docx
report_final_v2_REALLY_FINAL_fixed.docx
```

Sound familiar? Now imagine 5 people editing the same code.

### The solution

**Git** is a **version control system**: it records snapshots of your project over time. You can see what changed, who changed it, go back to any earlier version, and work on experiments without breaking the main code.

**Analogy:** a video game with save points. You can save at any moment, and if you mess up, reload an earlier save.

### Key concepts

- **Repository (repo):** a project folder tracked by Git. Git stores its history in a hidden `.git` folder inside.
- **Commit:** a saved snapshot of your files, with a message describing the change.
- **Staging area:** a waiting area where you choose which changes go into the next commit.
- **Branch:** a separate line of development. You can experiment on a branch without affecting the `main` branch.
- **Merge:** combining a branch's changes back into another branch.

```
main:     A ── B ── C ─────────── F (merge)
                     \           /
feature:              D ──── E ─┘
```

### The basic workflow

```bash
git init                         # turn the current folder into a repo (once)
git status                       # what has changed?
git add train.py                 # stage one file
git add .                        # stage everything that changed
git commit -m "Add training script"   # save a snapshot with a message
git log --oneline                # see history
git diff                         # see exact line changes not yet staged
```

The three-step cycle you'll do hundreds of times:

```
edit files  →  git add  →  git commit
```

### Branches

```bash
git branch                       # list branches
git checkout -b new-feature      # create a branch and switch to it
                                 # (newer equivalent: git switch -c new-feature)
# ... edit, add, commit ...
git checkout main                # switch back to main
git merge new-feature            # bring the feature's commits into main
```

### Undoing things

```bash
git restore file.py              # discard uncommitted changes to a file
git revert <commit-id>           # make a new commit that undoes an old one (safe)
```

### .gitignore

A file named `.gitignore` lists files Git should **not** track:

```
.env
.venv/
__pycache__/
*.pyc
data/
*.pt
.ipynb_checkpoints/
```

Don't commit: secrets, virtual environments, big datasets, big model files. Big files are handled with tools like **Git LFS** or **DVC** (file 28).

### Merge conflicts

If two people change **the same lines** differently, Git can't decide and marks a **conflict**:

```
<<<<<<< HEAD
learning_rate = 0.01
=======
learning_rate = 0.001
>>>>>>> new-feature
```

You edit the file to keep what you want, delete the markers, then `git add` and `git commit`.

---

## 5. GitHub: sharing and collaborating

**Git** = the tool on your computer. **GitHub** = a website that hosts Git repositories online (alternatives: GitLab, Bitbucket). It's also where most open-source AI code lives, and your GitHub profile is your **portfolio** for job applications.

```bash
git clone https://github.com/user/repo.git   # download a repo
git remote add origin https://github.com/you/project.git   # link local repo to GitHub
git push origin main             # upload your commits
git pull                         # download and merge others' new commits
```

### Pull requests (PRs)

The standard team workflow:

1. Create a branch: `git checkout -b fix-bug`
2. Commit your changes and `git push origin fix-bug`
3. On GitHub, open a **Pull Request**: "please merge my branch into main"
4. Teammates **review** the code, comment, and approve
5. The PR is **merged**

Other GitHub terms:
- **Fork:** your own copy of someone else's repo
- **Issue:** a bug report or feature request
- **README.md:** the front page of a repo, written in **Markdown** (the same format as these course files)
- **GitHub Actions:** automatically run tests when code is pushed (this is CI/CD, file 28)
- **Star:** bookmark/like a repo

---

## 6. Databases and SQL basics

**Idea:** A **database** is an organised system for storing data so it can be searched and updated efficiently. A **relational database** stores data in **tables** (rows and columns, like in [file 01](01-big-picture-and-data.md#10-tables-rows-columns-features-labels)) which can be linked to each other.

**SQL** (Structured Query Language, said "S-Q-L" or "sequel") is the language for asking questions of relational databases.

Popular databases: **PostgreSQL**, **MySQL**, **SQLite** (a tiny database stored in a single file, great for learning), **SQL Server**, and cloud **data warehouses** like **BigQuery**, **Snowflake**, **Redshift** (built for analysing huge data).

### Our example tables

**customers**

| customer_id | name | city | joined |
|---|---|---|---|
| 1 | Amal | Colombo | 2023-01-15 |
| 2 | Nisha | Kandy | 2023-03-02 |
| 3 | John | Colombo | 2024-06-20 |
| 4 | Priya | Galle | 2024-07-11 |

**orders**

| order_id | customer_id | amount | order_date |
|---|---|---|---|
| 101 | 1 | 50.00 | 2024-01-10 |
| 102 | 1 | 20.00 | 2024-02-14 |
| 103 | 2 | 75.50 | 2024-02-20 |
| 104 | 3 | 10.00 | 2024-07-01 |
| 105 | 1 | 30.00 | 2024-08-05 |

- **Primary key:** a column that uniquely identifies each row (`customer_id` in customers, `order_id` in orders).
- **Foreign key:** a column that points to another table's primary key (`orders.customer_id` → `customers.customer_id`). That's how tables are linked: the "relational" in relational database.

### SELECT: getting data

```sql
SELECT * FROM customers;               -- all columns, all rows (* = everything)
SELECT name, city FROM customers;      -- just two columns
```

SQL keywords are usually written in CAPITALS by convention (not required). `--` starts a comment. Statements end with `;`.

---

## 7. SQL: filtering, sorting, aggregating

### WHERE: filter rows

```sql
SELECT * FROM customers WHERE city = 'Colombo';
SELECT * FROM orders WHERE amount > 25;
SELECT * FROM orders WHERE amount BETWEEN 20 AND 60;
SELECT * FROM customers WHERE city IN ('Kandy', 'Galle');
SELECT * FROM customers WHERE name LIKE 'A%';     -- starts with A (% = any characters)
SELECT * FROM customers WHERE city = 'Colombo' AND joined >= '2024-01-01';
SELECT * FROM orders WHERE amount IS NULL;        -- missing values (NULL = no value)
```

### ORDER BY and LIMIT

```sql
SELECT * FROM orders ORDER BY amount DESC;   -- biggest first (ASC = smallest first, default)
SELECT * FROM orders ORDER BY amount DESC LIMIT 3;   -- top 3
```

### Aggregate functions: summarising many rows into one number

```sql
SELECT COUNT(*) FROM orders;            -- 5    number of rows
SELECT SUM(amount) FROM orders;         -- 185.50
SELECT AVG(amount) FROM orders;         -- 37.10
SELECT MIN(amount), MAX(amount) FROM orders;   -- 10.00, 75.50
SELECT COUNT(DISTINCT customer_id) FROM orders;  -- 3   unique customers who ordered
```

### GROUP BY: aggregate per group

"Total spent **per customer**":

```sql
SELECT customer_id, COUNT(*) AS num_orders, SUM(amount) AS total
FROM orders
GROUP BY customer_id;
```

| customer_id | num_orders | total |
|---|---|---|
| 1 | 3 | 100.00 |
| 2 | 1 | 75.50 |
| 3 | 1 | 10.00 |

`AS` gives a column a nicer name (an **alias**).

**How GROUP BY works:** it puts rows into buckets by `customer_id`, then runs the aggregate on each bucket.

### HAVING: filter groups (after grouping)

`WHERE` filters rows **before** grouping. `HAVING` filters groups **after** grouping.

```sql
SELECT customer_id, SUM(amount) AS total
FROM orders
GROUP BY customer_id
HAVING SUM(amount) > 50;      -- only customers who spent more than 50
```

Result: customers 1 (100.00) and 2 (75.50).

### The order SQL actually runs things

You write: `SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT`

SQL runs: **FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT**

This explains why you can't use a SELECT alias inside WHERE (WHERE runs before SELECT).

---

## 8. SQL: joins

**Idea:** A **JOIN** combines rows from two tables using a matching column.

"Show each order with the customer's name":

```sql
SELECT o.order_id, c.name, o.amount
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id;
```

(`o` and `c` are short aliases for the table names.)

| order_id | name | amount |
|---|---|---|
| 101 | Amal | 50.00 |
| 102 | Amal | 20.00 |
| 103 | Nisha | 75.50 |
| 104 | John | 10.00 |
| 105 | Amal | 30.00 |

### Types of join

```
INNER JOIN       LEFT JOIN        RIGHT JOIN       FULL OUTER JOIN
  ┌──┬──┬──┐      ┌──┬──┬──┐       ┌──┬──┬──┐       ┌──┬──┬──┐
  │  │██│  │      │██│██│  │       │  │██│██│       │██│██│██│
  └──┴──┴──┘      └──┴──┴──┘       └──┴──┴──┘       └──┴──┴──┘
  A  both  B      A  both  B       A  both  B       A  both  B
```

- **INNER JOIN** (or just `JOIN`): only rows that match in **both** tables.
- **LEFT JOIN**: **all** rows from the left table, plus matches from the right (fills `NULL` where there's no match).
- **RIGHT JOIN**: the opposite.
- **FULL OUTER JOIN**: all rows from both.

**Example:** "All customers and how many orders they made, including those with zero":

```sql
SELECT c.name, COUNT(o.order_id) AS num_orders
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.name;
```

| name | num_orders |
|---|---|
| Amal | 3 |
| Nisha | 1 |
| John | 1 |
| Priya | 0 |

An INNER JOIN would have dropped Priya, who has no orders. **Choosing the wrong join is one of the most common data bugs.**

---

## 9. SQL: subqueries, CTEs, window functions

### Subquery: a query inside a query

"Orders bigger than the average order":

```sql
SELECT * FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders);   -- average is 37.10
```

Result: orders 101 (50.00) and 103 (75.50).

### CTE (Common Table Expression): named temporary result

`WITH` lets you name a step, making complex queries readable:

```sql
WITH customer_totals AS (
    SELECT customer_id, SUM(amount) AS total
    FROM orders
    GROUP BY customer_id
)
SELECT c.name, t.total
FROM customer_totals t
JOIN customers c ON c.customer_id = t.customer_id
WHERE t.total > 50;
```

### Window functions: calculations across related rows, without collapsing them

GROUP BY squashes many rows into one per group. **Window functions** compute something per group but **keep every row**.

```sql
SELECT order_id, customer_id, amount,
       SUM(amount) OVER (PARTITION BY customer_id) AS customer_total,
       ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS order_number
FROM orders;
```

| order_id | customer_id | amount | customer_total | order_number |
|---|---|---|---|---|
| 101 | 1 | 50.00 | 100.00 | 1 |
| 102 | 1 | 20.00 | 100.00 | 2 |
| 105 | 1 | 30.00 | 100.00 | 3 |
| 103 | 2 | 75.50 | 75.50 | 1 |
| 104 | 3 | 10.00 | 10.00 | 1 |

- `OVER (...)` makes it a window function.
- `PARTITION BY` = which rows form a group (like GROUP BY, but rows aren't collapsed).
- `ORDER BY` inside OVER = the order within each group.

Common window functions:
- `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`: numbering/ranking
- `LAG(amount)` / `LEAD(amount)`: previous / next row's value (e.g. "change since last order")
- `SUM(...) OVER (ORDER BY date)`: **running total**
- `AVG(...) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)`: **7-day moving average**

These are very common in data analyst interviews.

### Changing data (less common for analysts, but good to know)

```sql
INSERT INTO customers (customer_id, name, city) VALUES (5, 'Ravi', 'Jaffna');
UPDATE orders SET amount = 55.00 WHERE order_id = 101;
DELETE FROM orders WHERE order_id = 104;
CREATE TABLE products (product_id INT PRIMARY KEY, name TEXT, price REAL);
```

---

## 10. SQL from Python

```python
import sqlite3
import pandas as pd   # explained fully in file 08

conn = sqlite3.connect("shop.db")    # opens (or creates) a database file

df = pd.read_sql("""
    SELECT city, COUNT(*) AS n
    FROM customers
    GROUP BY city
""", conn)

print(df)
conn.close()
```

In real jobs, data often lives in a database or warehouse. You use SQL to pull just what you need, then Python to analyse or model it.

**SQL injection warning:** never build SQL by pasting user input into a string, like `f"... WHERE name = '{user_input}'"`. A malicious user can type SQL code that deletes your tables. Use parameters:

```python
conn.execute("SELECT * FROM customers WHERE name = ?", (user_input,))
```

(The same idea, untrusted input being treated as instructions, comes back as **prompt injection** in LLMs, in files 22 and 29.)

---

## 11. How the web works: HTTP

**Idea:** When your browser or program talks to a website or service, it uses **HTTP** (HyperText Transfer Protocol). The secure version is **HTTPS** (encrypted).

The pattern is always **request → response**:

```
  Your program (client)                         Server
        │ ──── REQUEST: "GET /weather?city=Kandy" ───► │
        │                                              │
        │ ◄─── RESPONSE: 200 OK  {"temp": 27} ──────── │
```

- **Client:** the one asking (your browser, your Python program).
- **Server:** the computer that answers.
- **URL:** the address, e.g. `https://api.example.com/weather?city=Kandy`
  - `https://`: protocol
  - `api.example.com`: domain (the server)
  - `/weather`: path (which resource/endpoint)
  - `?city=Kandy`: **query parameters** (extra options, `key=value`, joined with `&`)

### HTTP methods (verbs)

| Method | Meaning | Example |
|---|---|---|
| **GET** | Read/fetch data | get a user's profile |
| **POST** | Send data / create something | submit a form; send a prompt to an LLM |
| **PUT / PATCH** | Update (replace / modify part) | change your email |
| **DELETE** | Remove | delete a post |

### Status codes

| Code | Meaning |
|---|---|
| **200** OK | Success |
| **201** Created | Successfully created something |
| **400** Bad Request | Your request was malformed |
| **401** Unauthorized | Missing or wrong API key |
| **403** Forbidden | You don't have permission |
| **404** Not Found | Wrong URL |
| **429** Too Many Requests | You hit the **rate limit**, so slow down |
| **500** Internal Server Error | The server broke |
| **503** Service Unavailable | Server overloaded or down |

Rule of thumb: **2xx = success, 4xx = your fault, 5xx = their fault.**

### Headers and body

- **Headers:** extra info about the request, e.g. `Authorization: Bearer sk-abc...` (your API key) and `Content-Type: application/json`.
- **Body:** the data you send (for POST), usually JSON.

---

## 12. APIs and REST

**Idea:** An **API** (Application Programming Interface) is a defined way for programs to talk to each other. A **web API** lets your code use someone else's service over HTTP.

**Analogy:** A restaurant menu and waiter. You don't go into the kitchen. You order from the menu (the API's documented options), the waiter (HTTP) takes your request to the kitchen (server), and brings back your food (response). You don't need to know how the kitchen works.

**REST** is the most common style of web API:
- Resources have URLs (`/users/42`, `/orders`)
- You use HTTP methods to act on them (GET, POST, ...)
- Data is usually exchanged as **JSON**
- Each request is independent (the server doesn't remember previous requests; this is called **stateless**)

**Endpoint:** one specific URL + method the API offers, e.g. `POST /v1/chat/completions`.

**API key:** a secret string that identifies you to the API (for billing and permission). Keep it in an environment variable (section 3).

**Rate limit:** the maximum number of requests you may send per minute/day. Exceed it and you get a `429`. The standard fix is to wait and retry, waiting a bit longer each time (**exponential backoff**: wait 1s, then 2s, 4s, 8s...).

**Why this matters for AI:** using an LLM like GPT or Claude from your code is just making an HTTP POST request to their API with your prompt in JSON, and getting JSON back. You'll do exactly this in [file 22](22-prompt-engineering.md). You'll also build your own API to serve your model in [file 28](28-mlops-and-llmops.md).

**Other API styles you may hear about:** **GraphQL** (the client asks for exactly the fields it wants), **gRPC** (fast binary protocol, used inside big systems), **WebSockets** (two-way live connection, e.g. live chat or voice).

---

## 13. Calling an API from Python

The `requests` library (`pip install requests`) makes HTTP easy.

### GET example

```python
import requests

response = requests.get(
    "https://api.open-meteo.com/v1/forecast",
    params={"latitude": 6.93, "longitude": 79.85, "current_weather": True},
    timeout=10,              # don't wait forever
)
print(response.status_code)  # 200
data = response.json()       # JSON → Python dict
print(data["current_weather"]["temperature"])
```

### POST example (this is the shape of an LLM API call)

```python
import os, requests

response = requests.post(
    "https://api.example-llm.com/v1/chat",
    headers={
        "Authorization": f"Bearer {os.environ['LLM_API_KEY']}",
        "Content-Type": "application/json",
    },
    json={
        "model": "some-model",
        "messages": [{"role": "user", "content": "Say hello in Sinhala"}],
    },
    timeout=60,
)
response.raise_for_status()     # raise an error if status is 4xx/5xx
print(response.json())
```

In practice, LLM providers give you an **SDK** (Software Development Kit), a Python package (like `openai` or `anthropic`) that wraps these HTTP calls in nice functions. Underneath, it's the same thing.

### Retry with exponential backoff

```python
import time, requests

def get_with_retry(url, max_tries=5):
    for attempt in range(max_tries):
        r = requests.get(url, timeout=10)
        if r.status_code == 429 or r.status_code >= 500:
            wait = 2 ** attempt          # 1, 2, 4, 8, 16 seconds
            print(f"Retrying in {wait}s...")
            time.sleep(wait)
            continue
        r.raise_for_status()
        return r.json()
    raise RuntimeError("Gave up after retries")
```

---

## 14. Check yourself

**Q1.** You're in `/home/nisha/projects/ai`. What does `cd ..` do, and what will `pwd` show after?
<details><summary>Answer</summary>Moves up one folder. `pwd` shows `/home/nisha/projects`.</details>

**Q2.** How do you count the rows in a big CSV file from the terminal without opening it?
<details><summary>Answer</summary>`wc -l data.csv` (remember the header line counts as one).</details>

**Q3.** Why should API keys never be in your code?
<details><summary>Answer</summary>If the code is shared or pushed to GitHub, anyone can steal and misuse the key (costing you money or data). Store keys in environment variables or a `.env` file that's in `.gitignore`.</details>

**Q4.** What are the three commands you run to save a change in Git?
<details><summary>Answer</summary>Edit the file, then `git add <file>` and `git commit -m "message"`. (Then `git push` to upload to GitHub.)</details>

**Q5.** Write SQL to get the average order amount per customer, only for customers with more than one order.
<details><summary>Answer</summary>

```sql
SELECT customer_id, AVG(amount) AS avg_amount
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 1;
```
Result: customer 1, average 33.33.
</details>

**Q6.** What's the difference between INNER JOIN and LEFT JOIN?
<details><summary>Answer</summary>INNER JOIN keeps only rows that match in both tables. LEFT JOIN keeps all rows from the left table, filling NULLs where the right table has no match.</details>

**Q7.** What's the difference between WHERE and HAVING?
<details><summary>Answer</summary>WHERE filters individual rows before grouping; HAVING filters groups after GROUP BY (so it can use aggregates like SUM).</details>

**Q8.** Your API call returns status 429. What happened and what should you do?
<details><summary>Answer</summary>You hit the rate limit (too many requests). Wait and retry with exponential backoff.</details>

**Q9.** What's the difference between GET and POST?
<details><summary>Answer</summary>GET fetches data (parameters in the URL); POST sends data in the request body, to create something or submit input (e.g. a prompt).</details>

---

## 15. New words in this file

| Word | Meaning |
|---|---|
| Terminal / shell / command line | Text window for typing commands (bash, zsh, PowerShell) |
| Linux, WSL | OS running most servers / Linux inside Windows |
| Directory | Folder |
| `pwd, ls, cd, mkdir, cp, mv, rm, cat, head, tail, grep, find, wc` | Core terminal commands |
| Pipe (`\|`), redirect (`>`, `>>`) | Send output to another command / to a file |
| SSH, scp | Log into / copy files to a remote machine |
| `nvidia-smi` | Shows NVIDIA GPU usage |
| Environment variable | Named value in your shell session that programs can read |
| `.env` file | File holding secrets, loaded with python-dotenv |
| Git / version control | Tool recording snapshots of your project over time |
| Repository, commit, staging area | Tracked project / snapshot / changes chosen for next commit |
| Branch, merge, merge conflict | Separate line of work / combining branches / clashing edits |
| `.gitignore` | List of files Git should not track |
| GitHub, clone, push, pull, fork | Online Git hosting / download repo / upload commits / download changes / personal copy |
| Pull request (PR), code review | Request to merge a branch / teammates checking code |
| Markdown, README.md | Simple text formatting language / a repo's front page |
| Database, relational database | Organised data storage / data in linked tables |
| SQL | Language to query relational databases |
| SQLite, PostgreSQL, MySQL, BigQuery, Snowflake | Database / data warehouse systems |
| Data warehouse | Database built for analysing huge amounts of data |
| Primary key / foreign key | Unique row ID / column pointing to another table's key |
| SELECT, FROM, WHERE, ORDER BY, LIMIT | Choose columns, table, filter rows, sort, cap rows |
| NULL | Missing value in SQL |
| Aggregate (COUNT, SUM, AVG, MIN, MAX) | Summarise many rows into one value |
| GROUP BY / HAVING | Aggregate per group / filter groups |
| Alias (AS) | Temporary nicer name |
| JOIN (INNER, LEFT, RIGHT, FULL OUTER) | Combine tables on matching columns |
| Subquery, CTE (WITH) | Query inside a query / named temporary result |
| Window function (OVER, PARTITION BY, ROW_NUMBER, LAG, running total, moving average) | Per-group calculations that keep all rows |
| SQL injection | Attack where user input is run as SQL code |
| HTTP / HTTPS | Protocol for web requests / encrypted version |
| Client / server | The one asking / the one answering |
| URL, domain, path, query parameters | Web address and its parts |
| GET, POST, PUT, PATCH, DELETE | HTTP methods |
| Status codes (200, 400, 401, 404, 429, 500) | Server's answer codes |
| Headers / body | Request metadata / request data |
| API, web API, REST | Interface for programs to talk / over HTTP / common resource-based style |
| Endpoint | One specific API URL + method |
| Stateless | Server doesn't remember previous requests |
| API key | Secret identifying you to an API |
| Rate limit, exponential backoff | Max requests allowed / retry waiting 1, 2, 4, 8... seconds |
| SDK | Package that wraps an API in easy functions |
| `requests` | Python library for HTTP |
| GraphQL, gRPC, WebSockets | Other API styles |

**Next:** [04-math-numbers-and-functions.md](04-math-numbers-and-functions.md)
