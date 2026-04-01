export const parseStructure = (data: unknown, acc: string[] = []) => {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      parseStructure(data[i], acc);
    }
    return acc;
  }

  if (typeof data !== 'object' || data === null) {
    return acc;
  }

  for (const key in data) {
    if (key === 'text') {
      if (typeof data[key] !== 'string') {
        return acc;
      }
      acc.push(data[key]);
    } else {
      parseStructure(data[key], acc);
    }
  }

  return acc;
};

