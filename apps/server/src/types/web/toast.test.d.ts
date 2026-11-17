import type {
  Notyf,
  NotyfEventCallback,
  NotyfNotification,
} from 'notyf';
import type {
  Mock,
  MockInstance,
} from 'vitest';

/**
 * Web - Toast - Click handler.
 *
 * @since 1.1.0
 */
export type Web_Toast_ClickHandler = NotyfEventCallback;

/**
 * Web - Toast - Error notification.
 *
 * @since 1.1.0
 */
export type Web_Toast_ErrorNotification = NotyfNotification;

/**
 * Web - Toast - Notyf mocks.
 *
 * @since 1.1.0
 */
export type Web_Toast_NotyfMocks_Dismiss = Mock<Notyf['dismiss']>;

export type Web_Toast_NotyfMocks_DismissAll = Mock<Notyf['dismissAll']>;

export type Web_Toast_NotyfMocks_Error = Mock<Notyf['error']>;

export type Web_Toast_NotyfMocks_Success = Mock<Notyf['success']>;

export type Web_Toast_NotyfMocks = {
  dismiss: Web_Toast_NotyfMocks_Dismiss;
  dismissAll: Web_Toast_NotyfMocks_DismissAll;
  error: Web_Toast_NotyfMocks_Error;
  success: Web_Toast_NotyfMocks_Success;
};

/**
 * Web - Toast - Notification.
 *
 * @since 1.1.0
 */
export type Web_Toast_Notification = NotyfNotification;

/**
 * Web - Toast - Notification call.
 *
 * @since 1.1.0
 */
export type Web_Toast_NotificationCall = Parameters<NotyfNotification['on']> | undefined;

/**
 * Web - Toast - Notification on.
 *
 * @since 1.1.0
 */
export type Web_Toast_NotificationOn = MockInstance<NotyfNotification['on']>;

/**
 * Web - Toast - Success notification.
 *
 * @since 1.1.0
 */
export type Web_Toast_SuccessNotification = NotyfNotification;

/**
 * Web - Toast - Visible toast.
 *
 * @since 1.1.0
 */
export type Web_Toast_VisibleToast = {
  hidden: boolean;
  remove: () => void;
};

export type Web_Toast_VisibleToasts = Web_Toast_VisibleToast[];
