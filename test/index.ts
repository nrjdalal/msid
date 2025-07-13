import assert from "assert"
import msid from "../dist/index.js"

function main() {
  const now = new Date("2025-07-13T08:18:15.597Z")
  assert.strictEqual(msid(now), "UqofYU9")
  assert.strictEqual(msid(now, { resolution: "ms" }).length, 7)
  assert.strictEqual(msid(now, { resolution: "second" }).length, 6)
  assert.strictEqual(msid(now, { resolution: "day" }).length, 4)
  assert.strictEqual(msid("UqofYU9").toISOString(), now.toISOString())
  assert.strictEqual(msid("1uaruZ").toISOString(), "2025-07-13T08:18:15.000Z")
  assert.strictEqual(msid("05H8").toISOString(), "2025-07-13T00:00:00.000Z")
  assert.strictEqual(
    msid("EBT2bwj", {
      epoch: new Date("2000-01-01T00:00:00.000Z"),
    }).toISOString(),
    "2025-07-13T08:18:15.597Z",
  )
  assert.strictEqual(
    msid("19802dd03ad", { alphabet: "0123456789abcdef" }).toISOString(),
    "2025-07-13T08:18:15.597Z",
  )
  console.log("✅ All tests passed!")
}

main()
