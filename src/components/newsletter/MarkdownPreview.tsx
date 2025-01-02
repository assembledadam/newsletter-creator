import { marked } from 'marked';
import 'github-markdown-css/github-markdown-light.css';

interface Props {
  content: string;
}

export function MarkdownPreview({ content }: Props) {
  return (
    <div className="h-full overflow-auto rounded-lg bg-white">
      <div 
        className="markdown-body p-8 prose prose-slate max-w-none [&>h1]:border-b-0 [&>h1]:pb-0 [&>h2]:border-b-0 [&>h2]:pb-0"
        dangerouslySetInnerHTML={{ __html: marked(content) }}
      />
    </div>
  );
}