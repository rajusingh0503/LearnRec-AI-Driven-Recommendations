-- =============================================================================
-- Migration: V3__seed_sample_learning_contents.sql
-- Description: 100 Curated Realistic Sample Learning Resources across 10 Domains
-- =============================================================================

-- CATEGORY 1: ARTIFICIAL INTELLIGENCE (IDs 1-10)
INSERT INTO contents (id, title, description, content_type, difficulty_level, url, author_or_instructor, rating_avg, rating_count, category_id, is_published) VALUES
(1, 'CS50s Introduction to Artificial Intelligence with Python', 'Explores foundational concepts and algorithms at the foundation of modern artificial intelligence including game playing, search, and knowledge representation.', 'COURSE', 'BEGINNER', 'https://cs50.harvard.edu/ai/', 'Brian Yu & David J. Malan', 4.90, 3420, 1, TRUE),
(2, 'Deep Learning Specialization', 'Master Deep Learning fundamentals, build neural networks, CNNs, RNNs, and Transformers with hands-on PyTorch and TensorFlow projects.', 'COURSE', 'INTERMEDIATE', 'https://www.coursera.org/specializations/deep-learning', 'Andrew Ng (DeepLearning.AI)', 4.95, 12850, 1, TRUE),
(3, 'Artificial Intelligence: A Modern Approach (4th Edition)', 'The definitive textbook in AI, presenting full coverage of search, probabilistic reasoning, machine learning, and multi-agent systems.', 'BOOK', 'ADVANCED', 'https://aima.cs.berkeley.edu/', 'Stuart Russell & Peter Norvig', 4.80, 5200, 1, TRUE),
(4, 'Deep Learning (Adaptive Computation and Machine Learning)', 'An authoritative textbook providing deep theoretical foundations in linear algebra, probability, deep feedforward networks, and generative models.', 'BOOK', 'ADVANCED', 'https://www.deeplearningbook.org/', 'Ian Goodfellow, Yoshua Bengio, Aaron Courville', 4.75, 4100, 1, TRUE),
(5, 'Hugging Face NLP Course', 'A hands-on tutorial covering Transformer models, tokenizers, fine-tuning pretrained models, and deploying NLP pipelines using the Hugging Face ecosystem.', 'TUTORIAL', 'INTERMEDIATE', 'https://huggingface.co/learn/nlp-course', 'Hugging Face Team', 4.88, 2300, 1, TRUE),
(6, 'Introduction to Computer Vision with OpenCV and Python', 'Practical step-by-step tutorial on image processing, feature extraction, object detection, and OpenCV integration.', 'TUTORIAL', 'BEGINNER', 'https://pyimagesearch.com/start-here/', 'Adrian Rosebrock', 4.70, 1890, 1, TRUE),
(7, 'Implement Minimax with Alpha-Beta Pruning for Connect Four', 'Interactive coding challenge requiring implementation of the minimax decision algorithm with alpha-beta pruning optimization in Python.', 'CODING_PROBLEM', 'INTERMEDIATE', 'https://leetcode.com/discuss/general-discussion/458695/minimax-algorithm-guide', 'LeetCode Curated', 4.65, 870, 1, TRUE),
(8, 'Build a Multilayer Perceptron from Scratch in Pure NumPy', 'Algorithmic challenge to implement forward pass, backpropagation, and cross-entropy loss without external deep learning libraries.', 'CODING_PROBLEM', 'ADVANCED', 'https://github.com/karpathy/micrograd', 'Andrej Karpathy (Micrograd)', 4.92, 3400, 1, TRUE),
(9, 'Stanford CS221: Artificial Intelligence Principles and Techniques', 'Comprehensive lecture notes, problem sets, and syllabus covering modern state-of-the-art AI foundations from Stanford University.', 'RESOURCE', 'INTERMEDIATE', 'https://stanford-cs221.github.io/', 'Percy Liang & Dorsa Sadigh', 4.85, 1500, 1, TRUE),
(10, 'OpenAI Prompt Engineering & API Architecture Guide', 'Official technical documentation and best practice guidelines for designing prompts, structured outputs, and LLM orchestration.', 'RESOURCE', 'BEGINNER', 'https://platform.openai.com/docs/guides/prompt-engineering', 'OpenAI Research', 4.80, 6200, 1, TRUE);

