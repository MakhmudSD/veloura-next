import { FaqCategory, FaqStatus } from "../../enums/faq.enum";

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  status: FaqStatus;
  category: FaqCategory
  createdAt: Date;
  updatedAt: Date;
}
