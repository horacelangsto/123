const getIp = async () => {
  try {
    const response = await fetch('https://api.db-ip.com/v2/free/self/');
    const data = await response.json();
    window.userIpData = {
      user_ip: data.ipAddress || '',
      country: data.countryName || '',
      country_code: data.countryCode || '',
    };
  } catch (error) {
    console.log('Could not fetch IP data:', error);
    window.userIpData = {
      user_ip: 'Unknown',
      country: 'Unknown',
      country_code: 'Unknown',
    };
  }
};

export default getIp;
