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
    return false;
  }
});
