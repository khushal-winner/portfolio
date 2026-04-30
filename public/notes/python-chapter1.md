# 🐍 Chapter 1 — Setup, First Program, Modules, pip & Comments

> **Course:** Complete Python Course (CodeWithHarry)  
> **Goal:** Environment ready karo, pehla program chalao, modules/pip/comments samjho  
> **After this chapter:** You can write & run Python programs, install packages, and understand code structure.

---

## 1. 🤔 What is Programming?

Jaise hum dosto se baat karne ke liye Hindi/English use karte hain,  
**waise hi computer se baat karne ke liye Programming Languages use karte hain.**

> Computer ko seedha bol nahi sakte — _"bhai do numbers add kar do"_  
> Iske liye ek **proper program likhna padta hai** ek programming language mein.

Popular languages: Python, C, C++, Java, JavaScript, Go, Ruby  
**Hum sikhenge: Python** ✅

### Why Python?
- Simple hai — almost **plain English jaisi lagti hai**
- Open source — **bilkul free**
- Use hoti hai: Web dev, Data Science, AI/ML, Automation, Scripting
- Industry mein most popular beginner language

---

## 2. ⚙️ Setup — Python + VS Code Install Karo

### Step 1: Python Install karo
1. Google karo: **"download python"** → python.org pe jao
2. Latest version download karo (3.12+)
3. Installer mein **✅ "Add Python to PATH"** check karna ZAROOR karo
4. "Install Now" click karo → Done ✅

### Step 2: VS Code Install karo
1. Google karo: **"download VS Code"**
2. Download → Install karo
3. Installation mein **saare checkboxes tick karo** (especially "Open with Code")
4. VS Code open hoga automatically

### Step 3: VS Code mein Python Extension lagao
1. Left sidebar mein **Extensions** (puzzle icon) click karo
2. Search karo: **"Python"** → Microsoft wali install karo

### Step 4: Important Setting — Mouse Wheel Zoom
- Settings mein search karo: **"Mouse Wheel Zoom"** → Enable karo ✅

### Step 5: Auto Save On karo
- File → Auto Save ✅ (ab Ctrl+S har baar press nahi karna padega)

---

## 3. 📁 Organized Folder Structure Banao

```
MyPythonCourse/
├── chapter1/
│   ├── first.py
│   └── module_demo.py
├── chapter2/
...
```

**How to open folder in VS Code:**  
Right click on folder → "Open with Code" → VS Code us folder mein open ho jayega

---

## 4. 🟢 First Python Program — Hello World!

VS Code mein new file banao: `first.py` 

```python
print("Hello World!")
```

### Run karo:
- VS Code mein **Terminal** open karo (menu → Terminal → New Terminal)
- Type karo:

```bash
python first.py
```

**Output:**
```
Hello World!
```

🎉 **Congratulations — aapne apna pehla Python program run kar diya!**

### `print()` kya karta hai?
- Screen pe kuch bhi dikhata hai
- Jo bhi double quotes `" "` ke andar likhoge, woh print ho jayega

```python
print("Hello World!")       # Hello World!
print("Mera naam Khushal hai")   # Mera naam Khushal hai
print(5 + 3)                # 8  (numbers bhi print ho sakte hain!)
```

---

## 5. 📄 .py Extension kya hoti hai?

Jaise:
- Movies → `.mp4` 
- Games → `.exe` 
- Python files → **`.py`**

Jab bhi Python program likhoge — file ka naam `.py` extension ke saath rakho.  
Example: `hello.py`, `calculator.py`, `jarvis.py` 

---

## 6. 🔁 REPL — Python ka Calculator Mode

Terminal mein sirf `python` type karo (bina file ke):

```bash
python
```

Ab directly calculations likh sakte ho:

```python
>>> 5 + 6
11
>>> 4 * 2
8
>>> 10 / 3
3.3333333333333335
>>> print("Hello")
Hello
```

**REPL = Read → Evaluate → Print → Loop**  
(Padhta hai → Calculate karta hai → Print karta hai → Dobara poochta hai)

> Exit karne ke liye type karo: `exit()` ya Ctrl+Z

---

## 7. 📦 Module kya hota hai?

**Module = Kisi aur ka likha hua code, jo hum apne program mein use kar sakte hain.**

> Sochो — agar tumhe 5 numbers ka Harmonic Mean nikalna ho, tum scratch se math likho ge ya kisi ka bana hua code use karo ge?

**Module use karo = life easy ho jati hai** 🎯

### 2 Types of Modules:

| Type | Kya hai | Example |
|------|---------|---------|
| **Built-in** | Python ke saath hi aata hai, install nahi karna | `os`, `math`, `random` |
| **External** | Alag se install karna padta hai pip se | `flask`, `django`, `pyjokes` |

---

## 8. 📮 pip — Package Manager

**pip = Python ka "App Store"**  
Koi bhi external module install karna ho → pip use karo

### Syntax:
```bash
pip install module_name
```

### Examples:
```bash
pip install flask        # Web framework install karo
pip install django       # Another web framework
pip install pyjokes      # Fun jokes module
pip install pyttsx3      # Text to Speech module
```

### Module use karna (import):
```python
import pyjokes

joke = pyjokes.get_joke()
print(joke)
```

**Output (random joke milega):**
```
What's the object-oriented way to become wealthy? Inheritance.
```

