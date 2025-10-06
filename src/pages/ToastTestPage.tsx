import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function ToastTestPage() {
  const { toast } = useToast()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Toast Component Test</h1>
          <p className="text-muted-foreground">Test different types of toast notifications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Toasts</h2>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  toast({
                    title: 'Default Notification',
                    description: 'This is a default toast notification',
                  })
                }}
                className="w-full"
              >
                Default Toast
              </Button>

              <Button
                onClick={() => {
                  toast({
                    title: 'Success Notification',
                    description: 'Operation completed successfully!',
                    variant: 'success',
                  })
                }}
                className="w-full"
                variant="outline"
              >
                Success Toast
              </Button>

              <Button
                onClick={() => {
                  toast({
                    title: 'Warning Notification',
                    description: 'Please note, this is a warning message',
                    variant: 'warning',
                  })
                }}
                className="w-full"
                variant="outline"
              >
                Warning Toast
              </Button>

              <Button
                onClick={() => {
                  toast({
                    title: 'Error Notification',
                    description: 'Operation failed, please try again',
                    variant: 'destructive',
                  })
                }}
                className="w-full"
                variant="destructive"
              >
                Error Toast
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Advanced Toasts</h2>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  toast({
                    title: 'Toast with Action',
                    description: 'This toast includes an action button',
                    action: (
                      <Button size="sm" variant="outline">
                        Undo
                      </Button>
                    ),
                  })
                }}
                className="w-full"
                variant="secondary"
              >
                With Action Button
              </Button>

              <Button
                onClick={() => {
                  toast({
                    title: 'Long Text Notification',
                    description:
                      'This is a toast notification with a longer description, used to test text wrapping and display effects.',
                  })
                }}
                className="w-full"
                variant="secondary"
              >
                Long Text Toast
              </Button>

              <Button
                onClick={() => {
                  toast({
                    title: 'Title Only',
                  })
                }}
                className="w-full"
                variant="secondary"
              >
                Title Only
              </Button>

              <Button
                onClick={() => {
                  toast({
                    description: 'Description Only Toast Notification',
                  })
                }}
                className="w-full"
                variant="secondary"
              >
                Description Only
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Click the buttons to test different types of toast notifications
          </p>
        </div>
      </div>
    </div>
  )
}
