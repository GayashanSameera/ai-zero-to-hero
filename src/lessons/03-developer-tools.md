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

**Why it exists:** a mouse can only do what a button on screen allows. A terminal lets you say anything the computer understands, repeat it a thousand times with one line, and do it on a machine thousands of kilometres away.

**Idea:** The **terminal** (also called the **command line**, **shell** or **console**) is a text window where you type commands to control your computer, instead of clicking with the mouse.

**Why bother?** Most AI work happens on remote servers (cloud machines with GPUs) that have **no graphical screen at all**, only a terminal. Also, many tools (pip, git, docker, python scripts) are run from the terminal.

- **Linux/Mac:** open "Terminal". The shell is usually **bash** or **zsh**.
- **Windows:** use "PowerShell", or better, install **WSL** (Windows Subsystem for Linux) to get a real Linux terminal.
- **Colab:** put `!` before a command in a cell: `!ls`.

When you see `$` at the start of a line in tutorials, that's the **prompt**. Don't type the `$`.

**Linux** is the operating system that runs almost all servers and cloud machines. Learning its commands is a great investment.

### A picture: clicking vs typing

```
Mouse (GUI):     open folder -> find file -> right-click -> copy -> open other folder -> paste
Terminal:        cp reports/march.csv backup/        <- one line, repeatable, can be saved in a script
```

**Worked example:** you rent a cloud GPU machine in a data centre to fine-tune a model. You log in and see only this:

```
ubuntu@gpu-server:~$
```

No desktop, no icons. Everything you do (upload data, start training, check progress) is typed. That blinking cursor is the whole machine.

**Where you'll meet it in real work:** every cloud GPU server, every Docker container and every CI pipeline is driven from a terminal. A data scientist at a Colombo bank who trains a model on a remote server spends a good part of the day in one.

**Common mistakes:**
- Typing the `$` from a tutorial. It is the prompt, not part of the command.
- Copy-pasting a command you do not understand, especially one with `sudo` or `rm`.
- Forgetting which shell you are in: a command for bash may not work in Windows PowerShell.

**Exam angle:** deployment and NVIDIA-stack questions assume you can work on a headless (no screen) Linux GPU server and check it with commands such as `nvidia-smi`.

> **සිංහලෙන්:** Terminal එක කියන්නේ computer එකට mouse එකෙන් නෙවෙයි, අකුරු ටයිප් කරලා විධාන දෙන තැන. Tuk-tuk එකේ යන්නේ map එකේ ඇඟිල්ල තියන්නේ නැතුව "Galle Road එකේ කෙළින්ම ගිහින් දෙවෙනි හැරවුමෙන් වමට" කියලා හරියටම කියනවා වගේ. ඇත්ත වැඩේ කරන Cloud GPU server වල screen එකක්වත් නෑ, ඒ නිසා ඔයාට තියෙන්නේ terminal එක විතරයි. පටන් ගත්තම ටිකක් අමාරුයි, ඒත් පුරුදු වුණාම mouse එකට වඩා ගොඩක් වේගවත්. Tutorial එකක `$` තියෙනවා නම් ඒක ටයිප් කරන්න එපා, ඒක prompt එක විතරයි.

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

### Worked example: finding errors in a big log file

Your training log `train.log` has 50,000 lines and you want to know how many contain the word `ERROR`. Opening it in an editor would be slow. Instead:

```bash
cat train.log | grep "ERROR" | wc -l     # cat prints 50,000 lines -> grep keeps only ERROR lines -> wc -l counts them
```

```
train.log (50,000 lines)  --cat-->  all lines  --grep "ERROR"-->  12 lines  --wc -l-->  12
```

The terminal prints `12`. The whole job takes less than a second. (Shorter form: `grep -c "ERROR" train.log`.)

### Worked example: how paths work

You are in `/home/nisha/projects/ai` and the folder tree is:

```
/home/nisha/
    projects/
        ai/        <- you are here
        data/
```

| Command | Where you end up | Why |
|---|---|---|
| `cd ..` | `/home/nisha/projects` | `..` = one level up |
| `cd ../data` | `/home/nisha/projects/data` | up one level, then into `data` |
| `cd ~` | `/home/nisha` | `~` = home |
| `cd /home/nisha/projects/ai` | the original folder | a full address starting from `/` (an **absolute path**) |

A path that starts from where you are now (like `../data`) is a **relative path**. A path that starts with `/` is **absolute**.

**Where you'll meet it in real work:** `tail -f` on a training log to watch the loss fall, `nvidia-smi` to see whether the GPU is busy, `scp` to copy a trained model off the server.

