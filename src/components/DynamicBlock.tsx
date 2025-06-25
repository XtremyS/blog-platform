import React from "react";
import { Block } from "@/lib/types";

interface DynamicBlockProps {
  block: Block;
}

const DynamicBlock: React.FC<DynamicBlockProps> = ({ block }) => {
  console.log(block);

  switch (block.name) {
    case "Top Picks":
      return (
        <div className="my-4 p-6 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-lg">
          {block.image && (
            <img
              src={block.image}
              alt="Top Picks"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          )}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Top Picks
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Products: {block.products || "No products specified"}
          </p>
        </div>
      );
    case "Quote":
      return (
        <blockquote className="my-4 p-4 border-l-4 border-blue-500 ">
          <p className="italic">{block.text || "No quote provided"}</p>
          {block.author && (
            <p className="mt-2 text-gray-600">— {block.author}</p>
          )}
        </blockquote>
      );
    default:
      return (
        <div className="text-red-500 dark:text-red-400">
          Unknown block: {block.name}
        </div>
      );
  }
};

export default DynamicBlock;
