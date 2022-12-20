export const parsePathArgs = (inputPath) => {
  let isPathCorrect = true;

  if (inputPath.split(' ').length === 2 && !inputPath.includes('"')) isPathCorrect = true
  if (inputPath.split(' ').length !== 2 && !inputPath.includes('"')) isPathCorrect = false
  if (inputPath.includes('"') && (inputPath.split('"').length - 1) % 2 === 1) isPathCorrect = false
  if (inputPath.includes('"') && (inputPath.split('"').length - 1) % 2 === 0) isPathCorrect = true
  let countMarks = 0;
  let countSpace = 0;
  let divideIndex;
  for (let i = 0; i < inputPath.length; i++) {
    if (inputPath[i] === '"' && countMarks === 0) {
      countMarks++;
      continue;
    };

    if (inputPath[i] === '"' && countMarks === 1) {
      countMarks--;
      continue;
    };

    if (inputPath[i] === ' ' && countMarks === 0 && countSpace === 0) {
      divideIndex = i;
      countSpace++;
      continue;
    };

    if (inputPath[i] === ' ' && countMarks === 0 && countSpace !== 0) {
      isPathCorrect = false
      break;
    };
  }

  if (isPathCorrect) {
    return { firstArg: inputPath.substring(0, divideIndex), secondArg: inputPath.substring(divideIndex + 1) }
  } else {
    return { firstArg: null, secondArg: null }
  }
}