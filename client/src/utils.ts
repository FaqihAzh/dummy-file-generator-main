import { FileType } from "./types";

// Auto-fix extension
export function ensureExtension(name: string, fileType: FileType): string {
  const ext = `.${fileType}`;
  if (!name.toLowerCase().endsWith(ext)) {
    return name + ext;
  }
  return name;
}

export function calculateTotalBytes(size: number, unit: string): number {
  switch (unit) {
    case "B": return size;
    case "KB": return size * 1024;
    case "MB": return size * 1024 * 1024;
    case "GB": return size * 1024 * 1024 * 1024;
    default: return size;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  const units = ["KB", "MB", "GB"];
  let i = -1;
  do {
    bytes /= 1024;
    i++;
  } while (bytes >= 1024 && i < units.length - 1);
  return bytes.toFixed(2) + " " + units[i];
}

// MAIN GENERATOR USING TEMPLATE (non-corrupt)
export async function generateFile(totalBytes: number, fileType: FileType, filename: string) {
  const templatePath = `./assets/templates/template.${fileType}`;

  // load base template file
  const baseBuffer = await fetch(templatePath).then(r => r.arrayBuffer());
  const baseBytes = new Uint8Array(baseBuffer);

  // compute padding needed
  const remaining = totalBytes - baseBytes.length;

  const chunks: Uint8Array[] = [];
  chunks.push(baseBytes);

  // add dummy padding bytes
  if (remaining > 0) {
    const chunkSize = 1024 * 64; // 64KB chunks
    let created = 0;

    while (created < remaining) {
      const s = Math.min(chunkSize, remaining - created);
      chunks.push(new Uint8Array(s)); // zero-filled chunk
      created += s;
    }
  }

  const blob = new Blob(chunks, { type: getMime(fileType) });

  // trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

// MIME types
function getMime(ext: FileType) {
  switch (ext) {
    case "pdf": return "application/pdf";
    case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    default: return "text/plain";
  }
}
