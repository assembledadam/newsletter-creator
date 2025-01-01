import { marked } from 'marked';
import 'github-markdown-css/github-markdown-light.css';

interface Props {
  content: string;
}

export function MarkdownPreview({ content }: Props) {
  return (
    <div className="h-full overflow-auto rounded-lg bg-white">
      <div 
        className="markdown-body p-8 prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: marked(content) }}
      />
    </div>
  );
}