# 🐍 Chapter 2 — Variables, Data Types, Operators & Input

> **Course:** Complete Python Course (CodeWithHarry)  
> **"Yahan se aapka asli Python shuru hota hai."** — Harry Bhai  
> **After this chapter:** Tum data store, compare, calculate kar sakte ho aur user se input le sakte ho.

---

## 1. 📦 Variable kya hota hai?

**Variable = Ek container (dabba) jisme hum data store karte hain.**

Jaise kitchen mein:
- Lal dabbe mein → Cheeni
- Neele dabbe mein → Dal

Usi tarah:
```python
a = 1      # 'a' container mein 1 store ho gaya
b = 2      # 'b' container mein 2 store ho gaya
print(a + b)   # Output: 3
```

> **Technical definition:** Variable = Name given to a memory location in a program.  
> RAM mein `a` naam ki location pe `1` store hota hai.

---

## 2. 🗂️ Data Types — Kitne Tarah ka Data Hota Hai?

Python mein **5 main (primitive) data types** hote hain:

| Data Type | Kya Hota Hai | Example |
|-----------|-------------|---------|
| `int` | Whole numbers (bina decimal) | `1`, `34`, `-100` |
| `float` | Numbers with decimal point | `7.22`, `3.14`, `-0.5` |
| `str` | Text / characters (double ya single quotes mein) | `"Harry"`, `'hello'` |
| `bool` | Sirf True ya False | `True`, `False` |
| `NoneType` | Kuch bhi nahi — emptiness | `None` |

### Code mein dekho:
```python
a = 1           # int
b = 5.22        # float
c = "Harry"     # str  (double quotes mein = string)
d = True        # bool (capital T)
e = None        # NoneType

print(a)   # 1
print(b)   # 5.22
print(c)   # Harry
print(d)   # True
print(e)   # None
```

### Boolean ke baare mein:
```python
is_raining = True
is_sunny   = False

# Kab use karte hain? Jab sirf haan ya na store karni ho.
# E.g., is_logged_in = True
```

### None ke baare mein:
```python
result = None
# Matlab: abhi tak koi value nahi hai is variable mein
# False nahi hai — "empty" hai, alag cheez hai
```

---

## 3. 📏 Variable Naming Rules — Kya valid hai?

### ✅ Valid Names:
```python
a = 10
name = "Harry"
my_name = "Khushal"
_count = 5
value1 = 100
userName = "admin"      # camelCase bhi valid
```

### ❌ Invalid Names (Error ayega):
```python
1value = 10       # ❌ Number se start nahi ho sakta
my name = 10      # ❌ Space nahi ho sakta
@rate = 10        # ❌ Special characters (except _) nahi
my-value = 10     # ❌ Hyphen nahi (underscore hona chahiye)
```

### 4 Rules yaad rakho:
```
1. Alphabets (a-z, A-Z), Digits (0-9), Underscore (_) allowed
2. Start sirf Alphabet ya Underscore se (number se nahi!)
3. Koi whitespace (space) allowed nahi
4. Special characters allowed nahi (@, #, -, etc.) — sirf _ allowed
```

> 💡 **Best Practice:** Descriptive names use karo → `user_age` is better than `x` 

---

## 4. ➕ Operators — Calculations & Comparisons

### 4.1 Arithmetic Operators (Math Operations)

```python
a = 10
b = 3

print(a + b)    # 13  → Addition
print(a - b)    # 7   → Subtraction
print(a * b)    # 30  → Multiplication
print(a / b)    # 3.333... → Division (always returns float)
print(a // b)   # 3   → Floor Division (integer result)
print(a % b)    # 1   → Modulus (remainder)
print(a ** b)   # 1000 → Exponent (a to the power b)
```

> **`**` = Power operator** → `2 ** 10 = 1024`  
> `a^2` writing is WRONG in Python. Use `a ** 2` ✅

### 4.2 Assignment Operators

```python
b = 6           # Assign 6 to b

b += 3          # Same as: b = b + 3  → b is now 9
b -= 3          # Same as: b = b - 3  → b is now 6
b *= 3          # Same as: b = b * 3  → b is now 18
b /= 3          # Same as: b = b / 3  → b is now 6.0
b **= 2         # Same as: b = b ** 2 → b is now 36.0
```