-- CATEGORY 2: MACHINE LEARNING (IDs 11-20)
INSERT INTO contents (id, title, description, content_type, difficulty_level, url, author_or_instructor, rating_avg, rating_count, category_id, is_published) VALUES
(11, 'Machine Learning Specialization', 'Foundational program teaching supervised learning, regression, classification, clustering, anomaly detection, and recommender systems.', 'COURSE', 'BEGINNER', 'https://www.coursera.org/specializations/machine-learning-introduction', 'Andrew Ng & Stanford Online', 4.93, 21400, 2, TRUE),
(12, 'Advanced Machine Learning and Model Optimization', 'In-depth focus on gradient boosted decision trees (XGBoost, LightGBM), hyperparameter optimization, and ensemble stacking.', 'COURSE', 'ADVANCED', 'https://www.fast.ai/', 'Jeremy Howard & Rachel Thomas', 4.87, 8300, 2, TRUE),
(13, 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow', 'Practical guide to building intelligent systems using concrete examples, minimal theory, and production-ready Python frameworks.', 'BOOK', 'INTERMEDIATE', 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/', 'Aurélien Géron', 4.91, 7400, 2, TRUE),
(14, 'Pattern Recognition and Machine Learning', 'Comprehensive reference textbook on Bayesian methods, graphical models, kernel methods, and continuous latent variables.', 'BOOK', 'ADVANCED', 'https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/', 'Christopher M. Bishop', 4.79, 4900, 2, TRUE),
(15, 'Building a Complete ML Pipeline with Scikit-Learn', 'Tutorial on structuring end-to-end pipelines: imputation, scaling, one-hot encoding, column transformers, and cross-validation.', 'TUTORIAL', 'BEGINNER', 'https://scikit-learn.org/stable/tutorial/index.html', 'Scikit-Learn Community', 4.82, 3100, 2, TRUE),
(16, 'Hyperparameter Tuning with Optuna: Practical Guide', 'Step-by-step tutorial on Bayesian hyperparameter tuning, pruning unpromising trials, and distributed search with Optuna.', 'TUTORIAL', 'INTERMEDIATE', 'https://optuna.readthedocs.io/en/stable/tutorial/index.html', 'Preferred Networks Team', 4.78, 1420, 2, TRUE),
(17, 'House Prices: Advanced Regression Techniques', 'Predict sales prices and practice feature engineering, RF, and gradient boosting algorithms on real-world housing data.', 'CODING_PROBLEM', 'INTERMEDIATE', 'https://www.kaggle.com/c/house-prices-advanced-regression-techniques', 'Kaggle Competitions', 4.86, 18900, 2, TRUE),
(18, 'Titanic: Machine Learning from Disaster', 'Legendary introductory binary classification challenge for practicing clean data preparation and classification algorithms.', 'CODING_PROBLEM', 'BEGINNER', 'https://www.kaggle.com/c/titanic', 'Kaggle Competitions', 4.80, 45200, 2, TRUE),
(19, 'Google Machine Learning Crash Course with TensorFlow APIs', 'Fast-paced, practical introduction to machine learning featuring interactive exercises, video lectures, and case studies.', 'RESOURCE', 'BEGINNER', 'https://developers.google.com/machine-learning/crash-course', 'Google Engineering', 4.76, 11200, 2, TRUE),
(20, 'Distill ML Research Journal & Interactive Explanations', 'Peer-reviewed visual journal dedicated to clear, dynamic explanations of modern machine learning breakthroughs.', 'RESOURCE', 'INTERMEDIATE', 'https://distill.pub/', 'Distill Editorial Board', 4.96, 5600, 2, TRUE);

