declare module 'marked-terminal' {
  import type { MarkedExtension } from 'marked';
  interface TerminalRendererOptions {
    tab?: number;
    [key: string]: unknown;
  }
  export function markedTerminal(options?: TerminalRendererOptions): MarkedExtension;
  export default markedTerminal;
}

declare module 'pdf-parse' {
  interface PdfData {
    numpages: number;
    numrender: number;
    info: Record<string, string>;
    metadata: unknown;
    text: string;
    version: string;
  }
  function pdfParse(buffer: Buffer): Promise<PdfData>;
  export default pdfParse;
}
