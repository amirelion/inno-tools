declare module 'docx' {
  export class Document {
    constructor(options: any);
    save(): Promise<Uint8Array>;
  }
  
  export class Paragraph {
    constructor(options: any);
  }
  
  export class TextRun {
    constructor(options: any);
  }
  
  export class Table {
    constructor(options: any);
  }
  
  export class TableRow {
    constructor(options: any);
  }
  
  export class TableCell {
    constructor(options: any);
  }
  
  export enum HeadingLevel {
    TITLE = 'title',
    HEADING_1 = 'heading1',
    HEADING_2 = 'heading2',
    HEADING_3 = 'heading3'
  }
  
  export enum BorderStyle {
    SINGLE = 'single',
    DOUBLE = 'double',
    DASH = 'dash',
    NONE = 'none'
  }
} 