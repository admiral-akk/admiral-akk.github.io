const DEBUG = { enabled: false };
const old_console_log = console.log;
console.log = function () {
  if (DEBUG.enabled) {
    old_console_log.apply(this, arguments);
  }
};

function withLogging(method) {
  DEBUG.enabled = true;
  const result = method();
  DEBUG.enabled = false;
  return result;
}

export { withLogging };
