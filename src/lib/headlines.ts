import fs from 'fs';
import path from 'path';

export interface Headline {
  id: string;
  title: string;
  quote: string;
  commentary: string;
}

export function getHeadlines(): Headline[] {
  // 1. Point to the content folder
  const contentDir = path.join(process.cwd(), 'content', 'headlines');
  
  // Fail gracefully if the folder doesn't exist yet
  if (!fs.existsSync(contentDir)) return [];

  // 2. Read all the markdown files
  const fileNames = fs.readdirSync(contentDir);
  
  const headlines = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      // 3. Read the raw text of each file
      const fullPath = path.join(contentDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // 4. Our custom zero-dependency parser
      // This splits the file by the "---" dividers
      const parts = fileContents.split('---');
      if (parts.length < 3) return null; // Skip invalid files

      const rawMetadata = parts[1];
      const commentary = parts[2].trim();

      // Extract the title and quote using basic string matching
      const titleMatch = rawMetadata.match(/title:\s*(.*)/);
      const quoteMatch = rawMetadata.match(/quote:\s*(.*)/);

      return {
        id: fileName.replace(/\.md$/, ''), // Use the filename as a unique ID
        title: titleMatch ? titleMatch[1].trim() : "Untitled",
        quote: quoteMatch ? quoteMatch[1].trim() : "",
        commentary: commentary,
      };
    })
    .filter(Boolean) as Headline[]; // Remove any nulls from invalid files

  // 5. Return the list, ensuring newest files (like 02-xxx.md) appear first
  return headlines.reverse();
}