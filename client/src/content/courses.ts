import type {
  Course,
  CourseModule,
  CourseSummary,
  CourseTrack,
} from "@elyse/database/types";

/**
 * ELYSE DEV ACADEMY — course catalogue.
 *
 * ⚠️ EDITABLE — this is the single source of truth for the academy.
 *
 *  • `status` decides what the site claims. `"available"` means the material
 *    exists and can be studied now; `"in-development"` means the curriculum is
 *    published while lessons are being produced; `"planned"` is a roadmap entry.
 *    Change one word here and every page, badge and certificate follows.
 *  • Every course is written from the language's real ecosystem: the tooling,
 *    the concepts and the capstone project are specific to that language, not
 *    copy-paste. Nothing claims student numbers, ratings or reviews — those are
 *    facts only you can supply.
 *  • `mark` is the short label drawn on the generated course artwork; `image`
 *    points at that artwork (see `client/scripts/generate-course-artwork.mjs`).
 *  • Adding a language = adding one object below. Nothing else needs to change.
 */

export const courseTracks: CourseTrack[] = [
  {
    id: "web",
    name: "Web & Frontend",
    emoji: "🌐",
    description:
      "The languages a browser understands, from the document itself to the applications built on top of it.",
  },
  {
    id: "backend",
    name: "Backend & APIs",
    emoji: "⚙️",
    description:
      "Server-side languages for APIs, data-driven products and the systems other software talks to.",
  },
  {
    id: "systems",
    name: "Systems & Performance",
    emoji: "🚀",
    description:
      "Languages where memory, speed and hardware are part of the design rather than a hidden detail.",
  },
  {
    id: "data",
    name: "Data & Query",
    emoji: "🗄️",
    description:
      "Languages and query tools for asking questions of data, from reporting to scientific computing.",
  },
  {
    id: "mobile",
    name: "Mobile & Apps",
    emoji: "📱",
    description:
      "Languages used to ship applications to phones and tablets on the platforms people actually carry.",
  },
  {
    id: "scripting",
    name: "Scripting & Automation",
    emoji: "🧰",
    description:
      "The languages that make a computer do repetitive work properly, on your machine or on a server.",
  },
  {
    id: "functional",
    name: "Functional & Logic",
    emoji: "🧠",
    description:
      "Languages that change how you think about state, data and correctness — useful even if you never ship them.",
  },
];

interface CourseSeed {
  slug: string;
  language: string;
  mark: string;
  trackId: string;
  level: Course["level"];
  status: Course["status"];
  tagline: string;
  summary: string;
  weeks: number;
  hours: number;
  prerequisites: string[];
  /** What a student installs in week one. */
  tooling: string[];
  /** The three language-specific modules at the centre of the course. */
  core: { t: string; s: string }[];
  outcomes: string[];
  /** Completes the sentence "Plan, build and ship …". */
  capstone: string;
  featured?: boolean;
}

