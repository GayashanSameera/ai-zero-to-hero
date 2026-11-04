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

**Why it exists:** the best way to learn to program is to make the computer do something visible as soon as possible. `print` is the simplest way to see what your code is doing, and you will use it for debugging for the rest of your career.

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

**Worked example (what Python does, line by line):**

```python
print("Hello, Sri Lanka!")   # line 1: show text
print(2 + 3)                 # line 2: Python calculates 2 + 3 = 5, then shows 5 (no quotes!)
print("2 + 3")               # line 3: this is text in quotes, so it is shown exactly as written
```

Output:
```
Hello, Sri Lanka!
5
2 + 3
```

Lines 2 and 3 look almost the same but behave differently: no quotes means "calculate this", quotes mean "this is just text".

**Where you'll meet it in real work:** when a model training loop runs for hours, you `print` the loss every few steps to check that it is going down.

**Common mistakes:**
- Forgetting the closing bracket or quote: `print("Hello` gives a `SyntaxError`.
- Using a "smart quote" (curly quotes pasted from a Word document or a chat). Python only accepts straight quotes `"` or `'`.
- Writing `Print` or `PRINT`. Python is case-sensitive; it must be `print`.

> **සිංහලෙන්:** print() කියන්නේ තිරයේ යම් දෙයක් පෙන්වන function එක. Quotes ඇතුළේ තියෙන්නේ text (string) එකක්, ඒක ඒ විදිහටම පෙන්වනවා. Quotes නැතුව 2 + 3 ලිව්වොත් Python එක ගණනය කරලා 5 පෙන්වනවා, ඒත් "2 + 3" කියලා quotes දාලා ලිව්වොත් ඒ text එක ඒ විදිහටම පෙනෙනවා. Model එකක් පැය ගාණක් train වෙද්දී loss එක අඩු වෙනවාද බලන්න අපි print කරනවා. Print එක ලියද්දී bracket එකයි quotes දෙකයි වහන්න අමතක කරන්න එපා.

---

## 2. Comments

**Why it exists:** code tells the computer what to do, but a person reading it six months later (often you) needs to know why. Comments carry that human explanation.

Anything after `#` on a line is a **comment**. Python ignores it. Comments are notes for humans.

```python
# This line is ignored by Python
print("Hi")  # this part is also ignored
```

Write comments to explain *why* you did something, not *what* (the code shows what).

**Good vs bad comments:**

```python
# BAD: repeats what the code already says
x = x + 1   # add 1 to x

# GOOD: explains the reason
retries = retries + 1   # the server sometimes drops the first request, so we try again
```

**Handy trick:** put `#` in front of a line to switch it off temporarily while you test something else. This is called "commenting out" code.

**Where you'll meet it in real work:** in team projects, a short comment like `# Rs. per kg, not per bag` next to a price can save a colleague from a costly misunderstanding.

**Common mistake:** leaving old comments that no longer match the code. A wrong comment is worse than none.

> **සිංහලෙන්:** Comment එකක් කියන්නේ # ලකුණෙන් පටන් ගන්න, Python එක කිසිසේත් ගණන් නොගන්න, මිනිසුන්ට විතරක් ලියන සටහනක්. කෝඩ් එකෙන් "මොකක්ද" කියන එක පේනවනේ, ඉතින් comment එකේ ලියන්න ඕනේ "ඇයි" කියන එක. උදාහරණයක් විදිහට "x = x + 1" ට "1ක් එකතු කරනවා" කියලා ලියන්න එපා, "server එක පළවෙනි request එක සමහර වෙලාවට අතහරිනවා, ඒ නිසා ආයේ උත්සාහ කරනවා" කියලා ලියන්න. කෝඩ් එකක පේළියක් තාවකාලිකව නතර කරන්නත් # ගහන්න පුළුවන්.

---

## 3. Variables

**Why it exists:** programs need to remember things: a price, a name, a running total. A variable gives a value a name so you can use and change it later.

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

**Worked example (tracing a variable step by step):** a shop sells a bag of rice.

```python
price = 250          # price is 250
quantity = 3         # quantity is 3
total = price * quantity   # 250 * 3 = 750
discount = 50
total = total - discount   # take the old total (750), subtract 50, store 700 back
print(total)         # 700
```

| After this line | price | quantity | total | discount |
|---|---|---|---|---|
| `price = 250` | 250 | | | |
| `quantity = 3` | 250 | 3 | | |
| `total = price * quantity` | 250 | 3 | 750 | |
| `discount = 50` | 250 | 3 | 750 | 50 |
| `total = total - discount` | 250 | 3 | **700** | 50 |

**Text picture:** a variable is a label stuck on a value.

```
price ───►  250
name  ───►  "Nisha"
```

**Where you'll meet it in real work:** every ML script begins by naming things: `learning_rate = 0.001`, `epochs = 10`, `batch_size = 32`. Changing one variable at the top changes the whole experiment.

**Common mistakes:**
- Reading `x = x + 1` as a maths impossibility. It means "take the current x, add 1, put it back into x".
- Using a name before giving it a value (`NameError`).
- Typos in names: `totl` and `total` are different variables.

> **සිංහලෙන්:** Variable එකක් කියන්නේ අගයකට දෙන නමක්, බඳුනකට ඇලවපු ලේබලයක් වගේ. price = 250, quantity = 3 කියලා දුන්නොත් total = price * quantity කළාම 750 වෙනවා, ඊට පස්සේ total = total - 50 කළාම රු. 700 ක් ඉතුරු වෙනවා. "=" ලකුණෙන් කියන්නේ "සමානයි" කියන එක නෙවෙයි, "මේ අගය මේ නමට දාන්න" කියන එක. ML code වල learning_rate = 0.001, epochs = 10 වගේ variables උඩින්ම තියෙනවා, ඒවා වෙනස් කළාම මුළු experiment එකම වෙනස් වෙනවා.

---

## 4. Basic data types

**Why it exists:** a computer treats the number 5, the decimal 5.0 and the text "5" very differently. Types tell Python which operations make sense (you can add numbers, but "adding" a name and a price is a mistake).

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

**Worked example (a type bug that shows up in real data):** you read a column of prices from a CSV file. They arrive as text:

```python
prices = ["120", "80", "45"]      # text, as read from a CSV
print("120" + "80")               # 12080   (text joins together, it does not add!)
print(int("120") + int("80"))     # 200     (convert to numbers first, then add)
total = 0
for p in prices:
    total += int(p)               # convert each piece of text, then add it
print(total)                      # 245: 120 + 80 + 45
```

**A quick type table by example:**

| Value | Type | Why |
|---|---|---|
| `7` | int | whole number |
| `7.0` | float | has a decimal point |
| `"7"` | str | quotes make it text |
| `True` | bool | capital T, no quotes |
| `None` | NoneType | "nothing here yet" |

**Where you'll meet it in real work:** a classic Pandas/ML bug is a numeric column that was loaded as text because one cell had "N/A" in it. The whole column becomes `str`, and the maths fails.

