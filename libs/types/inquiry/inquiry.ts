import { InquiryType } from "../../enums/inquiry.enum";
import { MemberOutput } from "../member/member";


export interface CreateInquiryInput {
  inquiryType: InquiryType;
  content: string;
}

export interface ReplyInquiryInput {
  _id: string;
  reply: string;
}



export interface InquiryOutput {
  _id: string;
  inquiryType: InquiryType;
  content: string;
  reply: string;
  memberId: MemberOutput;
  createdAt: Date;
  updatedAt: Date;
}