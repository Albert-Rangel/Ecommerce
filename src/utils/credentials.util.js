
const saltRounds = 10;

export const generateRandomString = (num) => {
  return [...Array(num)].map(() => {
    const randomNum = ~~(Math.random() * 36);
    return randomNum.toString(36);
  })
  .join('')
  .toUpperCase();
}

