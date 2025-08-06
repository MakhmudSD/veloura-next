import { InquiryType } from "../../enums/inquiry.enum";
import { InquiryOutput } from "./inquiry";


export interface InquiryInput {
  inquiryType: InquiryType;
  content: string;
}

export interface ReplyInquiryInput {
  _id: string;
  reply: string;
}

export interface TotalInquiries {
  total?: number;
}

export interface InquiryOutputs {
  list: InquiryOutput[];
  metaCounter: TotalInquiries[];
}


export interface InquiryPaginationInput {
  page: number;
  limit: number;
}