# 02: Python Programming from Zero

> **Before you start:** [01: Big picture & data](01-big-picture-and-data.md) (you should know what a program, algorithm and data types are).
>
> **After this file you can:** write real Python programs using variables, lists, dictionaries, loops, functions, classes, files and packages, and understand what "Big-O" speed means.

Python is the main language of data science and AI. It reads almost like English, which makes it great for beginners.

**How to practise:** open [Google Colab](https://colab.research.google.com), click "New notebook", type code in a cell and press **Shift + Enter** to run it. Type every example yourself.

---

## Table of contents

1. [Your first program](#1-your-first-program)
2. [Comments](#2-comments)
3. [Variables](#3-variables)
4. [Basic data types](#4-basic-data-types)
5. [Operators: maths and comparisons](#5-operators)
6. [Strings (text)](#6-strings)
7. [Lists](#7-lists)
8. [Tuples](#8-tuples)
9. [Dictionaries](#9-dictionaries)
10. [Sets](#10-sets)
11. [If / elif / else: making decisions](#11-if--elif--else)
12. [Loops: for and while](#12-loops)
13. [Functions](#13-functions)
14. [Errors and exceptions](#14-errors-and-exceptions)
15. [Reading and writing files](#15-reading-and-writing-files)
16. [Modules, packages, and pip](#16-modules-packages-and-pip)
17. [Virtual environments](#17-virtual-environments)
18. [Jupyter notebooks and VS Code](#18-jupyter-notebooks-and-vs-code)
19. [List comprehensions and lambda](#19-list-comprehensions-and-lambda)
20. [Classes and objects (OOP)](#20-classes-and-objects-oop)
21. [Generators, decorators, type hints](#21-generators-decorators-type-hints)
22. [Data structures you should know](#22-data-structures-you-should-know)
23. [Algorithm speed: Big-O notation](#23-algorithm-speed-big-o-notation)
24. [Mini project](#24-mini-project)
25. [Check yourself](#25-check-yourself)
26. [New words in this file](#26-new-words-in-this-file)

---

## 1. Your first program

```python
print("Hello, world!")
```

Output:
```
Hello, world!
```

`print(...)` is a **function** (a reusable command, explained in section 13) that shows something on the screen. The text inside quotes is called a **string**.

You can print several things at once:

```python
print("I am", 25, "years old")
# I am 25 years old
```

---

## 2. Comments

Anything after `#` on a line is a **comment**. Python ignores it. Comments are notes for humans.

```python
# This line is ignored by Python
print("Hi")  # this part is also ignored
```

Write comments to explain *why* you did something, not *what* (the code shows what).

---

## 3. Variables

**Idea:** A **variable** is a name that points to a value, like a labeled box you put things in.

```python
age = 25
name = "Nisha"
height = 1.62

print(name, "is", age)   # Nisha is 25
```

- `=` means **"store this value in this name"** (assignment). It does NOT mean "equals" in the maths sense.
- You can change a variable later:

```python
score = 10
score = score + 5   # take the old score, add 5, store it back
print(score)        # 15
```

Shortcut: `score += 5` means the same as `score = score + 5`. Similarly `-=`, `*=`, `/=`.

**Naming rules:**
- Letters, numbers, underscores. Can't start with a number. No spaces.
- Case-sensitive: `Age` and `age` are different variables.
- Convention in Python: `snake_case` (lowercase with underscores), e.g. `total_price`.
- Use meaningful names: `hours_studied` is better than `h`.

---

## 4. Basic data types

Every value has a **type**. Check it with `type()`.

| Type | Name | Examples | Used for |
|---|---|---|---|
| `int` | integer | `5`, `-3`, `1000000` | whole numbers (counts) |
| `float` | floating point | `3.14`, `-0.5`, `2.0` | decimal numbers (measurements) |
| `str` | string | `"hello"`, `'Kandy'` | text |
| `bool` | boolean | `True`, `False` | yes/no |
| `NoneType` | none | `None` | "no value / nothing here" |

```python
print(type(5))        # <class 'int'>
print(type(5.0))      # <class 'float'>
print(type("5"))      # <class 'str'>
print(type(True))     # <class 'bool'>
```

Notice: `5`, `5.0` and `"5"` are three *different* things. The last one is text that happens to contain a digit.

### Converting between types (casting)

```python
int("42")       # 42     (text → integer)
float("3.5")    # 3.5    (text → float)
str(100)        # "100"  (number → text)
int(3.99)       # 3      (cuts off the decimal, doesn't round!)
round(3.99)     # 4      (rounds)
bool(0)         # False  (0, empty string "", empty list [] and None are "falsy")
bool(7)         # True   (most other things are "truthy")
```

This matters in data science: data loaded from a CSV file often arrives as text and must be converted to numbers.

---

## 5. Operators

### Arithmetic

```python
7 + 2    # 9      addition
7 - 2    # 5      subtraction
7 * 2    # 14     multiplication
7 / 2    # 3.5    division (always gives a float)
7 // 2   # 3      floor division (divide, drop the decimal part)
7 % 2    # 1      modulo (the remainder after division)
7 ** 2   # 49     power (7 squared)
```

`%` (modulo) is surprisingly useful: `n % 2 == 0` checks if `n` is even.

**Order of operations** is like school maths: brackets first, then powers, then `* / // %`, then `+ -`.

```python
2 + 3 * 4     # 14, not 20
(2 + 3) * 4   # 20
```

### Comparison (the answer is always True or False)

```python
5 == 5    # True   equal to (note: TWO equals signs)
5 != 3    # True   not equal
5 > 3     # True
5 < 3     # False
5 >= 5    # True   greater than or equal
5 <= 4    # False
```

Common bug: writing `=` (assignment) when you mean `==` (comparison).

### Logical: and, or, not

```python
age = 25
has_id = True

age >= 18 and has_id     # True: both must be true
age < 18 or has_id       # True: at least one must be true
not has_id               # False: flips True/False
```

---

## 6. Strings

### Creating strings

```python
a = "double quotes"
b = 'single quotes'       # same thing
c = """triple quotes
can span many lines"""
```

### Joining and repeating

```python
"Hello" + " " + "world"   # "Hello world"
"ha" * 3                  # "hahaha"
```

### f-strings: putting values inside text (use these a lot)

Put `f` before the quotes, and put variables inside `{ }`:

```python
name = "Amal"
score = 87.456
print(f"{name} scored {score}")          # Amal scored 87.456
print(f"{name} scored {score:.1f}")      # Amal scored 87.5   (:.1f = 1 decimal place)
print(f"Total: {2 + 3}")                 # Total: 5  (you can put expressions inside)
```

### Indexing: getting one character

Python counts from **0**, not 1. This catches every beginner.

```
 string:  P  y  t  h  o  n
 index:   0  1  2  3  4  5
 negative:-6 -5 -4 -3 -2 -1
```

```python
word = "Python"
word[0]     # "P"   (first)
word[5]     # "n"
word[-1]    # "n"   (last; negative indexes count from the end)
word[-2]    # "o"
```

### Slicing: getting a piece

`word[start:stop]` gives characters from `start` up to **but not including** `stop`.

```python
word = "Python"
word[0:3]    # "Pyt"    (indexes 0, 1, 2)
word[2:]     # "thon"   (from 2 to the end)
word[:2]     # "Py"     (from start to 2, not including 2)
word[::-1]   # "nohtyP" (step -1 = reversed)
```

### Useful string methods

A **method** is a function attached to a value, called with a dot.

```python
s = "  Hello World  "
s.lower()              # "  hello world  "
s.upper()              # "  HELLO WORLD  "
s.strip()              # "Hello World"   (removes spaces at both ends)
s.replace("World", "Python")   # "  Hello Python  "
"a,b,c".split(",")     # ["a", "b", "c"]  (text → list)
"-".join(["a", "b"])   # "a-b"            (list → text)
"World" in s           # True             (does it contain?)
len("Hello")           # 5                (length)
"hello".startswith("he")  # True
```

Strings are **immutable**: you can't change a character in place; methods return a *new* string.

---

## 7. Lists

**Idea:** A **list** is an ordered collection of items, in square brackets. Like a shopping list.

```python
fruits = ["apple", "banana", "mango"]
numbers = [10, 20, 30, 40]
mixed = [1, "two", 3.0, True]     # can hold different types
empty = []
```

### Indexing and slicing work just like strings

```python
fruits[0]       # "apple"
fruits[-1]      # "mango"
numbers[1:3]    # [20, 30]
```

### Changing a list (lists are **mutable**: you can change them)

```python
fruits[1] = "orange"          # replace: ["apple", "orange", "mango"]
fruits.append("grape")        # add to end: [..., "grape"]
fruits.insert(0, "kiwi")      # insert at position 0
fruits.remove("apple")        # remove by value
last = fruits.pop()           # remove and return the last item
len(fruits)                   # number of items
"mango" in fruits             # True
```

### Useful list functions

```python
nums = [4, 1, 7, 3]
sum(nums)        # 15
max(nums)        # 7
min(nums)        # 1
sorted(nums)     # [1, 3, 4, 7]  (returns a new sorted list)
nums.sort()      # sorts nums itself in place
nums.reverse()   # reverses in place
sum(nums) / len(nums)   # 3.75  (the average)
```

### Lists inside lists (nested lists)

```python
grid = [[1, 2, 3],
        [4, 5, 6]]
grid[1][2]     # 6   (row 1, column 2)
```

This is how you could represent a table or an image, but in practice we use NumPy for that (file 08), because it's much faster.

### A gotcha: copying

```python
a = [1, 2, 3]
b = a          # b is the SAME list as a, not a copy!
b.append(4)
print(a)       # [1, 2, 3, 4]  ← surprise!

c = a.copy()   # a real copy
```

**Analogy:** `b = a` gives the same house a second address label. Changing the house changes it for both labels.

---

## 8. Tuples

**Idea:** A **tuple** is like a list but **cannot be changed** after creation (immutable). Uses round brackets.

```python
point = (3, 4)
rgb = (255, 0, 0)
point[0]           # 3
# point[0] = 5     # ERROR: tuples can't be changed
```

**Unpacking:** take a tuple apart into variables:

```python
x, y = point       # x = 3, y = 4
```

Use tuples for things that belong together and shouldn't change: coordinates, a colour, a dataset's shape `(rows, columns)`.

---

## 9. Dictionaries

**Idea:** A **dictionary** (`dict`) stores **key → value** pairs. You look things up by key, not by position. Like a real dictionary: word → meaning. Or a phone contacts list: name → number.

```python
student = {
    "name": "Nisha",
    "age": 22,
    "courses": ["Maths", "AI"]
}

student["name"]              # "Nisha"
student["age"] = 23          # change a value
student["city"] = "Kandy"    # add a new key
del student["courses"]       # remove a key
"age" in student             # True (checks keys)
student.get("phone", "N/A")  # "N/A": safe lookup with a default if missing
```

Looking up a missing key with `student["phone"]` gives an error (`KeyError`). Use `.get()` to be safe.

### Looping over a dictionary

```python
for key, value in student.items():
    print(key, "→", value)
```

`.keys()` gives keys, `.values()` gives values, `.items()` gives (key, value) pairs.

**Why dicts matter:** JSON data (file 01) becomes dicts and lists in Python. API responses, LLM outputs, configuration files: all dicts.

Keys must be immutable (strings, numbers, tuples). Values can be anything.

---

## 10. Sets

**Idea:** A **set** is an unordered collection of **unique** items. Duplicates are removed automatically.

```python
colors = {"red", "blue", "red", "green"}
print(colors)     # {'red', 'blue', 'green'}  (only one "red")

a = {1, 2, 3}
b = {2, 3, 4}
a | b     # {1, 2, 3, 4}  union (in either)
a & b     # {2, 3}        intersection (in both)
a - b     # {1}           difference (in a but not b)
```

Quick trick: count unique items with `len(set(my_list))`.

---

## 11. If / elif / else

**Idea:** Run different code depending on a condition.

```python
marks = 72

if marks >= 75:
    grade = "A"
elif marks >= 65:
    grade = "B"
elif marks >= 50:
    grade = "C"
else:
    grade = "F"

print(grade)   # B
```

**Indentation matters in Python!** The 4 spaces at the start of a line show which code belongs to the `if`. Other languages use `{ }`; Python uses indentation.

Python checks from top to bottom and runs **only the first** block whose condition is True.

**One-line version** (conditional expression):

```python
status = "pass" if marks >= 50 else "fail"
```

---

## 12. Loops

### for loop: repeat for each item

```python
fruits = ["apple", "banana", "mango"]
for fruit in fruits:
    print("I like", fruit)
```

### range(): generate a sequence of numbers

```python
range(5)          # 0, 1, 2, 3, 4      (5 numbers, starting at 0)
range(2, 6)       # 2, 3, 4, 5         (stop is not included)
range(0, 10, 2)   # 0, 2, 4, 6, 8      (step of 2)

for i in range(3):
    print(i)      # 0, then 1, then 2
```

### enumerate(): get the index and the item together

```python
for i, fruit in enumerate(fruits):
    print(i, fruit)    # 0 apple, 1 banana, 2 mango
```

### zip(): loop over two lists side by side

```python
names = ["Amal", "Nisha"]
scores = [80, 92]
for name, score in zip(names, scores):
    print(name, score)
```

### while loop: repeat while a condition is true

```python
balance = 1000
years = 0
while balance < 2000:
    balance = balance * 1.10    # grows 10% per year
    years += 1
print(years)     # 8
```

Careful: if the condition never becomes False, the loop runs forever (an **infinite loop**). Press the stop button to kill it.

### break and continue

```python
for n in range(10):
    if n == 3:
        continue     # skip the rest of this round, go to the next n
    if n == 6:
        break        # exit the loop completely
    print(n)         # prints 0 1 2 4 5
```

### Worked example: accumulator pattern

Very common: start with an empty/zero value and build it up in a loop.

```python
prices = [12.5, 8.0, 3.25, 20.0]
total = 0
for p in prices:
    total += p
print(f"Total: {total}")   # Total: 43.75

# Count how many prices are above 10
count = 0
for p in prices:
    if p > 10:
        count += 1
print(count)   # 2
```

---

## 13. Functions

**Idea:** A **function** is a named, reusable block of code. You give it inputs (**arguments**), it does work, and it can give back an output (**return value**).

**Analogy:** A blender. Put in fruit (input), press the button (call the function), get a smoothie (output). You don't need to know how the motor works each time.

```python
def area_of_rectangle(width, height):
    """Return the area of a rectangle."""   # a docstring: describes the function
    area = width * height
    return area

result = area_of_rectangle(3, 4)
print(result)    # 12
```

- `def` = "define a function"
- `width, height` = **parameters** (placeholders)
- `3, 4` = **arguments** (actual values passed in)
- `return` = send a value back. Without `return`, the function returns `None`.

### Default values and keyword arguments

```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

greet("Amal")                    # "Hello, Amal!"
greet("Amal", "Ayubowan")        # "Ayubowan, Amal!"
greet(greeting="Hi", name="Nisha")   # keyword arguments: order doesn't matter
```

You'll see keyword arguments everywhere in ML libraries:
`model = RandomForestClassifier(n_estimators=100, max_depth=5)`.

### Returning several values

```python
def min_max(numbers):
    return min(numbers), max(numbers)    # returns a tuple

lo, hi = min_max([4, 9, 1])   # lo = 1, hi = 9
```

### Scope: where variables live

Variables created inside a function exist **only inside** that function (**local** variables).

```python
def f():
    x = 10      # local
f()
# print(x)      # ERROR: x doesn't exist out here
```

### *args and **kwargs (you'll see them in library code)

```python
def show(*args, **kwargs):
    print(args)     # a tuple of extra positional arguments
    print(kwargs)   # a dict of extra keyword arguments

show(1, 2, color="red")   # (1, 2) and {'color': 'red'}
```

### Why functions matter

1. **Don't Repeat Yourself (DRY):** write once, use many times.
2. **Readability:** `clean_data(df)` tells you what's happening.
3. **Testing:** you can test each function on its own.

---

## 14. Errors and exceptions

Errors are normal. Reading them is a skill.

```python
print(10 / 0)
```
```
ZeroDivisionError: division by zero
```

**Read the last line first.** It tells you the error type and the message. The lines above (the **traceback**) show where it happened.

| Error | Usual cause |
|---|---|
| `SyntaxError` | Typo in code structure (missing `:`, bracket, quote) |
| `IndentationError` | Wrong spaces at line start |
| `NameError` | Using a variable that doesn't exist (often a typo) |
| `TypeError` | Wrong type, e.g. `"5" + 3` |
| `ValueError` | Right type, bad value, e.g. `int("abc")` |
| `IndexError` | List index out of range, e.g. `[1,2][5]` |
| `KeyError` | Dict key doesn't exist |
| `FileNotFoundError` | Wrong file path |
| `ModuleNotFoundError` | Package not installed (fix with pip, section 16) |

### Handling errors with try / except

```python
text = "abc"
try:
    number = int(text)
except ValueError:
    print("That's not a number, using 0")
    number = 0
finally:
    print("This always runs")
```

Use this when you *expect* something might fail (e.g. bad user input, network errors) and want to handle it gracefully.

### Raising your own errors

```python
def set_age(age):
    if age < 0:
        raise ValueError("Age can't be negative")
    return age
```

---

## 15. Reading and writing files

```python
# Write a text file
with open("notes.txt", "w") as f:      # "w" = write (overwrites!)
    f.write("Line one\n")              # \n = new line
    f.write("Line two\n")

# Read it back
with open("notes.txt", "r") as f:      # "r" = read
    content = f.read()
print(content)

# Read line by line
with open("notes.txt") as f:
    for line in f:
        print(line.strip())

# Append to the end
with open("notes.txt", "a") as f:      # "a" = append
    f.write("Line three\n")
```

`with` automatically closes the file when done, even if an error happens. Always use it.

### Reading JSON

```python
import json

data = {"name": "Amal", "scores": [80, 90]}
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)       # Python dict → JSON file

with open("data.json") as f:
    loaded = json.load(f)              # JSON file → Python dict
print(loaded["scores"])                # [80, 90]

text = json.dumps(data)                # dict → JSON string
back = json.loads(text)                # JSON string → dict
```

For CSV files, we'll use Pandas (file 08), which is much easier.

### File paths

- **Absolute path:** full location, e.g. `/home/nisha/data/sales.csv` (Linux/Mac) or `C:\Users\Nisha\data\sales.csv` (Windows).
- **Relative path:** relative to where your program is running, e.g. `data/sales.csv`.

---

## 16. Modules, packages, and pip

### Modules

A **module** is a Python file containing code (functions, variables) you can reuse. Python comes with many built-in modules (the **standard library**).

```python
import math
math.sqrt(16)     # 4.0
math.pi           # 3.14159...

from math import sqrt, pi     # import specific things
sqrt(25)          # 5.0

import random
random.randint(1, 6)   # random dice roll

import datetime
datetime.date.today()
```

### Packages and libraries

A **package** (or **library**) is a collection of modules, usually made by other people, which you install. The data/AI world runs on these:

| Library | What it's for | File |
|---|---|---|
| `numpy` | fast maths on arrays of numbers | 08 |
| `pandas` | tables (DataFrames) | 08 |
| `matplotlib`, `seaborn`, `plotly` | charts | 09 |
| `scikit-learn` (`sklearn`) | classic machine learning | 11 to 14 |
| `xgboost`, `lightgbm` | boosted trees | 12 |
| `torch` (PyTorch) | deep learning | 15 |
| `transformers` (Hugging Face) | pretrained language/vision models | 18 to 21 |
| `openai`, `anthropic` | calling LLM APIs | 22 |
| `langchain`, `llama-index` | LLM apps, RAG | 23, 24 |
| `fastapi` | web APIs to serve models | 28 |

**Convention:** some libraries have standard short names:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
```

### pip: installing packages

**pip** is Python's package installer. In a terminal (file 03):

```bash
pip install pandas
pip install scikit-learn==1.5.0     # a specific version
pip install -r requirements.txt     # install everything listed in a file
pip list                            # what's installed
pip freeze > requirements.txt       # save your exact versions
```

In Colab/Jupyter, put `!` in front to run terminal commands: `!pip install pandas`.

A **requirements.txt** file lists the packages your project needs, one per line, so others can reproduce your setup.

---

## 17. Virtual environments

**Problem:** Project A needs `pandas 1.5`, project B needs `pandas 2.2`. If you install everything globally, they clash.

**Solution:** a **virtual environment** (venv) is an isolated folder with its own Python and its own packages, one per project.

**Analogy:** separate toolboxes for separate jobs, so the plumber's tools don't get mixed up with the electrician's.

```bash
python -m venv .venv               # create an environment in a folder called .venv
source .venv/bin/activate          # activate it (Mac/Linux)
.venv\Scripts\activate             # activate it (Windows)
pip install pandas                 # now installs only into this environment
deactivate                         # leave the environment
```

**Other tools you'll hear about:**
- **conda** (Anaconda/Miniconda): manages environments and packages, popular in data science, can also install non-Python things (like GPU libraries).
- **uv**: a very fast modern replacement for pip + venv. `uv venv`, `uv pip install pandas`.
- **poetry**: manages dependencies and packaging.

Rule: **one virtual environment per project.**

---

## 18. Jupyter notebooks and VS Code

### Jupyter Notebook

A **notebook** (`.ipynb` file) mixes code cells, their outputs (tables, charts) and text notes in one document. You run cells one at a time, and the variables stay in memory between cells.

✅ Perfect for exploring data, experimenting, teaching, and showing results.
❌ Easy to get messy: cells run out of order can give confusing results. Before sharing, use "Restart & Run All" to check it works top to bottom.

Tools: **JupyterLab**, **Google Colab** (free in browser, with free GPU), **VS Code** (has notebook support), **Kaggle Notebooks**.

### Scripts

A **script** is a plain `.py` file you run from the terminal: `python train.py`. Better for production code, automation, and anything that runs repeatedly.

**Typical workflow:** explore in a notebook → move the working code into `.py` scripts/functions.

### VS Code

A free, popular code editor with Python support, debugging, Git, notebooks, and AI assistants.

---

## 19. List comprehensions and lambda

### List comprehensions

**Idea:** a short way to build a list from another list.

```python
# Long way
squares = []
for n in range(5):
    squares.append(n ** 2)

# List comprehension: same result in one line
squares = [n ** 2 for n in range(5)]        # [0, 1, 4, 9, 16]

# With a filter
evens = [n for n in range(10) if n % 2 == 0]   # [0, 2, 4, 6, 8]

# Transform text
names = ["amal", "nisha"]
upper = [name.title() for name in names]       # ["Amal", "Nisha"]
```

Read it as: "**[** *what to keep* **for** *each item* **in** *collection* **if** *condition* **]**".

**Dict comprehension:**
```python
lengths = {name: len(name) for name in names}   # {"amal": 4, "nisha": 5}
```

### Lambda: tiny unnamed functions

```python
square = lambda x: x ** 2
square(5)    # 25

# Most common use: as a sort key
people = [("Amal", 34), ("Nisha", 22), ("John", 45)]
people.sort(key=lambda person: person[1])   # sort by age
# [("Nisha", 22), ("Amal", 34), ("John", 45)]
```

You'll use lambdas with Pandas, e.g. `df["col"].apply(lambda x: x * 2)` (file 08).

---

## 20. Classes and objects (OOP)

**Object-Oriented Programming (OOP)** organises code around "objects" that bundle **data** and **behaviour** together.

**Analogy:** A **class** is a blueprint (the plan for a car). An **object** is a thing built from it (your actual red car). Many cars can be built from one blueprint, each with its own colour and mileage.

```python
class BankAccount:
    def __init__(self, owner, balance=0):    # runs when you create an object
        self.owner = owner                   # attributes: data stored on the object
        self.balance = balance

    def deposit(self, amount):               # method: a function belonging to the class
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

acc = BankAccount("Nisha", 100)   # create an object (an "instance")
acc.deposit(50)
print(acc.balance)                # 150
```

- `__init__` is the **constructor**: it sets up a new object.
- `self` means "this particular object". Every method gets it as the first parameter.
- `acc.balance` = an **attribute**; `acc.deposit()` = a **method**.

### Inheritance

A class can **inherit** from another and add or change behaviour:

```python
class SavingsAccount(BankAccount):
    def add_interest(self, rate):
        self.balance *= (1 + rate)

s = SavingsAccount("Amal", 1000)
s.deposit(100)          # inherited from BankAccount
s.add_interest(0.05)    # new method
print(s.balance)        # 1155.0
```

### Why you need OOP for AI

You'll *use* classes constantly, even if you rarely write big ones:

```python
from sklearn.linear_model import LinearRegression
model = LinearRegression()   # create an object
model.fit(X, y)              # call a method to train it
model.predict(X_new)         # call a method to predict
model.coef_                  # read an attribute (learned values)
```

And in PyTorch (file 15) you *write* a class for every neural network:

```python
import torch.nn as nn
class MyNet(nn.Module):      # inherits from nn.Module
    def __init__(self):
        super().__init__()   # run the parent class's __init__
        ...
```

---

## 21. Generators, decorators, type hints

### Generators

A **generator** produces values **one at a time**, only when asked, instead of building a whole list in memory. Uses `yield` instead of `return`.

```python
def count_up_to(n):
    i = 1
    while i <= n:
        yield i      # hand back one value, pause here until asked again
        i += 1

for x in count_up_to(3):
    print(x)         # 1, 2, 3
```

**Why it matters:** a dataset of 100 GB doesn't fit in memory. A generator can read and serve it in small batches. LLM APIs also **stream** responses token by token, which you'll read with a loop over a generator (file 22).

### Decorators

A **decorator** wraps a function to add behaviour. Written with `@` above the function.

```python
import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.time() - start:.2f}s")
        return result
    return wrapper

@timer
def slow_add(a, b):
    time.sleep(1)
    return a + b

slow_add(2, 3)   # prints "slow_add took 1.00s"
```

You'll see decorators in web frameworks (`@app.get("/predict")` in FastAPI, file 28) and in PyTorch (`@torch.no_grad()`, file 15).

### Type hints

Optional labels saying what types a function expects and returns. Python doesn't enforce them, but they make code clearer and help editors catch bugs.

```python
def average(numbers: list[float]) -> float:
    return sum(numbers) / len(numbers)

name: str = "Nisha"
maybe: int | None = None    # either an int or None
```

Type hints are also used by tools like **Pydantic** to validate data. This is very common for LLM structured outputs and tool calling (files 22, 24).

---

## 22. Data structures you should know

A **data structure** is a way of organising data so certain operations are fast.

| Structure | Idea | Python | Good at |
|---|---|---|---|
| **Array / List** | items in a row, numbered | `list` | access by position |
| **Hash map / Hash table** | key → value lookup | `dict` | super fast lookup by key |
| **Set** | unique items | `set` | "is X in here?" fast |
| **Stack** | last in, first out (LIFO), like a stack of plates | `list` with `append`/`pop` | undo history |
| **Queue** | first in, first out (FIFO), like a line at a shop | `collections.deque` | processing tasks in order |
| **Tree** | items in a hierarchy (parent → children) | custom classes | folders; decision trees (file 12) |
| **Graph** | items (nodes) connected by links (edges) | dicts of lists | social networks, maps, knowledge graphs (file 23) |
| **Heap / Priority queue** | always gives the smallest (or largest) item fast | `heapq` | "top 10 results" |

```python
from collections import deque, Counter

q = deque()
q.append("task1"); q.append("task2")
q.popleft()        # "task1": first in, first out

Counter("banana")  # Counter({'a': 3, 'n': 2, 'b': 1}): counts items
```

`Counter` is great for counting words in text (file 18).

---

## 23. Algorithm speed: Big-O notation

**Idea:** **Big-O** describes how the running time (or memory) of an algorithm **grows** as the input size *n* grows. It ignores small details and focuses on the trend.

**Analogy:** Finding a friend's name:
- In a **messy pile** of n papers: you may need to check all n. That's **O(n)**.
- In an **alphabetical phone book**: open in the middle, halve each time. That's **O(log n)**: 1,000,000 names need only ~20 checks.
- In your **phone's contacts search** (hash map): almost instant regardless of size. That's **O(1)**.

| Big-O | Name | Example | n = 1,000 → steps |
|---|---|---|---|
| O(1) | constant | dict lookup | 1 |
| O(log n) | logarithmic | binary search | ~10 |
| O(n) | linear | loop through a list once | 1,000 |
| O(n log n) | "n log n" | good sorting (`sorted()`) | ~10,000 |
| O(n²) | quadratic | loop inside a loop (compare every pair) | 1,000,000 |
| O(2ⁿ) | exponential | try every subset | astronomically large |

(*log* is explained properly in [file 04](04-math-numbers-and-functions.md). For now: log₂ n ≈ "how many times can you halve n until you reach 1".)

```python
# O(n): one loop
def contains(lst, target):
    for x in lst:
        if x == target:
            return True
    return False

# O(n²): nested loops
def has_duplicate(lst):
    for i in range(len(lst)):
        for j in range(i + 1, len(lst)):
            if lst[i] == lst[j]:
                return True
    return False

# O(n): smarter, using a set
def has_duplicate_fast(lst):
    return len(set(lst)) != len(lst)
```

**Why AI people care:** the "attention" mechanism inside LLMs is O(n²) in the length of the text (file 19). That's exactly why long documents are expensive, and why so much research tries to make it faster.

Common searching/sorting terms you may hear: **linear search** O(n), **binary search** O(log n) (needs sorted data), **merge sort / quicksort** O(n log n).

---

## 24. Mini project

**Student grade report.** Given:

```python
students = [
    {"name": "Amal", "scores": [78, 85, 90]},
    {"name": "Nisha", "scores": [92, 88, 95]},
    {"name": "John", "scores": [55, 62, 48]},
]
```

Write a program that:
1. Defines a function `average(scores)` returning the mean.
2. Defines a function `grade(avg)` returning A (≥75), B (≥65), C (≥50), F otherwise.
3. Prints each student's name, average (1 decimal) and grade.
4. Prints the top student's name.
5. Saves the results to `report.json`.

<details><summary>One possible solution</summary>

```python
import json

def average(scores):
    return sum(scores) / len(scores)

def grade(avg):
    if avg >= 75: return "A"
    elif avg >= 65: return "B"
    elif avg >= 50: return "C"
    return "F"

report = []
for s in students:
    avg = average(s["scores"])
    g = grade(avg)
    print(f"{s['name']}: {avg:.1f} ({g})")
    report.append({"name": s["name"], "average": round(avg, 1), "grade": g})

top = max(report, key=lambda r: r["average"])
print("Top student:", top["name"])

with open("report.json", "w") as f:
    json.dump(report, f, indent=2)
```
Output:
```
Amal: 84.3 (A)
Nisha: 91.7 (A)
John: 55.0 (C)
Top student: Nisha
```
</details>

---

## 25. Check yourself

**Q1.** What does `"Python"[1:4]` give?
<details><summary>Answer</summary>`"yth"`: indexes 1, 2, 3 (stop index 4 is not included).</details>

**Q2.** What's the difference between a list and a tuple?
<details><summary>Answer</summary>A list is mutable (can be changed) and uses `[ ]`; a tuple is immutable (can't be changed) and uses `( )`.</details>

**Q3.** What does `7 % 3` give, and what is `%` useful for?
<details><summary>Answer</summary>`1` (the remainder). Useful for checking even/odd (`n % 2 == 0`), doing something every k-th item, wrapping around.</details>

**Q4.** Write a list comprehension that gives the lengths of each word in `["data", "ai", "python"]`.
<details><summary>Answer</summary>`[len(w) for w in ["data", "ai", "python"]]` → `[4, 2, 6]`</details>

**Q5.** Why use a virtual environment?
<details><summary>Answer</summary>To give each project its own isolated set of packages and versions, so projects don't break each other.</details>

**Q6.** You see `ModuleNotFoundError: No module named 'pandas'`. What do you do?
<details><summary>Answer</summary>Install it: `pip install pandas` (and make sure your virtual environment is activated).</details>

**Q7.** In `model.fit(X, y)`, what are `model`, `fit` and `X, y`?
<details><summary>Answer</summary>`model` is an object (an instance of a class), `fit` is a method of that object, `X` and `y` are arguments passed to the method.</details>

**Q8.** Is checking every pair of items in a list O(n), O(n²), or O(log n)?
<details><summary>Answer</summary>O(n²): for each of n items you compare with about n others.</details>

---

## 26. New words in this file

| Word | Meaning |
|---|---|
| `print()` | Show output on screen |
| Comment (`#`) | Note for humans, ignored by Python |
| Variable | A name pointing to a value |
| Assignment (`=`) | Store a value in a variable |
| `int`, `float`, `str`, `bool`, `None` | Whole number, decimal number, text, True/False, nothing |
| Casting | Converting between types (`int()`, `str()`, ...) |
| Operator | Symbol doing an operation (`+`, `==`, `and`, ...) |
| Modulo (`%`) | Remainder after division |
| String / f-string | Text / text with `{values}` inserted |
| Index / slicing | Position (starting at 0) / taking a range `[start:stop]` |
| Method | A function attached to an object, called with `.` |
| Mutable / immutable | Can / can't be changed after creation |
| List, tuple, dict, set | Ordered changeable collection; fixed collection; key→value lookup; unique items |
| `if/elif/else` | Choose code based on conditions |
| Indentation | Leading spaces that group code in Python |
| `for` / `while` loop | Repeat for each item / while a condition is true |
| `range`, `enumerate`, `zip` | Number sequences; index+item; pair up lists |
| `break` / `continue` | Exit loop / skip to next round |
| Function, parameter, argument, return | Reusable named code; placeholder input; actual input; output |
| Keyword argument / default value | `name=value` arguments; value used if none given |
| Scope / local variable | Where a variable exists / exists only inside a function |
| Exception, traceback | An error object / the report showing where it happened |
| `try/except/finally`, `raise` | Handle errors / create an error |
| `with open(...)` | Safely read/write files |
| Absolute / relative path | Full file location / location relative to current folder |
| Module, package, library | Reusable code file / collection of modules / installed package |
| Standard library | Modules that come with Python |
| pip, requirements.txt | Package installer / list of needed packages |
| Virtual environment (venv), conda, uv | Isolated per-project Python setups and tools |
| Jupyter notebook, Colab, script | Interactive code+output document; free online notebooks; plain `.py` file |
| List comprehension | One-line list building `[x for x in ...]` |
| Lambda | Small unnamed function |
| Class, object/instance | Blueprint / thing built from it |
| Attribute, method, `self`, `__init__` | Object's data; object's function; "this object"; constructor |
| Inheritance | A class reusing and extending another class |
| Generator, `yield` | Produces values one at a time, saving memory |
| Streaming | Receiving output piece by piece as it's produced |
| Decorator (`@`) | Wraps a function to add behaviour |
| Type hints | Labels describing expected types |
| Pydantic | Library that validates data using type hints |
| Data structure | Way of organising data (stack, queue, hash map, tree, graph, heap) |
| Big-O notation | How running time grows with input size: O(1), O(log n), O(n), O(n²) |
| Binary search | Find in sorted data by repeatedly halving: O(log n) |

**Next:** [03-developer-tools.md](03-developer-tools.md)
