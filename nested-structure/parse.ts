export const parseStruct = ( data: unknown ) => {
  if (typeof data === 'object' && data !== null) {
    return Object.keys(data).reduce((accumulator, key) => {
      if (key === 'text') {
        accumulator.push(data[key])
      } else {
        accumulator.push(...parseStruct(data[key]))
      }
      return accumulator
    }, [])
  } else if (Array.isArray(data)) {
    return data.flatMap(parseStruct)
  } else {
    return []
  }
}
