import Cycle from '@cycle/core'
import { h, h2, makeDOMDriver } from '@cycle/dom'
import storage from '@cycle/storage'
import Rx from 'rx'
import SkipEqual from './utils/skip-equal.js'
import update from 'react-addons-update'

function main (sources) {
  const textareaElement = sources.DOM.select('textarea');

  // initial value
  const initial$ = sources.storage.local.getItem('textarea').take(1)

  // initial$
  //   .timeInterval()
  //   .subscribe((x) => {
  //   console.log('initial: ', x)
  // })
  // Sources of events about text change
  const changeEvent$ = textareaElement.events('change')
  const keyupEvent$ = textareaElement.events('keyup')
  // Mix text-change events and filter real changes
  const value$ = SkipEqual(
    Rx.Observable
      .merge(changeEvent$, keyupEvent$)
      .map(x => x.target.value)
  )

  var i = 0

  return {
    DOM: initial$
      .map(v => ({ value: v, i: i++ }))
      .delay(function (v) { return Rx.Observable.timer(v.i*2) })
      .timeInterval()
      .map((value) => {
        console.log(value)
        return h('textarea', {
          'value': `${value.value.value}`,
          'style': {
            'opacity': (value.value.value ? 1 : 0)
          }
        })
      }),
    storage: SkipEqual(value$.debounce(1000))
      .map(value => ({
        key: 'textarea',
        value: value
      }))
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
  storage: storage
})



// // Output to storage
// let storageCache = ''
// SkipEqual(
//   valueStream
//     .debounce(1000)
//     .filter(v => storageCache != v)
//     .do(v => {
//       storageCache = v
//     })
// ).subscribe(v => {
//   // console.log(`${v}`)
//   localStorage.setItem('textarea', v)
// })

// //
// // Initial
// //

// // Initial input from storage
// textareaElement.value = localStorage.getItem('textarea')

// // Initial css effect
// textareaElement.style.opacity = 1
// const preloaderElement = document.querySelector('preloader')
// preloaderElement.style.opacity = 0
// setTimeout(function () {
//   preloaderElement.remove()
// }, 500)

// // test
// var state1 = {
//   value: [7]
// }

// var state2 = update(state1, {
//   value: {
//     $push: [89]
//   }
// })

// // console.log(state1, state2)
