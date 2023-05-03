/**
 * 本版比较
 * @param version1 
 * @param version2 
 * @returns 1前大，0相同，-1后大 
 */
const compareVersion = (version1: string, version2: string) => {
  const v1 = version1.split(".");
  const v2 = version2.split(".");
  for (let i = 0; i < v1.length || i < v2.length; ++i) {
    let x = 0,
      y = 0;
    if (i < v1.length) x = parseInt(v1[i]);
    if (i < v2.length) y = parseInt(v2[i]);
    if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
};
