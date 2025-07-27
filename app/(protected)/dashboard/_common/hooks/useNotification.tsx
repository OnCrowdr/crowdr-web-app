import {
  createContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
  ReactNode,
} from "react"
import { HeadlessService, IMessage } from "@novu/headless"
import { useUser } from "../../../../../contexts/UserProvider"
import { useSetAtom } from "jotai"
import { pageDrawerAtom } from "../../_components/layout/Sidebar"
import { useAuth } from "@/contexts/AppProvider"

interface NotificationContextType {
  notifications: IMessage[]
  markNotificationsAsRead: (messageIds: string | string[]) => void
  markAllMessagesAsRead: (feedId?: string) => void
  markAllMessagesAsSeen: (feedId?: string) => void
  pageNum: number
  setPageNum: React.Dispatch<React.SetStateAction<number>>
  fetchNotifications: () => void
  unseenCount: number
  setUnseenCount: React.Dispatch<React.SetStateAction<number>>
  pagination?: {
    hasMore: boolean
    page: number
    pageSize: number
    totalCount: number
  }
}

const NotificationContext = createContext<NotificationContextType>(
  {} as NotificationContextType
)

type Props = {
  children: ReactNode
}

type Pagination = NotificationContextType["pagination"]

const NotificationProvider: React.FC<Props> = ({ children }) => {
  const {user } = useAuth()
  const headlessServiceRef = useRef<HeadlessService | null>(null)
  const [notifications, setNotifications] = useState<IMessage[]>([])
  const [pageNum, setPageNum] = useState(0)
  const [pagination, setPagination] = useState<Pagination>()
  const [unseenCount, setUnseenCount] = useState(0)
  const setCurrentDrawerId = useSetAtom(pageDrawerAtom)

  const fetchNotifications = useCallback(() => {
    const headlessService = headlessServiceRef.current
    if (headlessService) {
      headlessService.fetchNotifications({
        listener: ({ data, error, isError, isFetching, isLoading, status }) => {
          // Handle the state of the fetching process and errors here.
        },
        onSuccess: (response) => {
          // Handle the fetched notifications here.
          if (response.page !== pagination?.page) {
            const pagination = {
              hasMore: response.hasMore,
              page: response.page,
              pageSize: response.pageSize,
              totalCount: response.totalCount,
            }

            setPagination(pagination)
            setNotifications((prev) =>
              // response.page will be zero on initial fetching or subsequent ones caused by headlessService.listenUnseenCountChange's listener
              response.page === 0 ? response.data : prev.concat(response.data)
            ) // Store notifications in the state
          }
        },
        page: pageNum, // page number to be fetched
      })
    }
  }, [pageNum])

  const getUnseenCount = useCallback(() => {
    const headlessService = headlessServiceRef.current
    if (headlessService) {
      headlessService.fetchUnseenCount({
        listener: () => {},
        onSuccess: (data) => {
          setUnseenCount(data.count)
        },
      })

      headlessService.listenUnseenCountChange({
        listener: (unseenCount: number) => {
          const isNewNotification = unseenCount > 0
          if (isNewNotification) {
            setUnseenCount(unseenCount)

            setCurrentDrawerId((currentDrawerId) => {
              if (currentDrawerId === "notifications") {
                markAllMessagesAsSeen()
              }

              return currentDrawerId
            })

            // fetch notifications if pageNum = 0, else set pageNum to 0
            // which will consequently cause new notifications to be fetched
            pageNum === 0 ? fetchNotifications() : setPageNum(0)
          }
        },
      })
    }
  }, [pageNum])

  // useEffect(() => {
  //   if (user?._id) {
  //     if (!headlessServiceRef.current) {
  //       const headlessService = new HeadlessService({
  //         applicationIdentifier: "JyjHr30y-vzW",
  //         subscriberId: user._id,
  //       })

  //       headlessService.initializeSession({
  //         listener: (res) => {},
  //         onSuccess: (session) => {
  //           headlessServiceRef.current = headlessService
  //           fetchNotifications()
  //           getUnseenCount()
  //         },
  //         onError: (error) => {
  //           console.log("headlessService error:", error)
  //         },
  //       })
  //     } else {
  //       fetchNotifications()
  //       getUnseenCount()
  //     }
  //   }
  // }, [fetchNotifications, getUnseenCount, user?._id])

  // Function to mark notifications as read
  const markNotificationsAsRead = (messageIds: string | string[]) => {
    if (!Array.isArray(messageIds)) {
      messageIds = [messageIds]
    }

    const headlessService = headlessServiceRef.current

    if (headlessService) {
      headlessService.markNotificationsAsRead({
        messageId: messageIds,
        listener: (result) => {},
        onSuccess: ([notification]) => {
          const notificationIndex = notifications.findIndex(
            (n) => n._id === notification._id
          )
          notifications.splice(notificationIndex, 1, notification)
          setNotifications(notifications)
        },
        onError: (error) => {
          console.error("Error marking notifications as read:", error)
        },
      })
    }
  }

  const markAllMessagesAsRead = (feedId?: string) => {
    const headlessService = headlessServiceRef.current

    if (headlessService) {
      headlessService.markAllMessagesAsRead({
        listener: (result) => {
          // Handle the result of marking all messages as read
          // You can update the state or perform other actions here
        },
        onError: (error) => {
          console.error("Error marking all messages as read:", error)
          // Implement error handling if needed
        },
        feedId: feedId, // Pass the feed ID here, it can be an array or a single ID
      })
    }
  }

  const markAllMessagesAsSeen = (feedId?: string) => {
    const headlessService = headlessServiceRef.current

    if (headlessService) {
      headlessService.markAllMessagesAsSeen({
        listener: (result) => {
          // Handle the result of marking all messages as read
          // You can update the state or perform other actions here
        },
        onSuccess: (count) => {
          setUnseenCount(0)
        },
        onError: (error) => {
          console.error("Error marking all messages as seen:", error)
          // Implement error handling if needed
        },
        feedId: feedId, // Pass the feed ID here, it can be an array or a single ID
      })
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markNotificationsAsRead,
        markAllMessagesAsRead,
        markAllMessagesAsSeen,
        pageNum,
        setPageNum,
        fetchNotifications,
        unseenCount,
        setUnseenCount,
        pagination,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

const useNotification = (): NotificationContextType =>
  useContext(NotificationContext)

export { useNotification, NotificationProvider }
