const DETECTION_INTERVAL = 500;

function detectDevTools() {
  let devtools = {
    open: false,
    orientation: null,
  };

  let initialOuterHeight = window.outerHeight;
  let initialOuterWidth = window.outerWidth;
  let initialInnerHeight = window.innerHeight;
  let initialInnerWidth = window.innerWidth;

  setTimeout(() => {
    initialOuterHeight = window.outerHeight;
    initialOuterWidth = window.outerWidth;
    initialInnerHeight = window.innerHeight;
    initialInnerWidth = window.innerWidth;
  }, 20);

  function checkWindowSize() {
    const threshold = 200;
    const currentOuterHeight = window.outerHeight;
    const currentOuterWidth = window.outerWidth;
    const currentInnerHeight = window.innerHeight;
    const currentInnerWidth = window.innerWidth;

    const heightDiff = Math.abs(currentOuterHeight - currentInnerHeight);
    const widthDiff = Math.abs(currentOuterWidth - currentInnerWidth);

    const heightChange = Math.abs(currentInnerHeight - initialInnerHeight);
    const widthChange = Math.abs(currentInnerWidth - initialInnerWidth);

    if (
      (heightDiff > threshold || widthDiff > threshold) &&
      (heightChange > 100 || widthChange > 100)
    ) {
      if (!devtools.open) {
        devtools.open = true;
        redirectToGoogle();
      }
    }
  }

  function checkDebugger() {
    if (devtools.open) return;
    // redirectToGoogle();
  }

  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  });

  document.addEventListener('keydown', function (e) {
    if (
      e.keyCode === 123 || // F12
      (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
      (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
      (e.ctrlKey && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C
      (e.ctrlKey && e.key === 'u') // Ctrl+U
    ) {
      e.preventDefault();
      redirectToGoogle();
      return false;
    }
  });

  function redirectToGoogle() {
    window.location.href = 'https://www.google.com';
  }

  setInterval(checkWindowSize, DETECTION_INTERVAL);
  setInterval(checkDebugger, DETECTION_INTERVAL);

  document.onselectstart = function () {
    return false;
  };
  document.onmousedown = function () {
    return false;
  };

  document.ondragstart = function () {
    return false;
  };
}

detectDevTools();