**Common mistakes:**
- `rm` has no recycle bin. `rm -r data` deletes the folder and everything in it, forever. Run `ls` first to confirm where you are.
- `>` **overwrites** a file. If `output.txt` already holds results, `python train.py > output.txt` replaces them. Use `>>` to add to the end.
- File names with spaces need quotes: `cd "my data"`.

**Exam angle:** know that `nvidia-smi` reports GPU memory and utilisation, which is the first thing to check when a model will not load or training is slow.

> **සිංහලෙන්:** Terminal commands ටිකක් විතරයි ඉගෙන ගන්න ඕනේ: pwd (මම කොහෙද), ls (මොනවද තියෙන්නේ), cd (යන්න), cp, mv, rm. Pipe (|) එකෙන් එක command එකක output එක අනිත් එකට දෙනවා. උදාහරණයක් විදිහට පේළි 50,000ක log file එකක `grep "ERROR" train.log | wc -l` කළාම error පේළි කීයක්ද කියලා තත්පරයෙන් කියනවා. /home/nisha/projects/ai ඉඳන් `cd ..` කළාම /home/nisha/projects එකට යනවා. rm කියන්නේ recycle bin නැති delete එකක්, ඒ නිසා ඒක ගහන්න කලින් හැමවිටම ls කරලා බලන්න.

---

## 3. Environment variables and secrets

**Why it exists:** code gets copied, emailed and pushed to the internet. A password written inside it travels with it. Environment variables keep the secret **outside** the code, so the same code can be shared safely.

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

### A picture: where the secret lives

```
.env file (stays on YOUR machine, in .gitignore)
        |   load_dotenv()
        v
environment variables of the running program
        |   os.environ["OPENAI_API_KEY"]
        v
your code  --->  sends key to the API

GitHub gets only the code. The key never leaves your computer.
```

**Worked example:** a student pushes `api_key = "sk-abc123"` inside `app.py` to a public repo at 9:00 pm. Automated bots scan GitHub for strings like this continuously. If the key is found, someone can run requests on your account and the bill arrives on your card. The fix is not just deleting the line: Git remembers history, so the key must be **revoked and replaced** in the provider's dashboard.

**Where you'll meet it in real work:** cloud platforms (and Docker, file 28) pass keys and database URLs into a program as environment variables, not inside the code.

**Common mistakes:**
- Adding `.env` to `.gitignore` **after** committing it. It is already in the history, so rotate the key.
- `export` only lasts for that terminal session. Close the window and it is gone, which is why `.env` files are popular.
- Putting spaces around `=` in a `.env` file or forgetting to call `load_dotenv()`, then getting a `KeyError`.

**Exam angle:** trustworthy-AI and deployment questions treat hard-coded credentials as a basic security failure. The expected answer is environment variables or a secrets manager.

> **සිංහලෙන්:** API key එකක් කියන්නේ ඔයාගේ account එකේ මුරපදය වගේ දෙයක්. ඒක code එක ඇතුළට ලියලා GitHub එකට දැම්මොත් විනාඩි කීපයකින් bots ඒක හොයාගෙන ඔයාගේ සල්ලි වලින් වැඩ කරනවා. ඒ නිසා ඒක `.env` file එකක ලියලා, `.gitignore` එකට දාලා, Python වලින් os.environ හරහා කියවනවා. බැංකු card එකේ PIN එක card එකේ ලියන්නේ නැහැනේ, ඒ වගේමයි. Key එක ඒ වෙනකොටත් push වෙලා නම්, line එක මැකීම මදි, provider එකේ site එකට ගිහින් key එක අලුත් කරන්න ඕනේ.

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

### A picture: three areas

```
working folder  --git add-->  staging area  --git commit-->  repository (history)
(you edit here)   (choose)      (ready list)     (snapshot)     (.git folder)
```

Think of packing a box for posting: you put items on the table (edit), pick the ones to go in the box (`git add`), then seal and label the box (`git commit -m "..."`).

### Worked example: an ML experiment you can undo

1. You train a sentiment model and it reaches 85% accuracy. You run `git add train.py` then `git commit -m "Baseline: 85% accuracy"`.
2. You want to try a BERT-based idea: `git checkout -b experiment-bert` and edit the code.
3. The new model reaches only 70%. Nothing is lost: `git checkout main` takes you back to the 85% code, exactly as saved.
4. If the idea had worked (say 91%), you would run `git checkout main` and `git merge experiment-bert`.

`git log --oneline` would show something like:

```
a3f9c21 Baseline: 85% accuracy
```

**Where you'll meet it in real work:** ML teams commit code and small config files so that "the model that scored 85% last month" can be reproduced exactly.

