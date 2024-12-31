export function getSelectionInfo(editor: any) {
    const model = editor.getModel();
    const selection = editor.getSelection();
    const selectedText = model.getValueInRange(selection);
    return { selection, selectedText };
  }
  
  const formatPatterns = {
    bold: /^\*\*(.*)\*\*$/,
    italic: /^\*(.*)\*$/,
    heading1: /^# (.*)$/,
    heading2: /^## (.*)$/,
    heading3: /^### (.*)$/,
    bulletList: /^- (.*)$/,
    numberList: /^\d+\. (.*)$/,
    quote: /^> (.*)$/,
    code: /^`(.*)`$/,
    link: /^\[(.*)\]\(.*\)$/,
    image: /^!\[(.*)\]\(.*\)$/
  };
  
  function hasFormat(text: string, format: keyof typeof formatPatterns): boolean {
    return formatPatterns[format].test(text);
  }
  
  function removeFormat(text: string, format: keyof typeof formatPatterns): string {
    const match = text.match(formatPatterns[format]);
    return match ? match[1] : text;
  }
  
  export function applyMarkdown(editor: any, action: string) {
    const model = editor.getModel();
    const { selection, selectedText } = getSelectionInfo(editor);
    
    // Handle special case for divider
    if (action === 'divider') {
      model.pushEditOperations([], [{
        range: selection,
        text: '\n---\n'
      }], () => null);
      return;
    }
  
    // Handle lists separately
    if (action === 'bulletList' || action === 'numberList') {
      const lines = selectedText.split('\n');
      const prefix = action === 'bulletList' ? '- ' : '1. ';
      const pattern = action === 'bulletList' ? /^- / : /^\d+\. /;
  
      const newText = lines.map(line => {
        if (pattern.test(line)) {
          // Remove formatting if it exists
          return line.replace(pattern, '');
        } else {
          // Add formatting if it doesn't exist
          return `${prefix}${line}`;
        }
      }).join('\n');
  
      model.pushEditOperations([], [{
        range: selection,
        text: newText
      }], () => null);
      return;
    }
  
    // For all other formats
    const formatType = action as keyof typeof formatPatterns;
    let newText = selectedText;
  
    if (hasFormat(selectedText, formatType)) {
      // Remove formatting if it exists
      newText = removeFormat(selectedText, formatType);
    } else {
      // Add formatting if it doesn't exist
      const actions: { [key: string]: string } = {
        bold: `**${selectedText}**`,
        italic: `*${selectedText}*`,
        heading1: `# ${selectedText}`,
        heading2: `## ${selectedText}`,
        heading3: `### ${selectedText}`,
        quote: `> ${selectedText}`,
        code: `\`${selectedText}\``,
        link: `[${selectedText}](url)`,
        image: `![${selectedText}](url)`
      };
      newText = actions[action] || selectedText;
    }
  
    model.pushEditOperations([], [{
      range: selection,
      text: newText
    }], () => null);
  }