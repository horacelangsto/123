export function showModal(modalId) {
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.style.display = 'none';
    modal.classList.remove('show');
  });

  const modal = document.getElementById(modalId);
  if (modal) {
    document.body.style.overflow = 'hidden';

    modal.style.display = 'flex';
    modal.classList.add('show');

    setTimeout(() => {
      const firstInput = modal.querySelector(
        'input:not([type="hidden"]):not([readonly])'
      );
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }
}

export function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}