> Har baar run karo → naya joke milega! 😄

---

## 9. 🔧 Built-in Module — `os` (Real Project Example)

`os` module se aap **computer ki files aur folders list** kar sakte ho — bina extra install kiye!

```python
import os

# Current directory ke saare files/folders print karo
directory_path = "."   # "." matlab current folder
entries = os.listdir(directory_path)

for entry in entries:
    print(entry)
```

**Output (jo bhi files/folders honge):**
```
chapter1
chapter2
first.py
module_demo.py
```

> Real projects mein `os` module bahut kaam aata hai — file paths, directories, environment variables sab kuch handle karta hai.

---

## 10. 💬 Comments — Code mein Notes likhna

**Comment = Woh line jo Python IGNORE kar deta hai**

Use karte hain:
- Code explain karne ke liye (doosre developers ke liye)
- Temporarily koi line "off" karne ke liye
- Apne future self ke liye notes likhne ke liye

### Type 1: Single Line Comment — `#` use karo

```python
# Yeh comment hai — Python isko ignore karega
print("Hello")   # Yeh bhi comment hai (line ke end mein)

# import pyjokes  ← Yeh line "off" hai, chalegi nahi
```

**VS Code shortcut:** `Ctrl + /` → selected lines comment/uncomment ho jaati hain

### Type 2: Multi-line Comment — Triple Quotes

```python
"""
Yeh ek
multi-line comment hai.
Saari lines ignore hongi.
"""

print("Yeh print hoga")  # Sirf yeh chalega
```

```python
'''
Single quotes se bhi
multi-line comment
likh sakte hain.
'''
```

### Important Note 🔑
> Aajkal VS Code jaisi IDE hone ki wajah se, **zyada programmers sirf single-line comments use karte hain** — multiple lines ke liye bhi `Ctrl+/` se select karke ek saath comment kar lete hain.

---

## 11. 🤖 AI (ChatGPT/Claude) ka Smart Use

Course mein Harry bhai ne dikhaya: **AI ko ek tool ki tarah use karo — cheating nahi, assistance!**

```
Prompt example:
"Write a Python program to print contents of a directory using os module"
```

> AI ne code diya → Hum use samjhe → Apne project mein use kiya ✅

**Rule:** Pehle khud sochne ki koshish karo. Phir AI use karo.  
Jab tak Chapter 4-5 nahi aata, AI pe zyada depend mat karo.

---

## 12. 🎯 Complete Example — Sab Ek Saath

```python
# ============================================
# Chapter 1 - Complete Demo Program
# ============================================

# Built-in module import karo
import os

# External module import karo (pehle: pip install pyjokes)
import pyjokes

# Single line comment - yeh print hoga
print("=== Welcome to Python ===")

"""
Yeh ek multi-line comment hai.
Yeh sab kuch print nahi hoga.
"""

# Joke print karo using external module
joke = pyjokes.get_joke()
print("Random Joke:", joke)

# os module se current directory list karo
print("\nFiles in current folder:")
entries = os.listdir(".")
for entry in entries:
    print(" -", entry)

print("=== Program Complete ===")
```

**Output:**
```
=== Welcome to Python ===
Random Joke: Why do Java developers wear glasses? Because they don't C#!
Files in current folder:
 - first.py
 - module_demo.py
=== Program Complete ===
```

---

## 🏋️ Practice Set — Chapter 1

### Q1. Twinkle Twinkle print karo
Ek program likho jo **Twinkle Twinkle Little Star** poem print kare.

```python
# Solution:
print("""Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky.""")
```

---

### Q2. REPL se Table of 5 print karo
Terminal mein `python` type karo aur manually 5 ki table print karo:

```python
>>> 5 * 1
5
>>> 5 * 2
10
>>> 5 * 3
15
# ... aur aage
```

---

### Q3. Koi bhi external module install karo aur use karo

```bash
pip install pyttsx3
```

```python
import pyttsx3

engine = pyttsx3.init()
engine.say("Hello! I am speaking using Python!")
engine.runAndWait()
```

> Yeh actually aapke speakers se bolega! 🔊

---

### Q4. `os` module se apne folder ki files print karo

```python
import os

path = "."   # Current folder
for item in os.listdir(path):
    print(item)
```

---

## ⚡ Quick Revision — Chapter 1

```
✅ Python = Computer se baat karne ki language (simple, free, powerful)
✅ .py extension → Python files ka format
✅ print() → Screen pe output dikhata hai
✅ REPL → Terminal mein directly Python chalane ka mode
✅ Module → Kisi aur ka ready-made code jo hum use karte hain
✅ pip → External modules install karne ka tool (pip install xyz)
✅ import → Module ko apne program mein laane ka keyword
✅ # → Single line comment (Python ignore karta hai)
✅ """ """ ya ''' ''' → Multi-line comment
✅ Built-in modules (os, math) → Already installed hain
✅ External modules (flask, pyjokes) → pip se install karte hain
```

---

## 🔗 What's Next?

**Chapter 2 → Variables & Data Types**  
Ab hum seekhenge ki Python mein data kaise store karte hain — numbers, text, true/false — sab kuch!

---

> 💡 **Pro Tip:** Har chapter ke baad practice problems zaroor karo. Theory padh ke code likha — tabhi asli seekhna hota hai. Errors aayenge — Google karo, AI se poocho, par khud solve karo! 🔥