**Common mistakes:**
- `git add .` can also stage secrets or a 2 GB dataset. Run `git status` first.
- Vague messages like "update" or "fix". Write what changed: "Lower learning rate to 0.001".
- Working directly on `main` for risky experiments. Use a branch.
- Committing is not backing up. Until you `git push`, the history exists only on your computer.

**Exam angle:** NCA-GENL does not test Git commands directly. It expects reproducibility: code, data versions and configs tracked so an experiment can be repeated.

> **සිංහලෙන්:** Git කියන්නේ video game එකක save points වගේ. ඔයාගේ model එක 85% accuracy එකකින් වැඩ කරනකොට commit එකක් කරනවා. ඊට පස්සේ "experiment-bert" කියලා branch එකක් හදලා අලුත් ක්‍රමයක් try කරනවා. ඒකෙන් 70% විතරක් ආවොත් main branch එකට ආපහු ගියාම 85% code එක එහෙමම තියෙනවා. කරන්න තියෙන්නේ edit කරනවා, git add, git commit, මේ තුන. Commit එකක් කරලා තියෙන්නේ ඔයාගේ computer එකේ විතරයි, GitHub එකට යන්නේ push කළාම පමණයි.

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

### A picture: your computer and GitHub

```
   your computer                           GitHub (remote "origin")
 ┌───────────────┐   git push  ───────►  ┌───────────────┐
 │ local repo    │                       │ shared repo   │
 └───────────────┘   git pull  ◄───────  └───────────────┘
        ▲                                        │
        └──────────── git clone ◄────────────────┘ (first download)
```

**Worked example (a team of three):** Amal, Nisha and John build a chatbot. Amal pushes `main`. Nisha runs `git clone`, creates `fix-typo`, commits and pushes it, then opens a PR. John reads the changed lines, comments "use lowercase here", Nisha fixes it, John approves and the PR is merged. `main` now holds Nisha's change, and Amal gets it with `git pull`.

**Where you'll meet it in real work:** open-source AI code (PyTorch, Hugging Face libraries, NVIDIA's NeMo) is developed through GitHub issues and pull requests. Hugging Face model repositories are also Git repos underneath.

**Common mistakes:**
- Pushing straight to `main` when the team uses pull requests.
- Forgetting `git pull` before `git push`. Git then rejects your push because the remote has newer commits.
- Putting private data or keys in a **public** repository.

**Exam angle:** not a core exam topic. For jobs, a tidy GitHub profile with a README for each project is worth more than any certificate.

> **සිංහලෙන්:** Git කියන්නේ ඔයාගේ computer එකේ තියෙන tool එක, GitHub කියන්නේ ඒ repository එක online තියන website එක. යාළුවෝ තුන් දෙනෙක් chatbot එකක් හදනවා නම්, එක්කෙනෙක් අලුත් branch එකක වැඩ කරලා push කරනවා, ඊට පස්සේ Pull Request එකක් දානවා. අනිත් අය code එක බලලා අදහස් දීලා approve කළාම ඒක main එකට merge වෙනවා. ඒක ගුරුවරයෙක් ලියපු රචනාවක් පරීක්ෂා කරලා අනුමත කරනවා වගේ. GitHub profile එක ඔයාගේ portfolio එක, ඒක job එකක් හොයද්දී ගොඩක් වැදගත්.

---

## 6. Databases and SQL basics

**Why it exists:** a spreadsheet starts to struggle at a few hundred thousand rows, and it cannot let 10,000 people read and write at the same time without clashes. A database is built for exactly that, and SQL lets you ask it questions in a few lines.

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

### Worked example: reading a SELECT

```sql
SELECT name, city          -- which columns to show
FROM customers             -- from which table
WHERE city = 'Colombo';    -- which rows to keep
```

Step 1: start with all 4 rows of `customers`. Step 2: keep rows where `city` is Colombo, so Amal (row 1) and John (row 3) remain. Step 3: show only `name` and `city`.

| name | city |
|---|---|
| Amal | Colombo |
| John | Colombo |

### A picture: keys link tables

```
customers                       orders
 customer_id (PK) ◄──────────── customer_id (FK)
 1  Amal                         101  customer_id = 1  (Amal's order)
 2  Nisha                        103  customer_id = 2  (Nisha's order)
```

**Why two tables, not one?** If we stored Amal's name and city in every order row, a change of address would need three edits and mistakes would creep in. One row in `customers`, many in `orders`, linked by the key.

**Where you'll meet it in real work:** a bank keeps customers, accounts and transactions as linked tables, and a telecom keeps SIMs and call records. The data you train a model on very often starts as a SQL query.

