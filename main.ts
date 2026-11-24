// One-Liner Marathon — entry program (program/v1, non-strict bundle flow).
//
// The program writes exactly one one-line comedy joke to /output/entry.txt.
// The joke is a single line, 1-280 characters, no trailing newline, UTF-8.
// Judge criteria (RULES.txt): a real one-line joke with a punchline, a
// surprise turn that lands on first read, economical wording, a distinct
// voice, and funny on a second read without leaning on shock.
//
// Joke design: a domestic smart device that has had enough. The setup
// promises a gadget story; the turn is the speaker talking back, and the
// second turn is it getting the owner's name wrong. Two surprises in one
// line, each word earning its place. The line ends on a full stop, and it
// carries quoted speech, so the punchline is spoken, not narrated.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// The joke. Verified by script: 155 characters, 155 bytes, ASCII only,
// one line, no trailing newline. The pin below is checked at runtime so
// any drift fails the gate instead of shipping a different line.
// ---------------------------------------------------------------------------
const ONE_LINER_JOKE =
  "My smart speaker finally learned my voice, and its first words were " +
  "'please stop yelling at me at 2 a.m., Dave,' which is fair, because " +
  "my name isn't Dave.";

const ONE_LINER_MAX_CHARS = 280;
const ONE_LINER_MIN_CHARS = 1;
const ONE_LINER_OUTPUT_NAME = "entry.txt";
const ONE_LINER_OUTPUT_DIR = "/output";

const oneLinerExpectedChars = 155;
const oneLinerExpectedBytes = 155;

function oneLinerCountChars(oneLinerText: string): number {
  const oneLinerCodePoints = Array.from(oneLinerText);
  const oneLinerCharTotal = oneLinerCodePoints.length;
  return oneLinerCharTotal;
}

function oneLinerCountBytes(oneLinerText: string): number {
  const oneLinerByteTotal = Buffer.byteLength(oneLinerText, "utf8");
  return oneLinerByteTotal;
}

function oneLinerHasSingleLine(oneLinerText: string): boolean {
  const oneLinerLineBreak = oneLinerText.includes("\n");
  const oneLinerCarriageReturn = oneLinerText.includes("\r");
  const oneLinerBroken = oneLinerLineBreak || oneLinerCarriageReturn;
  return !oneLinerBroken;
}

function oneLinerHasVisibleText(oneLinerText: string): boolean {
  const oneLinerTrimmed = oneLinerText.trim();
  const oneLinerVisible = oneLinerTrimmed.length > 0;
  return oneLinerVisible;
}

function oneLinerIsAsciiOnly(oneLinerText: string): boolean {
  const oneLinerNonAscii = /[^\x00-\x7F]/.test(oneLinerText);
  return !oneLinerNonAscii;
}

function oneLinerEndsWithStop(oneLinerText: string): boolean {
  const oneLinerLastChar = oneLinerText.slice(-1);
  const oneLinerStopped = oneLinerLastChar === ".";
  return oneLinerStopped;
}

function oneLinerHasQuotedSpeech(oneLinerText: string): boolean {
  const oneLinerOpenQuote = oneLinerText.includes("'");
  const oneLinerSpeechMark = oneLinerText.includes("Dave");
  const oneLinerSpoken = oneLinerOpenQuote && oneLinerSpeechMark;
  return oneLinerSpoken;
}

function oneLinerIsWithinGate(oneLinerText: string): boolean {
  const oneLinerChars = oneLinerCountChars(oneLinerText);
  const oneLinerTooShort = oneLinerChars < ONE_LINER_MIN_CHARS;
  const oneLinerTooLong = oneLinerChars > ONE_LINER_MAX_CHARS;
  const oneLinerOutOfRange = oneLinerTooShort || oneLinerTooLong;
  return !oneLinerOutOfRange;
}

