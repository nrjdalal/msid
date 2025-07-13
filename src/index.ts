/** Default alphabet (0–9, A–Z, a–z) */
export const DEFAULT_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

/** A single, static epoch to avoid re-allocations */
const UNIX_EPOCH = new Date(0)

export interface DateCodecOptions {
  /** Custom epoch for offsets (default: UNIX_EPOCH) */
  epoch?: Date
  /** Precision unit: milliseconds, seconds, or days */
  resolution?: "ms" | "second" | "day"
  /** Alphabet for base‑N encoding (default: DEFAULT_ALPHABET) */
  alphabet?: string
}

// ─── Precompute a 256-entry lookup for the default alphabet ───
const DEFAULT_TABLE = new Uint16Array(256).fill(0xffff)
for (let i = 0; i < DEFAULT_ALPHABET.length; i++) {
  DEFAULT_TABLE[DEFAULT_ALPHABET.charCodeAt(i)] = i
}

// ─── Fallback cache for custom alphabets ───
const INDEX_MAP_CACHE = new Map<string, Uint16Array>()
function getTable(alphabet: string): Uint16Array {
  let tbl = INDEX_MAP_CACHE.get(alphabet)
  if (!tbl) {
    tbl = new Uint16Array(256).fill(0xffff)
    for (let i = 0; i < alphabet.length; i++) {
      tbl[alphabet.charCodeAt(i)] = i
    }
    INDEX_MAP_CACHE.set(alphabet, tbl)
  }
  return tbl
}

/** Decode a base‑N string into a number */
function decodeBase(str: string, alphabet: string): number {
  const table =
    alphabet === DEFAULT_ALPHABET ? DEFAULT_TABLE : getTable(alphabet)
  const base = alphabet.length
  let num = 0
  for (let i = 0; i < str.length; i++) {
    const idx = table[str.charCodeAt(i)]
    if (idx === 0xffff) throw new Error(`Invalid character '${str[i]}'`)
    num = num * base + idx
  }
  return num
}

/** Encode a number into a base‑N string */
function encodeOffset(offset: number, alphabet: string): string {
  if (offset === 0) return alphabet[0]
  const base = alphabet.length
  const buf: string[] = []
  while (offset > 0) {
    buf.push(alphabet[offset % base])
    offset = Math.floor(offset / base)
  }
  buf.reverse()
  return buf.join("")
}

// ─── Monotonicity state for default epoch+alphabet ───
let _lastDefaultMs = -1
let _lastDefaultSec = -1
let _lastDefaultDay = -1

// ─── Fallback state for custom configs ───
const _lastCustom = new Map<string, number>()
function _makeCustomKey(
  epoch: Date,
  alphabet: string,
  resolution: "ms" | "second" | "day",
) {
  return `${epoch.getTime()}|${alphabet}|${resolution}`
}

// ─── Overload signatures ───
export function msid(): string
export function msid(opts: DateCodecOptions): string
export function msid(date: Date, opts?: DateCodecOptions): string
export function msid(id: string, opts?: DateCodecOptions): Date

// ─── Implementation ───
export default function msid(
  input?: Date | string | DateCodecOptions,
  opts: DateCodecOptions = {},
): string | Date {
  // support msid(opts)
  if (
    input != null &&
    typeof input === "object" &&
    !(input instanceof Date) &&
    !(typeof input === "string")
  ) {
    opts = input as DateCodecOptions
    input = undefined
  }

  // ─── Decode path ───
  if (typeof input === "string") {
    const epoch = opts.epoch ?? UNIX_EPOCH
    const alphabet = opts.alphabet ?? DEFAULT_ALPHABET

    // recognize both 3- and 4-char day IDs
    const resolution =
      opts.resolution ??
      (input.length === 7
        ? "ms"
        : input.length === 6
          ? "second"
          : input.length === 3 || input.length === 4
            ? "day"
            : "ms")

    const offset = decodeBase(input, alphabet)
    const unit =
      resolution === "ms" ? 1 : resolution === "second" ? 1_000 : 86_400_000

    return new Date(epoch.getTime() + offset * unit)
  }

  // ─── Encode path ───
  const date = input instanceof Date ? input : new Date()
  const epoch = opts.epoch ?? UNIX_EPOCH
  const alphabet = opts.alphabet ?? DEFAULT_ALPHABET
  const resolution = opts.resolution ?? "ms"

  const delta = date.getTime() - epoch.getTime()
  if (delta < 0) throw new Error(`Date is before epoch: ${date.toISOString()}`)

  const unit =
    resolution === "ms" ? 1 : resolution === "second" ? 1_000 : 86_400_000

  const rawOffset = Math.floor(delta / unit)
  let offset: number

  if (epoch === UNIX_EPOCH && alphabet === DEFAULT_ALPHABET) {
    // fast path
    if (resolution === "ms") {
      offset = rawOffset <= _lastDefaultMs ? _lastDefaultMs + 1 : rawOffset
      _lastDefaultMs = offset
    } else if (resolution === "second") {
      offset = rawOffset <= _lastDefaultSec ? _lastDefaultSec + 1 : rawOffset
      _lastDefaultSec = offset
    } else {
      offset = rawOffset <= _lastDefaultDay ? _lastDefaultDay + 1 : rawOffset
      _lastDefaultDay = offset
    }
  } else {
    // custom path
    const key = _makeCustomKey(epoch, alphabet, resolution)
    const last = _lastCustom.get(key)
    offset = last != null && rawOffset <= last ? last + 1 : rawOffset
    _lastCustom.set(key, offset)
  }

  let id = encodeOffset(offset, alphabet)

  // ─── PAD day IDs to 4 characters ───
  if (resolution === "day") {
    const DAY_WIDTH = 4
    id = id.padStart(DAY_WIDTH, alphabet[0])
  }

  return id
}
