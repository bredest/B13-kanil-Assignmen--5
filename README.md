# 🐛 GitHub Issues Tracker

A simple and efficient GitHub Issues Tracker built with vanilla web technologies. This project allows users to view, search, and filter issues fetched from a live API.

## 🚀 Live Demo & Repository
- **Live Site:** [Insert Live Link Here]
- **GitHub Repository:** [Insert Repository Link Here]

---

## 🛠️ Technology Stack
- **Frontend:** HTML5, CSS3 (Vanilla/Tailwind Design)
- **Logic:** Vanilla JavaScript (ES6+)
- **API:** External Ph-Lab Server

---

## ⚙️ Core Features
- **Secure Login:** Access the tracker using admin credentials.
- **Issue Dashboard:** View a comprehensive list of GitHub issues.
- **Dynamic Filtering:** Filter issues by their status (All, Open, Closed).
- **Real-time Search:** Quickly find specific issues using the search functionality.
- **Detailed View:** Click on any issue to see full details in a modal.
- **Responsive Design:** Fully optimized for both desktop and mobile devices.

---

## 🔑 Demo Credentials
To explore the application, use the following credentials:
- **Username:** `admin`
- **Password:** `admin123`

---

## 📝 JavaScript Concepts (Assignment Part)

### 1️⃣ What is the difference between var, let, and const?
- **`var`**: The traditional way to declare variables. It is function-scoped and can be redeclared and updated. It also undergoes "hoisting," where the declaration is moved to the top of its scope.
- **`let`**: Introduced in ES6, it is block-scoped (limited to the `{}` where it's defined). It can be updated but not redeclared within the same scope.
- **`const`**: Also block-scoped, but it is used for variables that should not be reassigned. Once a value is assigned to a `const`, it cannot be changed (though object properties can still be modified).

### 2️⃣ What is the spread operator (...)?
The **Spread Operator** allows an iterable (like an array or object) to be expanded in places where multiple arguments or elements are expected. It is commonly used for:
- **Copying arrays/objects:** `const newArr = [...oldArr];`
- **Merging:** `const combined = [...arr1, ...arr2];`
- **Passing arguments:** `Math.max(...numbers);`

### 3️⃣ What is the difference between map(), filter(), and forEach()?
- **`forEach()`**: Iterates through an array and executes a function for each element. It returns `undefined` and is used for side effects (like logging).
- **`map()`**: Iterates through an array and returns a **new array** containing the results of the function applied to every element.
- **`filter()`**: Iterates through an array and returns a **new array** containing only the elements that pass a specific condition (return `true`).

### 4️⃣ What is an arrow function?
An **Arrow Function** is a more concise syntax for writing function expressions introduced in ES6. 
- Syntax: `const add = (a, b) => a + b;`
- Key Difference: They do not have their own `this` context; they inherit `this` from the parent scope (lexical scoping), making them ideal for callbacks.

### 5️⃣ What are template literals?
**Template Literals** are string literals that allow embedded expressions. They use backticks (`` ` ``) instead of quotes.
- **Multi-line strings:** You can create strings spanning multiple lines without `\n`.
- **Interpolation:** You can embed variables or expressions directly using `${expression}` syntax.

---

## 🛠️ Implementation Details
- **API Endpoints handled:**
    - `All Issues`: Fetching all data from the PHP lab server.
    - `Search`: Implementing query-based searching.
- **UI Logic:**
    - Green top border for **Open** issues.
    - Purple top border for **Closed** issues.
    - Loading states handled with a spinner.
