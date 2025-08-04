import { TWO_FA_TIMEOUT } from '../configs/env.js';

function startCountdownTimer() {
  const timerElement = document.getElementById('timer');
  const twoFAInput = document.getElementById('twofaFormPassword');
  const submitBtn = document.querySelector(
    '#twoFAForm button[type="submit"], #twoFAForm button:not([type])'
  );

  if (!timerElement) return;

  twoFAInput.disabled = true;
  submitBtn.disabled = true;
  twoFAInput.classList.add('disabled');

  let seconds = TWO_FA_TIMEOUT;
  const interval = setInterval(() => {
    seconds--;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerElement.textContent = `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;

    if (seconds <= 0) {
      clearInterval(interval);
      timerElement.textContent = '';

      twoFAInput.disabled = false;
      submitBtn.disabled = false;
      twoFAInput.classList.remove('disabled');
      twoFAInput.focus();
    }
  }, 1000);
}

export default startCountdownTimer;
