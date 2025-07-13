#!/usr/bin/env node
import os from "os"
import { encodeTime } from "ulid"
import msid from "../dist/index.js"

const ITERATIONS = 1e6
const mode = process.argv[2]

if (!["msid", "decode", "ulid"].includes(mode)) {
  console.error("Usage: bench.js [msid|decode|ulid]")
  process.exit(1)
}

function bench(fn, label) {
  const start = process.hrtime.bigint()
  for (let i = 0; i < ITERATIONS; i++) fn()
  const end = process.hrtime.bigint()
  const elapsedMs = Number((end - start) / 1_000_000n)
  const perMs = (ITERATIONS / elapsedMs).toFixed(2)
  console.log(`${label}: ${elapsedMs} ms — ${perMs} ops/ms`)
}

// hardware info (only on first run)
if (mode === "encode") {
  console.log("------------------------------")
  const cpus = os.cpus()
  console.log(`Platform:      ${os.platform()}`)
  console.log(`Architecture:  ${os.arch()}`)
  console.log(`CPU Model:     ${cpus[0].model}`)
  console.log(`CPU Cores:     ${cpus.length}`)
  console.log(`Total Memory:  ${(os.totalmem() / 1024 ** 3).toFixed(2)} GB`)
  console.log("------------------------------\n")
  console.log(`Bench for ${ITERATIONS.toLocaleString()} iterations:\n`)
}

if (mode === "msid") {
  bench(() => msid(), "msid encode time")
}

if (mode === "decode") {
  const code = msid()
  bench(() => msid(code), "msid decode time")
}

if (mode === "ulid") {
  bench(() => encodeTime(Date.now()), "ulid encode time")
}
