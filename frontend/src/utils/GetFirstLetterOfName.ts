export const GetUsersFirstLetterOfNames = (
  firstName: string,
  lastName: string
) => {
  const firstChar = firstName.slice(0, 1).toUpperCase();
  const secondChar = lastName.slice(0, 1).toUpperCase();
  return `${firstChar}${secondChar}`;
};
