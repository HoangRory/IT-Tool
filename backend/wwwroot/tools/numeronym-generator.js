export function run(obj) {
    const text = obj.text || "";
    const words = text.trim().split(/\s+/);
  
    const result = words.map(word => {
      if (word.length <= 3) return word; // too short for numeronym
      return `${word[0]}${word.length - 2}${word[word.length - 1]}`;
    });
  
    return {
      input: text,
      numeronyms: result.join(" ")
    };
  }
  