# msid

**Minimal, monotonic, URL-safe, Client-first, reversible date-based IDs - just 7 chars for millisecond precision!**

[![Twitter](https://img.shields.io/twitter/follow/nrjdalal?label=%40nrjdalal)](https://twitter.com/nrjdalal) [![npm](https://img.shields.io/npm/v/msid?color=blue&logo=npm)](https://www.npmjs.com/package/msid) [![downloads](https://img.shields.io/npm/dt/msid?color=blue&logo=npm)](https://www.npmjs.com/package/msid) [![stars](https://img.shields.io/github/stars/nrjdalal/msid?color=blue&logo=github)](https://github.com/nrjdalal/msid)

> Encode any `Date` (or “now”) into the shortest possible, msid guarantees lexographically sortable and **strictly increasing IDs** when called in rapid succession string at **ms**, **second**, or **day** precision - and decode it back without loss.

- **ms resolution (default)** ~ 7 chars
- **second resolution** ~ 6 chars
- **day resolution** ~ 4 chars

---

## 📖 Examples

```ts
// Millisecond precision (default)
msid()
// encoded - UqofYU9 ~ 7 chars
// current - 2025-07-13T08:18:15.597Z
// decoded - 2025-07-13T08:18:15.597Z

// Second precision
msid({ resolution: "second" })
// encoded - 1uaruZ ~ 6 chars
// current - 2025-07-13T08:18:15.597Z
// decoded - 2025-07-13T08:18:15.000Z

// Day precision
msid({ resolution: "day" })
// encoded - 05H8 ~ 4 chars
// current - 2025-07-13T08:18:15.597Z
// decoded - 2025-07-13T00:00:00.000Z
```

---

## ✨ Features

- 🔢 **Variable‑length Base‑N** (no padding)
- 📆 **Multi‑resolution**: `ms` | `second` | `day`
- ⏳ **Custom epoch**: any start date (default `1970-01-01T00:00:00Z`)
- 🔤 **Custom alphabet**: URL‑safe (`0-9A-Za-z`)
- 🔄 **Reversible**: `msid(id)` restores the exact instant
- 🔒 **Monotonic**: guarantees strictly increasing IDs when called in rapid succession, with optimized fast-path for default epoch/alphabet and fallback for custom settings

---

## 🚀 Quick Start

```sh
bun add msid
# npm install msid
```

Based on the input type, it will either encode a `Date` to a string or decode a string back to a `Date`.

```ts
import msid from "msid"

// Encode default
msid() // → UqofYU9

// Encode in resolution: "ms" default
msid({ resolution: "ms" }) // → UqofYU9

// Encode in resolution: "second"
msid({ resolution: "second" }) // → 1uaruZ

// Encode in resolution: "day"
msid({ resolution: "day" }) // → 05H8

// Decode in resolution: "ms" default
msid("UqofYU9") // → 2025-07-13T08:18:15.597Z

// Decode in resolution: "second"
msid("1uaruZ") // → 2025-07-13T08:18:15.000Z

// Decode in resolution: "day"
msid("05H8") // → 2025-07-13T00:00:00.000Z

// Custom epoch
msid({ epoch: "2000-01-01T00:00:00.000Z" }) // → EBT2bwj

// Custom alphabet
msid({ alphabet: "0123456789abcdef" }) // → 19802dd03ad
```

---

## 🛠️ Benchmarks

```
Platform:      darwin
Architecture:  arm64
CPU Model:     Apple M2 Pro
CPU Cores:     12
Total Memory:  16.00 GB
```

```
Using hyperfine for benchmarking!

📝 Encode comparison (Node.js vs. Bun):

Benchmark 1: node ./test/bench.js msid
  Time (mean ± σ):     352.0 ms ±   3.7 ms    [User: 333.6 ms, System: 10.2 ms]
  Range (min … max):   347.0 ms … 366.1 ms    100 runs

Benchmark 2: bun ./test/bench.js msid
  Time (mean ± σ):     319.0 ms ±   3.8 ms    [User: 313.5 ms, System: 14.3 ms]
  Range (min … max):   312.0 ms … 329.7 ms    100 runs

Summary
  bun ./test/bench.js msid ran
    1.10 ± 0.02 times faster than node ./test/bench.js msid

📝 Decode comparison (Node.js vs. Bun):

Benchmark 1: node ./test/bench.js decode
  Time (mean ± σ):      92.7 ms ±   2.0 ms    [User: 80.4 ms, System: 6.3 ms]
  Range (min … max):    90.7 ms … 108.2 ms    100 runs

Benchmark 2: bun ./test/bench.js decode
  Time (mean ± σ):      53.4 ms ±   1.9 ms    [User: 54.1 ms, System: 9.5 ms]
  Range (min … max):    50.9 ms …  65.4 ms    100 runs

Summary
  bun ./test/bench.js decode ran
    1.74 ± 0.07 times faster than node ./test/bench.js decode

📝 MSID vs ULID encode time comparison:

Benchmark 1: node ./test/bench.js msid
  Time (mean ± σ):     352.7 ms ±   4.0 ms    [User: 334.1 ms, System: 10.4 ms]
  Range (min … max):   347.8 ms … 375.2 ms    100 runs

Benchmark 2: node ./test/bench.js ulid
  Time (mean ± σ):     358.3 ms ±   7.3 ms    [User: 342.9 ms, System: 10.0 ms]
  Range (min … max):   329.8 ms … 385.4 ms    100 runs

Summary
  node ./test/bench.js msid ran
    1.02 ± 0.02 times faster than node ./test/bench.js ulid
```

---

## 🔗 Related

- [ULID](https://github.com/ulid/javascript) – Universally Unique Lexicographically Sortable Identifiers
- [KSUID](https://github.com/segmentio/ksuid) – K-Sortable Globally Unique IDs

---

## 📄 License

MIT – [LICENSE](LICENSE)