**Common mistakes:**
- Using `int()` expecting rounding: `int(3.99)` is 3, not 4.
- Writing `true` or `false` (lowercase). In Python it is `True` and `False`.
- Forgetting that `bool("False")` is `True`, because any non-empty text is "truthy".

> **සිංහලෙන්:** හැම අගයකටම type එකක් තියෙනවා: int කියන්නේ පූර්ණ සංඛ්‍යා (7), float කියන්නේ දශම (7.0), str කියන්නේ quotes ඇතුළේ text ("7"), bool කියන්නේ True/False. CSV එකකින් මිල කියවද්දී ඒවා සමහර වෙලාවට text විදිහට එන නිසා "120" + "80" කළාම 200 නෙවෙයි, "12080" කියලා වචන දෙක ඇලෙනවා. int("120") + int("80") කළාම හරියටම 200 ලැබෙනවා. int(3.99) කළාම 3 ලැබෙන්නේ, round කරන්නේ නෑ, දශම කෑල්ල කපලා දානවා විතරයි.

---

## 5. Operators

**Why it exists:** programs spend most of their time calculating and comparing: "is the total over Rs. 5,000?", "is the user old enough?". Operators are the symbols that do this.

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

**Worked example (a delivery fee rule):** an order of Rs. 4,200 from a customer in Colombo. Delivery is free if the order is at least Rs. 5,000 **or** the customer is a member.

```python
order = 4200
is_member = True

order >= 5000                 # False (4200 is less than 5000)
is_member                     # True
order >= 5000 or is_member    # False or True  →  True   so delivery is free
```

**Worked example (the `//` and `%` pair):** you have 47 sweets and put 10 in each packet.

```python
47 // 10    # 4   → 4 full packets
47 % 10     # 7   → 7 sweets left over
```

Check: 4 × 10 + 7 = 47. In general, `a == (a // b) * b + a % b`.

**Truth tables you can trust:**

| A | B | A and B | A or B |
|---|---|---|---|
| True | True | True | True |
| True | False | False | True |
| False | True | False | True |
| False | False | False | False |

**Where you'll meet it in real work:** filtering a table in Pandas, e.g. `df[(df.age > 18) & (df.city == "Kandy")]`, is the same logic. Note that Pandas uses `&` and `|` instead of `and` and `or`.

**Common mistakes:**
- `=` versus `==` (assign versus compare).
- `0.1 + 0.2 == 0.3` is `False` in Python! Decimals are stored in binary and small rounding errors appear (`0.1 + 0.2` gives `0.30000000000000004`). Compare floats with a tolerance, e.g. `abs(a - b) < 1e-9`, or use `math.isclose`.
- Forgetting that `/` always gives a float: `10 / 2` is `5.0`, not `5`.

> **සිංහලෙන්:** Operators කියන්නේ ගණනය කරන්න සහ සසඳන්න පාවිච්චි කරන ලකුණු: +, -, *, /, සහ ==, >, < වගේ ඒවා. // කියන්නේ බෙදලා දශමය අයින් කරන එක, % කියන්නේ ඉතිරිය. පැකට් එකක ගෙඩි 10 බැගින් දාද්දී රට්ටන් 47ක් තියෙනවා නම් 47 // 10 = 4 පැකට්, 47 % 10 = 7 ඉතුරුයි. "=" කියන්නේ අගයක් දාන එක, "==" කියන්නේ සමානද කියලා බලන එක, ඒ දෙක වෙනස්. අමුතු දෙයක් මෙහෙමයි: 0.1 + 0.2 කළාම හරියටම 0.3 නෙවෙයි, ඒ නිසා දශම අංක සසඳද්දී පරිස්සම් වෙන්න ඕනේ.

---

## 6. Strings

**Why it exists:** most real data is text: names, reviews, product titles, chat messages. LLMs work entirely on text. Python's string tools let you clean and reshape it before a model ever sees it.

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

**Worked example (clean a messy customer name):**

```python
raw = "   aMAL perera  "            # typed carelessly
step1 = raw.strip()                 # "aMAL perera"        (remove outer spaces)
step2 = step1.title()               # "Amal Perera"        (capital first letters)
first, last = step2.split(" ")      # first = "Amal", last = "Perera"
print(f"{last}, {first}")           # Perera, Amal
```

**Worked example (slicing, step by step):** for `word = "Colombo"`:

```
 index:    0  1  2  3  4  5  6
 letters:  C  o  l  o  m  b  o
```

- `word[0:3]`: indexes 0, 1, 2 → `"Col"`
- `word[3:]`: from index 3 to the end → `"ombo"`
- `word[-1]`: last letter → `"o"`
- `word[::-1]`: reversed → `"obmoloC"`

A handy rule: `word[a:b]` has `b - a` letters. Here `3 - 0 = 3`, and "Col" has 3.

**Where you'll meet it in real work:** cleaning text before tokenization, building prompts for an LLM with f-strings (`f"Summarise this: {text}"`), and splitting a CSV line with `.split(",")`.