**Common mistakes:**
- `SELECT *` on a table with billions of rows. Name your columns and add `LIMIT` while exploring.
- Forgetting that two rows can share a city but never a primary key.
- Treating NULL as zero. NULL means "no value", which is different.

**Exam angle:** the exam is about GenAI, but data-preparation questions assume you know structured (tables) versus unstructured (text, images) data, and that embeddings in a vector database are retrieved much like rows are.

> **සිංහලෙන්:** Database එකක් කියන්නේ ලොකු පුස්තකාලයක් වගේ, ඒකෙන් SQL කියන්නේ පුස්තකාලයාට දෙන ඉල්ලීම. Excel එකේ පේළි ලක්ෂ ගණනක් වුණාම හිර වෙනවා, ඒත් database එකට ඒක සුළු දෙයක්. Customers table එකේ Amal, Nisha, John, Priya කියලා හතර දෙනෙක් ඉන්නවා කියමු. `SELECT name FROM customers WHERE city = 'Colombo'` කළාම Amal සහ John විතරක් එනවා. Orders table එකේ customer_id එක, customers table එකේ id එකට යොමු කරන foreign key එකක්, ඒකෙන් තමයි table දෙක සම්බන්ධ වෙන්නේ.

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

### Worked example: GROUP BY step by step

`SELECT customer_id, COUNT(*) AS num_orders, SUM(amount) AS total FROM orders GROUP BY customer_id;`

Step 1: put the 5 order rows into buckets by `customer_id`.

```
bucket 1:  101 (50.00), 102 (20.00), 105 (30.00)
bucket 2:  103 (75.50)
bucket 3:  104 (10.00)
```

Step 2: aggregate each bucket. Bucket 1: count 3, sum 50 + 20 + 30 = 100. Bucket 2: 1 and 75.50. Bucket 3: 1 and 10.00.

Step 3 (with `HAVING SUM(amount) > 50`): 100 > 50 keeps bucket 1, 75.50 > 50 keeps bucket 2, 10 > 50 drops bucket 3.

**Check the aggregates by hand:** SUM = 50 + 20 + 75.50 + 10 + 30 = 185.50. AVG = 185.50 / 5 = 37.10. That is exactly what the queries above returned.

**Where you'll meet it in real work:** "total airtime recharged per district per month" for a telecom, or "number of loans per branch" for a bank, are all GROUP BY queries. Analysts write them every day.

**Common mistakes:**
- Using an aggregate in `WHERE` (`WHERE SUM(amount) > 50` is an error). Use `HAVING`.
- Selecting a column that is neither grouped nor aggregated, such as `name` when grouping by `customer_id`.
- Writing `amount = NULL`. Nothing equals NULL, so use `IS NULL`.
- `COUNT(*)` counts rows, `COUNT(column)` skips NULLs in that column. They can differ.

**Exam angle:** data-preparation and evaluation questions often reduce to "count and average per group", for example accuracy per class.

> **සිංහලෙන්:** WHERE කියන්නේ තනි පේළි filter කරන එක, GROUP BY කියන්නේ පේළි කණ්ඩායම් වලට දාලා එක එක කණ්ඩායමට ගණන් බලන එක. පන්තියේ හැම ළමයෙක්ගේම marks එකතු කරලා "සාමාන්‍යය 62" කියනවා වගේ. Orders 5ක් තියෙනවා කියමු: 50, 20, 75.50, 10, 30. ඔක්කොම එකතුව 185.50, සාමාන්‍යය 185.50 ÷ 5 = 37.10. Customer 1ට orders තුනක් තියෙනවා, 50 + 20 + 30 = 100. HAVING කියන්නේ කණ්ඩායම් හැදුවට පස්සේ filter කරන එක, ඒ නිසා "100ට වඩා වියදම් කරපු අය" වගේ දේවල් හොයන්නේ HAVING වලින්.

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

### Worked example: matching rows by hand

`FROM orders o JOIN customers c ON o.customer_id = c.customer_id`

For each order, look up the customer with the same `customer_id`:

| order | customer_id | found in customers | result |
|---|---|---|---|
| 101 | 1 | Amal | kept |
| 103 | 2 | Nisha | kept |
| 104 | 3 | John | kept |

With `LEFT JOIN` from `customers`, Priya (id 4) has no order, so she is **kept** with `NULL` order columns, and `COUNT(o.order_id)` counts 0 for her. An `INNER JOIN` drops her entirely.

**Picture:** think of two class lists, one with names and one with marks. INNER JOIN gives only students found on both lists. LEFT JOIN gives everyone on the names list and leaves the marks blank if missing.

**Where you'll meet it in real work:** to build a training table you often join customers, transactions and complaints. A model trained on an INNER JOIN silently never sees customers with zero transactions, which can bias it.

