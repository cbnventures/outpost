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
 * Toast.
 *
 * @since 1.1.0
 */
export type Web_Toast_ClickHandler = NotyfEventCallback;

/**
 * Toast.
 *
 * @since 1.1.0
 */
export type Web_Toast_ErrorNotification = NotyfNotification;

/**
 * Toast.
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
 * Toast.
 *
 * @since 1.1.0
 */
export type Web_Toast_Notification = NotyfNotification;

/**
 * Toast.
 *
 * @since 1.1.0
 */
export type Web_Toast_NotificationCall = Parameters<NotyfNotification['on']> | undefined;

/**
 * Toast.
 *
 * @since 1.1.0
 */
export type Web_Toast_NotificationOn = MockInstance<NotyfNotification['on']>;

/**
 * Toast.
 *
 * @since 1.1.0
 */
export type Web_Toast_SuccessNotification = NotyfNotification;

/**
 * Toast.
 *
 * @since 1.1.0
 */
export type Web_Toast_VisibleToast = {
  hidden: boolean;
  remove: () => void;
};

export type Web_Toast_VisibleToasts = Web_Toast_VisibleToast[];
