import { marked } from 'marked';
import 'github-markdown-css/github-markdown-light.css';

interface Props {
  content: string;
}

export function MarkdownPreview({ content }: Props) {
  return (
    <div className="h-full">
      <div 
        className="markdown-body overflow-auto p-6 bg-white rounded-lg shadow-sm h-full prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: marked(content) }}
      />
    </div>
  );
}