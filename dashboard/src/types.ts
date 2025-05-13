export interface HelpRequest {
  id: string;
  question: string;
  callerId: string;
  status: "pending" | "resolved" | "unresolved";
  answer: string;
  createdAt: string;
}

export type KBEntry = { question: string; answer: string };

export type AskedQuestion = {
  question: string;
  answer: string;
  status: "success" | "pending";
  createdAt: string;
};
