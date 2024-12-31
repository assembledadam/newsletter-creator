import { Editor } from '@monaco-editor/react';
import { useCallback, useRef, useState } from 'react';
import { MarkdownToolbar } from './MarkdownToolbar';
import { applyMarkdown } from '@/lib/markdown';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface Props {
  content: string;
  onChange: (content: string) => void;
}

export function CodeEditor({ content, onChange }: Props) {
  const editorRef = useRef<any>(null);
  const [localContent, setLocalContent] = useState(content);

  const debouncedOnChange = useDebounce(onChange, 300);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.createContextKey('preserveCursor', true);
  };

  const handleEditorChange = useCallback((value: string | undefined) => {
    const newContent = value || '';
    setLocalContent(newContent);
    debouncedOnChange(newContent);
  }, [debouncedOnChange]);

  const handleToolbarAction = useCallback((action: string) => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      const selection = editorRef.current.getSelection();
      
      applyMarkdown(editorRef.current, action);
      
      editorRef.current.setPosition(position);
      if (selection) {
        editorRef.current.setSelection(selection);
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <MarkdownToolbar onAction={handleToolbarAction} />
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={localContent}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          wordWrap: 'on',
          lineNumbers: 'off',
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          renderLineHighlight: 'none',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          preserveViewState: true,
          // Disable suggestions
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          wordBasedSuggestions: false,
          parameterHints: { enabled: false },
          suggest: { showWords: false },
        }}
      />
    </div>
  );
}