const seeds: CourseSeed[] = [
  /* ---------------------------------------------------------------- web --- */
  {
    slug: "html-and-css",
    language: "HTML & CSS",
    mark: "H5",
    trackId: "web",
    level: "beginner",
    status: "available",
    tagline: "The document language and the stylesheet language behind every website",
    summary:
      "Start where the web starts: semantic HTML, the box model, layout with Flexbox and Grid, and an interface that stays usable on a 320px screen and on a 4K monitor.",
    weeks: 5,
    hours: 30,
    prerequisites: ["A computer and a browser", "No previous code required"],
    tooling: ["VS Code with Live Server", "Chrome DevTools", "W3C validator"],
    core: [
      {
        t: "Semantics before styling",
        s: "Headings, landmarks, lists, forms and tables chosen for meaning — the structure a screen reader, a search engine and a future maintainer all depend on.",
      },
      {
        t: "Layout that survives real content",
        s: "Flexbox and Grid for one-dimensional and two-dimensional layout, spacing with gap, and the mistakes that cause overflow on small screens.",
      },
      {
        t: "Responsive design and accessibility",
        s: "Media queries and fluid sizing, focus states, colour contrast, reduced-motion and the audit habit that catches problems before your users do.",
      },
    ],
    outcomes: [
      "Build a semantic, responsive page from a design without a framework",
      "Diagnose layout bugs in DevTools instead of guessing at them",
      "Pass a basic accessibility review on your own work",
    ],
    capstone: "a responsive multi-section landing page with a working, accessible contact form",
    featured: true,
  },
  {
    slug: "javascript",
    language: "JavaScript",
    mark: "JS",
    trackId: "web",
    level: "beginner",
    status: "available",
    tagline: "The language of the browser, now also the language of the server",
    summary:
      "Learn JavaScript the way it is actually written today: modern syntax, the event loop, the DOM, fetch, modules and the parts of the language that catch people out.",
    weeks: 8,
    hours: 60,
    prerequisites: ["Comfortable with HTML and CSS"],
    tooling: ["Node.js and npm", "VS Code debugger", "Vitest"],
    core: [
      {
        t: "Values, scope and functions",
        s: "let and const, closures, arrow functions, destructuring and the difference between copying a value and copying a reference.",
      },
      {
        t: "The event loop and async work",
        s: "Why a browser never blocks, callbacks to promises to async/await, and how to handle failures from fetch instead of swallowing them.",
      },
      {
        t: "The DOM and browser APIs",
        s: "Selecting and updating elements, events and delegation, forms and validation, local storage, and rendering lists without fighting the DOM.",
      },
    ],
    outcomes: [
      "Write modern JavaScript without leaning on a framework",
      "Fetch, cache and render remote data with proper error handling",
      "Debug a failing script with breakpoints rather than console.log everywhere",
    ],
    capstone: "a browser app that talks to a public API, with loading, empty and error states",
    featured: true,
  },
  {
    slug: "typescript",
    language: "TypeScript",
    mark: "TS",
    trackId: "web",
    level: "intermediate",
    status: "available",
    tagline: "JavaScript with the safety net you actually want in a team",
    summary:
      "Types that earn their place: modelling data with unions, narrowing safely, generics that reduce duplication, and strict-mode configuration that catches real bugs.",
    weeks: 7,
    hours: 50,
    prerequisites: ["Solid JavaScript", "Some experience with a code editor and terminal"],
    tooling: ["TypeScript compiler", "tsx for running files", "ESLint with typescript-eslint"],
    core: [
      {
        t: "Modelling with the type system",
        s: "Interfaces and type aliases, unions of literal values, optional and readonly properties, and designing types that make invalid states unrepresentable.",
      },
      {
        t: "Narrowing and generics",
        s: "Control-flow narrowing, type guards and discriminated unions, then generics and utility types (Pick, Omit, Record, Partial) to remove repetition honestly.",
      },
      {
        t: "Types at the boundaries",
        s: "Typing API responses, validating unknown input at runtime with a schema library, and keeping `strict` on without reaching for `any`.",
      },
    ],
    outcomes: [
      "Turn a JavaScript project into a strict TypeScript one without a rewrite",
      "Model API contracts so the compiler catches breaking changes",
      "Read and write generics instead of avoiding the library that uses them",
    ],
    capstone: "a typed API client with runtime validation, tests and zero `any` in the public types",
    featured: true,
  },

  /* ------------------------------------------------------------ backend --- */
  {
    slug: "php",
    language: "PHP",
    mark: "PHP",
    trackId: "backend",
    level: "beginner",
    status: "available",
    tagline: "The server language that still powers most of the web",
    summary:
      "Modern PHP, not the version people complain about: Composer, typed functions, PDO with prepared statements, sessions, and building a real request/response cycle.",
    weeks: 8,
    hours: 56,
    prerequisites: ["Basic HTML", "A little programming experience helps"],
    tooling: ["PHP 8 with the built-in server", "Composer", "Xdebug + PHPUnit"],
    core: [
      {
        t: "Language fundamentals, properly typed",
        s: "Types and strict_types, arrays as the workhorse data structure, functions, classes, namespaces and how PSR autoloading actually finds your files.",
      },
      {
        t: "Requests, forms and sessions",
        s: "Superglobals, method handling, validating and escaping input, CSRF tokens, sessions and cookies, and why output escaping is not optional.",
      },
      {
        t: "Databases with PDO",
        s: "Connecting with PDO, prepared statements against SQL injection, transactions, and a small repository layer that keeps SQL in one place.",
      },
    ],
    outcomes: [
      "Build a multi-page PHP application with clean separation of concerns",
      "Store and read data safely with PDO and prepared statements",
      "Avoid the five mistakes that make PHP applications insecure",
    ],
    capstone: "a CRUD web application with authentication, validation and a small template layer",
    featured: true,
  },
  {
    slug: "python",
    language: "Python",
    mark: "PY",
    trackId: "backend",
    level: "beginner",
    status: "in-development",
    tagline: "The most readable language for scripting, data and backend work",
    summary:
      "From first script to a tested application: the language's data model, error handling, virtual environments, files, HTTP and the standard library you already have.",
    weeks: 8,
    hours: 60,
    prerequisites: ["Comfortable using a terminal"],
    tooling: ["Python 3 with venv", "uv or pip for dependencies", "pytest and ruff"],
    core: [
      {
        t: "The Python data model",
        s: "Lists, tuples, dictionaries and sets, comprehensions, slicing, mutability, and why the iterator protocol explains most of Python's syntax.",
      },
      {
        t: "Functions, modules and errors",
        s: "Default and keyword arguments, decorators, modules and packages, exceptions and context managers — including writing your own.",
      },
      {
        t: "Files, HTTP and the standard library",
        s: "Reading and writing files safely, pathlib, JSON and CSV, calling APIs with requests, and knowing when the standard library is enough.",
      },
    ],
    outcomes: [
      "Automate a real task: files, APIs and data in one script",
      "Structure a project into modules with tests and a virtual environment",
      "Handle failure with exceptions and log it usefully",
    ],
    capstone: "a command-line tool that pulls data from an API, stores it and prints a report",
  },
  {
    slug: "java",
    language: "Java",
    mark: "JV",
    trackId: "backend",
    level: "intermediate",
    status: "in-development",
    tagline: "The language of large systems, Android and enterprise backends",
    summary:
      "Object orientation the way Java intends it, the collections framework, generics, exceptions, Maven, and the JVM basics that explain how your code runs.",
    weeks: 10,
    hours: 80,
    prerequisites: ["Programming experience in any language"],
    tooling: ["JDK 21", "Maven or Gradle", "JUnit 5"],
    core: [
      {
        t: "Classes, interfaces and design",
        s: "Objects, encapsulation, inheritance versus composition, interfaces and abstract classes, and when a design pattern is genuinely earning its place.",
      },
      {
        t: "Collections and generics",
        s: "List, Set, Map and their implementations, iteration and streams, generics and bounded type parameters, and the cost of each choice.",
      },
      {
        t: "Exceptions, threads and the JVM",
        s: "Checked and unchecked exceptions, try-with-resources, threading basics, the class loader, garbage collection and JVM tuning vocabulary.",
      },
    ],
    outcomes: [
      "Design and test a layered Java application with Maven",
      "Choose the right collection for a workload and explain why",
      "Read a stack trace and a heap dump without panicking",
    ],
    capstone: "a REST service with layered architecture, validation and JUnit tests",
  },
  {
    slug: "csharp",
    language: "C#",
    mark: "C#",
    trackId: "backend",
    level: "intermediate",
    status: "in-development",
    tagline: "A modern, strongly typed language for web, desktop and games",
    summary:
      "C# through the .NET CLI: types and LINQ, async/await, dependency injection, ASP.NET Core minimal APIs and automated tests, all runnable on Windows, macOS or Linux.",
    weeks: 10,
    hours: 76,
    prerequisites: ["Object-oriented programming basics"],
    tooling: [".NET SDK", "dotnet CLI", "xUnit"],
    core: [
      {
        t: "Types, properties and LINQ",
        s: "Value and reference types, records and properties, nullable reference types, and querying collections with LINQ instead of hand-written loops.",
      },
      {
        t: "Async, exceptions and resources",
        s: "Task and async/await, cancellation, exception filters, and deterministic disposal with `using` — the difference between correct and lucky.",
      },
      {
        t: "Web APIs with ASP.NET Core",
        s: "Minimal APIs, routing, model binding and validation, dependency injection, middleware and configuration across environments.",
      },
    ],
    outcomes: [
      "Ship a documented ASP.NET Core API from the command line",
      "Use LINQ and async correctly under load",
      "Structure a solution into testable projects",
    ],
    capstone: "a documented .NET web API with injected services and integration tests",
  },
  {
    slug: "go",
    language: "Go",
    mark: "GO",
    trackId: "backend",
    level: "intermediate",
    status: "in-development",
    tagline: "Small language, fast binaries, excellent concurrency",
    summary:
      "Go's deliberate simplicity: goroutines and channels, interfaces by behaviour, the standard library HTTP stack, and building a service that deploys as one static binary.",
    weeks: 7,
    hours: 52,
    prerequisites: ["Comfortable with a compiled language or JavaScript"],
    tooling: ["Go toolchain", "go test and go vet", "Delve debugger"],
    core: [
      {
        t: "Types, interfaces and composition",
        s: "Structs and methods, slices and maps, implicit interface satisfaction, embedding, and why Go prefers small interfaces.",
      },
      {
        t: "Concurrency with goroutines",
        s: "Goroutines, channels, select, sync primitives, context cancellation, and the race detector that finds the bugs tests miss.",
      },
      {
        t: "Services with the standard library",
        s: "net/http handlers and middleware, encoding/json, error wrapping, graceful shutdown and cross-compiling a static binary.",
      },
    ],
    outcomes: [
      "Write concurrent Go that passes the race detector",
      "Build and deploy an HTTP service as a single binary",
      "Benchmark and profile before optimising",
    ],
    capstone: "a concurrent HTTP service with tests, benchmarks and a container build",
  },
  {
    slug: "ruby",
    language: "Ruby",
    mark: "RB",
    trackId: "backend",
    level: "beginner",
    status: "in-development",
    tagline: "A language designed for developer happiness and readable code",
    summary:
      "Ruby's expressive syntax, blocks and objects, then a small web application with Sinatra, a database layer and tests — the fastest route to shipping something readable.",
    weeks: 6,
    hours: 44,
    prerequisites: ["Basic programming experience"],
    tooling: ["Ruby with rbenv", "Bundler and gems", "RSpec and RuboCop"],
    core: [
      {
        t: "Objects, blocks and enumerables",
        s: "Everything is an object, blocks and Procs, modules as mixins, and the Enumerable methods that replace most loops you would write elsewhere.",
      },
      {
        t: "Files, gems and structure",
        s: "Reading data, organising a project into lib and spec folders, dependency management with Bundler, and semantic versioning of your own gem.",
      },
      {
        t: "Web applications with Sinatra",
        s: "Routes and parameters, templates, sessions, an ORM for persistence, and configuration that differs between development and production.",
      },
    ],
    outcomes: [
      "Write idiomatic Ruby that reads like a sentence",
      "Build and test a small web application",
      "Package and reuse your own code as a gem",
    ],
    capstone: "a tested web application with persistence, sessions and a clean repository layer",
  },
  {
    slug: "elixir",
    language: "Elixir",
    mark: "EX",
    trackId: "backend",
    level: "advanced",
    status: "in-development",
    tagline: "Functional, concurrent and famously fault-tolerant",
    summary:
      "Pattern matching, immutable data and the Erlang virtual machine — then processes, supervision trees and real-time features through Phoenix channels.",
    weeks: 9,
    hours: 70,
    prerequisites: ["Experience in another backend language", "Comfort with the command line"],
    tooling: ["Elixir and Erlang/OTP", "Mix and Hex", "ExUnit"],
    core: [
      {
        t: "Pattern matching and pipelines",
        s: "Match operator, destructuring, guards, the pipe operator and with-expressions, and how to write error paths as data instead of exceptions.",
      },
      {
        t: "Processes and supervision",
        s: "Spawned processes, message passing, GenServer state, supervision trees and the 'let it crash' philosophy that makes systems recoverable.",
      },
      {
        t: "Real-time web with Phoenix",
        s: "Routers and contexts, Ecto changesets and queries, and LiveView or channels for interfaces that update without a page reload.",
      },
    ],
    outcomes: [
      "Model a domain with immutable data and pattern matching",
      "Supervise long-running work so failures do not take the system down",
      "Ship a real-time feature over websockets",
    ],
    capstone: "a supervised real-time service with Ecto persistence and ExUnit coverage",
  },
  {
    slug: "scala",
    language: "Scala",
    mark: "SC",
    trackId: "backend",
    level: "advanced",
    status: "in-development",
    tagline: "Object-oriented and functional on the JVM, for data at scale",
    summary:
      "Scala's dual nature: case classes and pattern matching, collections and higher-order functions, then futures and a typed service on the JVM.",
    weeks: 9,
    hours: 72,
    prerequisites: ["Java or another JVM language", "Some functional programming exposure"],
    tooling: ["sbt or scala-cli", "Scala 3 compiler", "ScalaTest and scalafmt"],
    core: [
      {
        t: "Case classes and pattern matching",
        s: "Algebraic data types as sealed traits, exhaustive matching the compiler checks, Option and Either instead of null and exceptions.",
      },
      {
        t: "Collections and higher-order functions",
        s: "map, flatMap, fold and for-comprehensions, laziness with views and streams, and the performance consequences of each transformation.",
      },
      {
        t: "Concurrency and typed effects",
        s: "Futures and ExecutionContext, error handling in async code, and an introduction to effect systems for describing side effects explicitly.",
      },
    ],
    outcomes: [
      "Express a domain as types the compiler can verify",
      "Process collections declaratively without losing track of cost",
      "Write asynchronous JVM code that handles failure deliberately",
    ],
    capstone: "a concurrent Scala service with typed errors, tests and a build definition",
  },
  {
    slug: "solidity",
    language: "Solidity",
    mark: "SOL",
    trackId: "backend",
    level: "advanced",
    status: "planned",
    tagline: "Smart contracts for the Ethereum virtual machine",
    summary:
      "Contract programming where every line costs money: storage layout and gas, access control, reentrancy, testing with Foundry and the discipline of an upgrade plan.",
    weeks: 8,
    hours: 58,
    prerequisites: ["JavaScript or another C-family language", "Basic understanding of blockchain concepts"],
    tooling: ["Foundry (forge, anvil, cast)", "Solidity compiler", "OpenZeppelin contracts"],
    core: [
      {
        t: "Contracts, storage and gas",
        s: "State variables and visibility, functions and modifiers, calldata versus memory versus storage, and reading a gas report to find waste.",
      },
      {
        t: "Security patterns that matter",
        s: "Reentrancy and checks-effects-interactions, access control, integer handling, oracle and price manipulation, and why audits exist.",
      },
      {
        t: "Testing and deploying",
        s: "Unit and fuzz tests with Foundry, fork tests against mainnet state, deployment scripts, verification and upgradeable proxy patterns.",
      },
    ],
    outcomes: [
      "Write and test a contract suite locally before spending gas",
      "Recognise the common exploit classes in reviewed code",
      "Deploy, verify and interact with a contract from the CLI",
    ],
    capstone: "an audited-style contract with fuzz tests, deployment scripts and a written threat model",
  },

  /* ------------------------------------------------------------ systems --- */
  {
    slug: "c",
    language: "C",
    mark: "C",
    trackId: "systems",
    level: "advanced",
    status: "in-development",
    tagline: "The language underneath almost everything else",
    summary:
      "Pointers, memory and the machine: manual allocation, structs and data structures, the build toolchain, and using a debugger and sanitiser to find real bugs.",
    weeks: 10,
    hours: 84,
    prerequisites: ["Comfort with a terminal", "Basic programming in any language"],
    tooling: ["GCC or Clang, make", "gdb and valgrind", "AddressSanitizer"],
    core: [
      {
        t: "Pointers and memory",
        s: "Addresses and indirection, pointer arithmetic, the stack versus the heap, malloc and free, and every way a program can leak or corrupt memory.",
      },
      {
        t: "Structs, files and data structures",
        s: "Defining and passing structs, linked lists, dynamic arrays and hash tables you write yourself, plus binary and text file I/O.",
      },
      {
        t: "The toolchain and debugging",
        s: "Compilation stages and linking, header files and make, reading a core dump in gdb, and using sanitizers to turn undefined behaviour into a report.",
      },
    ],
    outcomes: [
      "Write C that valgrind reports as clean",
      "Build a multi-file project with a Makefile",
      "Debug memory corruption from a stack trace instead of by guessing",
    ],
    capstone: "a small command-line tool with its own data structure, Makefile and sanitizer-clean test run",
  },
  {
    slug: "cpp",
    language: "C++",
    mark: "C++",
    trackId: "systems",
    level: "advanced",
    status: "in-development",
    tagline: "Performance with zero-cost abstractions",
    summary:
      "Modern C++ (17 and later): RAII and smart pointers, the standard library containers and algorithms, templates, move semantics and CMake.",
    weeks: 11,
    hours: 90,
    prerequisites: ["C or strong programming fundamentals"],
    tooling: ["CMake and Ninja", "GCC or Clang with sanitizers", "GoogleTest and clang-format"],
    core: [
      {
        t: "RAII, references and smart pointers",
        s: "Constructors and destructors as resource management, references versus pointers, unique_ptr and shared_ptr, and why manual delete is a last resort.",
      },
      {
        t: "The standard library",
        s: "vector, string, map and their performance characteristics, iterators and algorithms, ranges, and avoiding the classic dangling-iterator bugs.",
      },
      {
        t: "Move semantics, templates and builds",
        s: "Copy versus move, rvalue references, template functions and classes with concepts, and structuring a multi-target build with CMake.",
      },
    ],
    outcomes: [
      "Write leak-free modern C++ with tests",
      "Choose containers and algorithms on measured cost",
      "Configure a multi-target CMake project from scratch",
    ],
    capstone: "a performance-sensitive library with benchmarks, tests and a CMake build",
  },
  {
    slug: "rust",
    language: "Rust",
    mark: "RS",
    trackId: "systems",
    level: "advanced",
    status: "in-development",
    tagline: "Memory safety without a garbage collector",
    summary:
      "The borrow checker as a design tool: ownership, traits and generics, error handling, fearless concurrency, and publishing a crate with tests and documentation.",
    weeks: 10,
    hours: 80,
    prerequisites: ["Experience in a systems or backend language"],
    tooling: ["rustup and cargo", "clippy and rustfmt", "cargo test and criterion"],
    core: [
      {
        t: "Ownership, borrowing and lifetimes",
        s: "Moves and copies, mutable versus shared borrows, lifetime annotations, and reading borrow-checker errors as design feedback rather than obstacles.",
      },
      {
        t: "Traits, generics and errors",
        s: "Trait definitions and implementations, generic bounds, enums for state, and Result-based error handling with the `?` operator and custom error types.",
      },
      {
        t: "Concurrency and the crate ecosystem",
        s: "Threads, channels and Arc/Mutex, async with tokio, choosing dependencies carefully, and publishing a documented crate to crates.io.",
      },
    ],
    outcomes: [
      "Design data structures the borrow checker accepts",
      "Write concurrent code that compiles without data races",
      "Publish a documented, tested crate",
    ],
    capstone: "a command-line tool published as a crate with integration tests and generated docs",
  },
  {
    slug: "zig",
    language: "Zig",
    mark: "ZG",
    trackId: "systems",
    level: "advanced",
    status: "planned",
    tagline: "A small systems language with explicit memory and great tooling",
    summary:
      "Explicit allocators, comptime instead of macros, first-class C interoperability and a build system that can compile C and C++ in the same project.",
    weeks: 7,
    hours: 52,
    prerequisites: ["C or C++ experience", "Understanding of manual memory management"],
    tooling: ["Zig compiler and build system", "zig fmt and zig test", "Valgrind or a sanitizer"],
    core: [
      {
        t: "Allocators and explicit memory",
        s: "The allocator interface, arena and general-purpose allocators, defer and errdefer for cleanup, and slices rather than null-terminated strings.",
      },
      {
        t: "Comptime and error unions",
        s: "Compile-time code execution, generic containers through comptime, error unions and try, and optional values without null pointers.",
      },
      {
        t: "C interop and the build system",
        s: "Calling and exporting C functions, cross-compilation to another architecture, and a build.zig that produces executables, tests and libraries.",
      },
    ],
    outcomes: [
      "Write systems code with no hidden allocations",
      "Cross-compile a binary for another platform",
      "Interoperate with an existing C library",
    ],
    capstone: "a cross-compiled CLI tool that links a C library and passes allocator-leak tests",
  },
  {
    slug: "assembly",
    language: "Assembly",
    mark: "ASM",
    trackId: "systems",
    level: "advanced",
    status: "planned",
    tagline: "What the machine actually executes",
    summary:
      "x86-64 fundamentals: registers and the stack, system calls, calling conventions and reading compiler output — the layer that makes debugging everything else easier.",
    weeks: 6,
    hours: 40,
    prerequisites: ["Strong C knowledge"],
    tooling: ["NASM or GNU as", "objdump and gdb", "Godbolt compiler explorer"],
    core: [
      {
        t: "Registers, memory and the stack",
        s: "General-purpose registers, addressing modes, stack frames and the calling convention that lets C and assembly call each other.",
      },
      {
        t: "Instructions, branches and syscalls",
        s: "Moving and comparing data, conditional jumps and loops, arithmetic flags, and making a Linux system call directly.",
      },
      {
        t: "Reading compiler output",
        s: "Compiling C to assembly, recognising optimisation patterns, and using objdump and gdb to understand a program you did not write.",
      },
    ],
    outcomes: [
      "Write and assemble a working program without a high-level compiler",
      "Explain a stack trace at the instruction level",
      "Read optimised compiler output with confidence",
    ],
    capstone: "a small assembly utility plus a written analysis of a C file's compiler output",
  },

  /* --------------------------------------------------------------- data --- */
  {
    slug: "sql",
    language: "SQL",
    mark: "SQL",
    trackId: "data",
    level: "beginner",
    status: "available",
    tagline: "The one language every developer eventually needs",
    summary:
      "From SELECT to schema design: joins and aggregation, subqueries and CTEs, indexes and query plans, transactions, and modelling data so it stays correct.",
    weeks: 6,
    hours: 44,
    prerequisites: ["Comfort with a terminal", "No database experience required"],
    tooling: ["PostgreSQL (or MySQL)", "psql CLI and a GUI client", "EXPLAIN ANALYZE"],
    core: [
      {
        t: "Querying: joins and aggregation",
        s: "INNER, LEFT and self joins, GROUP BY with HAVING, window functions, and the difference between filtering before and after aggregation.",
      },
      {
        t: "Schema design and integrity",
        s: "Primary and foreign keys, constraints, normalisation versus deliberate denormalisation, and migrations that can be rolled back safely.",
      },
      {
        t: "Indexes, plans and transactions",
        s: "B-tree and composite indexes, reading EXPLAIN plans, avoiding N+1 patterns, and isolating concurrent writes with the right transaction level.",
      },
    ],
    outcomes: [
      "Answer real business questions with a single correct query",
      "Design a schema that prevents invalid data",
      "Make a slow query fast and prove it with a query plan",
    ],
    capstone: "a designed schema, a seeded dataset, an indexed reporting query and a written plan analysis",
    featured: true,
  },
  {
    slug: "r",
    language: "R",
    mark: "R",
    trackId: "data",
    level: "intermediate",
    status: "in-development",
    tagline: "Statistics and visualisation for people who work with data",
    summary:
      "Vectors and data frames, the tidyverse approach to cleaning and reshaping, statistical summaries and plots that communicate a finding honestly.",
    weeks: 7,
    hours: 50,
    prerequisites: ["Basic programming concepts", "Some statistics familiarity helps"],
    tooling: ["R and RStudio", "tidyverse packages", "Quarto or R Markdown"],
    core: [
      {
        t: "Vectors, data frames and types",
        s: "Atomic vectors, factors and dates, list columns, and the indexing rules that explain most confusing R behaviour.",
      },
      {
        t: "Tidy data and transformation",
        s: "filter, select, mutate, group_by and summarise, reshaping with pivots, joining datasets, and handling missing values deliberately.",
      },
      {
        t: "Visualisation and reporting",
        s: "ggplot2 grammar of graphics, choosing the right chart for the question, colour and labelling for accessibility, and rendering a reproducible report.",
      },
    ],
    outcomes: [
      "Clean and reshape a messy dataset reproducibly",
      "Produce charts that do not mislead",
      "Deliver an analysis as a document someone else can reproduce",
    ],
    capstone: "a reproducible analysis of a public dataset published as a rendered report",
  },
  {
    slug: "julia",
    language: "Julia",
    mark: "JL",
    trackId: "data",
    level: "advanced",
    status: "planned",
    tagline: "Numerical computing that reads like mathematics and runs like C",
    summary:
      "Multiple dispatch, type stability and performance, arrays and broadcasting, then a data or simulation project with plots and tests.",
    weeks: 7,
    hours: 54,
    prerequisites: ["Programming experience", "Comfort with basic linear algebra"],
    tooling: ["Julia and the Pkg REPL", "Jupyter or Pluto notebooks", "Test and BenchmarkTools"],
    core: [
      {
        t: "Multiple dispatch and typing",
        s: "Generic functions and methods, abstract and concrete types, type stability, and why a type annotation can make code slower rather than faster.",
      },
      {
        t: "Arrays, broadcasting and performance",
        s: "Vectorised operations and the dot syntax, views versus copies, in-place mutation, and profiling to find the allocation hotspot.",
      },
      {
        t: "Packages, tests and plots",
        s: "Project environments and dependencies, writing package tests, and producing publication-quality figures with a plotting library.",
      },
    ],
    outcomes: [
      "Write type-stable Julia that performs close to compiled code",
      "Profile and remove allocations from a hot loop",
      "Package a numerical project with tests and figures",
    ],
    capstone: "a measured simulation or data pipeline packaged with tests, benchmarks and plots",
  },
  {
    slug: "fortran",
    language: "Fortran",
    mark: "FTN",
    trackId: "data",
    level: "advanced",
    status: "planned",
    tagline: "Still the language of weather models and heavy numerics",
    summary:
      "Modern Fortran (2008+): modules and typed procedures, arrays and intrinsic operations, then interoperating with C and parallelising a numerical kernel.",
    weeks: 6,
    hours: 42,
    prerequisites: ["A scientific or engineering background helps", "Basic programming"],
    tooling: ["gfortran or ifort", "fpm (Fortran Package Manager)", "OpenMP and a profiler"],
    core: [
      {
        t: "Modules and modern syntax",
        s: "Program units and modules, typed arguments with intent, allocatable arrays, derived types, and avoiding the fixed-form habits of old code.",
      },
      {
        t: "Array operations and numerics",
        s: "Whole-array expressions, intrinsics, array slicing, numerical precision and floating-point traps, and writing cache-friendly loops.",
      },
      {
        t: "Interoperability and parallelism",
        s: "The ISO_C_BINDING interface for calling C, build files for legacy code, and adding OpenMP directives to a kernel that already works.",
      },
    ],
    outcomes: [
      "Modernise part of a legacy numerical codebase",
      "Write array code that a profiler confirms is efficient",
      "Call C from Fortran (and back) without guessing at memory layout",
    ],
    capstone: "a parallelised numerical kernel with a C interoperability layer and benchmark results",
  },

  /* ------------------------------------------------------------- mobile --- */
  {
    slug: "swift",
    language: "Swift",
    mark: "SW",
    trackId: "mobile",
    level: "intermediate",
    status: "in-development",
    tagline: "Apple platforms, from first app to the App Store",
    summary:
      "Swift's optionals and value types, SwiftUI declarative interfaces, async work and persistence, then building, testing and shipping an app.",
    weeks: 9,
    hours: 68,
    prerequisites: ["Programming experience", "A Mac for building and testing"],
    tooling: ["Xcode and the Swift toolchain", "Swift Package Manager", "XCTest and Instruments"],
    core: [
      {
        t: "Optionals, value types and protocols",
        s: "Optional binding and chaining, structs versus classes, enums with associated values, protocol-oriented design and generics.",
      },
      {
        t: "SwiftUI interfaces and state",
        s: "Views and modifiers, @State and observable models, navigation and lists, animations, and building an interface that adapts to every screen size.",
      },
      {
        t: "Async work, data and shipping",
        s: "async/await and tasks, URLSession and Codable for APIs, persistence options, unit and UI tests, and the App Store submission checklist.",
      },
    ],
    outcomes: [
      "Build a multi-screen SwiftUI app that talks to an API",
      "Model data with Codable and persist it correctly",
      "Test and prepare an app for submission",
    ],
    capstone: "a tested SwiftUI app backed by a real API, with persistence and offline states",
  },
  {
    slug: "kotlin",
    language: "Kotlin",
    mark: "KT",
    trackId: "mobile",
    level: "intermediate",
    status: "in-development",
    tagline: "Android's modern language, and a capable JVM backend language too",
    summary:
      "Null safety, data classes and coroutines, Jetpack Compose interfaces, Room persistence and a tested Android application from empty project to release build.",
    weeks: 9,
    hours: 70,
    prerequisites: ["Some object-oriented programming experience"],
    tooling: ["Android Studio", "Gradle with the Kotlin DSL", "JUnit and AndroidX Test"],
    core: [
      {
        t: "Null safety and data classes",
        s: "Nullable and non-null types, safe calls and Elvis, data classes, sealed hierarchies when-expressions and the standard collection functions.",
      },
      {
        t: "Coroutines and asynchronous work",
        s: "suspend functions, scopes and structured concurrency, dispatchers, flows for streams of data, and the cancellation rules that keep apps responsive.",
      },
      {
        t: "Jetpack Compose and persistence",
        s: "Composable functions and state hoisting, navigation, theming, Room for local data, and networking with a typed HTTP client.",
      },
    ],
    outcomes: [
      "Build a Compose application with a real data layer",
      "Handle asynchronous work without leaking or blocking",
      "Run unit and instrumented tests against your own code",
    ],
    capstone: "a tested Compose app with offline persistence and a typed API client",
  },
  {
    slug: "dart",
    language: "Dart",
    mark: "DT",
    trackId: "mobile",
    level: "intermediate",
    status: "planned",
    tagline: "The language behind Flutter, for apps on every platform",
    summary:
      "Dart's sound null safety and async model, then Flutter widgets, state management, testing and building for Android, iOS and the web from one codebase.",
    weeks: 8,
    hours: 62,
    prerequisites: ["Programming experience in another language"],
    tooling: ["Flutter SDK and Dart", "DevTools profiler", "flutter test and integration_test"],
    core: [
      {
        t: "Dart without null surprises",
        s: "Sound null safety, final and const, records and pattern matching, futures and streams, and the language features Flutter leans on most.",
      },
      {
        t: "Flutter widgets and layout",
        s: "Composition over inheritance, the widget tree, constraints and layout, responsive breakpoints, theming and accessible semantics.",
      },
      {
        t: "State, storage and builds",
        s: "State management approaches and when each is appropriate, local storage, platform channels, widget tests, and release builds per platform.",
      },
    ],
    outcomes: [
      "Ship one codebase to Android, iOS and web",
      "Manage application state without a tangle of callbacks",
      "Write widget tests that catch layout regressions",
    ],
    capstone: "a responsive Flutter application with state management, persistence and widget tests",
  },

  /* ---------------------------------------------------------- scripting --- */
  {
    slug: "bash",
    language: "Bash",
    mark: "SH",
    trackId: "scripting",
    level: "beginner",
    status: "available",
    tagline: "The shell language every developer should be able to read",
    summary:
      "Pipes and redirection, variables and quoting, conditionals and loops, then writing scripts that fail safely and can be trusted in a deploy pipeline.",
    weeks: 4,
    hours: 24,
    prerequisites: ["Willingness to use a terminal"],
    tooling: ["Bash and the coreutils", "shellcheck", "bats for script tests"],
    core: [
      {
        t: "Pipes, redirection and the filesystem",
        s: "Standard streams, pipes, redirection and here-documents, permissions, globbing, and composing small commands into one useful line.",
      },
      {
        t: "Quoting, variables and control flow",
        s: "The rules that decide whether your variable survives intact, command substitution, tests and conditionals, loops, functions and exit codes.",
      },
      {
        t: "Scripts you can trust",
        s: "set -euo pipefail, traps for cleanup, argument parsing, temporary files, logging, and linting every script with shellcheck.",
      },
    ],
    outcomes: [
      "Automate a repetitive task in a script a colleague can read",
      "Write scripts that stop on failure instead of corrupting data",
      "Test your scripts instead of hoping",
    ],
    capstone: "an idempotent automation script with argument parsing, tests and shellcheck-clean linting",
  },
  {
    slug: "powershell",
    language: "PowerShell",
    mark: "PS",
    trackId: "scripting",
    level: "beginner",
    status: "planned",
    tagline: "Serious scripting across Windows, Linux and CI",
    summary:
      "Objects instead of text: the pipeline, cmdlets and parameters, error handling, modules, and automating administration tasks across platforms.",
    weeks: 5,
    hours: 30,
    prerequisites: ["Basic command-line familiarity"],
    tooling: ["PowerShell 7", "PSScriptAnalyzer", "Pester"],
    core: [
      {
        t: "Objects on the pipeline",
        s: "Why PowerShell passes objects rather than text, cmdlet naming and parameters, filtering with Where-Object and shaping with Select-Object.",
      },
      {
        t: "Functions, errors and modules",
        s: "Advanced functions with parameter validation, terminating and non-terminating errors, try/catch/finally, and packaging reusable modules.",
      },
      {
        t: "Automation across platforms",
        s: "Working with files, processes, environment variables and REST APIs, scheduled jobs, and writing scripts that run in Linux CI too.",
      },
    ],
    outcomes: [
      "Automate an administration task end to end",
      "Write a module with validation and help text",
      "Test scripts with Pester in a pipeline",
    ],
    capstone: "a tested PowerShell module that automates a multi-step administrative task",
  },
  {
    slug: "lua",
    language: "Lua",
    mark: "LUA",
    trackId: "scripting",
    level: "beginner",
    status: "in-development",
    tagline: "Tiny, fast and embeddable — games, tools and configuration",
    summary:
      "A small language you can hold in your head: tables as the universal structure, metatables, modules, and embedding Lua inside a host application.",
    weeks: 4,
    hours: 26,
    prerequisites: ["Any previous programming experience"],
    tooling: ["Lua 5.4 and LuaJIT", "luarocks", "busted"],
    core: [
      {
        t: "Tables, the one data structure",
        s: "Arrays, dictionaries, records and namespaces — all tables; iteration, length semantics, and the aliasing behaviour that trips people up.",
      },
      {
        t: "Functions, metatables and modules",
        s: "First-class functions and closures, metatables and metamethods for operator overloading, and organising code into require-able modules.",
      },
      {
        t: "Hosting and embedding",
        s: "The C API basics for embedding a script engine, sandboxing, and the pattern used by game engines and configuration-driven tools.",
      },
    ],
    outcomes: [
      "Use tables idiomatically for every data shape",
      "Extend behaviour safely with metatables",
      "Embed a Lua interpreter in a host program",
    ],
    capstone: "a small scripting layer embedded in a host application with a sandboxed API",
  },
  {
    slug: "perl",
    language: "Perl",
    mark: "PL",
    trackId: "scripting",
    level: "intermediate",
    status: "planned",
    tagline: "The original practical extraction language — still excellent at text",
    summary:
      "Perl's approach to text processing: scalars, arrays and hashes, regular expressions done properly, files and CPAN, plus the discipline of modern Perl.",
    weeks: 5,
    hours: 34,
    prerequisites: ["Some scripting experience", "Comfort with regular expressions helps"],
    tooling: ["Perl 5 with perlbrew or plenv", "cpanm", "Test::More and Perl::Critic"],
    core: [
      {
        t: "Scalars, arrays and hashes",
        s: "Sigils and context (scalar versus list), references and nested data structures, sorting and slicing, and the debugging aids that make sense of it.",
      },
      {
        t: "Regular expressions and text",
        s: "Pattern matching, capture groups, substitutions and transliteration, non-greedy matching, and parsing logs without a forest of conditionals.",
      },
      {
        t: "Modules, testing and modern Perl",
        s: "CPAN and cpanm, writing modules with packages and exports, strict and warnings, Test::More, and the style rules of Perl::Critic.",
      },
    ],
    outcomes: [
      "Parse and transform messy text reliably",
      "Use CPAN modules instead of reinventing them",
      "Write tested, warning-free Perl",
    ],
    capstone: "a log-processing tool with tests, CPAN dependencies and a documented CLI",
  },

  /* --------------------------------------------------------- functional --- */
  {
    slug: "haskell",
    language: "Haskell",
    mark: "HS",
    trackId: "functional",
    level: "advanced",
    status: "in-development",
    tagline: "Purely functional, lazily evaluated and famously mind-expanding",
    summary:
      "Types as the design: algebraic data types, pattern matching, functors and monads, laziness, and building a small application with a real build tool.",
    weeks: 9,
    hours: 70,
    prerequisites: ["Programming experience in another language", "Patience with compiler errors"],
    tooling: ["GHCup, GHC and cabal", "ghcid and HLint", "Hspec and QuickCheck"],
    core: [
      {
        t: "Types, functions and pattern matching",
        s: "Type inference and signatures, algebraic data types, recursion instead of loops, currying and higher-order functions.",
      },
      {
        t: "Functors, applicatives and monads",
        s: "What those abstractions actually abstract: mapping over contexts, sequencing effects, and why Maybe and Either replace a sea of null checks.",
      },
      {
        t: "Laziness, effects and tooling",
        s: "How lazy evaluation works and where it bites, strictness annotations, IO and state, and structuring a project with cabal and a test suite.",
      },
    ],
    outcomes: [
      "Design a program around types before writing functions",
      "Use monads without hand-waving what they do",
      "Build, test and benchmark a Haskell project",
    ],
    capstone: "a typed application with property-based tests and a documented, justified type design",
  },
  {
    slug: "fsharp",
    language: "F#",
    mark: "F#",
    trackId: "functional",
    level: "advanced",
    status: "planned",
    tagline: "Functional programming on .NET, with excellent data tooling",
    summary:
      "F#'s functional core on a pragmatic platform: immutable data and pattern matching, pipelines, discriminated unions, async and data scripting.",
    weeks: 7,
    hours: 50,
    prerequisites: ["Some C# or .NET familiarity helps", "Functional basics recommended"],
    tooling: [".NET SDK with Ionide or Rider", "dotnet fsi scripting", "Expecto or xUnit"],
    core: [
      {
        t: "Immutability and pattern matching",
        s: "let bindings, records and discriminated unions, exhaustive matching, and modelling a domain so invalid states cannot be constructed.",
      },
      {
        t: "Pipelines, options and results",
        s: "Composition with the pipe operator, Option and Result, railway-oriented error handling, and writing pipelines that read like the specification.",
      },
      {
        t: "Async, scripting and data work",
        s: "Async and task workflows, type providers for typed access to data sources, and using dotnet fsi for exploratory data work.",
      },
    ],
    outcomes: [
      "Solve a domain problem with types and pipelines",
      "Handle errors as values instead of exceptions",
      "Use F# for data exploration as well as applications",
    ],
    capstone: "a typed .NET application with railway error handling and a test suite",
  },
  {
    slug: "clojure",
    language: "Clojure",
    mark: "CLJ",
    trackId: "functional",
    level: "advanced",
    status: "planned",
    tagline: "A Lisp on the JVM built around immutable data",
    summary:
      "Data-first programming: the REPL workflow, sequences and transforms, maps as records, atoms for state, and a small service with deps.edn.",
    weeks: 7,
    hours: 52,
    prerequisites: ["Java or JVM exposure", "Comfort with a REPL-driven workflow"],
    tooling: ["Clojure CLI and deps.edn", "REPL and Portal inspector", "clojure.test"],
    core: [
      {
        t: "REPL-driven development",
        s: "Evaluating forms in context, exploring data at the REPL, namespaces and requires, and the workflow that makes Lisp editing worth the parenthesis.",
      },
      {
        t: "Immutable data and sequences",
        s: "Vectors, maps and sets, the sequence abstraction, transducers, destructuring, and structural sharing that makes immutability affordable.",
      },
      {
        t: "State, concurrency and services",
        s: "Atoms, refs and software transactional memory, core.async basics, and building an HTTP service with routing, JSON and tests.",
      },
    ],
    outcomes: [
      "Work effectively with immutable collections",
      "Manage state changes without locks",
      "Ship a small Clojure service with tests",
    ],
    capstone: "an immutable-data service built at the REPL with tests and a deps.edn project",
  },
  {
    slug: "erlang",
    language: "Erlang",
    mark: "ERL",
    trackId: "functional",
    level: "advanced",
    status: "planned",
    tagline: "Built for systems that must not stop",
    summary:
      "Processes, messages and supervision from the language that gave us the telecom-grade uptime story — plus OTP behaviours you should reuse rather than reinvent.",
    weeks: 8,
    hours: 58,
    prerequisites: ["Functional programming exposure", "Backend or systems experience"],
    tooling: ["Erlang/OTP and rebar3", "Observer for process inspection", "EUnit and Common Test"],
    core: [
      {
        t: "Processes and message passing",
        s: "Spawning processes, sending and receiving messages, selective receive, links and monitors, and reasoning about failure between processes.",
      },
      {
        t: "OTP behaviours and supervision",
        s: "GenServer, Supervisor and Application behaviours, supervision strategies, hot code upgrades, and the design conventions OTP enforces.",
      },
      {
        t: "Distribution and observability",
        s: "Node connections and clustering, distributed data, process inspection with Observer, and tracing a live system without stopping it.",
      },
    ],
    outcomes: [
      "Design supervision trees that recover from failure",
      "Reuse OTP behaviours instead of hand-rolling processes",
      "Inspect and trace a running distributed node",
    ],
    capstone: "a supervised, distributed service with OTP behaviours and failure-injection tests",
  },
  {
    slug: "prolog",
    language: "Prolog",
    mark: "PRL",
    trackId: "functional",
    level: "advanced",
    status: "planned",
    tagline: "Declare what is true and let the engine search for the answer",
    summary:
      "Logic programming: facts, rules and unification, recursion and backtracking, then constraint solving on a genuine puzzle or scheduling problem.",
    weeks: 5,
    hours: 34,
    prerequisites: ["Comfortable with recursion", "Willingness to think differently"],
    tooling: ["SWI-Prolog", "the interactive top level", "plunit"],
    core: [
      {
        t: "Facts, rules and unification",
        s: "Knowledge bases, variables and unification, querying, and how the resolution algorithm derives an answer from the clauses you wrote.",
      },
      {
        t: "Recursion, lists and backtracking",
        s: "List patterns, recursive predicates, cuts and negation, and controlling the search space instead of letting it explode.",
      },
      {
        t: "Constraints and real problems",
        s: "Constraint logic programming over finite domains for scheduling and puzzles, plus writing and running predicate tests with plunit.",
      },
    ],
    outcomes: [
      "Model a problem as facts and rules",
      "Control backtracking deliberately",
      "Solve a scheduling task with constraint programming",
    ],
    capstone: "a declarative solver for a real constraint problem, with predicate tests",
  },
];

