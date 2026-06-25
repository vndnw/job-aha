import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function makeVietnameseRegex(str) {
  if (!str) return null;
  let regexStr = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove standard diacritics
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
  
  let escaped = '';
  for (let i = 0; i < regexStr.length; i++) {
    const char = regexStr[i];
    if (char === 'a' || char === 'A') {
      escaped += '[aàáảãạăằắẳẵặâầấẩẫậAÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬ]';
    } else if (char === 'e' || char === 'E') {
      escaped += '[eèéẻẽẹêềếểễệEÈÉẺẼẸÊỀẾỂỄỆ]';
    } else if (char === 'i' || char === 'I') {
      escaped += '[iìíỉĩịIÌÍỈĨỊ]';
    } else if (char === 'o' || char === 'O') {
      escaped += '[oòóỏõọôồốổỗộơờớởỡợOÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢ]';
    } else if (char === 'u' || char === 'U') {
      escaped += '[uùúủũụưừứửữựUÙÚỦŨỤƯỪỨỬỮỰ]';
    } else if (char === 'y' || char === 'Y') {
      escaped += '[yỳýỷỹỵYỲÝỶỸỴ]';
    } else if (char === 'd' || char === 'D') {
      escaped += '[dđDĐ]';
    } else {
      // Escape regex special chars
      if (['.', '*', '+', '?', '^', '$', '{', '}', '(', ')', '|', '[', ']', '\\'].includes(char)) {
        escaped += '\\' + char;
      } else {
        escaped += char;
      }
    }
  }
  return new RegExp(escaped, 'i');
}
