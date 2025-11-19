import { test } from '../test/test.mjs'
import { say, on, send, el, client, server, include, primaSet, primalib } from './primaweb.mjs'

// Test say() function
test('say() - markdown rendering', function ({check}) {
  const html = say('# Hello\n**Bold** text')
  check(html.includes('<h1>Hello</h1>'))
  check(html.includes('<strong>Bold</strong>'))
})

// Test on() - DOM events
test('on() - DOM event handler', function ({check}) {
  if (typeof document === 'undefined') {
    check(true) // Skip in Node.js
    return
  }
  
  let clicked = false
  const btn = document.createElement('button')
  btn.id = 'test-btn'
  document.body.appendChild(btn)
  
  on('click', () => { clicked = true })('#test-btn')
  btn.click()
  
  check(clicked)
  document.body.removeChild(btn)
})

// Test el() - element selector
test('el() - element selector', function ({check}) {
  if (typeof document === 'undefined') {
    check(true) // Skip in Node.js
    return
  }
  
  const div = document.createElement('div')
  div.id = 'test-el'
  document.body.appendChild(div)
  
  const result = el('#test-el')
  check(result.toArray().length === 1)
  check(result.toArray()[0].id === 'test-el')
  
  document.body.removeChild(div)
})

// Test send() - message sender (mock WebSocket)
test('send() - message sender', function ({check}) {
  const messages = []
  const mockWs = {
    readyState: 1,
    send: (data) => messages.push(JSON.parse(data))
  }
  
  const pipe = { ws: mockWs }
  send('test-type', () => ({ x: 1, y: 2 }))(pipe)
  
  check(messages.length === 1)
  check(messages[0].type === 'test-type')
  check(messages[0].data.x === 1)
  check(messages[0].data.y === 2)
})

// Test on() - WebSocket message handler (mock WebSocket)
test('on() - WebSocket message handler', function ({check}) {
  const received = []
  const mockWs = {
    addEventListener: (type, handler) => {
      if (type === 'message') {
        // Simulate message
        setTimeout(() => {
          handler({ data: JSON.stringify({ type: 'test-event', data: { value: 42 } }) })
        }, 10)
      }
    },
    removeEventListener: () => {}
  }
  
  const pipe = { ws: mockWs }
  on('test-event', (data) => {
    received.push(data)
  })(pipe)
  
  // Wait for async handler
  setTimeout(() => {
    check(received.length === 1)
    check(received[0].value === 42)
  }, 50)
})

// Test client() - creates WebSocket pipe
test('client() - creates client pipe', function ({check}) {
  if (typeof WebSocket === 'undefined') {
    check(true) // Skip in Node.js
    return
  }
  
  const pipe = client('ws://localhost:8080')
  check(pipe.ws !== null)
  check(typeof pipe.on === 'function')
  check(typeof pipe.send === 'function')
  
  if (pipe.ws) {
    pipe.ws.close()
  }
})

// Test server() - creates server pipe
test('server() - creates server pipe', function ({check}) {
  const mockWs = { readyState: 1 }
  const pipe = server(mockWs)
  
  check(pipe.ws === mockWs)
  check(typeof pipe.on === 'function')
  check(typeof pipe.send === 'function')
})

// Test primaSet integration
test('primaweb - primaSet integration', function ({check}) {
  const set = primaSet([1, 2, 3])
  check(set.sum() === 6)
})

// Test primalib exposure
test('primaweb - primalib exposure', function ({check}) {
  check(typeof primalib.N === 'function')
  check(typeof primalib.primes === 'object')
})