/**
 * Distributes the course hours across six modules.
 *
 * The split is 8% setup, 20% per core module, 12% quality and 20% capstone — and
 * the rounding remainder is added to the capstone so the module hours always sum
 * to exactly `hours`. A curriculum that does not add up is a small lie, and the
 * test suite checks for it.
 */
function buildModules(seed: CourseSeed): CourseModule[] {
  const share = (percent: number) => Math.round((seed.hours * percent) / 100);
  const [install, debug] = seed.tooling;

  const allocation = [8, 20, 20, 20, 12, 20];
  const hours = allocation.map(share);
  const drift = seed.hours - hours.reduce((total, value) => total + value, 0);
  const lastIndex = hours.length - 1;
  hours[lastIndex] = Math.max(1, (hours[lastIndex] ?? 0) + drift);

  return [
    {
      title: `Getting set up with ${seed.language}`,
      summary: `${seed.tooling.join(", ")} — installing the toolchain, running a first program, and learning how ${seed.language} reports errors.`,
      hours: hours[0]!,
    },
    ...seed.core.map((item, index) => ({
      title: item.t,
      summary: item.s,
      hours: hours[index + 1]!,
    })),
    {
      title: "Testing, quality and debugging",
      summary: `Writing tests from day one with ${debug}, reading failures, and setting up the linters and formatters that keep a codebase consistent.`,
      hours: hours[4]!,
    },
    {
      title: `Capstone — ${seed.capstone.replace(/^an? /, "")}`,
      summary: `Plan, build and ship ${seed.capstone}, then review it against the checklist from every earlier module${install ? ` — starting from a clean ${seed.language} project, as you would at work` : ""}.`,
      hours: hours[5]!,
    },
  ];
}

