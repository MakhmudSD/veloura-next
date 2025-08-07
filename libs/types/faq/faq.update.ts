import { FaqCategory, FaqStatus } from "../../enums/faq.enum";
export interface UpdateFaqInput {
  _id: string;
  status?: FaqStatus;
  category?: FaqCategory
}
