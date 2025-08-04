import getIp from '../message/ip.js';

export const initialize = () => {
  window.formToSend = {};
  window.userIpData = {};
  window.metrics = {};

  window.userIpData = {
    user_ip: '',
    country: '',
    country_code: '',
  };

  window.metrics = {
    is_Mobile:
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
    page_name: '',
    params: window.location.search,
  };

  getIp();
};
