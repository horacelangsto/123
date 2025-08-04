export function showLoading(button) {
  const spinner = button.querySelector('.spinner-border');
  const buttonText = button.querySelector('.button-text');

  if (spinner) spinner.style.display = 'inline-block';
  if (buttonText) buttonText.textContent = 'Loading...';
  button.disabled = true;
}

export function hideLoading(button, originalText) {
  const spinner = button.querySelector('.spinner-border');
  const buttonText = button.querySelector('.button-text');

  if (spinner) spinner.style.display = 'none';
  if (buttonText) buttonText.textContent = originalText;
  button.disabled = false;
}
