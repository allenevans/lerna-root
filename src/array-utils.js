const arraySame = (array1, array2) => {
  if (array1.length !== array2.length) {
    return false;
  }

  return array1.every((item, index) => array2[index] === item);
};

/**
 * Remove the contiguous intersecting array from the input array
 * @param {[]} array
 * @param {[]} intersect
 */
const removeIntersection = (array, intersect) => {
  const occurrence = array.findIndex((item, index) => {
    if (item !== intersect[0] || array.length - index < intersect.length) {
      return false;
    }

    return arraySame(array.slice(index, index + intersect.length), intersect);
  });

  return occurrence < 0 ? array : [
    ...array.slice(0, occurrence),
    ...array.slice(occurrence + intersect.length),
  ];
};

module.exports = {
  arraySame,
  removeIntersection,
};
