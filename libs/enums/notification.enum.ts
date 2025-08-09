export enum NotificationType {
	LIKE = 'LIKE',
	COMMENT = 'COMMENT',
	FOLLOW = 'FOLLOW',
	NEW_PRODUCT = 'NEW_PRODUCT',
	ORDER = 'ORDER',           // ✅ add
	NOTICE = 'NOTICE',         // ✅ add (admin site notice)
	MESSAGE = 'MESSAGE',       // ✅ add (admin received a message)
  }


export enum NotificationStatus {
	WAIT = 'WAIT',
	READ = 'READ',
}

export enum NotificationGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	PRODUCT = 'PRODUCT',
	COMMENT = 'COMMENT',
	NOTICE = 'NOTICE',         // ✅ add (admin site notice)
}
