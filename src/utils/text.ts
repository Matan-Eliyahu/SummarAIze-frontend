export function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncateFileName(name: string, maxLength: number = 15) {
  return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
}

export function isFileName(fileName:string) {
  const fileNamePattern = /^[^\\/:*?"<>|]+(\.[^\\/:*?"<>|]+)+$/;
  return fileNamePattern.test(fileName);
}
