export interface Question {
    id?: string | number;
    title: string;
    statement: string;
    difficulty: string;
    image?: string;
    alternatives: any[];
    rightAnswer: string;
  }
