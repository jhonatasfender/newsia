"use client";

import Image from "next/image";
import type { OutputData } from "@editorjs/editorjs";

type Props = {
  data: OutputData;
};

type Block = {
  type: string;
  data: Record<string, unknown>;
};

export default function EditorJsRenderer({ data }: Props) {
  if (!data?.blocks) {
    return <p className="text-gray-600">Conteúdo não disponível.</p>;
  }

  const renderBlock = (block: Block, index: number) => {
    const { type, data: blockData } = block;

    switch (type) {
      case "header":
        const level = (blockData.level as number) || 2;
        const text = blockData.text as string;
        
        if (level === 1) {
          return (
            <h1 key={index} className="font-bold mb-4 mt-6 first:mt-0 text-3xl">
              {text}
            </h1>
          );
        } else if (level === 2) {
          return (
            <h2 key={index} className="font-bold mb-4 mt-6 first:mt-0 text-2xl">
              {text}
            </h2>
          );
        } else if (level === 3) {
          return (
            <h3 key={index} className="font-bold mb-4 mt-6 first:mt-0 text-xl">
              {text}
            </h3>
          );
        } else {
          return (
            <h4 key={index} className="font-bold mb-4 mt-6 first:mt-0 text-lg">
              {text}
            </h4>
          );
        }

      case "paragraph":
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {blockData.text as string}
          </p>
        );

      case "list":
        const ListTag = (blockData.style as string) === "ordered" ? "ol" : "ul";
        const items = blockData.items as string[];
        return (
          <ListTag 
            key={index} 
            className={`mb-4 ${(blockData.style as string) === "ordered" ? "list-decimal list-inside" : "list-disc list-inside"}`}
          >
            {items.map((item: string, itemIndex: number) => (
              <li key={itemIndex} className="mb-1">
                {item}
              </li>
            ))}
          </ListTag>
        );

      case "checklist":
        const checklistItems = blockData.items as Array<{ text: string; checked: boolean }>;
        return (
          <ul key={index} className="mb-4">
            {checklistItems.map((item, itemIndex: number) => (
              <li key={itemIndex} className="flex items-start mb-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  readOnly
                  className="mr-2 mt-1"
                />
                <span className={item.checked ? "line-through text-gray-500" : ""}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        );

      case "quote":
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 py-2 mb-4 italic text-gray-700">
            <p className="mb-2">{blockData.text as string}</p>
            {blockData.caption ? (
              <cite className="text-sm text-gray-500">— {String(blockData.caption)}</cite>
            ) : null}
          </blockquote>
        );

      case "code":
        return (
          <pre key={index} className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto">
            <code className="text-sm font-mono">{blockData.code as string}</code>
          </pre>
        );

      case "image":
        return (
          <figure key={index} className="mb-4">
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
              <Image
                src={blockData.url as string}
                alt={(blockData.caption as string) || ""}
                fill
                className="object-cover"
              />
            </div>
            {blockData.caption ? (
              <figcaption className="text-sm text-gray-600 mt-2 text-center">
                {String(blockData.caption)}
              </figcaption>
            ) : null}
          </figure>
        );

      case "table":
        const tableContent = blockData.content as string[][];
        return (
          <div key={index} className="overflow-x-auto mb-4">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-50">
                {tableContent[0] && (
                  <tr>
                    {tableContent[0].map((cell: string, cellIndex: number) => (
                      <th key={cellIndex} className="border border-gray-300 px-4 py-2 text-left">
                        {cell}
                      </th>
                    ))}
                  </tr>
                )}
              </thead>
              <tbody>
                {tableContent.slice(1).map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "embed":
        return (
          <div key={index} className="mb-4">
            <div className="aspect-video">
              <iframe
                src={blockData.embed as string}
                className="w-full h-full rounded-md"
                allowFullScreen
              />
            </div>
            {blockData.caption ? (
              <p className="text-sm text-gray-600 mt-2 text-center">
                {String(blockData.caption)}
              </p>
            ) : null}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="prose prose-neutral prose-lg max-w-none">
      {data.blocks.map((block: Block, index: number) => renderBlock(block, index))}
    </div>
  );
}
