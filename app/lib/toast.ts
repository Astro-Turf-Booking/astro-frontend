import type { ReactNode } from "react";
import {
  gooeyToast,
  type GooeyToastOptions,
  type GooeyPromiseData,
  type GooeyToastUpdateOptions,
  type DismissFilter,
} from "goey-toast";

export type ToastId = string | number;

export type ToastOptions = GooeyToastOptions;
export type ToastPromiseData<T> = GooeyPromiseData<T>;
export type ToastUpdateOptions = GooeyToastUpdateOptions;
export type ToastDismissFilter = DismissFilter;

/**
 * Toast service wrapping `goey-toast` for consistent notifications across the application.
 */
export const toast = {
  /**
   * Display a default neutral notification.
   */
  show(message: string, options?: ToastOptions): ToastId {
    return gooeyToast(message, options);
  },

  /**
   * Display a success notification.
   */
  success(message: string, options?: ToastOptions): ToastId {
    return gooeyToast.success(message, { showTimestamp: false, ...options });
  },

  /**
   * Display an error notification.
   */
  error(message: string, options?: ToastOptions): ToastId {
    return gooeyToast.error(message, { showTimestamp: false, ...options });
  },

  /**
   * Display a warning notification.
   */
  warning(message: string, options?: ToastOptions): ToastId {
    return gooeyToast.warning(message, { showTimestamp: false, ...options });
  },

  /**
   * Display an informational notification.
   */
  info(message: string, options?: ToastOptions): ToastId {
    return gooeyToast.info(message, { showTimestamp: false, ...options });
  },

  /**
   * Display a loading indicator toast that updates when the provided promise settles,
   * or a custom loading indicator.
   */
  loading(message: string, options?: ToastOptions): ToastId {
    return gooeyToast(message, {
      ...options,
      duration: options?.duration ?? Infinity,
    });
  },

  /**
   * Bind a notification to a promise that shows loading, success, or error states.
   */
  promise<T>(promise: Promise<T>, data: ToastPromiseData<T>): string {
    return gooeyToast.promise(promise, data);
  },

  /**
   * Dismiss a specific toast by ID, by filter, or dismiss all toasts if no argument is passed.
   */
  dismiss(idOrFilter?: ToastId | ToastDismissFilter): void {
    gooeyToast.dismiss(idOrFilter);
  },

  /**
   * Update an existing active toast in-place.
   */
  update(id: ToastId, options: ToastUpdateOptions): void {
    gooeyToast.update(id, options);
  },
};

export default toast;