```python
# Real example:
score = 100
score += 10     # Player ne 10 points kamaye
print(score)    # 110
```

### 4.3 Comparison Operators (Always return True or False!)

```python
a = 5
b = 4

print(a > b)    # True   → Greater than
print(a < b)    # False  → Less than
print(a >= b)   # True   → Greater than or equal to
print(a <= b)   # False  → Less than or equal to
print(a == b)   # False  → Equal to (double =)
print(a != b)   # True   → Not equal to
```

> ⚠️ **Biggest beginner mistake:**  
> `=` → Assignment (variable mein value daalna)  
> `==` → Comparison (kya dono equal hain?)

```python
a = 5       # a mein 5 daalo
a == 5      # kya a 5 ke barabar hai? → True
```

### 4.4 Logical Operators (and, or, not)

#### `and` — Dono conditions True hongi tabhi True
```python
print(True and True)    # True
print(True and False)   # False
print(False and False)  # False
```

**Real example:**
```python
age = 20
has_id = True
can_enter = age >= 18 and has_id     # True (dono conditions true hain)
```

#### `or` — Dono mein se ek True hoga toh True
```python
print(True or False)    # True
print(False or False)   # False
print(True or True)     # True
```

**Real example:**
```python
is_weekend = True
is_holiday = False
can_play = is_weekend or is_holiday   # True (ek bhi true hai)
```

#### `not` — Ulta kar do
```python
print(not True)    # False
print(not False)   # True
```

**Trick to remember:**
> "Haar ke bhi jeetne wale ko bajigir kehte hain,  
> aur jo True ko False aur False ko True bana de use `not` kehte hain." 😄

### Truth Table (Yaad kar lo):

| A | B | A and B | A or B | not A |
|---|---|---------|--------|-------|
| True | True | True | True | False |
| True | False | False | True | False |
| False | True | False | True | True |
| False | False | False | False | True |

---

## 5. 🔍 `type()` Function — Variable ka Type Pata Karo

```python
a = 1
print(type(a))       # <class 'int'>

b = 5.22
print(type(b))       # <class 'float'>

c = "Harry"
print(type(c))       # <class 'str'>

d = True
print(type(d))       # <class 'bool'>

e = None
print(type(e))       # <class 'NoneType'>
```

### Interesting case:
```python
x = "31.2"            # Yeh float NAHI hai — double quotes ke andar hai!
print(type(x))        # <class 'str'>  ← String hai!
```

---

## 6. 🔄 Type Casting — Data Type Badalna

Ek type se dusre mein convert karna = **Type Casting / Type Conversion**

```python
# str → int
a = "42"
b = int(a)
print(type(b))    # <class 'int'>
print(b + 8)      # 50  ✅ ab math ho sakti hai

# str → float
x = "3.14"
y = float(x)
print(type(y))    # <class 'float'>

# int → str
n = 100
s = str(n)
print(type(s))    # <class 'str'>
print(s + "!")    # "100!" ✅ ab concatenation ho sakti hai

# int → float
p = 5
q = float(p)
print(q)          # 5.0
```

### Invalid conversions — Error aayega:
```python
int("Harry")      # ❌ ValueError — "Harry" koi number nahi hai
int("3.14")       # ❌ ValueError — float string ko int mein directly nahi bata sakte
float("abc")      # ❌ ValueError
```

### Valid workaround:
```python
x = "3.14"
y = float(x)     # pehle float bano
z = int(y)       # phir int bano
print(z)         # 3
```

---

## 7. ⌨️ `input()` Function — User Se Input Lena

```python
name = input("Enter your name: ")
print("Hello,", name)
```

**Run karo:**
```
Enter your name: Khushal
Hello, Khushal
```

### ⚠️ CRITICAL — input() HAMESHA string return karta hai!

```python
a = input("Enter number 1: ")
b = input("Enter number 2: ")
print(a + b)
```

**User ne diya:** `1` aur `2`  
**Expected:** `3`  
**Actual Output:** `12` ← STRING CONCATENATION! 😱