**Common mistakes:**
- Using INNER when you wanted LEFT, and losing rows without any error message.
- Joining on the wrong column, or on a column that is not unique. If customer 1 appears twice in the other table, every order of customer 1 is **duplicated**, and sums come out too big.
- Always compare row counts before and after a join as a sanity check.

**Exam angle:** an exam may describe a table merge and ask which problem arises. The key phrase to recognise is "silently dropped rows" and its link to data leakage or bias in the training data.

> **සිංහලෙන්:** JOIN කියන්නේ table දෙකක් එකම අගයක් තියෙන column එකකින් ගලපන එක. Names තියෙන ලිස්ට් එකයි marks තියෙන ලිස්ට් එකයි එකට ගැලපුවා වගේ. INNER JOIN එකෙන් ලැබෙන්නේ දෙකේම ඉන්න අය විතරයි. LEFT JOIN එකෙන් වමේ table එකේ හැමෝම එනවා, ගැලපෙන්නේ නැති අයට NULL වැටෙනවා. Priya එකම order එකක්වත් දාලා නැති නිසා INNER JOIN කළාම එයා නැතිවෙනවා, LEFT JOIN කළාම order ගණන 0 කියලා එයාත් පෙන්නනවා. Join එකට කලින් සහ පස්සේ row ගණන බලන්න, එතකොට නිකම්ම පේළි නැති වෙලා නැහැයි කියලා දැනගන්න පුළුවන්.

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

### Worked example: LAG and a running total

Customer 1 has three orders by date: 50 (Jan 10), 20 (Feb 14), 30 (Aug 5).

```sql
SELECT order_id, amount,
       LAG(amount) OVER (ORDER BY order_date)         AS previous_amount,
       SUM(amount) OVER (ORDER BY order_date)         AS running_total
FROM orders WHERE customer_id = 1;
```

| order_id | amount | previous_amount | running_total |
|---|---|---|---|
| 101 | 50 | NULL (no earlier row) | 50 |
| 102 | 20 | 50 | 50 + 20 = 70 |
| 105 | 30 | 20 | 70 + 30 = 100 |

Change since last order: 20 − 50 = −30, then 30 − 20 = +10.

**GROUP BY versus window:** `GROUP BY customer_id` would return **one** row (total 100). The window version returns **three** rows and writes 100 on each.

**Why subqueries and CTEs?** A subquery answers a question you need *inside* another question ("bigger than the average" needs the average first). A CTE gives that step a name so a long query reads from top to bottom.

**Where you'll meet it in real work:** "each customer's second purchase", "7-day moving average of daily Daraz orders", "top 2 spenders in each city" (`RANK() OVER (PARTITION BY city ORDER BY amount DESC)`, then keep rank <= 2).

**Common mistakes:**
- Using a window function in `WHERE`. WHERE runs before windows exist, so put the window in a CTE and filter in the next step.
- Running `UPDATE` or `DELETE` **without** `WHERE`: it changes every row. Test with `SELECT` first.
- Forgetting that `ROW_NUMBER` needs an `ORDER BY` inside `OVER` to mean anything.

**Exam angle:** not a GenAI exam topic. It matters for feature engineering ("previous order", "rolling average") when preparing data for a model.

> **සිංහලෙන්:** Subquery එකක් කියන්නේ query එක ඇතුළේ තව query එකක්, ඒ වගේම CTE (WITH) එකකින් ඒ පියවරට නමක් දීලා query එක කියවන්න පහසු කරනවා. Window function කියන්නේ GROUP BY වගේ නෙවෙයි, පේළි එකතු කරන්නේ නැතුව හැම පේළියටම අමතර තොරතුරක් දාන එක. Report card එකේ ළමයාගේ marks එක්කම "පන්තියේ ස්ථානය 5" කියලා ලියනවා වගේ. Customer 1ගේ orders 50, 20, 30 නම් running total එක 50, 70, 100 වෙනවා. LAG එකෙන් කලින් order එකේ අගය ගත්තොත් 20 − 50 = −30 කියලා වෙනස දැනගන්න පුළුවන්. UPDATE හෝ DELETE කරද්දී WHERE නැතුව ගහන්න එපා, එහෙම ගැහුවොත් හැම පේළියක්ම වෙනස් වෙනවා.

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

### Worked example: what comes back

Using the 4 customers (Amal, John in Colombo; Nisha in Kandy; Priya in Galle), the query groups by city and returns a DataFrame:

| city | n |
|---|---|
| Colombo | 2 |
| Galle | 1 |
| Kandy | 1 |

