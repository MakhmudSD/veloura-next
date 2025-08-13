import {  NoticeStatus } from '../../enums/notice.enum';

export interface UpdateNoticeInput {
	_id: string;
	noticeStatus?: NoticeStatus;
	noticeTitle?: string;
	noticeContent?: string;
}