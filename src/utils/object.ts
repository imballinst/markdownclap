export function deepClone<Type>(obj: Type): Type {
  return JSON.parse(JSON.stringify(obj));
}