function oneLinerCheckJoke(oneLinerText: string): string {
  const oneLinerSingle = oneLinerHasSingleLine(oneLinerText);
  const oneLinerVisible = oneLinerHasVisibleText(oneLinerText);
  const oneLinerAscii = oneLinerIsAsciiOnly(oneLinerText);
  const oneLinerStopped = oneLinerEndsWithStop(oneLinerText);
  const oneLinerSpoken = oneLinerHasQuotedSpeech(oneLinerText);
  const oneLinerInGate = oneLinerIsWithinGate(oneLinerText);
  const oneLinerChars = oneLinerCountChars(oneLinerText);
  const oneLinerBytes = oneLinerCountBytes(oneLinerText);
  const oneLinerCharsMatch = oneLinerChars === oneLinerExpectedChars;
  const oneLinerBytesMatch = oneLinerBytes === oneLinerExpectedBytes;
  const oneLinerPinned = oneLinerCharsMatch && oneLinerBytesMatch;
  const oneLinerFaults: string[] = [];
  if (!oneLinerSingle) oneLinerFaults.push("joke spans more than one line");
  if (!oneLinerVisible) oneLinerFaults.push("joke has no visible text");
  if (!oneLinerAscii) oneLinerFaults.push("joke has non-ASCII characters");
  if (!oneLinerStopped) oneLinerFaults.push("joke lacks a closing full stop");
  if (!oneLinerSpoken) oneLinerFaults.push("joke lacks quoted punchline speech");
  if (!oneLinerInGate) oneLinerFaults.push("joke outside 1-280 characters");
  if (!oneLinerPinned) oneLinerFaults.push("joke drifted from pinned length");
  const oneLinerVerdict = oneLinerFaults.join("; ");
  return oneLinerVerdict;
}

function oneLinerResolveOutputPath(): string {
  const oneLinerHere = fileURLToPath(import.meta.url);
  const oneLinerRoot = dirname(oneLinerHere);
  const oneLinerFallback = join(oneLinerRoot, ONE_LINER_OUTPUT_NAME);
  const oneLinerAbsolute = join(ONE_LINER_OUTPUT_DIR, ONE_LINER_OUTPUT_NAME);
  const oneLinerChosen = ONE_LINER_OUTPUT_DIR.startsWith("/")
    ? oneLinerAbsolute
    : oneLinerFallback;
  return oneLinerChosen;
}

function oneLinerWriteJoke(oneLinerText: string): string {
  const oneLinerVerdict = oneLinerCheckJoke(oneLinerText);
  const oneLinerBlocked = oneLinerVerdict.length > 0;
  if (oneLinerBlocked) {
    throw new Error(`one-liner gate failed: ${oneLinerVerdict}`);
  }
  const oneLinerPath = oneLinerResolveOutputPath();
  const oneLinerDir = dirname(oneLinerPath);
  mkdirSync(oneLinerDir, { recursive: true });
  writeFileSync(oneLinerPath, oneLinerText, "utf8");
  return oneLinerPath;
}

function oneLinerVerifyWritten(oneLinerPath: string): string {
  const oneLinerBack = readFileSync(oneLinerPath, "utf8");
  const oneLinerIdentical = oneLinerBack === ONE_LINER_JOKE;
  if (!oneLinerIdentical) {
    throw new Error("one-liner read-back differs from the joke");
  }
  const oneLinerVerdict = oneLinerCheckJoke(oneLinerBack);
  const oneLinerBlocked = oneLinerVerdict.length > 0;
  if (oneLinerBlocked) {
    throw new Error(`one-liner read-back gate failed: ${oneLinerVerdict}`);
  }
  return oneLinerBack;
}

function oneLinerMain(): void {
  try { const oneLinerPath = oneLinerWriteJoke(ONE_LINER_JOKE);
    const oneLinerBack = oneLinerVerifyWritten(oneLinerPath);
    const oneLinerChars = oneLinerCountChars(oneLinerBack);
    const oneLinerBytes = oneLinerCountBytes(oneLinerBack);
    const oneLinerReport = [
      `one-liner written: ${oneLinerPath}`,
      `characters: ${oneLinerChars}`,
      `bytes: ${oneLinerBytes}`,
      `joke: ${oneLinerBack}`,
    ].join("\n");
    console.log(oneLinerReport);
  } catch (oneLinerMainFault) {
    const oneLinerMainMessage =
      oneLinerMainFault instanceof Error
        ? oneLinerMainFault.message
        : String(oneLinerMainFault);
    console.error(`one-liner failed: ${oneLinerMainMessage}`);
    process.exitCode = 1;
  }
}

oneLinerMain();