From here pandas takes over: `df["n"].sum()` is 4, and you can plot or feed it to a model.

### Worked example: why injection is dangerous

Suppose the code is `f"SELECT * FROM customers WHERE name = '{user_input}'"` and the user types `x' OR '1'='1`. The final text becomes:

```sql
SELECT * FROM customers WHERE name = 'x' OR '1'='1'
```

`'1'='1'` is always true, so **every** row is returned. A worse input could append a `DROP TABLE` statement. With the `?` placeholder, the database treats the whole input as a plain value to look for, never as code.

**Where you'll meet it in real work:** a loan-approval service builds its training set with SQL, then serves a model. The same web form that feeds the database must use parameters.

**Common mistakes:**
- Building SQL with f-strings or `+`.
- Forgetting `conn.close()` (or use `with`), which can lock a SQLite file.
- Pulling a billion rows into pandas. Filter and aggregate in SQL first.

**Exam angle:** injection is the classic case of "untrusted input mixed with instructions". The trustworthy-AI and prompting domains test the LLM version, **prompt injection**, with the same remedy: separate data from instructions and validate input.

> **සිංහලෙන්:** SQL query එකක් Python එකෙන් run කරන්නේ sqlite3 වගේ connection එකක් හරහා, ප්‍රතිඵලය pandas DataFrame එකක් විදිහට ගන්නවා. Database එකෙන් ඔයාට ඕන data ටික විතරක් අරන්, Python වලින් analysis කරනවා. අන්තිමට මතක තියාගන්න ඕනේ ආරක්ෂාව: user ටයිප් කරපු දේ කෙළින්ම SQL string එකට ඇලෙව්වොත්, කවුරුහරි `x' OR '1'='1` කියලා ගැහුවාම හැම පේළියක්ම එනවා. ඒ නිසා `?` කියන placeholder එක පාවිච්චි කරන්න. බැංකු form එකකට ඕනෑම කෙනෙක්ට ඕන දෙයක් ටයිප් කරන්න පුළුවන්, ඒ නිසා ඒක කවදාවත් code එකක් විදිහට run වෙන්න දෙන්න එපා.

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

### Worked example: take a URL apart

`https://api.example.com/weather?city=Kandy&units=metric`

| Piece | Value | Meaning |
|---|---|---|
| protocol | `https` | encrypted HTTP |
| domain | `api.example.com` | which server |
| path | `/weather` | which resource |
| query | `city=Kandy&units=metric` | two options joined with `&` |

### Worked example: which code do I expect?

| Situation | Code |
|---|---|
| Fetched the Kandy weather correctly | 200 |
| Created a new user | 201 |
| Sent JSON with a missing comma | 400 |
| Forgot the API key | 401 |
| Key is valid but your plan does not include this model | 403 |
| Typo in the URL | 404 |
| Sent 100 requests in one second | 429 |
| Provider's server crashed | 500 or 503 |

Rule from the section: first digit 2 = success, 4 = your fault, 5 = their fault. A 5xx is worth retrying, a 400 is not (the same bad request fails again).

**Where you'll meet it in real work:** every mobile app (Daraz, PickMe, a bank app) talks to its servers with HTTPS requests like these, and so does every call to an LLM.

**Common mistakes:**
- Confusing 401 (who are you?) with 403 (I know you, but you may not).
- Assuming `200 OK` means the *answer is correct*. It only means the request worked.
- Putting secrets in the URL query string. URLs are often logged. Keys go in headers.

**Exam angle:** deployment questions use these ideas: an inference endpoint is an HTTP service, `429` signals rate limits, and `5xx` means retry with backoff.

> **සිංහලෙන්:** Browser එකෙන් හෝ Python code එකෙන් website එකකට කතා කරද්දී HTTP පාවිච්චි කරනවා, හැමවිටම request එකක් යවලා response එකක් ලබනවා. URL එක කොටස් වලට බෙදනවා: https කියන්නේ protocol එක, api.example.com කියන්නේ server එක, /weather කියන්නේ path එක, ?city=Kandy කියන්නේ අමතර options. Status code එකේ පළවෙනි ඉලක්කම බලන්න: 2 නම් හරි, 4 නම් ඔයාගේ වැරැද්ද, 5 නම් server එකේ වැරැද්ද. 404 කියන්නේ URL එක වැරදියි, 401 කියන්නේ API key එක නෑ, 429 කියන්නේ request වැඩියි, ටිකක් ඉඳලා ආයෙත් try කරන්න.

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

### Worked example: exponential backoff in numbers

