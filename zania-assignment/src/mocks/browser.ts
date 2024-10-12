import { setupWorker } from 'msw/browser'
import { handlers } from './handler'

export const worker = setupWorker(...handlers)

worker.start({
    onUnhandledRequest: (request, print) => {
      if (request.url.startsWith('chrome-extension://')) {
        // Ignore Chrome extension requests
        return
      }
      // For all other unhandled requests, print a warning
      print.warning()
    },
  })