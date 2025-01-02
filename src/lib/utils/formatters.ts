// Common acronyms that should be in uppercase
const ACRONYMS = ['RDCF', 'AIF', 'CIRD'];

export function formatSourceType(source: string): string {
  // Split the source into words
  const words = source.toLowerCase().split('_');
  
  // Capitalize each word and handle acronyms
  return words
    .map(word => {
      // Check if the word (in uppercase) is in our acronyms list
      const upperWord = word.toUpperCase();
      if (ACRONYMS.includes(upperWord)) {
        return upperWord;
      }
      // Otherwise capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}