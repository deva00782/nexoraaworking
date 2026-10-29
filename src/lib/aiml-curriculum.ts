export interface AimlQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AimlTestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface AimlCodingChallenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  functionName: string;
  starterCode: {
    python: string;
    javascript: string;
  };
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  testCases: AimlTestCase[];
}

export interface AimlLevel {
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
      mathFormula?: string;
    }[];
  };
  quiz: {
    passThreshold: number;
    questions: AimlQuizQuestion[];
  };
  codingChallenge?: AimlCodingChallenge;
}

export interface AimlTopic {
  id: string;
  slug: string;
  title: string;
  iconName: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  order: number;
  description: string;
  levels: AimlLevel[];
}

export const aimlTopics: AimlTopic[] = [
  {
    id: "python-ai-math",
    slug: "python-ai-math",
    title: "Python & Vector Math for AI",
    iconName: "Binary",
    difficulty: "Beginner",
    order: 1,
    description: "Vectorized arithmetic with NumPy, broadcasting, matrix dot products, and Euclidean norms.",
    levels: [
      {
        id: "vector-math-1",
        title: "Vectors & Euclidean Norms",
        shortDesc: "Vector representation, element-wise addition, dot products, and Euclidean distance in N-dimensions.",
        estimatedMinutes: 20,
        order: 1,
        requiresCoding: true,
        theory: {
          summary: "In modern AI, data points (images, text embeddings, user profiles) are modeled as high-dimensional vectors. Measuring distance and similarity between vectors is the cornerstone of retrieval and classification.",
          sections: [
            {
              heading: "Vector Magnitude & Euclidean Distance",
              content: "The Euclidean distance between two vectors u and v in R^N is the square root of the sum of squared coordinate differences: d(u, v) = sqrt(sum((u_i - v_i)^2)).",
              codeSnippet: {
                language: "python",
                code: "import math\n\ndef euclidean_distance(u, v):\n    return math.sqrt(sum((a - b) ** 2 for a, b in zip(u, v)))",
              },
              keyTakeaways: [
                "Vectors with low distance represent semantically similar concepts.",
                "Vectorization replaces slow Python loops with SIMD hardware instructions.",
              ],
            },
          ],
        },
        quiz: {
          passThreshold: 3,
          questions: [
            {
              id: "q1",
              question: "What is the Euclidean distance between points (0, 0) and (3, 4)?",
              options: ["5", "7", "25", "1"],
              correctIndex: 0,
              explanation: "sqrt((3 - 0)² + (4 - 0)²) = sqrt(9 + 16) = sqrt(25) = 5.",
            },
            {
              id: "q2",
              question: "What does the Dot Product of two orthogonal (perpendicular) non-zero vectors equal?",
              options: ["1", "0", "-1", "Infinity"],
              correctIndex: 1,
              explanation: "Orthogonal vectors have an angle of 90 degrees; cos(90°) = 0, so u · v = 0.",
            },
            {
              id: "q3",
              question: "Why is NumPy faster than standard Python lists for matrix operations?",
              options: ["It executes in contiguous C-level memory with SIMD vectorization", "It uses multi-threading automatically for prints", "It converts floats to strings", "It skips mathematical precision"],
              correctIndex: 0,
              explanation: "NumPy arrays are stored in contiguous memory buffers without Python object pointer overhead, running compiled C/Fortran routines.",
            },
            {
              id: "q4",
              question: "What is NumPy 'Broadcasting'?",
              options: ["Streaming data over a network", "Allowing element-wise operations between arrays of different compatible shapes", "Converting integers to booleans", "Plotting graphs"],
              correctIndex: 1,
              explanation: "Broadcasting describes how NumPy treats arrays with different shapes during arithmetic operations without making unneeded copies.",
            },
            {
              id: "q5",
              question: "What is the shape of a vector with 512 dimensions?",
              options: ["(512,)", "(1, 512, 1)", "(512, 512)", "Scalar"],
              correctIndex: 0,
              explanation: "A 1-dimensional array with 512 items has shape tuple `(512,)`.",
            },
          ],
        },
        codingChallenge: {
          id: "code-vector-math-1",
          title: "Euclidean Distance",
          difficulty: "Easy",
          description: "Given two 1D numeric vectors `u` and `v` of equal length, calculate and return their Euclidean distance rounded to 2 decimal places.",
          functionName: "euclideanDistance",
          starterCode: {
            python: "def euclideanDistance(u, v):\n    import math\n    dist = math.sqrt(sum((a - b) ** 2 for a, b in zip(u, v)))\n    return round(dist, 2)",
            javascript: "function euclideanDistance(u, v) {\n  let sum = 0;\n  for (let i = 0; i < u.length; i++) {\n    sum += Math.pow(u[i] - v[i], 2);\n  }\n  return Math.round(Math.sqrt(sum) * 100) / 100;\n}",
          },
          examples: [
            { input: "[0, 0], [3, 4]", output: "5", explanation: "sqrt(3^2 + 4^2) = 5.0" },
            { input: "[1, 2, 3], [4, 6, 8]", output: "7.07" },
          ],
          constraints: ["1 <= len(u) == len(v) <= 1000", "-1000 <= u[i], v[i] <= 1000"],
          testCases: [
            { input: "[0, 0], [3, 4]", expectedOutput: "5" },
            { input: "[1, 2, 3], [4, 6, 8]", expectedOutput: "7.07" },
            { input: "[1, 1], [1, 1]", expectedOutput: "0", isHidden: true },
          ],
        },
      },
    ],
  },
  {
    id: "classical-ml",
    slug: "classical-ml",
    title: "Foundational Machine Learning",
    iconName: "TrendingUp",
    difficulty: "Beginner",
    order: 2,
    description: "Loss functions, Gradient Descent, Linear Regression, and Logistic Regression with Sigmoid classification.",
    levels: [
      {
        id: "classical-ml-1",
        title: "Logistic Regression & Sigmoid",
        shortDesc: "Binary classification, mapping real numbers into probabilities using the Sigmoid activation function.",
        estimatedMinutes: 20,
        order: 1,
        requiresCoding: true,
        theory: {
          summary: "Logistic Regression predicts the probability P(y = 1 | x) of a binary outcome. It applies the non-linear Sigmoid activation function sigma(z) = 1 / (1 + e^(-z)) to a linear combination of inputs z = w^T * x + b.",
          sections: [
            {
              heading: "The Sigmoid Activation Property",
              content: "As z approaches +infinity, sigma(z) approaches 1.0. As z approaches -infinity, sigma(z) approaches 0.0. When z = 0, sigma(z) = 0.5 (the standard decision boundary threshold).",
              codeSnippet: {
                language: "python",
                code: "import math\n\ndef sigmoid(z):\n    return round(1.0 / (1.0 + math.exp(-z)), 4)",
              },
            },
          ],
        },
        quiz: {
          passThreshold: 3,
          questions: [
            {
              id: "q1",
              question: "What is the output range of the Sigmoid activation function?",
              options: ["(0, 1)", "[-1, 1]", "[0, +Infinity)", "(-Infinity, +Infinity)"],
              correctIndex: 0,
              explanation: "Sigmoid maps any real-valued number into open interval (0, 1), representing a valid probability.",
            },
            {
              id: "q2",
              question: "What value does Sigmoid return when input z = 0?",
              options: ["0.0", "0.5", "1.0", "-0.5"],
              correctIndex: 1,
              explanation: "1 / (1 + e^0) = 1 / (1 + 1) = 1 / 2 = 0.5.",
            },
            {
              id: "q3",
              question: "What loss function is used to train Logistic Regression models?",
              options: ["Binary Cross-Entropy (Log Loss)", "Mean Squared Error", "Hinge Loss", "Mean Absolute Error"],
              correctIndex: 0,
              explanation: "Binary Cross-Entropy (Log Loss) penalizes confident wrong predictions with logarithmic severity and guarantees a convex optimization surface.",
            },
            {
              id: "q4",
              question: "What is Gradient Descent used for in Machine Learning?",
              options: ["Iteratively updating model weights to minimize the loss function", "Sorting the dataset", "Compressing images", "Formatting text"],
              correctIndex: 0,
              explanation: "Gradient descent moves model parameters in the direction opposite to the gradient of the loss function.",
            },
            {
              id: "q5",
              question: "What problem arises when the learning rate alpha is set too large?",
              options: ["The model converges too slowly", "Training can diverge, overshoot the minimum, and oscillate wildly", "Weights freeze to zero", "Data is erased"],
              correctIndex: 1,
              explanation: "An excessively large learning rate causes step sizes that overshoot the local minimum, causing gradient divergence.",
            },
          ],
        },
        codingChallenge: {
          id: "code-classical-ml-1",
          title: "Sigmoid Activation Function",
          difficulty: "Easy",
          description: "Write a function `sigmoid(z)` that computes sigma(z) = 1 / (1 + e^(-z)) rounded to 4 decimal places.",
          functionName: "sigmoid",
          starterCode: {
            python: "def sigmoid(z):\n    import math\n    val = 1.0 / (1.0 + math.exp(-z))\n    return round(val, 4)",
            javascript: "function sigmoid(z) {\n  const val = 1.0 / (1.0 + Math.exp(-z));\n  return Math.round(val * 10000) / 10000;\n}",
          },
          examples: [
            { input: "0", output: "0.5", explanation: "1 / (1 + e^0) = 0.5" },
            { input: "2", output: "0.8808" },
            { input: "-2", output: "0.1192" },
          ],
          constraints: ["-50 <= z <= 50"],
          testCases: [
            { input: "0", expectedOutput: "0.5" },
            { input: "2", expectedOutput: "0.8808" },
            { input: "-2", expectedOutput: "0.1192", isHidden: true },
          ],
        },
      },
    ],
  },
  {
    id: "deep-learning",
    slug: "deep-learning",
    title: "Neural Networks & Backpropagation",
    iconName: "Cpu",
    difficulty: "Intermediate",
    order: 3,
    description: "Multi-Layer Perceptrons, activation functions (ReLU, Softmax), forward propagation, and weight gradients.",
    levels: [
      {
        id: "deep-learning-1",
        title: "Multi-Class Softmax Activation",
        shortDesc: "Converting raw unnormalized logits into calibrated probability distributions across K classes.",
        estimatedMinutes: 25,
        order: 1,
        requiresCoding: true,
        theory: {
          summary: "Softmax normalizes an arbitrary vector of raw scores (logits) into a probability distribution where each value is in (0, 1) and all values sum strictly to 1.0.",
          sections: [
            {
              heading: "Softmax Mathematical Definition",
              content: "For a vector z of length K: softmax(z)_i = e^(z_i) / sum_{j=1}^K e^(z_j). In numerical computing, subtracting max(z) from all logits prevents numerical overflow from large exponentials.",
              codeSnippet: {
                language: "python",
                code: "import math\n\ndef softmax(logits):\n    max_val = max(logits)\n    exp_vals = [math.exp(x - max_val) for x in logits]\n    total = sum(exp_vals)\n    return [round(e / total, 4) for e in exp_vals]",
              },
            },
          ],
        },
        quiz: {
          passThreshold: 3,
          questions: [
            {
              id: "q1",
              question: "What is the sum of all probabilities produced by the Softmax function?",
              options: ["0.0", "1.0", "100", "Depends on number of classes"],
              correctIndex: 1,
              explanation: "Softmax produces a normalized probability distribution that always sums to 1.0.",
            },
            {
              id: "q2",
              question: "Why do numerical libraries subtract max(z) before exponentiating in Softmax?",
              options: ["To prevent floating point overflow error (Inf) from large numbers", "To make all numbers negative", "To speed up multiplication", "It is required by calculus"],
              correctIndex: 0,
              explanation: "e^1000 causes float overflow. Subtracting max(z) ensures the largest exponent is e^0 = 1, keeping values safe from overflow without altering relative proportions.",
            },
            {
              id: "q3",
              question: "Which activation function is most widely used in hidden layers of deep neural networks to avoid vanishing gradients?",
              options: ["ReLU (Rectified Linear Unit)", "Sigmoid", "Step function", "Linear"],
              correctIndex: 0,
              explanation: "ReLU: f(x) = max(0, x). For positive inputs, its derivative is constant 1, preventing the vanishing gradient problem seen in Sigmoid/Tanh.",
            },
            {
              id: "q4",
              question: "What algorithm calculates the gradient of the loss function with respect to every weight in a deep network?",
              options: ["Backpropagation (Chain Rule of Calculus)", "Binary Search", "K-Means", "Breadth First Search"],
              correctIndex: 0,
              explanation: "Backpropagation uses the calculus chain rule backwards from the loss function to propagate error gradients.",
            },
            {
              id: "q5",
              question: "What does 'Overfitting' mean in deep learning?",
              options: ["Model memorizes noise in training data and performs poorly on unseen test data", "Model cannot learn training data", "Model has too few layers", "Model trains too fast"],
              correctIndex: 0,
              explanation: "Overfitting occurs when a high-capacity model achieves near-zero training error but fails to generalize to test data.",
            },
          ],
        },
        codingChallenge: {
          id: "code-deep-learning-1",
          title: "Softmax Probability Normalization",
          difficulty: "Medium",
          description: "Given a list of numeric logits `logits`, calculate their Softmax probability distribution rounded to 4 decimal places.",
          functionName: "softmax",
          starterCode: {
            python: "def softmax(logits):\n    import math\n    max_val = max(logits)\n    exps = [math.exp(x - max_val) for x in logits]\n    total = sum(exps)\n    return [round(e / total, 4) for e in exps]",
            javascript: "function softmax(logits) {\n  const maxVal = Math.max(...logits);\n  const exps = logits.map(x => Math.exp(x - maxVal));\n  const sum = exps.reduce((a, b) => a + b, 0);\n  return exps.map(e => Math.round((e / sum) * 10000) / 10000);\n}",
          },
          examples: [
            { input: "[1.0, 2.0, 3.0]", output: "[0.09, 0.2447, 0.6652]" },
            { input: "[2.0, 2.0]", output: "[0.5, 0.5]" },
          ],
          constraints: ["1 <= logits.length <= 100", "-50 <= logits[i] <= 50"],
          testCases: [
            { input: "[1.0, 2.0, 3.0]", expectedOutput: "[0.09, 0.2447, 0.6652]" },
            { input: "[2.0, 2.0]", expectedOutput: "[0.5, 0.5]" },
          ],
        },
      },
    ],
  },
  {
    id: "nlp-embeddings",
    slug: "nlp-embeddings",
    title: "NLP & Vector Embeddings",
    iconName: "FileText",
    difficulty: "Advanced",
    order: 4,
    description: "Vector embeddings, tokenization, semantic similarity, and Cosine Distance for RAG search.",
    levels: [
      {
        id: "nlp-1",
        title: "Cosine Similarity for Semantic Search",
        shortDesc: "Measuring angular distance between high-dimensional text embeddings independent of vector magnitude.",
        estimatedMinutes: 20,
        order: 1,
        requiresCoding: true,
        theory: {
          summary: "Cosine similarity measures the cosine of the angle between two non-zero vectors. Value ranges from -1 (opposite) to +1 (identical direction), with 0 indicating orthogonality.",
          sections: [
            {
              heading: "Cosine Similarity Formula",
              content: "cosine_sim(A, B) = (A · B) / (||A|| * ||B||) = sum(A_i * B_i) / (sqrt(sum(A_i²)) * sqrt(sum(B_i²))). It evaluates semantic alignment regardless of document length.",
              codeSnippet: {
                language: "python",
                code: "import math\n\ndef cosine_similarity(a, b):\n    dot = sum(x * y for x, y in zip(a, b))\n    norm_a = math.sqrt(sum(x * x for x in a))\n    norm_b = math.sqrt(sum(y * y for y in b))\n    if norm_a == 0 or norm_b == 0: return 0.0\n    return round(dot / (norm_a * norm_b), 4)",
              },
            },
          ],
        },
        quiz: {
          passThreshold: 3,
          questions: [
            {
              id: "q1",
              question: "Why is Cosine Similarity preferred over Euclidean distance for text embeddings?",
              options: ["It measures angular direction rather than magnitude, so long and short texts with the same topic score high", "It is always integer", "It requires no division", "It only works on English"],
              correctIndex: 0,
              explanation: "Cosine similarity normalizes for vector length, focusing solely on the conceptual direction.",
            },
            {
              id: "q2",
              question: "What is the Cosine Similarity of two parallel vectors pointing in the exact same direction?",
              options: ["1.0", "0.0", "-1.0", "0.5"],
              correctIndex: 0,
              explanation: "Angle theta = 0 degrees; cos(0°) = 1.0.",
            },
            {
              id: "q3",
              question: "What is a Vector Database (e.g. Pinecone, Chroma, pgvector) primarily used for?",
              options: ["Storing embeddings and performing Approximate Nearest Neighbor (ANN) search", "Rendering HTML pages", "Running cron jobs", "Relational ACID joins"],
              correctIndex: 0,
              explanation: "Vector databases index high-dimensional embeddings to perform sub-millisecond similarity search.",
            },
            {
              id: "q4",
              question: "What is an embedding model in NLP?",
              options: ["A neural network that converts words or passages into dense numeric coordinate vectors", "A spellchecker", "A compiler", "A database server"],
              correctIndex: 0,
              explanation: "Embedding models map raw text into continuous vector spaces where semantic similarity correlates with geometric proximity.",
            },
            {
              id: "q5",
              question: "What does RAG stand for in modern AI architecture?",
              options: ["Retrieval-Augmented Generation", "Recursive Array Generation", "Real-time Action Grammar", "Randomized Auto Graph"],
              correctIndex: 0,
              explanation: "RAG retrieves relevant external factual documents from a vector store to ground an LLM prompt before answering.",
            },
          ],
        },
        codingChallenge: {
          id: "code-nlp-1",
          title: "Cosine Similarity",
          difficulty: "Easy",
          description: "Given two numeric vectors `a` and `b`, compute their Cosine Similarity rounded to 4 decimal places. If either vector has zero magnitude, return `0`.",
          functionName: "cosineSimilarity",
          starterCode: {
            python: "def cosineSimilarity(a, b):\n    import math\n    dot = sum(x * y for x, y in zip(a, b))\n    norm_a = math.sqrt(sum(x * x for x in a))\n    norm_b = math.sqrt(sum(y * y for y in b))\n    if norm_a == 0 or norm_b == 0:\n        return 0.0\n    return round(dot / (norm_a * norm_b), 4)",
            javascript: "function cosineSimilarity(a, b) {\n  let dot = 0, normA = 0, normB = 0;\n  for (let i = 0; i < a.length; i++) {\n    dot += a[i] * b[i];\n    normA += a[i] * a[i];\n    normB += b[i] * b[i];\n  }\n  if (normA === 0 || normB === 0) return 0;\n  const sim = dot / (Math.sqrt(normA) * Math.sqrt(normB));\n  return Math.round(sim * 10000) / 10000;\n}",
          },
          examples: [
            { input: "[1, 2], [1, 2]", output: "1.0", explanation: "Identical vectors have cosine similarity of 1.0" },
            { input: "[1, 0], [0, 1]", output: "0", explanation: "Orthogonal vectors have cosine similarity of 0" },
          ],
          constraints: ["1 <= len(a) == len(b) <= 500"],
          testCases: [
            { input: "[1, 2], [1, 2]", expectedOutput: "1" },
            { input: "[1, 0], [0, 1]", expectedOutput: "0" },
            { input: "[1, 2, 3], [2, 4, 6]", expectedOutput: "1", isHidden: true },
          ],
        },
      },
    ],
  },
];

export function getAllAimlLevels() {
  return aimlTopics.flatMap((topic) =>
    topic.levels.map((level) => ({
      topic,
      topicId: topic.id,
      level,
    }))
  );
}

