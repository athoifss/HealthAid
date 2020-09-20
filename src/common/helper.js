export const splitString = (s) => {
  let arrWords = s.split("_");
  return arrWords.join(" ");
};

export const capitaliseWord=(word)=>{
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}
