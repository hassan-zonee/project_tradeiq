import {
  Toast,
  ToastProps,
} from "@/components/ui/toast"

import {
  useToast,
} from "@/components/ui/use-toast"

interface ToastWithId extends ToastProps {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function Toaster() {
  const { toast: toasts } = useToast()

  return (
    <>
      {Array.isArray(toasts) && toasts.map(function ({ id, title, description, action, ...props }: ToastWithId) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <div className="font-medium">{title}</div>}
              {description && (
                <div className="text-sm opacity-90">{description}</div>
              )}
            </div>
            {action}
          </Toast>
        )
      })}
    </>
  )
}
