import {  NoticeStatus } from '../../enums/notice.enum';
import { Direction } from '../../enums/common.enum';

export interface NoticeInput {
	noticeStatus?: NoticeStatus;
	noticeTitle: string;
	noticeContent: string;
	memberId?: string; // Set to admin's ID in your resolver/controller
}

interface NISearch {
	noticeStatus?: NoticeStatus;	
	noticeTitle?: string;
    noticeContent?: string;
	text?: string;
	memberId?: string;
}

export interface NoticeInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: NISearch;
}