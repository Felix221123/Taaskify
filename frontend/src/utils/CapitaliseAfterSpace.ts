
export const CapitaliseAfterSpace = (inputString:string|undefined) => {
  // Split the input string into an array of words
  const words = inputString?.split(' ');

  // Capitalize the first letter of each word
  const capitalizedWords = words?.map(word => word.charAt(0).toUpperCase() + word.slice(1));

  // Join the capitalized words back together with spaces
  const resultString = capitalizedWords?.join(' ');

  return resultString;
}