Your script gets `429` four times in a row. With waits of 1, 2, 4, 8 seconds, it waits 1 + 2 + 4 + 8 = **15 seconds** in total before the fifth try. Doubling matters: if 500 students all retry every 1 second, the server is hit 500 times a second and never recovers. If they wait longer each time, the load spreads out. Real systems also add a small random delay (**jitter**) so that clients do not all retry at the same instant.

### Worked example: a REST design

```
GET    /orders        -> list orders
GET    /orders/101    -> one order
POST   /orders        -> create an order  (body: JSON)
DELETE /orders/101    -> remove it
```

The URL names the *thing*, the method says what to do with it, and because the API is **stateless**, every request carries everything the server needs (including your key). The server does not "remember" request 1 when it receives request 2. That is why a chat API needs you to send the **whole conversation** again in each call.

**Where you'll meet it in real work:** a bank's support chatbot sends the customer's message plus the previous turns to an LLM API, receives JSON, and shows the reply. Your fine-tuned model can be wrapped in the same style of endpoint with a framework such as FastAPI.

**Common mistakes:**
- Putting an API key in front-end JavaScript or a mobile app, where anyone can read it. Calls must go through your own server.
- No timeout, so one stuck request freezes your program.
- Ignoring rate limits and then wondering why a batch job of 10,000 prompts fails halfway.

**Exam angle:** NCA-GENL deployment questions expect you to know that LLM services are called as REST APIs, that NVIDIA NIM microservices expose OpenAI-compatible endpoints, and that rate limits and retries are part of production design.

> **සිංහලෙන්:** API එකක් කියන්නේ restaurant එකක waiter වගේ. ඔයා කුස්සියට කෙළින්ම යන්නේ නෑ, menu එක බලලා waiter ට order එක දෙනවා, එයා කෑම ගෙනත් දෙනවා. REST API එකේ URL එකෙන් කියන්නේ මොකක්ද කියලා, GET හෝ POST කියන්නේ ඒකට මොකක්ද කරන්න ඕනේ කියලා. Server එක කලින් request එක මතක තියාගන්නේ නෑ (stateless), ඒ නිසා chatbot එකකට හැම පාරම මුළු සංවාදයම යවන්න ඕනේ. 429 ආවොත් තත්පර 1, 2, 4, 8 කියලා ටික ටික වැඩි කරලා ඉඳලා retry කරන්න, ඒකට කියන්නේ exponential backoff කියලා.

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

### Worked example: reading the JSON that comes back

Suppose `response.json()` gives this dictionary (the weather API, shortened):

```python
data = {
    "latitude": 6.93,
    "current_weather": {"temperature": 28.4, "windspeed": 11.2},
}
```

| You write | You get |
|---|---|
| `data["latitude"]` | `6.93` |
| `data["current_weather"]` | `{"temperature": 28.4, "windspeed": 11.2}` |
| `data["current_weather"]["temperature"]` | `28.4` |

Read it from left to right, one key per step. A typo such as `data["temp"]` raises `KeyError`, and `data.get("temp")` returns `None` instead of crashing.

For an LLM, the shape is similar but deeper: the reply text typically sits several levels inside (a list of choices, then a message, then its content). Always print the whole JSON once and follow the path with your eyes.

**Where you'll meet it in real work:** every RAG chatbot, document summariser and customer-support assistant in production is a Python function that builds a JSON body, POSTs it and picks the text out of the answer.

**Common mistakes:**
- Not checking the status first, then calling `.json()` on an error page.
- Leaving out `timeout`, or forgetting `raise_for_status()`, so failures pass silently.
- Retrying a `400`. It will fail every time. Retry only `429` and `5xx`.
- Sending the key in the JSON body when the API wants it in the `Authorization` header.

**Exam angle:** know the parts of an LLM request (model name, messages with roles, sampling settings such as temperature) and that the SDK is just a wrapper over this HTTP call.

> **සිංහලෙන්:** Python වලින් API එකකට කතා කරන්න `requests` library එක පාවිච්චි කරනවා. GET එකෙන් data ගන්නවා, POST එකෙන් ඔයාගේ prompt එක JSON විදිහට යවනවා. ආපහු එන JSON එක Python dictionary එකක් වෙනවා, ඒක කියවන්නේ `data["current_weather"]["temperature"]` වගේ key එකින් එක ඇතුළට යමින්. Colombo වල උෂ්ණත්වය 28.4 කියලා එන්නේ ඒ විදිහට. හැමවිටම timeout එකක් දාන්න, status code එක බලන්න, 429 සහ 5xx වලදී විතරක් retry කරන්න, මොකද 400 එක කොච්චර retry කළත් ආයෙත් අසාර්ථකයි. OpenAI හෝ Anthropic SDK එකත් ඇතුළෙන් කරන්නේ මේ HTTP call එකමයි.

