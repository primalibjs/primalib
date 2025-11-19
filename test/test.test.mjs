import { test } from './test.mjs';

test("🧪 test.test.mjs - test&check", function (check) {
  check(true)
  check(Math.PI, "3.14")
  check(1, 1)
  check({x:1, v:"a"}, '{x:1,v:"a"}')
  check(1, '1')
  check(() => true)
  check(() => 1, 1)
  check(2, () => 2)
})
