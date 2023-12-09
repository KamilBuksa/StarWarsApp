export const spiltStringOnUppercaseCharacter = (name: string) => {
  return name.split(/(?=[A-Z])/);
};

// "random string" --> "RANDOM_STRING"
export const toEnumFormat = (text: string) => {
  return text.toUpperCase().split(' ').join('_').replace(/,/g, '');
};

export const hoursWithMinutes = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
