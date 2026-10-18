// Short code snippets for Code mode (10 per language)
// Indentation is intentional — leading whitespace after \n is auto-skipped.

export const SNIPPETS = {
  javascript: [
    `const add = (a, b) => a + b;\nconst mul = (a, b) => a * b;\nconsole.log(add(3, 4), mul(2, 5));`,

    `async function fetchUser(id) {\n  const res = await fetch(\`/api/users/\${id}\`);\n  return res.json();\n}`,

    `const nums = [1, 2, 3, 4, 5, 6];\nconst result = nums\n  .filter(n => n % 2 === 0)\n  .map(n => n * n)\n  .reduce((a, b) => a + b, 0);`,

    `class Stack {\n  constructor() { this.items = []; }\n  push(x) { this.items.push(x); }\n  pop() { return this.items.pop(); }\n  peek() { return this.items.at(-1); }\n}`,

    `function memoize(fn) {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (!cache.has(key)) cache.set(key, fn(...args));\n    return cache.get(key);\n  };\n}`,

    `const { name, age = 0, ...rest } = person;\nconst updated = { ...person, age: age + 1 };\nconst keys = Object.keys(updated);`,

    `function debounce(fn, ms) {\n  let timer;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), ms);\n  };\n}`,

    `const p = new Promise((resolve, reject) => {\n  setTimeout(() => resolve("done"), 500);\n});\np.then(val => console.log(val));`,

    `const flatten = arr =>\n  arr.reduce((acc, val) =>\n    Array.isArray(val) ? acc.concat(flatten(val)) : [...acc, val],\n  []);`,

    `export default function Button({ label, onClick, disabled = false }) {\n  return (\n    <button onClick={onClick} disabled={disabled}>\n      {label}\n    </button>\n  );\n}`,
  ],

  python: [
    `def greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nprint(greet("world"))\nprint(greet("Alice", "Hi"))`,

    `numbers = [1, 2, 3, 4, 5, 6, 7, 8]\nevens = [x for x in numbers if x % 2 == 0]\nsquares = {x: x**2 for x in evens}`,

    `class Node:\n    def __init__(self, val=0):\n        self.val = val\n        self.next = None\n\n    def __repr__(self):\n        return f"Node({self.val})"`,

    `def fibonacci(n):\n    a, b = 0, 1\n    result = []\n    while a < n:\n        result.append(a)\n        a, b = b, a + b\n    return result`,

    `from functools import wraps\n\ndef log_call(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        print(f"calling {func.__name__}")\n        return func(*args, **kwargs)\n    return wrapper`,

    `data = {"name": "Alice", "scores": [95, 87, 92]}\navg = sum(data["scores"]) / len(data["scores"])\ndata.setdefault("avg", round(avg, 2))`,

    `def gen_primes():\n    seen = set()\n    n = 2\n    while True:\n        if all(n % p != 0 for p in seen):\n            seen.add(n)\n            yield n\n        n += 1`,

    `try:\n    with open("data.txt") as f:\n        lines = [l.strip() for l in f]\nexcept FileNotFoundError:\n    lines = []\nfinally:\n    print(f"loaded {len(lines)} lines")`,

    `words = ["hello", "world", "python"]\nupper = list(map(str.upper, words))\nfiltered = list(filter(lambda w: len(w) > 4, upper))\nprint(", ".join(filtered))`,

    `matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\ntranspose = [[row[i] for row in matrix] for i in range(3)]\nflat = [x for row in matrix for x in row]`,
  ],

  cpp: [
    `int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    return factorial(10);\n}`,

    `#include <vector>\n#include <algorithm>\n\nstd::vector<int> v = {5, 2, 8, 1, 9};\nstd::sort(v.begin(), v.end());\nv.erase(std::unique(v.begin(), v.end()), v.end());`,

    `template <typename T>\nT clamp(T val, T lo, T hi) {\n    return (val < lo) ? lo : (val > hi) ? hi : val;\n}`,

    `struct Point {\n    double x, y;\n    Point(double x, double y) : x(x), y(y) {}\n    double dist(const Point& o) const {\n        return std::sqrt((x-o.x)*(x-o.x)+(y-o.y)*(y-o.y));\n    }\n};`,

    `for (int i = 0; i < 10; ++i) {\n    if (i % 3 == 0) std::cout << "fizz";\n    else if (i % 5 == 0) std::cout << "buzz";\n    else std::cout << i;\n    std::cout << "\\n";\n}`,

    `auto square = [](int x) { return x * x; };\nauto add = [](int a, int b) { return a + b; };\nstd::transform(v.begin(), v.end(), v.begin(), square);`,

    `class Queue {\n    std::deque<int> d;\npublic:\n    void push(int x) { d.push_back(x); }\n    int pop() { int v = d.front(); d.pop_front(); return v; }\n    bool empty() const { return d.empty(); }\n};`,

    `std::string reverse(std::string s) {\n    int l = 0, r = s.size() - 1;\n    while (l < r) std::swap(s[l++], s[r--]);\n    return s;\n}`,

    `std::map<std::string, int> freq;\nfor (const auto& w : words) freq[w]++;\nfor (const auto& [k, v] : freq)\n    std::cout << k << ": " << v << "\\n";`,

    `std::vector<int> merge(std::vector<int> a, std::vector<int> b) {\n    std::vector<int> res;\n    std::merge(a.begin(), a.end(), b.begin(), b.end(),\n               std::back_inserter(res));\n    return res;\n}`,
  ],
};

export function generateCodeChars(language) {
  const pool = SNIPPETS[language] || SNIPPETS.javascript;
  const count = Math.min(5, pool.length);
  const indices = new Set();
  while (indices.size < count) {
    indices.add(Math.floor(Math.random() * pool.length));
  }
  return [...indices].map(i => pool[i]).join('\n\n').split('');
}
