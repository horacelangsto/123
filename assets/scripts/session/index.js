export const saveToSession = (key = 'formData', value = window.formToSend) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to sessionStorage:', error);
  }
};

export const loadFromSession = (key = 'formData') => {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error loading from sessionStorage:', error);
    return null;
  }
};