**Common mistakes:**
- Trying to change one letter: `word[0] = "c"` is an error because strings are immutable. Make a new one: `"c" + word[1:]`.
- Index errors from counting from 1. The first character is index 0.
- Forgetting `f` before the quotes, so `{name}` appears literally in the output.
- Sinhala and emoji work fine in Python strings (they are Unicode, see [file 01](01-big-picture-and-data.md#11-how-computers-store-data-bits-and-bytes)), but `len()` counts characters (code points), not what a reader sees as letters.

> **සිංහලෙන්:** String එකක් කියන්නේ text එකක්. f-string එකකදී අකුරට කලින් f ගහලා { } ඇතුළේ variable දාන්න පුළුවන්, උදාහරණයක් විදිහට f"{name} scored {score}". "Colombo" ගත්තොත් පළවෙනි අකුර index 0 එක (C), හතරවෙනි අකුර index 3 එක. word[0:3] කළාම "Col" ලැබෙනවා, මොකද stop index එක ඇතුළත් වෙන්නේ නෑ. .strip() කළාම දෙපැත්තේ හිස්තැන් ඉවත් වෙනවා, .split(",") කළාම text එක ලිස්ට් එකක් වෙනවා. String එකක අකුරක් වෙනස් කරන්න බෑ, අලුත් string එකක් හදන්න ඕනේ.

---

## 7. Lists

**Why it exists:** you constantly need to hold many values together: marks of 40 students, prices in a basket, words in a sentence. A list keeps them in order so you can loop over them or pick one.

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

**Worked example (class marks):**

```python
marks = [72, 58, 91, 40, 85]

total = sum(marks)                  # 72 + 58 + 91 + 40 + 85 = 346
average = total / len(marks)        # 346 / 5 = 69.2
best = max(marks)                   # 91
marks.sort()                        # marks is now [40, 58, 72, 85, 91]
median = marks[len(marks) // 2]     # 5 // 2 = 2, so marks[2] = 72
print(average, best, median)        # 69.2 91 72
```

**Text picture of a list:**

```
 marks:   [ 40 | 58 | 72 | 85 | 91 ]
 index:      0    1    2    3    4
 negative:  -5   -4   -3   -2   -1
```

**Worked example (copy trap, in numbers):**

```python
basket = [100, 200]
backup = basket          # NOT a copy: two names, one list
basket.append(300)
print(backup)            # [100, 200, 300]  surprise!

backup = basket.copy()   # a true copy
basket.append(400)
print(backup)            # [100, 200, 300]  unchanged this time
```

**Where you'll meet it in real work:** a batch of 32 training examples is a list of 32 items; a tokenised sentence is a list of token ids such as `[15496, 995]`.

**Common mistakes:**
- `IndexError`: asking for `marks[5]` when the list has only 5 items (valid indexes are 0 to 4).
- `sort()` returns `None`. Writing `marks = marks.sort()` destroys your list. Use `sorted(marks)` for a new list, or call `marks.sort()` alone.
- Removing items from a list while looping over it.

> **සිංහලෙන්:** List එකක් කියන්නේ පිළිවෙළට තියෙන, වෙනස් කරන්න පුළුවන් items එකතුවක්. ළමයි පස් දෙනෙකුගේ marks [72, 58, 91, 40, 85] ගත්තොත් එකතුව 346, සාමාන්‍යය 346 ÷ 5 = 69.2 වෙනවා. පළවෙනි item එකේ index එක 0, අන්තිම එක -1. b = a කියලා ලිව්වම copy එකක් හැදෙන්නේ නෑ, ගෙදරකට ලිපිනයන් දෙකක් දුන්නා වගේ, එක නමකින් වෙනස් කළොත් අනිත් නමෙනුත් වෙනස් වෙනවා. ඇත්ත copy එකට a.copy() පාවිච්චි කරන්න. marks = marks.sort() කියලා ලිව්වොත් ලිස්ට් එකම නැති වෙනවා, මොකද sort() එක None දෙනවා.

---

## 8. Tuples

**Why it exists:** sometimes a group of values belongs together and must not be changed by accident: a map point, a colour, a table's shape. A tuple is a list that is locked.

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

**Worked example (the shape of a dataset):**

```python
shape = (1000, 5)          # 1000 rows, 5 columns
rows, cols = shape         # unpacking: rows = 1000, cols = 5
print(rows * cols)         # 5000 cells in total
# shape[0] = 2000          # ERROR: tuples can't be changed
```

**List vs tuple at a glance:**

| | List | Tuple |
|---|---|---|
| Brackets | `[1, 2]` | `(1, 2)` |
| Can change? | yes | no |
| Use for | collections that grow or change | fixed groups (coordinates, shapes, return values) |

**Where you'll meet it in real work:** in NumPy and PyTorch, `x.shape` is a tuple like `(32, 128)`, and many functions return several values as a tuple.

**Common mistakes:**
- A tuple with one item needs a trailing comma: `(5,)` is a tuple, `(5)` is just the number 5.
- Trying to assign to a tuple item.

> **සිංහලෙන්:** Tuple එකක් list එකක් වගේම, ඒත් හදපු පස්සේ වෙනස් කරන්න බෑ. ඒකට වටකුරු වරහන් පාවිච්චි කරනවා, උදාහරණයක් විදිහට (1000, 5). Data table එකක shape එක (පේළි 1000, තීරු 5) වගේ දෙයක් tuple එකක් විදිහට තියාගන්නේ, මොකද ඒක අහම්බෙන් වෙනස් වෙන්න දෙන්න බෑ. rows, cols = shape කළාම rows = 1000, cols = 5 වෙනවා. NumPy සහ PyTorch වල x.shape කියන්නේ tuple එකක්. එක item එකක් තියෙන tuple එකට (5,) කියලා කොමාවක් දාන්න අමතක කරන්න එපා.

---

## 9. Dictionaries

**Why it exists:** a list finds things by position, but real questions are "what is Nisha's phone number?", not "what is item number 17?". A dictionary lets you look values up by a meaningful name (a key), and it does so very fast.

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

**Worked example (counting words, the classic dict job):**

```python
words = ["ai", "data", "ai", "python", "data", "ai"]
counts = {}                                  # empty dict
for w in words:
    if w in counts:
        counts[w] += 1                       # seen before: add 1
    else:
        counts[w] = 1                        # first time: start at 1
print(counts)                                # {'ai': 3, 'data': 2, 'python': 1}
```

Trace: "ai" → 1; "data" → 1; "ai" → 2; "python" → 1; "data" → 2; "ai" → 3.

**Text picture:**

```
  keys        values
 "name"  ──►  "Nisha"
 "age"   ──►  22
 "city"  ──►  "Kandy"
```

**List vs dict:** to find "Nisha" in a list of 1,000,000 names, Python may check one by one (up to 1,000,000 steps). A dict finds a key in about one step, however big it is (see section 23).

**Where you'll meet it in real work:** every LLM API request and response is a dict (JSON): `{"role": "user", "content": "Hello"}`. Pandas rows, config files and model hyper-parameters are also dicts.

**Common mistakes:**
- `KeyError` from asking for a key that doesn't exist. Use `.get(key, default)`.
- Expecting duplicates: a key can appear only once. Assigning to an existing key replaces its value.
- Using a list as a key. Keys must be immutable (strings, numbers, tuples).

> **සිංහලෙන්:** Dictionary එකක් කියන්නේ key එකකින් value එකක් හොයන ක්‍රමයක්, දුරකථන පොතේ නමට අංකය බලනවා වගේ. {"name": "Nisha", "age": 22} කියන එකේ "name" කියන්නේ key එක, "Nisha" කියන්නේ value එක. වචන ගණන් කරන්නත් හොඳයි: ["ai", "data", "ai"] බැලුවාම ai = 2, data = 1 කියලා ගණන් තියාගන්න පුළුවන්. නැති key එකක් ඉල්ලුවොත් KeyError එනවා, ඒ නිසා .get() පාවිච්චි කරන්න. LLM API එකකට යවන message එකත් {"role": "user", "content": "Hello"} වගේ dict එකක්.

---

## 10. Sets

**Why it exists:** often you only care whether something is present, or you need to remove duplicates or compare two groups. A set does that in one line, and checking "is X in here?" is very fast.

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

**Worked example (two classes, who is in which?):**

```python
class_a = {"Amal", "Nisha", "Kamal", "Sunil"}
class_b = {"Nisha", "Sunil", "Dilani"}

class_a & class_b    # {'Nisha', 'Sunil'}                          in both
class_a | class_b    # {'Amal', 'Nisha', 'Kamal', 'Sunil', 'Dilani'}   in either (5 people)
class_a - class_b    # {'Amal', 'Kamal'}                            only in A
```

(Sets are unordered, so the printed order may differ on your machine.)

Count check: |A| + |B| − |A ∩ B| = 4 + 3 − 2 = 5 people in the union. ✓

**Worked example (de-duplicate a list):**

```python
tags = ["ai", "ml", "ai", "data", "ml"]
unique = list(set(tags))     # 3 unique tags (order may vary)
print(len(unique))           # 3
```

**Where you'll meet it in real work:** building a vocabulary (the set of distinct words in a text), checking whether a word is a stop-word, or removing duplicate customer ids before training.

**Common mistakes:**
- Writing `{}` and expecting an empty set. `{}` is an empty **dict**; use `set()`.
- Expecting order or indexing. `my_set[0]` is an error.

> **සිංහලෙන්:** Set එකක් කියන්නේ සමාන නැති (unique) items එකතුවක්. Duplicate තිබුණොත් ඉබේම එක විතරක් ඉතුරු වෙනවා. A පන්තියේ {Amal, Nisha, Kamal, Sunil} සහ B පන්තියේ {Nisha, Sunil, Dilani} ගත්තොත් දෙකේම ඉන්නේ Nisha සහ Sunil (&), එකතු කළාම ඉන්නේ 5දෙනයි (|), A එකේ විතරක් ඉන්නේ Amal සහ Kamal (-). ලිස්ට් එකක duplicate අයින් කරන්න set(list) පාවිච්චි කරනවා. හිස් set එකක් හදන්නේ set() වලින්, මොකද {} කියන්නේ හිස් dict එක.

---

## 11. If / elif / else

**Why it exists:** a program that always does the same thing is not very useful. `if` lets it choose: approve or reject, show a warning or not, use the fast path or the slow one.

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

**Worked example (follow the A/L-style grading ladder for three students):**

```python
def grade(m):
    if m >= 75:
        return "A"
    elif m >= 65:
        return "B"
    elif m >= 50:
        return "C"
    else:
        return "F"

grade(82)   # 82 >= 75 is True → "A", stop checking
grade(58)   # 58 >= 75 No; 58 >= 65 No; 58 >= 50 Yes → "C"
grade(35)   # all three tests fail → "F"
```

**Text picture (flow chart):**

```
 marks ──► >= 75? ─yes─► A
            │no
            ▼
          >= 65? ─yes─► B
            │no
            ▼
          >= 50? ─yes─► C
            │no
            ▼
            F
```

**Order matters:** if you wrote the `>= 50` test first, then 82 would get "C" because 82 is also at least 50 and Python stops at the first True. Always check the strictest condition first.

**Where you'll meet it in real work:** early stopping in training (`if val_loss > best_loss: patience += 1`), input validation in an API, and routing a question to different tools in an agent.

**Common mistakes:**
- Missing colon `:` at the end of the `if` line.
- Mixed indentation (tabs and spaces) causing `IndentationError`.
- Using `=` instead of `==` inside the condition.
- Writing `if x == 1 or 2:` and expecting "x is 1 or 2". It is always true because `2` alone is truthy. Write `if x == 1 or x == 2:` or `if x in (1, 2):`.

> **සිංහලෙන්:** if / elif / else කියන්නේ කොන්දේසි අනුව වෙනස් code එකක් දුවවන ක්‍රමය. Marks 82ක් නම් "75ට වැඩිද?" කියලා බලද්දී ඔව් නිසා A දීලා නවතිනවා. 58ක් නම් 75 නෑ, 65 නෑ, 50 ඔව් නිසා C. Python එක උඩ ඉඳන් පහළට බලලා පළමු හරි එකේ විතරක් නතර වෙනවා, ඒ නිසා ඉහළම marks කොන්දේසිය මුලින්ම ලියන්න ඕනේ. 50 මුලින් ලිව්වොත් 82ටත් C ලැබෙනවා. පේළියේ අගට : දාන්න සහ spaces 4ක indentation එක නිවැරදිව තියාගන්න අමතක කරන්න එපා.

---

## 12. Loops

**Why it exists:** computers are good at repeating things. Whether it is 5 prices or 5 million rows, one loop handles them all with the same few lines.

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

**Worked example (trace a `for` loop with an accumulator):**

```python
marks = [60, 75, 90]
total = 0
for m in marks:
    total += m
print(total)   # 225
```

| Round | m | total before | total after |
|---|---|---|---|
| 1 | 60 | 0 | 60 |
| 2 | 75 | 60 | 135 |
| 3 | 90 | 135 | 225 |

**Worked example (the `while` compound-interest loop from above):** start with Rs. 1,000 growing 10% each year, stop when it reaches 2,000.

| Year | Balance after growing |
|---|---|
| 1 | 1,100.00 |
| 2 | 1,210.00 |
| 3 | 1,331.00 |
| 4 | 1,464.10 |
| 5 | 1,610.51 |
| 6 | 1,771.56 |
| 7 | 1,948.72 |
| 8 | 2,143.59 |

At year 7 the balance is still below 2,000, so the loop runs once more. After year 8 it passes 2,000 and stops, so `years` is 8. ✓

**Which loop?** Use `for` when you know what to loop over (a list, a range). Use `while` when you don't know how many rounds you need ("until it is good enough").

**Where you'll meet it in real work:** a neural network's training loop is just `for epoch in range(10):` with a batch loop inside. Looping over files in a folder, rows in a dataset, or pages of an API are also `for` loops.

**Common mistakes:**
- Off-by-one: `range(5)` gives 0 to 4, never 5.
- Changing a list while looping over it.
- An infinite `while` loop because the variable in the condition is never updated.
- Doing a slow Python loop over millions of numbers when NumPy or Pandas could do it in one vectorised step ([file 08](08-numpy-and-pandas.md)).

> **සිංහලෙන්:** Loop එකක් කියන්නේ එකම වැඩේ නැවත නැවත කරන ක්‍රමය. for loop එක ලිස්ට් එකක හැම item එකක් හරහාම යනවා, while loop එක කොන්දේසියක් ඇත්ත වෙනතුරු දුවනවා. marks [60, 75, 90] එකතු කරද්දී total එක 0 → 60 → 135 → 225 කියලා වැඩි වෙනවා, ඒකට accumulator pattern කියනවා. රු. 1,000ක් අවුරුද්දකට 10% බැගින් වැඩි වෙනවා නම් අවුරුදු 7කදී 1,948 වෙනවා, 8 වෙනි අවුරුද්දේ 2,143 වෙලා 2,000 පහු කරනවා, ඒ නිසා while loop එක අවුරුදු 8කින් නවතිනවා. range(5) කියන්නේ 0 ඉඳන් 4 දක්වා, 5 ඇතුළත් වෙන්නේ නෑ.

---

## 13. Functions

**Why it exists:** without functions you would copy and paste the same lines everywhere, and fix every copy when a bug appears. A function is written once and used many times.

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

**Worked example (a function with a tax rate):**

```python
def add_vat(price, rate=0.18):      # rate has a default of 18%
    return price * (1 + rate)       # 1 + 0.18 = 1.18

add_vat(1000)          # 1000 * 1.18 = 1180.0
add_vat(1000, 0.08)    # 1000 * 1.08 = 1080.0
```

Trace of `add_vat(1000)`: price = 1000, rate = 0.18 (default), result = 1000 × 1.18 = 1180.0, which is sent back to the caller.

**print vs return:** `print` only shows a value on screen. `return` hands the value back so other code can use it. A function that prints but does not return gives `None` when you try to store its result.

**Where you'll meet it in real work:** every ML project has helper functions such as `load_data()`, `clean(df)`, `train(model, data)`. Small named functions make big projects readable and testable.

**Common mistakes:**
- Forgetting `return` (you get `None`).
- Using a mutable default such as `def f(x, items=[])`. The same list is shared between calls. Use `items=None` and create the list inside.
- Expecting a variable made inside a function to exist outside.

> **සිංහලෙන්:** Function එකක් කියන්නේ නමක් දාපු, නැවත නැවත පාවිච්චි කරන code කෑල්ලක්. add_vat(1000) කියලා call කළාම 1000 × 1.18 = 1180 ලැබෙනවා, rate එක දුන්නේ නැත්නම් default 18% පාවිච්චි වෙනවා. print කියන්නේ තිරයේ පෙන්වන එක විතරයි, return කියන්නේ අගය ආපහු දෙන එක. return නැති function එකක් None දෙනවා. Function එක ඇතුළේ හදපු variable එක ඒකට පිටින් පේන්නේ නෑ. ML project එකක load_data(), clean(df) වගේ පොඩි functions ගොඩක් තියෙනවා.

---

## 14. Errors and exceptions

**Why it exists:** real programs meet bad input, missing files and network failures. Handling errors lets the program recover or explain the problem instead of crashing.

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

**Worked example (reading messy numbers safely):**

```python
raw = ["120", "80", "N/A", "45"]
total = 0
for item in raw:
    try:
        total += int(item)         # works for "120", "80", "45"
    except ValueError:
        print("skipping", item)    # "N/A" cannot become an int
print(total)                       # 245
```

Without `try/except`, the program would stop at "N/A" with `ValueError` and you would get no total at all.

**How to read a traceback:** read the last line first (the error type and message), then look upward for the line number in your own file.

**Where you'll meet it in real work:** calling an LLM API can fail with a timeout or rate limit. Production code wraps the call in `try/except` and retries.

**Common mistakes:**
- A bare `except:` that hides every error, including your own typos. Catch specific errors like `ValueError`.
- Using `try/except` to silence an error you never investigated.

> **සිංහලෙන්:** Error එකක් ආවාම කලබල වෙන්න එපා, ඒක කියවන්න පුළුවන් පණිවිඩයක්. අන්තිම පේළිය මුලින් කියවන්න, එකේ error එකේ වර්ගයයි හේතුවයි තියෙනවා. ["120", "80", "N/A", "45"] එකතු කරද්දී "N/A" නිසා int() එක ValueError එකක් දෙනවා, try/except දාලා ඒක මග හැරියොත් මුළු එකතුව 245 ලැබෙනවා. except එකේ නිශ්චිත error එක ලියන්න, හැමදේම හංගන except: එකක් දාන්න එපා. LLM API එකක් timeout වුණාම retry කරන්නත් මේක පාවිච්චි වෙනවා.

---

## 15. Reading and writing files

**Why it exists:** variables vanish when the program ends. Files let you save results, read datasets and share data between programs.

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

**Worked example (a small log file):**

```python
lines = ["Amal,80", "Nisha,92", "John,55"]
with open("scores.txt", "w") as f:      # create the file
    for line in lines:
        f.write(line + "\n")            # one record per line

total = 0
with open("scores.txt") as f:           # read it back
    for line in f:
        name, score = line.strip().split(",")   # "Amal,80" → "Amal", "80"
        total += int(score)             # 80 + 92 + 55
print(total)                            # 227
```

Notice that file text always arrives as strings, so we convert with `int`.

**Mode cheat sheet:** `"r"` read, `"w"` write (erases old content!), `"a"` append, `"rb"`/`"wb"` binary files.

**Where you'll meet it in real work:** reading JSONL training data line by line, saving model results to JSON, loading config files.

**Common mistakes:**
- Opening with `"w"` on a file you wanted to keep. It is wiped immediately.
- `FileNotFoundError` from a wrong path or wrong working folder.
- Forgetting `.strip()` so the `\n` stays on each line.
- Not specifying `encoding="utf-8"` when the text contains Sinhala or Tamil on some systems.

> **සිංහලෙන්:** ගොනු (files) වලට ලියන්නේ program එක නැවතුනාට පස්සෙත් data තියාගන්න. with open("scores.txt", "w") කියලා ලිව්වොත් ගොනුව හැදෙනවා, "r" කියන්නේ කියවන්න, "a" කියන්නේ අගට එකතු කරන්න. "w" දාපුවාම පරණ දේ සම්පූර්ණයෙන් මැකෙනවා, ඒ නිසා පරිස්සම් වෙන්න. ගොනුවකින් කියවන හැම දෙයක්ම text, ඒ නිසා "80" එක එකතු කරන්න කලින් int() කරන්න ඕනේ. සිංහල අකුරු තියෙනවා නම් encoding="utf-8" දාන්න. with පාවිච්චි කළාම ගොනුව ඉබේම වැහෙනවා.

---

## 16. Modules, packages, and pip

**Why it exists:** nobody writes everything from scratch. Other people have already written code for maths, tables, charts and neural networks, and packages let you reuse it with one `import`.

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

**Worked example (use the standard library, then a package):**

```python
import math                          # built in, nothing to install
print(math.sqrt(144))                # 12.0
print(math.ceil(4.2))                # 5 (round up)

import random
random.seed(42)                      # fixed seed → same "random" numbers every run
print(random.randint(1, 6))          # a dice roll between 1 and 6

# pip install pandas   ← in the terminal, once
import pandas as pd                  # now the package is available
```

**Text picture:**

```
 Python itself ─► standard library (math, json, random)   ready to use
                └► packages from PyPI (numpy, pandas...)   pip install first
```

**Where you'll meet it in real work:** a typical ML script starts with 5 to 10 imports. Setting `random.seed(42)` (or the equivalent in NumPy and PyTorch) makes experiments reproducible.

**Common mistakes:**
- `ModuleNotFoundError`: the package is not installed in the environment you are running.
- Installing with one Python and running with another. Check which environment is active.
- Naming your own file `random.py` or `math.py`, which hides the real module.

> **සිංහලෙන්:** Module එකක් කියන්නේ වෙන කෙනෙක් ලියපු code ගොනුවක්, ඒක ඔයාගේ program එකට import කරලා පාවිච්චි කරන්න පුළුවන්. math, json, random වගේ ඒවා Python එක එක්කම එනවා. numpy, pandas වගේ ඒවා pip install කරන්න ඕනේ. import math කරලා math.sqrt(144) කළාම 12.0 ලැබෙනවා. ModuleNotFoundError එකක් ආවොත් ඒ package එක install කරලා නෑ, නැත්නම් වැරදි environment එකක් පාවිච්චි කරනවා. ඔයාගේ ගොනුවට random.py වගේ නමක් දාන්න එපා.

---

## 17. Virtual environments

**Why it exists:** two projects often need different versions of the same package. A virtual environment keeps each project's packages separate so updating one cannot break the other.

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

**Worked example (starting a clean project):**

```bash
mkdir my-ai-project && cd my-ai-project   # a new folder
python -m venv .venv                      # make the environment
source .venv/bin/activate                 # turn it on (prompt shows (.venv))
pip install pandas scikit-learn           # installed only for this project
pip freeze > requirements.txt             # record exact versions
deactivate                                # turn it off
```

Next month, a teammate runs `pip install -r requirements.txt` in a fresh environment and gets the same versions as you.

**Where you'll meet it in real work:** every deployment (Docker image, server) is built from a `requirements.txt` or lock file so the code runs the same everywhere.

**Common mistakes:**
- Forgetting to activate, then installing into the global Python.
- Committing `.venv` to Git. Add it to `.gitignore`; share `requirements.txt` instead.
- Moving or renaming a project folder, which breaks the environment. Recreate it.

> **සිංහලෙන්:** Virtual environment එකක් කියන්නේ project එකකට විතරක් වෙන් කරපු, තනි Python සහ packages තියෙන කාමරයක්. Project A එකට pandas 1.5, project B එකට pandas 2.2 ඕනේ නම්, දෙකම එකම තැනක දැම්මොත් ගැටෙනවා. python -m venv .venv කියලා හදලා, activate කරලා, pip install කළාම ඒ project එකට විතරක් install වෙනවා. pip freeze > requirements.txt කළාම තියෙන versions ටික ගොනුවක සේව් වෙනවා, ඒක යාළුවෙකුට දුන්නාම එයාටත් ඔයාගේ setup එකම හදාගන්න පුළුවන්. .venv ගොනුව Git එකට දාන්න එපා.

---

## 18. Jupyter notebooks and VS Code

**Why it exists:** in data work you try an idea, look at the result, then adjust. Notebooks give that quick loop, while scripts give repeatable, automatable programs.

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

**Notebook vs script:**

| | Notebook (`.ipynb`) | Script (`.py`) |
|---|---|---|
| Best for | exploring, charts, teaching | production, automation |
| Runs | cell by cell | top to bottom |
| Risk | hidden state from running cells out of order | less interactive |
| Typical command | Shift + Enter | `python train.py` |

**Worked example (the hidden-state trap):**

```python
# Cell 1
x = 10
# Cell 2
x = x * 2     # run once: x = 20; run twice: x = 40
```

If you run Cell 2 twice, `x` is 40, and the notebook looks the same as before. The fix is "Restart & Run All" so every cell runs once, in order.

**Where you'll meet it in real work:** a data scientist explores in a notebook (Colab or Kaggle gives a free GPU), then moves the working code into functions in `.py` files so the team can run and test it.

**Common mistakes:**
- Sharing a notebook that only works because of a cell you deleted.
- Putting passwords or API keys in a notebook cell, then uploading it publicly.

> **සිංහලෙන්:** Jupyter notebook එකක් කියන්නේ code, ප්‍රතිඵල සහ සටහන් එකම ලේඛනයක තියෙන තැනක්, cell එකින් එක දුවවන්න පුළුවන්. Data හොයලා බලන්නත්, පාඩම් ඉගෙන ගන්නත් හොඳයි, Google Colab එකේ නොමිලේ GPU එකකුත් ලැබෙනවා. ඒත් cells පිළිවෙලක් නැතුව දුවවුවොත් අමුතු ප්‍රතිඵල එනවා, උදාහරණයක් විදිහට x = x * 2 cell එක දෙපාරක් දුවවුවොත් x = 40 වෙනවා. ඒ නිසා යැවීමට කලින් "Restart & Run All" කරන්න. වැඩ කරන code එක පස්සේ .py script එකකට දාලා python train.py කියලා දුවවනවා. API keys notebook එකේ ලියන්න එපා.

---

## 19. List comprehensions and lambda

**Why it exists:** building a new list from an old one (clean it, filter it, transform it) is one of the most common jobs in data work. A comprehension does it in one readable line.

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

**Worked example (clean a price list, with the long version beside it):**

```python
prices = [100, -5, 250, 0, 80]

# Long way
clean = []
for p in prices:
    if p > 0:
        clean.append(p * 0.9)      # 10% discount

# One line, same result
clean = [p * 0.9 for p in prices if p > 0]
print(clean)    # [90.0, 225.0, 72.0]
```

Trace: 100 → 90.0; -5 skipped; 250 → 225.0; 0 skipped; 80 → 72.0.

**Lambda with sorting:**

```python
students = [("Amal", 84.3), ("Nisha", 91.7), ("John", 55.0)]
students.sort(key=lambda s: s[1], reverse=True)   # highest score first
print(students[0][0])    # Nisha
```

**Where you'll meet it in real work:** cleaning text lists (`[t.lower().strip() for t in texts]`), building batches, and `df["col"].apply(lambda x: ...)` in Pandas.

**Common mistakes:**
- Cramming too much into one comprehension. If you can't read it in one breath, use a normal loop.
- Putting the `if` filter in the wrong place. A filter goes at the end; an `if/else` choice goes at the front: `[x if x > 0 else 0 for x in nums]`.

> **සිංහලෙන්:** List comprehension කියන්නේ ලිස්ට් එකක් හදන loop එකක් එක පේළියකින් ලියන ක්‍රමය. [p * 0.9 for p in prices if p > 0] කියන්නේ "prices වල ධන හැම p එකක්ම 0.9න් ගුණ කරලා ලිස්ට් එකක් හදන්න". [100, -5, 250, 0, 80] දුන්නොත් -5 සහ 0 අයින් වෙලා [90.0, 225.0, 72.0] ලැබෙනවා. Lambda එක කියන්නේ නමක් නැති පොඩි function එකක්, sort කරද්දී key එක විදිහට පාවිච්චි වෙනවා. හැබැයි comprehension එක ඕනෑවට වඩා සංකීර්ණ වුණොත් සාමාන්‍ය loop එකක් ලියන්න.

---

## 20. Classes and objects (OOP)

**Why it exists:** big programs need a way to keep data and the functions that act on it together. Classes also let you make many similar things (many accounts, many models) from one design.

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

**Worked example (trace the bank account):**

```python
acc = BankAccount("Nisha", 100)   # __init__ runs: owner="Nisha", balance=100
acc.deposit(50)                   # balance = 100 + 50 = 150
acc.withdraw(30)                  # 30 <= 150, so balance = 150 - 30 = 120
acc.withdraw(500)                 # 500 > 120 → raises ValueError("Insufficient funds")
```

Data (`balance`) and the rules (`deposit`, `withdraw`) live together, so no code can accidentally make the balance negative without going through the check.

**Words, one more time:**

| Word | Bank example |
|---|---|
| Class | the design of an account |
| Object / instance | Nisha's account |
| Attribute | `acc.balance` |
| Method | `acc.deposit(50)` |
| Inheritance | `SavingsAccount` reuses `BankAccount` and adds interest |

**Where you'll meet it in real work:** `model = LinearRegression()`, `optimizer = Adam(...)`, `tokenizer = AutoTokenizer.from_pretrained(...)` are all objects. In PyTorch, you write `class MyNet(nn.Module)` to define a network.

**Common mistakes:**
- Forgetting `self` as the first parameter of a method.
- Writing `balance = x` instead of `self.balance = x` inside `__init__`, so the data is lost.
- Using inheritance when a plain function would do.

> **සිංහලෙන්:** Class එකක් කියන්නේ සැලැස්මක් (blueprint), object එකක් කියන්නේ ඒ සැලැස්මෙන් හදපු ඇත්ත දෙයක්. BankAccount class එකෙන් Nisha ගේ ගිණුම object එකක් විදිහට හදනවා. බැංකු ගිණුමේ රු. 100ක් තියෙද්දී deposit(50) කළාම 150, withdraw(30) කළාම 120. රු. 500ක් ගන්න හැදුවොත් ශේෂය මදි නිසා error එකක් එනවා. self කියන්නේ "මේ object එකම". ML වලදී LinearRegression() හදලා model.fit() කියන්නේ object එකක method එකක් call කරන එක, PyTorch වලදී nn.Module එකෙන් inherit කරලා network එක හදනවා.

---

## 21. Generators, decorators, type hints

**Why it exists:** these three tools solve problems that appear as soon as your data or code grows: memory that is too small (generators), repeated extra behaviour like timing (decorators), and unclear function inputs (type hints).

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

**Worked example (memory: list vs generator):** to add the numbers 1 to 1,000,000,

```python
total = sum([n for n in range(1, 1_000_001)])   # builds a million-item list in memory first
total = sum(n for n in range(1, 1_000_001))     # generator: one number at a time
print(total)    # 500000500000
```

Both give the same answer (1,000,000 × 1,000,001 ÷ 2 = 500,000,500,000), but the second never holds the whole list.

**Worked example (generator, step by step):**

```python
def count_up_to(n):
    i = 1
    while i <= n:
        yield i
        i += 1

g = count_up_to(2)
next(g)   # 1  (runs until the first yield, then pauses)
next(g)   # 2  (resumes, i becomes 2, yields it)
# next(g) would now raise StopIteration: nothing left
```

**Where you'll meet it in real work:** data loaders yield one batch at a time; streaming LLM responses arrive piece by piece; FastAPI routes use decorators; Pydantic models use type hints to validate JSON.

**Common mistakes:**
- Iterating a generator twice. It is used up after one pass.
- Believing type hints are checked at run time. They are not, unless a tool like mypy or Pydantic checks them.
- Forgetting `return wrapper` in a decorator.

> **සිංහලෙන්:** Generator එකක් කියන්නේ හැම අගයක්ම එකපාර හදන්නේ නැතුව, ඉල්ලන ඉල්ලන වෙලාවට එකින් එක දෙන function එකක්, yield එකෙන් අගය දීලා නවතිනවා. කොත්තු කඩේ වගේ, ඇණවුම ආවාම විතරයි කොත්තු හදන්නේ. 1ත් 1,000,000ත් අතර සංඛ්‍යා එකතු කරද්දී list එකක් හදනවා වෙනුවට generator එකක් පාවිච්චි කළාම memory ඉතුරු වෙනවා, ඒත් උත්තරය 500,000,500,000 ම තමයි. Decorator එක gift wrap එකක් වගේ, function එක වෙනස් කරන්නේ නැතුව අමතර දෙයක් එකතු කරනවා. Type hints run වෙද්දී enforce වෙන්නේ නෑ, ඒත් tools වලට උදව් වෙනවා.

---

## 22. Data structures you should know

**Why it exists:** the same task can be fast or painfully slow depending on how the data is organised. Picking the right structure is often the cheapest speed-up there is.

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

**Worked example (list vs set for membership):** you have 1,000,000 blocked phone numbers and must check each incoming call.

```python
blocked_list = [...]         # list: Python may look at up to 1,000,000 items per check
blocked_set = set(blocked_list)   # set: about 1 step per check

"0771234567" in blocked_set   # fast, however large the set is
```

For 10,000 calls: a list could mean up to 10,000 × 1,000,000 = 10 billion comparisons. A set means about 10,000.

**Worked example (stack vs queue):** tasks A, B, C arrive in that order.
- **Queue (first in, first out):** processed A, B, C. A shop line.
- **Stack (last in, first out):** processed C, B, A. The undo button.

**Where you'll meet it in real work:** `Counter` for word frequencies, a `deque` for a rolling window of recent chat messages, a heap for "top 5 results", dicts for lookup tables.

**Common mistakes:**
- Using a list for repeated `in` checks on big data.
- Using `list.pop(0)` as a queue on big lists; it shifts every item. Use `deque.popleft()`.

> **සිංහලෙන්:** Data structure එකක් කියන්නේ data සංවිධානය කරන විදිහක්, වැරදි එකක් තෝරගත්තොත් වැඩේ ගොඩක් හෙමින් වෙනවා. Block කරපු අංක මිලියනයක් list එකක තියලා හැම ඇමතුමකටම බැලුවොත් උපරිම 1,000,000ක් බලන්න වෙනවා, ඒත් set එකක් නම් එක පාරකින්ම හොයනවා. Queue එක කඩේක පෝලිමක් වගේ (first in, first out), stack එක undo button එක වගේ (last in, first out). Counter එකෙන් වචන ගණන් කරන්න ලේසියි, dict එකෙන් key එකකින් ඉක්මනින් හොයන්න පුළුවන්.

---

## 23. Algorithm speed: Big-O notation

**Why it exists:** a program that works on 100 rows may crawl on 10 million. Big-O gives us a way to predict that before it happens, and to compare two solutions without a stopwatch.

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

**Worked example (count the steps for n = 1,000 and n = 1,000,000):**

| Algorithm | n = 1,000 | n = 1,000,000 | If n grows 1000x |
|---|---|---|---|
| O(1) dict lookup | 1 | 1 | same |
| O(log n) binary search | about 10 | about 20 | 2x more |
| O(n) one loop | 1,000 | 1,000,000 | 1000x more |
| O(n²) double loop | 1,000,000 | 10¹² | 1,000,000x more |

If one step takes a microsecond (0.000001 s): O(n) for a million items takes 1 second, but O(n²) takes 10¹² microseconds = 1,000,000 seconds, about 11.6 days.

**Worked example (comparing every pair):** with 5 items, the double loop in `has_duplicate` makes 4 + 3 + 2 + 1 = 10 comparisons; with 1,000 items it makes about 500,000.

**Where you'll meet it in real work:** the attention in a transformer compares every token with every other token, so doubling the text length makes that part about 4 times more expensive ([file 19](19-transformers.md)). Long-context models need special tricks for this reason.

**Common mistakes:**
- Thinking Big-O gives exact seconds. It describes growth, not speed on your laptop.
- Optimising code that only runs on 20 items. Measure first.
- Hidden loops: `x in my_list` is itself an O(n) loop.

**Exam angle:** NCA-GENL-style questions may mention that self-attention cost grows quadratically with sequence length. This section is the background for that idea.

> **සිංහලෙන්:** Big-O කියන්නේ input එක ලොකු වෙද්දී algorithm එක කොච්චර හෙමින් වෙනවාද කියන එක. O(n) කියන්නේ එක loop එකක්, items මිලියනයක් නම් පියවර මිලියනයක්. O(n²) කියන්නේ loop එකක් ඇතුළේ loop එකක්, items මිලියනයක් නම් පියවර 10¹², ඒක පියවරකට මයික්‍රොතත්පරයක් ගියත් දවස් 11ක් විතර යනවා. Binary search එක O(log n), items මිලියනයකට පියවර 20ක් විතරයි. Transformer එකක attention එක හැම token එකක්ම අනිත් හැම token එකක් එක්කම සසඳන නිසා text දිග දෙගුණයක් කළාම වියදම 4 ගුණයක් විතර වෙනවා.

---

## 24. Mini project

**Why it exists:** reading about code teaches little; writing it teaches a lot. This project joins the pieces from the whole file (functions, loops, dicts, f-strings, files) in one small, real task.

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

**Plan before you code (a good habit):**

```
 students (list of dicts)
      │  for each student
      ▼
 average(scores) ──► grade(avg) ──► print + store in report (list of dicts)
      │
      ▼
 max(report) → top student → save report.json
```

**Check the arithmetic by hand:** Amal: (78 + 85 + 90) ÷ 3 = 253 ÷ 3 = 84.33 → grade A. Nisha: (92 + 88 + 95) ÷ 3 = 275 ÷ 3 = 91.67 → A. John: (55 + 62 + 48) ÷ 3 = 165 ÷ 3 = 55.0 → C. Top: Nisha.

**Extensions to try:**
1. Add a student with an empty `scores` list. What happens? (`ZeroDivisionError`.) Make `average` return 0 in that case.
2. Print the class average of all averages.
3. Ask the user for a name with `input()` and show only that student.

**Where you'll meet it in real work:** the same loop-compute-save shape is behind evaluating a model on several test sets and writing the results to a JSON file.

**Common mistakes:**
- Rounding too early: keep the full average for comparing, round only when printing.
- Using `report.sort()` and expecting a return value.

> **සිංහලෙන්:** මේ පොඩි project එකෙන් ඔයා ඉගෙන ගත්ත හැමදේම එකට පාවිච්චි කරනවා: functions, loops, dict, f-string සහ file. Amal ගේ marks (78, 85, 90) ගත්තොත් සාමාන්‍යය 253 ÷ 3 = 84.3, ඒ නිසා A. John ගේ 165 ÷ 3 = 55.0, ඒ නිසා C. ඉහළම සාමාන්‍යය Nisha ගේ 91.7. සාමාන්‍යය round කරන්නේ print කරද්දී විතරයි, සසඳද්දී සම්පූර්ණ අගයම පාවිච්චි කරන්න. scores හිස් ලිස්ට් එකක් නම් 0න් බෙදීමේ error එකක් එනවා, ඒක හදාගන්නත් උත්සාහ කරන්න.

```quiz
[
  {"q": "What does word[1:4] give when word = \"Python\"?", "options": ["Pyth", "yth", "ytho", "thon"], "answer": 1, "why": "Indexes 1, 2, 3 give y, t, h. The stop index 4 is not included. 'Pyth' would be word[0:4]."},
  {"q": "What is the value of 47 // 10 and 47 % 10?", "options": ["4.7 and 7", "5 and 7", "4 and 7", "4 and 4"], "answer": 2, "why": "// drops the decimal part (4 full groups of 10) and % gives the remainder (7). 4 x 10 + 7 = 47."},
  {"q": "a = [1, 2, 3] and b = a, then b.append(4). What is a?", "options": ["[1, 2, 3]", "[1, 2, 3, 4]", "[4]", "An error"], "answer": 1, "why": "b = a does not copy; both names point to the same list. Use a.copy() for a real copy."},
  {"q": "Which data type is best for counting how many times each word appears?", "options": ["tuple", "dict", "set", "str"], "answer": 1, "why": "A dict maps each word (key) to its count (value). A set would lose the counts because it only stores unique items."},
  {"q": "What does [p * 0.9 for p in [100, -5, 250] if p > 0] produce?", "options": ["[90.0, -4.5, 225.0]", "[90.0, 225.0]", "[100, 250]", "[0.9, 0.9]"], "answer": 1, "why": "-5 fails the p > 0 filter and is skipped; 100 and 250 are multiplied by 0.9. The first option forgets the filter."},
  {"q": "Which code finds out whether a list has duplicates fastest for a very large list?", "options": ["Two nested for loops comparing every pair", "len(set(lst)) != len(lst)", "Sorting and printing the list", "A while loop that never ends"], "answer": 1, "why": "Building a set is about O(n); nested loops are O(n^2), which becomes huge for big lists."},
  {"q": "You see ModuleNotFoundError: No module named 'pandas'. What should you do first?", "options": ["Rewrite your code", "Run pip install pandas in the active environment", "Delete your virtual environment", "Rename the file to pandas.py"], "answer": 1, "why": "The package is simply not installed in the environment you are running. Renaming a file to pandas.py would make things worse."},
  {"q": "If an algorithm is O(n^2) and takes 1 second for 1,000 items, about how long for 10,000 items?", "options": ["10 seconds", "100 seconds", "20 seconds", "1 second"], "answer": 1, "why": "10 times more items means 10^2 = 100 times more work, so about 100 seconds. 10 seconds would be the answer for O(n)."}
]
```

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

**Q9.** A shop has 47 sweets and packs 10 per packet. Write code that gives the number of full packets and the sweets left over.
<details><summary>Answer</summary>`47 // 10` gives `4` full packets and `47 % 10` gives `7` left over (4 x 10 + 7 = 47).</details>

**Q10.** What is wrong with `def f(x, items=[]):` and how do you fix it?
<details><summary>Answer</summary>The default list is created once and shared between calls, so items pile up. Use `items=None` and write `if items is None: items = []` inside the function.</details>

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
| Accumulator | A variable built up inside a loop (a running total or count) |
| Traceback | The error report listing where in the code the error happened |
| Seed | A starting number that makes "random" results repeat the same way each run |

**Next:** [03-developer-tools.md](03-developer-tools.md)
