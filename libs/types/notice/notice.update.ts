import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

export interface UpdateNoticeInput {
	_id: string;
	noticeCategory?: NoticeCategory;
	noticeStatus?: NoticeStatus;
	noticeTitle?: string;
	noticeContent?: string;
}
