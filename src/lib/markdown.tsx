import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Block } from "./types";
import DynamicBlock from "@/components/DynamicBlock";

export function parseContent(content: string): React.ReactNode[] {
  const blockRegex = /{{block\s+([^}]*)}}/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  content.replace(blockRegex, (match, blockAttrs, offset) => {
    if (offset > lastIndex) {
      const markdownContent = content.slice(lastIndex, offset);
      if (markdownContent.trim()) {
        parts.push(
          <ReactMarkdown key={`md-${lastIndex}`} remarkPlugins={[remarkGfm]}>
            {markdownContent}
          </ReactMarkdown>
        );
      }
    }

    const block: Block = { name: "" };
    const attrRegex = /(\w+)=["']([^"']+)["']/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(blockAttrs)) !== null) {
      const [, key, value] = attrMatch;
      block[key] = value;
    }

    if (block.name) {
      parts.push(<DynamicBlock key={`block-${offset}`} block={block} />);
    }

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < content.length) {
    const remainingContent = content.slice(lastIndex);
    if (remainingContent.trim()) {
      parts.push(
        <ReactMarkdown
          key={`md-${lastIndex}`}
          remarkPlugins={[remarkGfm]}
          // className="prose dark:prose-invert max-w-none"
        >
          {remainingContent}
        </ReactMarkdown>
      );
    }
  }

  return parts.length
    ? parts
    : [
        <ReactMarkdown
          key="empty"
          remarkPlugins={[remarkGfm]}
          // className="prose dark:prose-invert max-w-none"
        >
          No content
        </ReactMarkdown>,
      ];
}
