/**
  debounce ensures that only one execution of $func
  can occur within each $wait 'window'.

  in the case where multiple executions have occured
  within a single window, the most recent is used.

  this differs from lodash.debouce in that we don't wait
  for the events to stop coming in before calling $func.
**/
const debounce = (func, wait) => {
  const schedule = {}

  return function() {
    const now = Date.now()

    // a timestamp representing the leading edge of the current window
    const window = Math.floor(Math.floor(now/wait)*wait)

    // cancel any existing scheduled invocations for this window
    if (window in schedule) {
      clearTimeout(schedule[window])
    }

    // duration between now and the trailing edge of the window
    // note: a delay of <= 0 causes $func to execute immediately
    const delay = (window + wait) - now

    // schedule invocation on the trailing edge of the window
    schedule[window] = setTimeout(() => {
      func.apply(null, arguments)
      delete schedule[window]
    }, delay)
  }
}

export default debounce