export const courses: Course[] = seeds.map((seed) => ({
  slug: seed.slug,
  language: seed.language,
  mark: seed.mark,
  trackId: seed.trackId,
  level: seed.level,
  status: seed.status,
  tagline: seed.tagline,
  summary: seed.summary,
  weeks: seed.weeks,
  hours: seed.hours,
  outcomes: seed.outcomes,
  modules: buildModules(seed),
  capstone: seed.capstone,
  prerequisites: seed.prerequisites,
  tooling: seed.tooling,
  image: `/images/courses/${seed.slug}.svg`,
  ...(seed.featured ? { featured: true } : {}),
}));

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

export const courseLevelLabels: Record<Course["level"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const courseStatusLabels: Record<Course["status"], string> = {
  available: "Available now",
  "in-development": "In development",
  planned: "On the roadmap",
};

/** Strips a course down to what a card or list needs to render. */
export function toCourseSummary(course: Course): CourseSummary {
  return {
    slug: course.slug,
    language: course.language,
    mark: course.mark,
    trackId: course.trackId,
    level: course.level,
    status: course.status,
    tagline: course.tagline,
    weeks: course.weeks,
    hours: course.hours,
    moduleCount: course.modules.length,
    image: course.image,
  };
}

export function summariseCourses(courses: Course[]): CourseSummary[] {
  return courses.map(toCourseSummary);
}

export function getTrackById(id: string): CourseTrack | undefined {
  return courseTracks.find((track) => track.id === id);
}

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export function getCoursesByTrack(trackId: string): Course[] {
  return courses.filter((course) => course.trackId === trackId);
}

/** Listings use this so a page never ships 33 full curricula in its payload. */
export function getTrackSummaries(trackId: string): CourseSummary[] {
  return summariseCourses(getCoursesByTrack(trackId));
}

export function getFeaturedCourses(limit = 3): CourseSummary[] {
  return summariseCourses(courses.filter((course) => course.featured).slice(0, limit));
}

export function getAvailableCourses(limit?: number): CourseSummary[] {
  const available = courses.filter((course) => course.status === "available");
  return summariseCourses(limit ? available.slice(0, limit) : available);
}

/** Total curriculum size, used on the academy landing page. */
export function getCatalogueTotals(): {
  courses: number;
  languages: number;
  tracks: number;
  hours: number;
  modules: number;
  available: number;
} {
  return {
    courses: courses.length,
    languages: courses.length,
    tracks: courseTracks.length,
    hours: courses.reduce((total, course) => total + course.hours, 0),
    modules: courses.reduce((total, course) => total + course.modules.length, 0),
    available: getAvailableCourses().length,
  };
}
