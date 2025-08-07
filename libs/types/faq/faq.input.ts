import { FaqCategory, FaqStatus } from "../../enums/faq.enum";

export interface FaqInput {
  question: string;
  answer: string;
  status: FaqStatus;
  category: FaqCategory
}
