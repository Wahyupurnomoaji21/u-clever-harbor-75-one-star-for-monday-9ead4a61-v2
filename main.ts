import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const reviewText =
  "One star. Booked Saturday, seated at Monday: lukewarm coffee, a 9 a.m. meeting, and a waiter who billed me for the week.";

const MAX_WORDS = 25;
const MAX_CHARS = 180;
const MIN_CHARS = 1;

function validate(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("review must not be blank or whitespace only");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("review must fit on a single line");
  }
  if (!line.startsWith("One star")) {
    throw new Error('review must open with "One star"');
  }
  const wordCount = line.trim().split(/\s+/).length;
  if (wordCount > MAX_WORDS) {
    throw new Error(`review must be at most ${MAX_WORDS} words, got ${wordCount}`);
  }
  const charCount = [...line].length;
  if (charCount < MIN_CHARS || charCount > MAX_CHARS) {
    throw new Error(
      `review must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${charCount}`,
    );
  }
}

function emitReview(line: string): string {
  const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(targetDir, { recursive: true });
  const targetPath = join(targetDir, "entry.txt");
  writeFileSync(targetPath, line, "utf8");
  return targetPath;
}

function main(): void {
  validate(reviewText);
  const writtenTo = emitReview(reviewText);
  const words = reviewText.trim().split(/\s+/).length;
  const chars = [...reviewText].length;
  console.log(`wrote entry to ${writtenTo} (${words} words, ${chars} chars)`);
}

main();
