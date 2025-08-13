import {  NoticeStatus } from '../../enums/notice.enum';
import { TotalCounter } from '../product/product';

export interface Notice {
	_id: String;
	noticeStatus: NoticeStatus;
	noticeTitle: string;
	noticeContent: string;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Notices {
	list: Notice[];
	metaCounter: TotalCounter[];
}