```quiz
[{"q": "You are in /home/nisha/projects/ai. After running `cd ../data`, what does `pwd` show?", "options": ["/home/nisha/projects/ai/data", "/home/nisha/projects/data", "/home/nisha/data", "/home/nisha/projects/ai"], "answer": 1, "why": "`..` moves one level up to /home/nisha/projects, then `data` goes into that folder. The tempting first option would be right for `cd data`, which looks inside the current folder."}, {"q": "An API key was committed inside .env and pushed to GitHub. You then add .env to .gitignore. Is the key now safe?", "options": ["Yes, .gitignore hides it from now on", "Yes, because the repo is private", "No, the old commit still contains it, so the key must be revoked and replaced", "No, but only if someone runs git pull"], "answer": 2, "why": "`.gitignore` only stops Git from tracking new changes. Git keeps history, so the key can still be read from the earlier commit. Revoke it in the provider's dashboard."}, {"q": "Orders: 50, 20, 75.50, 10, 30. What does `SELECT AVG(amount) FROM orders` return?", "options": ["185.50", "75.50", "37.10", "30.00"], "answer": 2, "why": "SUM = 185.50 and there are 5 rows, so 185.50 / 5 = 37.10. 185.50 is the SUM, a common mix-up."}, {"q": "You want every customer listed, with 0 for those who never ordered. Which is right?", "options": ["customers INNER JOIN orders", "customers LEFT JOIN orders with COUNT(o.order_id)", "orders LEFT JOIN customers with COUNT(*)", "customers JOIN orders with WHERE order_id IS NOT NULL"], "answer": 1, "why": "LEFT JOIN from customers keeps customers with no match (their order columns are NULL), and COUNT(o.order_id) skips NULLs so it returns 0. INNER JOIN would drop them, and COUNT(*) would count the NULL row as 1."}, {"q": "Customer 1 has orders 50, 20, 30 in date order. What is the running total after the third order?", "options": ["30", "100", "70", "50"], "answer": 1, "why": "Running total: 50, then 50 + 20 = 70, then 70 + 30 = 100. 70 is the total after the second order only."}, {"q": "Why is `WHERE SUM(amount) > 50` an error?", "options": ["SUM can only be used with ORDER BY", "WHERE runs before grouping, so aggregates are not available yet; use HAVING", "SUM needs a LIMIT", "The number 50 must be in quotes"], "answer": 1, "why": "SQL runs FROM, WHERE, GROUP BY, HAVING in that order. Groups do not exist at the WHERE step. HAVING filters groups after the aggregate is computed."}, {"q": "Your program receives HTTP 429 from an LLM API. What is the best response?", "options": ["Fix the URL", "Check whether the API key is missing", "Wait and retry with exponential backoff (for example 1, 2, 4, 8 seconds)", "Resend the same request immediately in a loop"], "answer": 2, "why": "429 means too many requests. Waiting longer each time lets the limit reset. Retrying immediately makes it worse, and 404 or 401 are the codes for a bad URL or missing key."}, {"q": "A user types `x' OR '1'='1` into a login box and your code builds SQL by pasting that text into a string. What happens?", "options": ["The query returns no rows", "The condition becomes always true and returns all rows", "Python raises a SyntaxError", "The text is ignored"], "answer": 1, "why": "`'1'='1'` is always true, so the WHERE filter lets every row through. This is SQL injection, prevented by placeholders (`?`) that treat input only as data."}]
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

**Q10.** Customer 4 (Priya) has no orders. You run `customers JOIN orders` with GROUP BY and COUNT. Why is Priya missing, and how do you fix it?
<details><summary>Answer</summary>`JOIN` means INNER JOIN, which drops customers with no matching order. Use `LEFT JOIN orders` and `COUNT(o.order_id)`, which gives Priya a count of 0.</details>

**Q11.** Your script got 401, 429 and 503 on three different runs. Which of these should you retry with backoff?
<details><summary>Answer</summary>429 and 503. 401 means a missing or wrong API key, and retrying will not fix it.</details>

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
| Absolute / relative path | Full address from `/` / address from where you are |
| Headless server | Computer with no screen, used only through a terminal |
| Pull request review | Teammates read and approve changes before merging |
| Placeholder (`?`) | Safe way to put values into SQL, preventing injection |
| Running total, LAG | Cumulative sum / previous row's value |
| Jitter | Small random delay added to retries so clients do not retry together |
| CTE | Named step in a query, written with WITH |
| NIM | NVIDIA's packaged inference microservices with REST endpoints |

**Next:** [04-math-numbers-and-functions.md](04-math-numbers-and-functions.md)