-- CATEGORY 3: PYTHON PROGRAMMING (IDs 21-30)
INSERT INTO contents (id, title, description, content_type, difficulty_level, url, author_or_instructor, rating_avg, rating_count, category_id, is_published) VALUES
(21, 'Complete Python Bootcamp From Zero to Hero in Python', 'Comprehensive coverage of core Python, OOP, decorators, generators, packaging, and real-world scripting projects.', 'COURSE', 'BEGINNER', 'https://www.udemy.com/course/complete-python-bootcamp/', 'Jose Portilla', 4.70, 48000, 3, TRUE),
(22, 'Advanced Python Mastery: Internals, Concurrency, and Metaclasses', 'Master Python memory management, GIL, asyncio, threading, multiprocessing, and custom metaclass creation.', 'COURSE', 'ADVANCED', 'https://dabeaz-course.github.io/practical-python/', 'David Beazley', 4.94, 2800, 3, TRUE),
(23, 'Fluent Python: Clear, Concise, and Effective Programming', 'Guides experienced programmers through Python 3 best practices, idioms, data structures, and functional features.', 'BOOK', 'INTERMEDIATE', 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', 'Luciano Ramalho', 4.92, 5300, 3, TRUE),
(24, 'Python Crash Course: A Hands-On, Project-Based Introduction', 'Fast-paced, thorough introduction to Python that will have you writing programs, solving problems, and making apps quickly.', 'BOOK', 'BEGINNER', 'https://nostarch.com/python-crash-course-3rd-edition', 'Eric Matthes', 4.85, 9200, 3, TRUE),
(25, 'Modern Asynchronous Programming in Python with Asyncio', 'Comprehensive walkthrough of coroutines, event loops, tasks, semaphores, and asynchronous HTTP client architectures.', 'TUTORIAL', 'INTERMEDIATE', 'https://realpython.com/async-io-python/', 'Real Python Team', 4.89, 4100, 3, TRUE),
(26, 'Writing Idiomatic Python and Context Managers', 'Deep dive into Python dunder methods, generator expressions, `with` statements, and custom context managers.', 'TUTORIAL', 'BEGINNER', 'https://realpython.com/python-with-statement/', 'Dan Bader', 4.75, 2900, 3, TRUE),
(27, 'Implement an LRU Cache in Python using Custom Doubly Linked List', 'LeetCode problem 146: Design a data structure that follows the constraints of a Least Recently Used cache with O(1) operations.', 'CODING_PROBLEM', 'INTERMEDIATE', 'https://leetcode.com/problems/lru-cache/', 'LeetCode', 4.90, 14200, 3, TRUE),
(28, 'Concurrent Web Scraper with Asyncio and Aiohttp', 'Design and implement a resilient, rate-limited web scraper handling 1,000 concurrent requests without thread exhaustion.', 'CODING_PROBLEM', 'ADVANCED', 'https://github.com/realpython/materials/tree/master/asyncio-walkthrough', 'Real Python', 4.83, 1100, 3, TRUE),
(29, 'Python 3 Standard Library Documentation & Language Reference', 'The definitive source for built-in modules, data types, protocols, syntax specifications, and runtime behavior.', 'RESOURCE', 'INTERMEDIATE', 'https://docs.python.org/3/', 'Python Software Foundation', 4.88, 32000, 3, TRUE),
(30, 'Awesome-Python: Curated List of Libraries and Frameworks', 'Comprehensive catalog of verified Python packages for machine learning, web servers, data manipulation, and testing.', 'RESOURCE', 'BEGINNER', 'https://github.com/vinta/awesome-python', 'Vinta Chen & Community', 4.91, 28000, 3, TRUE);

-- CATEGORY 4: JAVA PROGRAMMING (IDs 31-40)
INSERT INTO contents (id, title, description, content_type, difficulty_level, url, author_or_instructor, rating_avg, rating_count, category_id, is_published) VALUES
(31, 'Java Programming Masterclass 2026 for Software Developers', 'Master Java from core syntax and OOP principles to lambdas, streams, virtual threads, and JavaFX.', 'COURSE', 'BEGINNER', 'https://www.udemy.com/course/java-the-complete-java-developer-course/', 'Tim Buchalka', 4.75, 62000, 4, TRUE),
(32, 'Spring Boot 3 & Spring Framework 6 Microservices Architecture', 'Design, build, and deploy production-ready REST APIs and microservices using Spring Boot 3, Spring Data JPA, and Security.', 'COURSE', 'INTERMEDIATE', 'https://www.udemy.com/course/spring-hibernate-tutorial/', 'Chad Darby & In28Minutes', 4.82, 34500, 4, TRUE),
(33, 'Effective Java (3rd Edition)', 'Definitive guide containing 90 best-practice items for writing robust, maintainable, and high-performance Java code.', 'BOOK', 'ADVANCED', 'https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/', 'Joshua Bloch', 4.96, 11400, 4, TRUE),
(34, 'Java Concurrency in Practice', 'In-depth treatise on concurrent programming in Java: threads, synchronization, memory model, immutability, and executors.', 'BOOK', 'ADVANCED', 'https://jcip.net/', 'Brian Goetz, Tim Peierls, Joshua Bloch', 4.90, 8900, 4, TRUE),
(35, 'Mastering Java Streams API and Functional Programming', 'Complete tutorial explaining filter, map, flatMap, reduce, collectors, and performance considerations for parallel streams.', 'TUTORIAL', 'INTERMEDIATE', 'https://www.baeldung.com/java-8-streams', 'Baeldung Team', 4.84, 9100, 4, TRUE),
(36, 'Securing REST APIs with Spring Security 6 and JWT', 'Practical guide to configuring stateless JWT authentication, filter chains, user details service, and RBAC in Spring Boot.', 'TUTORIAL', 'INTERMEDIATE', 'https://www.baeldung.com/spring-security-jwt', 'Eugen Paraschiv (Baeldung)', 4.88, 7200, 4, TRUE),
(37, 'Design a Thread-Safe Bounded Blocking Queue in Java', 'Implement a bounded blocking queue with `put` and `take` methods using ReentrantLock and Condition variables.', 'CODING_PROBLEM', 'ADVANCED', 'https://leetcode.com/problems/design-bounded-blocking-queue/', 'LeetCode Concurrency', 4.78, 2300, 4, TRUE),
(38, 'Serialize and Deserialize Binary Tree in Java', 'Design an efficient algorithm to serialize a binary tree into a string and deserialize that string back to the original tree structure.', 'CODING_PROBLEM', 'INTERMEDIATE', 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', 'LeetCode', 4.85, 8700, 4, TRUE),
(39, 'Oracle Official Java Documentation & API Specification (JDK 21 LTS)', 'Complete reference guide to the standard library, JVM performance flags, language features, and garbage collectors.', 'RESOURCE', 'INTERMEDIATE', 'https://docs.oracle.com/en/java/javase/21/', 'Oracle Corporation', 4.80, 24000, 4, TRUE),
(40, 'Baeldung Spring Boot Tutorials & Architecture Guides', 'The leading resource for concise, production-tested guides and code samples covering the entire Spring ecosystem.', 'RESOURCE', 'BEGINNER', 'https://www.baeldung.com/', 'Baeldung Media', 4.92, 45000, 4, TRUE);

-- CATEGORY 5: C++ PROGRAMMING (IDs 41-50)
INSERT INTO contents (id, title, description, content_type, difficulty_level, url, author_or_instructor, rating_avg, rating_count, category_id, is_published) VALUES
(41, 'Beginning C++ Programming - From Beginner to Beyond', 'Modern C++ (C++14/C++17) fundamentals: pointers, references, OOP, inheritance, polymorphism, and STL containers.', 'COURSE', 'BEGINNER', 'https://www.udemy.com/course/beginning-c-plus-plus-programming/', 'Frank Mitropoulos', 4.72, 38000, 5, TRUE),
(42, 'Advanced C++: Templates, Metaprogramming, and Modern Standards', 'Master template metaprogramming, concepts, constexpr, move semantics, and low-latency C++20 design patterns.', 'COURSE', 'ADVANCED', 'https://www.coursera.org/learn/c-plus-plus-modern', 'Vanderbilt University', 4.81, 2900, 5, TRUE),
(43, 'Effective Modern C++: 42 Specific Ways to Improve Your Use of C++11 and C++14', 'Expert guidance on auto, type deduction, smart pointers, lambda expressions, `std::move`, and `std::forward`.', 'BOOK', 'ADVANCED', 'https://www.oreilly.com/library/view/effective-modern-c/9781491908419/', 'Scott Meyers', 4.95, 6800, 5, TRUE),
(44, 'The C++ Programming Language (4th Edition)', 'Comprehensive, definitive reference to the C++ core language, standard library, and key design techniques.', 'BOOK', 'INTERMEDIATE', 'https://www.stroustrup.com/4th.html', 'Bjarne Stroustrup', 4.78, 5100, 5, TRUE),
(45, 'Smart Pointers in Modern C++: unique_ptr, shared_ptr, and weak_ptr', 'Detailed tutorial on RAII, memory management without raw pointers, reference counting, and circular dependency avoidance.', 'TUTORIAL', 'INTERMEDIATE', 'https://www.learncpp.com/cpp-tutorial/introduction-to-smart-pointers/', 'LearnCpp.com', 4.89, 8200, 5, TRUE),
(46, 'Understanding Move Semantics and Rvalue References in C++', 'Clear walkthrough explaining value categories (lvalue vs rvalue), perfect forwarding, and move constructors.', 'TUTORIAL', 'INTERMEDIATE', 'https://www.internalpointers.com/post/c-rvalue-references-and-move-semantics-beginners', 'Internal Pointers', 4.86, 3400, 5, TRUE),
(47, 'Implement a Custom std::vector in C++ with Dynamic Reallocation', 'Build a thread-safe, dynamically resizing container supporting templates, move semantics, iterators, and custom allocators.', 'CODING_PROBLEM', 'ADVANCED', 'https://github.com/TheAlgorithms/C-Plus-Plus/blob/master/data_structures/vector.hpp', 'Competitive Programming Curated', 4.84, 1900, 5, TRUE),
(48, 'Design a Memory Allocator in C++', 'Design a custom fixed-size memory block allocator with free list management for ultra-low latency execution.', 'CODING_PROBLEM', 'ADVANCED', 'https://leetcode.com/problems/design-memory-allocator/', 'LeetCode', 4.76, 1200, 5, TRUE),
(49, 'cppreference.com - Complete C and C++ Standard Reference', 'The premier community-maintained reference for the C++ language, Standard Template Library headers, algorithms, and complexity.', 'RESOURCE', 'INTERMEDIATE', 'https://en.cppreference.com/', 'cppreference Community', 4.97, 52000, 5, TRUE),
(50, 'C++ Core Guidelines by Bjarne Stroustrup and Herb Sutter', 'Set of guidelines, rules, and best practices about coding in modern C++ to ensure type-safety, resource safety, and performance.', 'RESOURCE', 'ADVANCED', 'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines', 'Standard C++ Foundation', 4.93, 19000, 5, TRUE);

-- CATEGORY 6: DATA SCIENCE (IDs 51-60)
INSERT INTO contents (id, title, description, content_type, difficulty_level, url, author_or_instructor, rating_avg, rating_count, category_id, is_published) VALUES
(51, 'IBM Data Science Professional Certificate', 'Comprehensive preparation covering Python, SQL, data analysis with Pandas, visualization, statistical modeling, and machine learning.', 'COURSE', 'BEGINNER', 'https://www.coursera.org/professional-certificates/ibm-data-science', 'IBM Skills Network', 4.68, 41000, 6, TRUE),
(52, 'Applied Data Science with Python Specialization', 'Specialization teaching data cleaning, text mining, network analysis, and statistical visualization using Python libraries.', 'COURSE', 'INTERMEDIATE', 'https://www.coursera.org/specializations/applied-data-science-python', 'University of Michigan', 4.74, 22500, 6, TRUE),
(53, 'Python for Data Analysis (3rd Edition)', 'Practical instructions for manipulating, processing, cleaning, and crunching datasets in Python using Pandas, NumPy, and Jupyter.', 'BOOK', 'BEGINNER', 'https://wesmckinney.com/book/', 'Wes McKinney (Creator of Pandas)', 4.89, 8100, 6, TRUE),
(54, 'Storytelling with Data: A Data Visualization Guide for Business', 'Practical guide to communicating effectively with data, eliminating chart clutter, and designing compelling statistical narratives.', 'BOOK', 'BEGINNER', 'https://www.storytellingwithdata.com/book', 'Cole Nussbaumer Knaflic', 4.83, 7200, 6, TRUE),
(55, 'Exploratory Data Analysis with Pandas, Seaborn, and Plotly', 'Step-by-step guide to univariate and bivariate analysis, correlation matrices, outlier detection, and interactive plotting.', 'TUTORIAL', 'BEGINNER', 'https://towardsdatascience.com/exploratory-data-analysis-eda-python-87178e35b14', 'Towards Data Science', 4.77, 6300, 6, TRUE),
(56, 'Feature Engineering for Machine Learning: Principles and Techniques', 'In-depth tutorial on target encoding, binning, interaction terms, box-cox transforms, and dimensionality reduction.', 'TUTORIAL', 'INTERMEDIATE', 'https://machinelearningmastery.com/discover-feature-engineering-how-to-engineer-features-and-how-to-get-good-at-it/', 'Jason Brownlee', 4.81, 4500, 6, TRUE),
(57, 'Kaggle: Rossmann Store Sales Forecasting Challenge', 'Forecast sales using store, promotion, and competitor data. Practice time series feature extraction and regression modeling.', 'CODING_PROBLEM', 'INTERMEDIATE', 'https://www.kaggle.com/c/rossmann-store-sales', 'Kaggle', 4.84, 5200, 6, TRUE),
(58, 'Credit Card Fraud Detection with Imbalanced Data', 'Analyze highly imbalanced transaction data, implement SMOTE, precision-recall curve analysis, and cost-sensitive classification.', 'CODING_PROBLEM', 'INTERMEDIATE', 'https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud', 'ULB Machine Learning Group', 4.90, 14000, 6, TRUE),
(59, 'Pandas Documentation: 10 Minutes to Pandas and User Guide', 'Essential documentation detailing DataFrame manipulations, indexing, group-by aggregations, reshaping, and time series.', 'RESOURCE', 'BEGINNER', 'https://pandas.pydata.org/docs/user_guide/index.html', 'The Pandas Development Team', 4.85, 36000, 6, TRUE),
(60, 'Papers with Code: State of the Art in Machine Learning & Data Science', 'Free and open resource with Machine Learning papers, code implementations, datasets, and benchmark evaluation tables.', 'RESOURCE', 'INTERMEDIATE', 'https://paperswithcode.com/', 'Meta AI / Papers with Code', 4.94, 21000, 6, TRUE);

-- CATEGORY 7: DATA STRUCTURES & ALGORITHMS (IDs 61-70)
INSERT INTO contents (id, title, description, content_type, difficulty_level, url, author_or_instructor, rating_avg, rating_count, category_id, is_published) VALUES
(61, 'Algorithms Specialization by Stanford University', 'Rigorous treatment of divide-and-conquer, sorting, graph search, shortest paths, greedy algorithms, and dynamic programming.', 'COURSE', 'INTERMEDIATE', 'https://www.coursera.org/specializations/algorithms', 'Tim Roughgarden', 4.89, 14900, 7, TRUE),
(62, 'Master the Coding Interview: Data Structures + Algorithms', 'Practical bootcamp focused on mastering big-O notation, trees, graphs, heaps, dynamic programming, and behavioral strategies.', 'COURSE', 'BEGINNER', 'https://www.udemy.com/course/master-the-coding-interview-data-structures-algorithms/', 'Andrei Neagoie', 4.73, 29000, 7, TRUE),
(63, 'Introduction to Algorithms (CLRS 4th Edition)', 'The world-renowned comprehensive textbook on algorithms: asymptotic notation, sorting, red-black trees, flow networks, and NP-completeness.', 'BOOK', 'ADVANCED', 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/', 'Cormen, Leiserson, Rivest, Stein (CLRS)', 4.86, 16000, 7, TRUE),
(64, 'Grokking Algorithms: An Illustrated Guide for Programmers', 'A friendly, beautifully illustrated introduction to core algorithms like binary search, Dijkstra, and greedy heuristics.', 'BOOK', 'BEGINNER', 'https://www.manning.com/books/grokking-algorithms', 'Aditya Bhargava', 4.88, 12400, 7, TRUE),
(65, 'Dynamic Programming Patterns: A Comprehensive Guide', 'Clear breakdown of 0/1 Knapsack, Longest Common Subsequence, Palindromic Substrings, and state-transition equations.', 'TUTORIAL', 'INTERMEDIATE', 'https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns', 'Aakash Verma', 4.92, 18500, 7, TRUE),
(66, 'Graph Traversal Mastery: BFS, DFS, Dijkstra, and Union-Find', 'Visual step-by-step tutorial covering topological sort, cycle detection in directed graphs, and disjoint-set union optimizations.', 'TUTORIAL', 'INTERMEDIATE', 'https://cp-algorithms.com/graph/breadth-first-search.html', 'CP-Algorithms Community', 4.90, 8900, 7, TRUE),
(67, 'LeetCode 42: Trapping Rain Water', 'Classic hard algorithmic problem: given n non-negative integers representing an elevation map, compute how much water it can trap.', 'CODING_PROBLEM', 'ADVANCED', 'https://leetcode.com/problems/trapping-rain-water/', 'LeetCode', 4.93, 31000, 7, TRUE),
(68, 'LeetCode 200: Number of Islands', 'Standard graph problem requiring grid BFS/DFS traversal and connected-component counting.', 'CODING_PROBLEM', 'BEGINNER', 'https://leetcode.com/problems/number-of-islands/', 'LeetCode', 4.87, 42000, 7, TRUE),
(69, 'NeetCode 150 - Blind Curated Algorithmic Problem Roadmap', 'Categorized, structured list of the 150 most representative LeetCode problems with interactive video explanations and code.', 'RESOURCE', 'INTERMEDIATE', 'https://neetcode.io/practice', 'Navdeep Singh (NeetCode)', 4.98, 48000, 7, TRUE),
(70, 'CP-Algorithms: Algorithms and Data Structures for Competitive Coding', 'In-depth mathematical proofs, pseudocode, and C++ implementations of advanced algorithms from string hashing to suffix automata.', 'RESOURCE', 'ADVANCED', 'https://cp-algorithms.com/', 'CP-Algorithms Translation Project', 4.95, 14000, 7, TRUE);

-- CATEGORY 8: WEB DEVELOPMENT (IDs 71-80)
INSERT INTO contents (id, title, description, content_type, difficulty_level, url, author_or_instructor, rating_avg, rating_count, category_id, is_published) VALUES
(71, 'The Complete 2026 Web Development Bootcamp', 'Full-stack web development: HTML5, CSS3, JavaScript ES6+, React, Node.js, Express, PostgreSQL, REST APIs, and authentication.', 'COURSE', 'BEGINNER', 'https://www.udemy.com/course/the-complete-web-development-bootcamp/', 'Angela Yu', 4.77, 85000, 8, TRUE),
(72, 'Full Stack Open 2026 by University of Helsinki', 'Deep dive into modern web development with React, Redux, Node.js, Express, MongoDB, GraphQL, TypeScript, and CI/CD pipelines.', 'COURSE', 'INTERMEDIATE', 'https://fullstackopen.com/en/', 'University of Helsinki', 4.96, 17200, 8, TRUE),
(73, 'Eloquent JavaScript (3rd Edition)', 'A modern introduction to programming, JavaScript syntax, error handling, regular expressions, DOM manipulation, and Node.js.', 'BOOK', 'BEGINNER', 'https://eloquentjavascript.net/', 'Marijn Haverbeke', 4.79, 11000, 8, TRUE),
(74, 'You Dont Know JS Yet (Book Series)', 'Deep dive into the core mechanics of JavaScript: scopes, closures, `this`, object prototypes, and asynchronous execution.', 'BOOK', 'ADVANCED', 'https://github.com/getify/You-Dont-Know-JS', 'Kyle Simpson (getify)', 4.91, 19500, 8, TRUE),
(75, 'Building Responsive UIs with Tailwind CSS from Scratch', 'Complete tutorial on utility classes, responsive breakpoints, typography, flexbox/grid layouts, and theme customization.', 'TUTORIAL', 'BEGINNER', 'https://tailwindcss.com/docs/utility-first', 'Tailwind Labs', 4.88, 14000, 8, TRUE),
(76, 'State Management in Modern React: Context vs Redux Toolkit vs Zustand', 'Architecture guide evaluating state management tradeoffs, re-render optimizations, and asynchronous action patterns.', 'TUTORIAL', 'INTERMEDIATE', 'https://kentcdodds.com/blog/application-state-management-with-react', 'Kent C. Dodds', 4.86, 9200, 8, TRUE),
(77, 'Build an Interactive Kanban Board with React and Drag-and-Drop', 'Challenge to design a Trello clone with persisted state, column reordering, smooth drag-and-drop, and optimistic updates.', 'CODING_PROBLEM', 'INTERMEDIATE', 'https://frontendeval.com/questions/kanban-board', 'FrontendEval', 4.82, 3800, 8, TRUE),
(78, 'Design an Autocomplete Search Component with Debounce and Cache', 'Implement a typeahead search component with debounced API queries, keyboard accessibility (ARIA), and LRU cache in React.', 'CODING_PROBLEM', 'INTERMEDIATE', 'https://bigfrontend.dev/problem/create-an-auto-complete-widget', 'BigFrontend.dev (BFE)', 4.85, 4100, 8, TRUE),
(79, 'MDN Web Docs (Mozilla Developer Network)', 'The premier, authoritative reference for HTML, CSS, JavaScript, Web APIs, accessibility (a11y), and browser compatibility tables.', 'RESOURCE', 'BEGINNER', 'https://developer.mozilla.org/', 'Mozilla Corporation & Open Web Docs', 4.99, 95000, 8, TRUE),
(80, 'React Official Documentation (react.dev)', 'The modern interactive React documentation featuring conceptual deep-dives, visual diagrams, and built-in interactive sandboxes.', 'RESOURCE', 'BEGINNER', 'https://react.dev/', 'Meta Open Source', 4.95, 46000, 8, TRUE);

-- CATEGORY 9: DATABASES & SQL (IDs 81-90)
INSERT INTO contents (id, title, description, content_type, difficulty_level, url, author_or_instructor, rating_avg, rating_count, category_id, is_published) VALUES
(81, 'CMU 15-445/645: Database Systems (BusTub)', 'Deep dive into database architecture: buffer pools, B+ trees, concurrency control, latching, and query execution engines.', 'COURSE', 'ADVANCED', 'https://15445.courses.cs.cmu.edu/', 'Andy Pavlo (Carnegie Mellon)', 4.97, 7200, 9, TRUE),
(82, 'The Ultimate MySQL Bootcamp: Go from SQL Beginner to Expert', 'Solid grounding in MySQL: table schemas, relationships, aggregate functions, string operators, and real-world database design.', 'COURSE', 'BEGINNER', 'https://www.udemy.com/course/the-ultimate-mysql-bootcamp-go-from-sql-beginner-to-expert/', 'Colt Steele', 4.74, 52000, 9, TRUE),
(83, 'Designing Data-Intensive Applications (DDIA)', 'The definitive handbook on distributed data systems: replication, partitioning, transactions, consensus, and stream processing.', 'BOOK', 'ADVANCED', 'https://dataintensive.net/', 'Martin Kleppmann', 4.98, 26000, 9, TRUE),
(84, 'SQL Antipatterns: Avoiding the Pitfalls of Database Programming', 'Practical guide identifying common mistakes in schema design, queries, and application architecture, with clean alternative solutions.', 'BOOK', 'INTERMEDIATE', 'https://pragprog.com/titles/bksqla/sql-antipatterns/', 'Bill Karwin', 4.84, 4300, 9, TRUE),
(85, 'Use The Index, Luke! A Guide to Database Performance for Developers', 'Clear, visual explanation of B-tree index traversal, composite index column ordering, slow table scans, and execution plans.', 'TUTORIAL', 'INTERMEDIATE', 'https://use-the-index-luke.com/', 'Markus Winand', 4.93, 11000, 9, TRUE),
(86, 'Mastering SQL Window Functions and Common Table Expressions (CTEs)', 'Tutorial covering `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LEAD`, `LAG`, running totals, and recursive queries in PostgreSQL/MySQL.', 'TUTORIAL', 'INTERMEDIATE', 'https://mode.com/sql-tutorial/sql-window-functions/', 'Mode Analytics', 4.87, 8600, 9, TRUE),
(87, 'LeetCode 185: Department Top Three Salaries', 'Write an SQL query to find the employees who earn the top three unique salaries in each department using window functions.', 'CODING_PROBLEM', 'INTERMEDIATE', 'https://leetcode.com/problems/department-top-three-salaries/', 'LeetCode SQL', 4.81, 16200, 9, TRUE),
(88, 'LeetCode 262: Trips and Users (Complex Multi-Join Aggregation)', 'Write an SQL query to calculate cancellation rates of unbanned users during a specific date window with nested filters.', 'CODING_PROBLEM', 'ADVANCED', 'https://leetcode.com/problems/trips-and-users/', 'LeetCode SQL', 4.79, 9800, 9, TRUE),
(89, 'PostgreSQL Official Documentation & Manual', 'Comprehensive documentation of PostgreSQL features: ACID guarantees, MVCC, indexes (GiST, GIN, BRIN), and JSONB operators.', 'RESOURCE', 'INTERMEDIATE', 'https://www.postgresql.org/docs/', 'PostgreSQL Global Development Group', 4.91, 28000, 9, TRUE),
(90, 'SQLZoo: Interactive Interactive SQL Tutorial and Exercises', 'Hands-on browser-based SQL sandbox with progressive exercises from basic SELECT to nested subqueries and joins.', 'RESOURCE', 'BEGINNER', 'https://sqlzoo.net/', 'SQLZoo Team', 4.76, 21000, 9, TRUE);

-- CATEGORY 10: CLOUD COMPUTING (IDs 91-100)
INSERT INTO contents (id, title, description, content_type, difficulty_level, url, author_or_instructor, rating_avg, rating_count, category_id, is_published) VALUES
(91, 'Ultimate AWS Certified Solutions Architect Associate (SAA-C03)', 'Thorough mastery of AWS cloud services: EC2, S3, RDS, DynamoDB, VPC, IAM, Route53, ECS, Lambda, and cloud architecture patterns.', 'COURSE', 'INTERMEDIATE', 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/', 'Stéphane Maarek', 4.88, 79000, 10, TRUE),
(92, 'Docker and Kubernetes: The Complete Guide', 'Build, test, and deploy Docker container applications and orchestrate them with Kubernetes clusters, Ingress, and Helm.', 'COURSE', 'INTERMEDIATE', 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/', 'Stephen Grider', 4.82, 41000, 10, TRUE),
(93, 'Cloud Native Patterns: Designing Change-tolerant Software', 'Guide to building software that thrives in the cloud: microservices, distributed configuration, canary rollouts, and circuit breakers.', 'BOOK', 'ADVANCED', 'https://www.manning.com/books/cloud-native-patterns', 'Cornelia Davis', 4.80, 2900, 10, TRUE),
(94, 'The Site Reliability Workbook: Practical Ways to Implement SRE', 'Hands-on companion to Google Site Reliability Engineering: SLOs, error budgets, postmortems, monitoring, and on-call practices.', 'BOOK', 'ADVANCED', 'https://sre.google/workbook/table-of-contents/', 'Betsy Beyer, Niall Murphy, David Rensin', 4.89, 6100, 10, TRUE),
(95, 'Deploying Production Microservices with Docker Compose and Nginx', 'Step-by-step tutorial on multi-container orchestration, networking, environment separation, and reverse proxy SSL termination.', 'TUTORIAL', 'BEGINNER', 'https://docs.docker.com/compose/gettingstarted/', 'Docker Documentation', 4.83, 15400, 10, TRUE),
(96, 'Deploying Spring Boot and FastAPI Applications to AWS ECS Fargate', 'Detailed walkthrough of containerizing backend services, setting up ALB, Task Definitions, CloudWatch logs, and auto-scaling.', 'TUTORIAL', 'INTERMEDIATE', 'https://aws.amazon.com/blogs/containers/', 'AWS Architecture Team', 4.85, 4700, 10, TRUE),
(97, 'Build an Automated Multi-Stage CI/CD Pipeline with GitHub Actions', 'Implement an automated pipeline that runs tests, builds Docker images, scans vulnerabilities with Trivy, and pushes to a registry.', 'CODING_PROBLEM', 'INTERMEDIATE', 'https://github.com/skills/continuous-integration', 'GitHub Skills', 4.87, 8900, 10, TRUE),
(98, 'Architect a Disaster-Resilient Multi-Region AWS VPC Infrastructure', 'Design and deploy Terraform manifests for cross-region peering, private subnets, NAT gateways, and automated failover.', 'CODING_PROBLEM', 'ADVANCED', 'https://learn.hashicorp.com/terraform', 'HashiCorp Learn', 4.90, 3100, 10, TRUE),
(99, 'AWS Well-Architected Framework Documentation', 'Architectural best practices across the six pillars: Operational Excellence, Security, Reliability, Performance, Cost, and Sustainability.', 'RESOURCE', 'INTERMEDIATE', 'https://aws.amazon.com/architecture/well-architected/', 'Amazon Web Services', 4.92, 19000, 10, TRUE),
(100, 'The Cloud Native Computing Foundation (CNCF) Cloud Native Landscape', 'Interactive directory mapping the entire ecosystem of container runtimes, service meshes, observability, and orchestration tools.', 'RESOURCE', 'BEGINNER', 'https://landscape.cncf.io/', 'CNCF', 4.91, 33000, 10, TRUE);

-- =============================================================================
-- TAG MAPPINGS FOR ALL 100 SAMPLE CONTENTS
-- =============================================================================
INSERT INTO content_tags (content_id, tag_id) VALUES
-- AI (1-10)
(1, 1), (1, 4), (1, 16),
(2, 4), (2, 5), (2, 6), (2, 23),
(3, 4), (3, 16),
(4, 5), (4, 6),
(5, 5), (5, 23), (5, 24),
(6, 1), (6, 4),
(7, 1), (7, 16),
(8, 1), (8, 5), (8, 21),
(9, 4), (9, 16),
(10, 4), (10, 26),
-- ML (11-20)
(11, 4), (11, 22), (11, 1),
(12, 4), (12, 23),
(13, 1), (13, 4), (13, 22), (13, 24),
(14, 4), (14, 16),
(15, 1), (15, 4), (15, 22),
(16, 1), (16, 4),
(17, 1), (17, 4), (17, 20),
(18, 1), (18, 4),
(19, 4), (19, 24),
(20, 4), (20, 5),
-- Python (21-30)
(21, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1), (25, 26),
(26, 1),
(27, 1), (27, 16), (27, 17), (27, 18),
(28, 1), (28, 26),
(29, 1),
(30, 1),
-- Java (31-40)
(31, 2),
(32, 2), (32, 7), (32, 25), (32, 26),
(33, 2),
(34, 2),
(35, 2),
(36, 2), (36, 7), (36, 26),
(37, 2), (37, 17),
(38, 2), (38, 16), (38, 17), (38, 18),
(39, 2),
(40, 2), (40, 7),
-- C++ (41-50)
(41, 3),
(42, 3),
(43, 3),
(44, 3),
(45, 3),
(46, 3),
(47, 3), (47, 16), (47, 17),
(48, 3), (48, 16),
(49, 3),
(50, 3),
-- Data Science (51-60)
(51, 1), (51, 9), (51, 20),
(52, 1), (52, 20), (52, 21),
(53, 1), (53, 20), (53, 21),
(54, 20),
(55, 1), (55, 20),
(56, 1), (56, 4), (56, 22),
(57, 1), (57, 4), (57, 20),
(58, 1), (58, 4), (58, 22),
(59, 1), (59, 20),
(60, 4), (60, 5),
-- DSA (61-70)
(61, 16), (61, 17),
(62, 16), (62, 17), (62, 18),
(63, 16), (63, 17),
(64, 16), (64, 17),
(65, 16), (65, 18),
(66, 16), (66, 17),
(67, 16), (67, 17), (67, 18),
(68, 16), (68, 17), (68, 18),
(69, 16), (69, 17), (69, 18),
(70, 3), (70, 16), (70, 17),
-- Web Dev (71-80)
(71, 8), (71, 26), (71, 28),
(72, 8), (72, 26), (72, 29),
(73, 28),
(74, 28),
(75, 27), (75, 28),
(76, 8), (76, 28),
(77, 8), (77, 28),
(78, 8), (78, 28),
(79, 27), (79, 28),
(80, 8), (80, 28),
-- Databases (81-90)
(81, 9), (81, 11),
(82, 9), (82, 11),
(83, 9), (83, 19), (83, 25),
(84, 9),
(85, 9), (85, 11),
(86, 9), (86, 10),
(87, 9), (87, 18),
(88, 9), (88, 18),
(89, 9), (89, 10),
(90, 9),
-- Cloud Computing (91-100)
(91, 14), (91, 15),
(92, 12), (92, 13), (92, 30),
(93, 15), (93, 25),
(94, 30),
(95, 12), (95, 30),
(96, 7), (96, 14), (96, 25),
(97, 12), (97, 30),
(98, 14), (98, 15),
(99, 14), (99, 15), (99, 19),
(100, 12), (100, 13), (100, 15)
ON DUPLICATE KEY UPDATE content_id=VALUES(content_id);
