import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Headline {
  id: string;
  title: string;
  quote: string;
  commentary: string;
  image_url?: string;
}

const headlinesDirectory = path.join(process.cwd(), 'content/headlines');

export function getHeadlines(): Headline[] {
  // 1. Get all file names under /content/headlines
  const fileNames = fs.readdirSync(headlinesDirectory);
  
  const allHeadlinesData = fileNames.map((fileName) => {
    // 2. Remove ".md" from file name to get the id
    const id = fileName.replace(/\.md$/, '');

    // 3. Read markdown file as a string
    const fullPath = path.join(headlinesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 4. Use gray-matter to parse the metadata section
    const matterResult = matter(fileContents);

    // 5. Map the data to our interface
    return {
      id,
      title: matterResult.data.title,
      quote: matterResult.data.quote,
      image_url: matterResult.data.image_url || undefined,
      commentary: matterResult.content, // The body of the MD file
    };
  });

  return allHeadlinesData;
}
