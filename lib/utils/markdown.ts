import { Block } from "@/types/editor.types";


export function blocksToMarkdown(blocks: Block[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading1":
          return `# ${block.content}\n`;

        case "heading2":
          return `## ${block.content}\n`;

        case "heading3":
          return `### ${block.content}\n`;

        case "heading4":
          return `#### ${block.content}\n`;

        case "paragraph":
          return `${block.content}\n`;

        case "list":
          return (
            (block.content as string)
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean)
              .map((item) => `- ${item.replace(/^[-*•]\s*/, "")}`)
              .join("\n") + "\n"
          );

        case "quote":
          return `> ${block.content}\n`;

        case "code":
          return `\`\`\`\n${block.content}\n\`\`\`\n`;

        case "image":
          return `![](${block.content})\n`;

        case "video":
          return `<video controls src="${block.content}"></video>\n`;

        case "text-image": {
          const content = block.content as { text: string; image: string };
          const text = content.text.replace(/\n/g, "<br>");

          return `
| ${text} | ![](${content.image}) |
|---|---|
`;
        }

        case "image-text": {
          const content = block.content as { text: string; image: string };
          const text = content.text.replace(/\n/g, "<br>");

          return `
| ![](${content.image}) | ${text} |
|---|---|
`;
        }

        default:
          return `${block.content}\n`;
      }
    })
    .join("\n");
}


export function markdownToBlocks(markdown: string): Block[] {
  if (!markdown) return [];

  const blocks: Block[] = [];
  const lines = markdown.split("\n");

  let currentList: Block | null = null;
  let inCode = false;
  let codeBuffer: string[] = [];
  let i = 0;

  const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const extractImage = (str: string): string | null => {
    const match = str.match(/!\[\]\((.*?)\)/);
    return match ? match[1] : null;
  };

  const extractText = (str: string): string =>
    str.replace(/!\[\]\((.*?)\)/g, "").replace(/<br>/g, "\n").trim();

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (line.startsWith("```")) {
      if (inCode) {
        blocks.push({
          id: newId(),
          type: "code",
          content: codeBuffer.join("\n"),
        });
        codeBuffer = [];
        inCode = false;
      } else {
        inCode = true;
      }
      i++;
      continue;
    }

    if (inCode) {
      codeBuffer.push(raw);
      i++;
      continue;
    }

    if (/^\|(.+)\|(.+)\|$/.test(raw)) {
      const cols = raw.split("|").filter((x) => x.trim() !== "");

      if (cols.length === 2) {
        const left = cols[0].trim();
        const right = cols[1].trim();

        const leftImg = extractImage(left);
        const rightImg = extractImage(right);

        if (leftImg && !rightImg) {
          blocks.push({
            id: newId(),
            type: "image-text",
            content: {
              image: leftImg,
              text: extractText(right),
            },
          });

          if (
            i + 1 < lines.length &&
            /^\|\s*-+\s*\|\s*-+\s*\|$/.test(lines[i + 1])
          ) {
            i += 2;
          } else {
            i++;
          }
          continue;
        }

        if (!leftImg && rightImg) {
          blocks.push({
            id: newId(),
            type: "text-image",
            content: {
              text: extractText(left),
              image: rightImg,
            },
          });

          if (
            i + 1 < lines.length &&
            /^\|\s*-+\s*\|\s*-+\s*\|$/.test(lines[i + 1])
          ) {
            i += 2;
          } else {
            i++;
          }
          continue;
        }
      }
    }

    if (/^\|\s*-+\s*\|\s*-+\s*\|$/.test(raw)) {
      i++;
      continue;
    }

    if (line.startsWith("<video") && line.includes("src=")) {
      const match = line.match(/src="([^"]+)"/);
      const src = match ? match[1] : "";

      blocks.push({
        id: newId(),
        type: "video",
        content: src,
      });
      i++;
      continue;
    }

    if (line.startsWith("![](") && line.endsWith(")")) {
      const url = line.slice(4, -1);
      blocks.push({
        id: newId(),
        type: "image",
        content: url,
      });
      i++;
      continue;
    }

    if (line.startsWith("#### ")) {
      blocks.push({
        id: newId(),
        type: "heading4",
        content: line.slice(5),
      });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ id: newId(), type: "heading3", content: line.slice(4) });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ id: newId(), type: "heading2", content: line.slice(3) });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({ id: newId(), type: "heading1", content: line.slice(2) });
      i++;
      continue;
    }

    // ------------------------
    // Quote
    // ------------------------
    if (line.startsWith("> ")) {
      blocks.push({
        id: newId(),
        type: "quote",
        content: line.substring(2),
      });
      i++;
      continue;
    }

    // ------------------------
    // List handling
    // ------------------------
    if (/^[-*•]\s+/.test(line)) {
      if (!currentList) {
        currentList = {
          id: newId(),
          type: "list",
          content: line,
        };
      } else {
        currentList.content = (currentList.content as string) + "\n" + line;
      }
      i++;
      continue;
    } else if (currentList) {
      blocks.push(currentList);
      currentList = null;
      continue;
    }

    // ------------------------
    // Paragraph
    // ------------------------
    if (line.length > 0) {
      blocks.push({
        id: newId(),
        type: "paragraph",
        content: line,
      });
    }

    i++;
  }

  if (currentList) blocks.push(currentList);

  return blocks;
}
