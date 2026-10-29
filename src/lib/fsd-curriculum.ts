export interface FsdQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FsdTestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface FsdCodingChallenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  functionName: string;
  starterCode: {
    javascript: string;
    typescript: string;
  };
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  testCases: FsdTestCase[];
}

export interface FsdLevel {
  id: string;
  title: string;
  shortDesc: string;
  estimatedMinutes: number;
  order: number;
  requiresCoding: boolean;
  theory: {
    summary: string;
    sections: {
      heading: string;
      content: string;
      codeSnippet?: {
        language: string;
        code: string;
      };
      keyTakeaways?: string[];
    }[];
  };
  quiz: {
    passThreshold: number;
    questions: FsdQuizQuestion[];
  };
  codingChallenge?: FsdCodingChallenge;
}

export interface FsdTopic {
  id: string;
  slug: string;
  title: string;
  iconName: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  order: number;
  description: string;
  levels: FsdLevel[];
}

export const fsdTopics: FsdTopic[] = [
  {
    id: "frontend-react",
    slug: "frontend-react",
    title: "Modern React & Component State",
    iconName: "Layout",
    difficulty: "Beginner",
    order: 1,
    description: "Component component hierarchy, unidirectional data flow, useState immutability, and custom hooks.",
    levels: [
      {
        id: "react-1",
        title: "React State & Immutability",
        shortDesc: "Why state cannot be mutated directly, reconciliation diffing, and batching state updates.",
        estimatedMinutes: 20,
        order: 1,
        requiresCoding: true,
        theory: {
          summary: "React compares object references (shallow comparison) to trigger re-renders. Directly modifying `state.count = 5` fails to change object reference, silently skipping DOM updates.",
          sections: [
            {
              heading: "Immutability & Object Spread",
              content: "Always create fresh references when updating state: `setItems(prev => [...prev, newItem])` or `setUser(prev => ({ ...prev, name: 'Alice' }))`. This preserves historical states and triggers fiber tree reconciliation.",
              codeSnippet: {
                language: "javascript",
                code: "// Correct immutable state update\nconst addItem = (item) => {\n  setItems(prev => [...prev, item]);\n};",
              },
            },
          ],
        },
        quiz: {
          passThreshold: 3,
          questions: [
            {
              id: "q1",
              question: "Why does `arr.push(x)` followed by `setArr(arr)` fail to re-render a React component consistently?",
              options: ["Because the array memory reference did not change, so React thinks state is identical", "Because push is deprecated in JavaScript", "Because React only supports numbers", "Because useState is asynchronous only on weekends"],
              correctIndex: 0,
              explanation: "React performs reference equality checking (`Object.is(prev, next)`). Mutating the existing array keeps the same memory address.",
            },
            {
              id: "q2",
              question: "What is the purpose of the dependency array in `useEffect(fn, [deps])`?",
              options: ["It specifies when the effect callback should re-run based on value changes", "It defines CSS classes", "It binds database tables", "It limits memory usage"],
              correctIndex: 0,
              explanation: "React re-runs the effect callback only if at least one dependency in the array has changed since the previous render.",
            },
            {
              id: "q3",
              question: "What does the 'key' prop do in list rendering `items.map(item => <Row key={item.id} />)`?",
              options: ["Helps React identify which items have changed, been added, or been removed during reconciliation", "Enables CSS styling", "Encrypts the element", "Sets the database primary key"],
              correctIndex: 0,
              explanation: "Keys provide stable identities to DOM nodes across renders, preventing costly re-creation of the whole list.",
            },
            {
              id: "q4",
              question: "What is Prop Drilling in React?",
              options: ["Passing data through multiple layers of intermediate components that do not need it themselves", "Writing SQL queries in props", "Validating TypeScript types", "Using Flexbox layouts"],
              correctIndex: 0,
              explanation: "Prop drilling occurs when props are passed down through components solely to reach a deeply nested child, solved via Context or state stores.",
            },
            {
              id: "q5",
              question: "What hook is used to memoize expensive calculation results between re-renders?",
              options: ["useMemo", "useCallback", "useRef", "useLayoutEffect"],
              correctIndex: 0,
              explanation: "`useMemo` caches the calculated result of a function and recomputes only when dependencies change.",
            },
          ],
        },
        codingChallenge: {
          id: "code-react-1",
          title: "Immutable Query String Builder",
          difficulty: "Easy",
          description: "Write a function `buildQueryString(params)` that takes an object of key-value pairs and returns a valid URL query string (sorted alphabetically by key), omitting keys with null or undefined values.",
          functionName: "buildQueryString",
          starterCode: {
            javascript: "function buildQueryString(params) {\n  const keys = Object.keys(params)\n    .filter(k => params[k] !== null && params[k] !== undefined)\n    .sort();\n  return keys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');\n}",
            typescript: "function buildQueryString(params: Record<string, any>): string {\n  const keys = Object.keys(params)\n    .filter(k => params[k] !== null && params[k] !== undefined)\n    .sort();\n  return keys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');\n}",
          },
          examples: [
            { input: '{"search": "nexora", "page": 1, "filter": null}', output: '"page=1&search=nexora"' },
            { input: '{"role": "admin"}', output: '"role=admin"' },
          ],
          constraints: ["Object contains string or number values"],
          testCases: [
            { input: '{"search": "nexora", "page": 1, "filter": null}', expectedOutput: '"page=1&search=nexora"' },
            { input: '{"role": "admin"}', expectedOutput: '"role=admin"' },
            { input: '{"a": 2, "b": null}', expectedOutput: '"a=2"', isHidden: true },
          ],
        },
      },
    ],
  },
  {
    id: "backend-apis",
    slug: "backend-apis",
    title: "Node.js & REST API Architecture",
    iconName: "Server",
    difficulty: "Intermediate",
    order: 2,
    description: "HTTP verbs, REST constraints, idempotency, middleware pipelines, and error handling conventions.",
    levels: [
      {
        id: "api-1",
        title: "RESTful Conventions & HTTP Methods",
        shortDesc: "Safe vs Idempotent operations, proper HTTP status codes (200, 201, 400, 401, 403, 404, 500).",
        estimatedMinutes: 20,
        order: 1,
        requiresCoding: true,
        theory: {
          summary: "REST architectures structure client-server communication using standard HTTP methods acting on noun resources: GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove).",
          sections: [
            {
              heading: "Idempotency in API Design",
              content: "An operation is idempotent if making multiple identical requests has the same outcome as making a single request. GET, PUT, and DELETE are idempotent. POST is NOT idempotent.",
            },
          ],
        },
        quiz: {
          passThreshold: 3,
          questions: [
            {
              id: "q1",
              question: "Which HTTP status code is most appropriate when a resource is successfully created via POST?",
              options: ["200 OK", "201 Created", "204 No Content", "301 Moved"],
              correctIndex: 1,
              explanation: "201 Created explicitly indicates that the request succeeded and resulted in a new resource.",
            },
            {
              id: "q2",
              question: "What is the difference between 401 Unauthorized and 403 Forbidden?",
              options: ["401 means identity is unauthenticated; 403 means authenticated identity lacks permission", "They are identical", "401 is server error; 403 is client error", "403 means URL not found"],
              correctIndex: 0,
              explanation: "401 asks for authentication credentials; 403 indicates credentials were confirmed but the user does not have permission.",
            },
            {
              id: "q3",
              question: "What is an Idempotent HTTP method?",
              options: ["A method that produces the same server state whether executed 1 time or 100 times", "A method that takes no arguments", "A method that encrypts data", "A method that returns HTML"],
              correctIndex: 0,
              explanation: "Idempotency guarantees that multiple identical calls leave the server in the exact same state (e.g. DELETE or PUT).",
            },
            {
              id: "q4",
              question: "Which of the following is NOT an idempotent operation?",
              options: ["POST", "GET", "PUT", "DELETE"],
              correctIndex: 0,
              explanation: "Sending multiple POST requests typically creates multiple new database records.",
            },
            {
              id: "q5",
              question: "In Express/Node.js, what does the `next()` function call inside middleware do?",
              options: ["Passes control to the next middleware function in the stack", "Restarts the server", "Sends a 200 response immediately", "Closes the database connection"],
              correctIndex: 0,
              explanation: "Calling `next()` triggers the subsequent middleware or route handler in the request pipeline.",
            },
          ],
        },
        codingChallenge: {
          id: "code-backend-1",
          title: "URL Path Parameter Extractor",
          difficulty: "Easy",
          description: "Write a function `matchRoute(pattern, path)` that matches an Express-style route pattern like `'/users/:id/posts/:slug'` against a path `'/users/42/posts/hello'` and returns an object of extracted params `{ id: '42', slug: 'hello' }`. Return `null` if the path doesn't match the pattern structure.",
          functionName: "matchRoute",
          starterCode: {
            javascript: "function matchRoute(pattern, path) {\n  const patParts = pattern.split('/').filter(Boolean);\n  const pathParts = path.split('/').filter(Boolean);\n  if (patParts.length !== pathParts.length) return null;\n  const params = {};\n  for (let i = 0; i < patParts.length; i++) {\n    if (patParts[i].startsWith(':')) {\n      params[patParts[i].slice(1)] = pathParts[i];\n    } else if (patParts[i] !== pathParts[i]) {\n      return null;\n    }\n  }\n  return params;\n}",
            typescript: "function matchRoute(pattern: string, path: string): Record<string, string> | null {\n  const patParts = pattern.split('/').filter(Boolean);\n  const pathParts = path.split('/').filter(Boolean);\n  if (patParts.length !== pathParts.length) return null;\n  const params: Record<string, string> = {};\n  for (let i = 0; i < patParts.length; i++) {\n    if (patParts[i].startsWith(':')) {\n      params[patParts[i].slice(1)] = pathParts[i];\n    } else if (patParts[i] !== pathParts[i]) {\n      return null;\n    }\n  }\n  return params;\n}",
          },
          examples: [
            { input: "'/users/:id', '/users/42'", output: '{"id": "42"}' },
            { input: "'/posts/:category/:id', '/posts/tech/99'", output: '{"category": "tech", "id": "99"}' },
          ],
          constraints: ["Patterns and paths are valid forward-slash routes"],
          testCases: [
            { input: "'/users/:id', '/users/42'", expectedOutput: '{"id":"42"}' },
            { input: "'/posts/:category/:id', '/posts/tech/99'", expectedOutput: '{"category":"tech","id":"99"}' },
            { input: "'/users/:id', '/users/42/extra'", expectedOutput: "null", isHidden: true },
          ],
        },
      },
    ],
  },
  {
    id: "auth-and-security",
    slug: "auth-and-security",
    title: "Web Security, JWT & Sessions",
    iconName: "ShieldCheck",
    difficulty: "Advanced",
    order: 3,
    description: "JWT anatomy, refresh tokens, CORS headers, Cross-Site Scripting (XSS), and CSRF defense.",
    levels: [
      {
        id: "auth-1",
        title: "JWT Anatomy & Stateless Auth",
        shortDesc: "Header, Payload, Signature, base64url encoding, and token validation.",
        estimatedMinutes: 20,
        order: 1,
        requiresCoding: false,
        theory: {
          summary: "A JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. It consists of three parts separated by dots: Header.Payload.Signature.",
          sections: [
            {
              heading: "Why JWTs Are NOT Encrypted By Default",
              content: "A standard JWT is SIGNED, not encrypted. Anyone can decode the payload using base64. The cryptographic signature verifies integrity (the payload was not tampered with), but sensitive secrets (passwords) must never be stored inside the payload.",
            },
          ],
        },
        quiz: {
          passThreshold: 3,
          questions: [
            {
              id: "q1",
              question: "What are the three parts of a JSON Web Token (JWT)?",
              options: ["Header, Payload, Signature", "Username, Password, Hash", "Salt, Nonce, Key", "Algorithm, Token, Cookie"],
              correctIndex: 0,
              explanation: "A JWT consists of Header (algorithm & token type), Payload (claims), and Signature.",
            },
            {
              id: "q2",
              question: "Can anyone decode and read the contents of a standard JWT payload without the secret key?",
              options: ["Yes, because it is only base64url encoded", "No, it is 256-bit encrypted", "Only the server can read it", "Only if HTTPS is off"],
              correctIndex: 0,
              explanation: "Base64url is an encoding format, not encryption. The secret key is only needed to verify or create the signature.",
            },
            {
              id: "q3",
              question: "What HTTP header is standard for transmitting a JWT bearer token?",
              options: ["Authorization: Bearer <token>", "X-Token: <token>", "Authenticate: <token>", "Set-Cookie: <token>"],
              correctIndex: 0,
              explanation: "RFC 6750 specifies the `Authorization: Bearer <token>` header format.",
            },
            {
              id: "q4",
              question: "What does CORS (Cross-Origin Resource Sharing) protect against?",
              options: ["Restricts browsers from making unauthorized cross-origin AJAX requests", "Encrypts database tables", "Stops SQL injections", "Speeds up image loading"],
              correctIndex: 0,
              explanation: "CORS is a browser security mechanism that allows or blocks HTTP requests from a different origin domain.",
            },
            {
              id: "q5",
              question: "What cookie attribute prevents client-side JavaScript (`document.cookie`) from accessing authentication session cookies?",
              options: ["HttpOnly", "SameSite", "Secure", "Domain"],
              correctIndex: 0,
              explanation: "`HttpOnly` cookies cannot be accessed via JavaScript APIs, mitigating XSS session theft.",
            },
          ],
        },
      },
    ],
  },
];

export function getAllFsdLevels() {
  return fsdTopics.flatMap((topic) =>
    topic.levels.map((level) => ({
      topic,
      topicId: topic.id,
      level,
    }))
  );
}

