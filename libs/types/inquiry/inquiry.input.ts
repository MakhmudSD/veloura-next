import { InquiryType } from "../../enums/inquiry.enum";


export interface InquiryInput {
  inquiryType: InquiryType;
  content: string;
}

export interface ReplyInquiryInput {
  _id: string;
  reply: string;
}