### Kyun? Kyunki:
```python
# "1" + "2" = "12"  (string + string = concatenation!)
# 1 + 2 = 3         (int + int = addition!)
```

### FIX — int() ya float() use karo:
```python
a = int(input("Enter number 1: "))
b = int(input("Enter number 2: "))
print(a + b)    # Ab 3 aayega ✅
```

```python
# Float input ke liye:
a = float(input("Enter price: "))
b = float(input("Enter tax: "))
print("Total:", a + b)
```

---

## 8. 🎯 Complete Real Program — Trip Expense Splitter

```python
# Trip mein 3 dost hain — expenses equally split karo

print("=== Trip Expense Splitter ===")

total = float(input("Enter total expense (₹): "))
people = int(input("How many people? "))

share = total / people

print("Each person should pay: ₹", share)
```

**Output:**
```
=== Trip Expense Splitter ===
Enter total expense (₹): 3000
How many people? 3
Each person should pay: ₹ 1000.0
```

---

## 9. 💡 VS Code Tips (Harry Bhai ke tips)

### Multi-cursor feature:
- `Alt + Click` → Multiple cursors bana sakte ho
- Ek baar mein multiple jagah type kar sakte ho

### Line duplicate karo:
- `Alt + Shift + ↓` → Current line duplicate ho jaati hai neeche

### Comment toggle:
- `Ctrl + /` → Line comment/uncomment toggle

---

## 🏋️ Practice Set — Chapter 2

### Q1. Do numbers add karo
```python
a = 15
b = 25
print("Sum:", a + b)
# Output: Sum: 40
```

---

### Q2. Remainder nikalo (Modulus Operator)
```python
a = 34
b = 5
print("Remainder when", a, "is divided by", b, "is:", a % b)
# Output: Remainder when 34 is divided by 5 is: 4
```

---

### Q3. `input()` se variable ka type check karo
```python
a = input("Enter a value: ")
print("Type of a:", type(a))
# Chahe kuch bhi daalo — hamesha <class 'str'> aayega!
```

---

### Q4. User se 2 numbers lo aur check karo — pehla bada hai ya nahi
```python
a = int(input("Enter number 1: "))
b = int(input("Enter number 2: "))
print("Is a greater than b?", a > b)
# True ya False print hoga
```

---

### Q5. Do numbers ka average nikalo
```python
a = int(input("Enter number 1: "))
b = int(input("Enter number 2: "))
average = (a + b) / 2     # Bracket lagana zaroori hai!
print("Average:", average)
```

---

### Q6. Kisi number ka square nikalo
```python
n = int(input("Enter a number: "))
print("Square of", n, "is:", n ** 2)
# n * n bhi valid hai, ** 2 use karo for powers
```

---

### Q7. Temperature Converter (Bonus — khud banao!)
```python
celsius = float(input("Enter temperature in Celsius: "))
fahrenheit = (celsius * 9/5) + 32
print("In Fahrenheit:", fahrenheit)
```

---

## ⚡ Quick Revision — Chapter 2

```
✅ Variable = Container to store data (a = 10)
✅ 5 main types: int, float, str, bool, NoneType
✅ int → whole numbers | float → decimal numbers
✅ str → text in " " or ' ' | bool → True/False | None → empty
✅ = is assignment | == is comparison (NEVER confuse these!)
✅ Arithmetic: + - * / // % **  (** = power, not ^)
✅ Assignment: += -= *= /= **= 
✅ Comparison: > < >= <= == !=  (always returns bool)
✅ Logical: and (both true) | or (one true) | not (reverse)
✅ type() → kisi bhi variable ka data type pata karo
✅ Type casting: int() float() str() bool()
✅ input() HAMESHA string return karta hai — int() ya float() wrap karo!
✅ str + str = concatenation ("1"+"2" = "12")
✅ int + int = addition (1+2 = 3)
```

---

## 🔗 What's Next?

**Chapter 3 → Strings**  
Strings ke andar deep dive karenge — methods, slicing, formatting, f-strings — sab kuch! Text manipulation Python mein bahut powerful hai.

---

> 💡 **Pro Tip:** Jab bhi code mein unexpected output aaye — pehle `type()` se check karo. 90% bugs type mismatch ki wajah se hote hain! 🔥
