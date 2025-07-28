import Link from "next/link"
import Image from "next/image"
import moment, { Moment } from "moment"
import { useSetAtom } from "jotai"
import { useNotification } from "../_common/hooks/useNotification"
import ModalTrigger from "../../../../components/ModalTrigger"
import Dot from "./Dot"

import { formatAmount } from "../_common/utils/currency"
import { pageDrawerAtom } from "./layout/Sidebar"

import { RFC } from "@/types"
import { IMessage } from "@novu/headless"
import { HiMiniXMark } from "react-icons/hi2"
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6"
import { GrayButton } from "../../../../components/Button"

const imageUrl =
  "https://res.cloudinary.com/crowdr/image/upload/v1697259678/hyom8zz9lpmeyuhe6fss.jpg"

const Notifications = () => {
  const setCurrentDrawerId = useSetAtom(pageDrawerAtom)
  const { notifications, setPageNum, pagination } = useNotification()
  const mappedNotifications = mapNotificationToView(notifications)

  const clearDrawerId = () => setCurrentDrawerId("")
  const fetchMoreNotifications = () => setPageNum((prev) => prev + 1)

  return (
    <div className="flex flex-col bg-white w-[400px] h-full max-h-full pt-6">
      <div className="flex justify-between px-6 mb-6">
        <h1 className="font-semibold text-2xl">Notifications</h1>

        <ModalTrigger id="notifications" type="hide">
          <div
            onClick={clearDrawerId}
            className="relative hover:bg-[#F8F8F8] transition cursor-pointer rounded-full p-2 -top-1"
          >
            <HiMiniXMark fill="#98A2B3" className="h-6 w-6" />
          </div>
        </ModalTrigger>
      </div>

      <div className="grow overflow-y-auto px-6">
        {mappedNotifications.map((notification, index) => (
          <Notification
            key={notification.id}
            data={notification}
            onNotificationSelect={clearDrawerId}
            isLastItem={index + 1 === mappedNotifications.length}
          />
        ))}
      </div>

      {pagination?.hasMore && (
        <div className="flex justify-center pt-2 pb-4">
          <GrayButton
            text="Show more"
            className="!justify-center self-center mt-auto"
            onClick={fetchMoreNotifications}
          />
        </div>
      )}
    </div>
  )
}

export default Notifications

const Notification: RFC<NotificationProps> = ({
  data,
  isLastItem,
  onNotificationSelect,
}) => {
  const { markNotificationsAsRead } = useNotification()
  const { id, subject, content, emphasis, status, path, read, createdAt } = data
  const bottomMargin = !isLastItem ? "mb-8" : "mb-8"

  const detail = createDetail(content, emphasis)
  const selectNotification = () => {
    // onNotificationSelect()
    if (!read) {
      markNotificationsAsRead(id)
    }
  }

  return (
    <ModalTrigger id="notifications" type="hide">
      <Link
        href={`/${path}`}
        onClick={selectNotification}
        className="flex gap-3 text-sm cursor-pointer"
      >
        {/* account photo */}
        <div className="flex flex-col items-center">
          <div className="grid place-items-center h-12 w-12">
            {/* <Image
              src={imageUrl}
              width={48}
              height={48}
              alt={subject}
              className="object-cover rounded-full h-full w-full"
            /> */}
            {status === "success" ? (
              <FaRegCircleCheck
                fill="rgb(132, 225, 188)"
                className="text-3xl"
              />
            ) : (
              <FaRegCircleXmark
                fill="#rgb(248, 180, 180)"
                className="text-3xl"
              />
            )}
          </div>
          {!isLastItem && (
            <div className="grow bg-[#EAECF0] rounded-sm w-[2.5px] my-1"></div>
          )}
        </div>

        <div className="grow">
          {/* name x timestamp */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              <p className="text-[#344054]">{subject}</p>
              <p className="text-[#475467] font-light">
                {moment(createdAt).fromNow()}
              </p>
              {/* TODO: MAKE TIMESTAMP RESEMBLE THAT IN FIGMA */}
            </div>

            {!read && <Dot />}
          </div>

          <p className={`text-[#475467] ${bottomMargin}`}>{detail}</p>
          {/* volunteer/donate details */}
          {/* {type === 'donation' && <p className={`text-[#1F2227] ${bottomMargin}`}>Donated {formatAmount(detail.amount, detail.currency)} to <span className="text-primary">{campaign}</span> campaign</p>}
        {type === 'volunteer' && <p className={`text-[#475467] ${bottomMargin}`}>Volunteered for the <span className="text-primary">{campaign}</span> campaign</p>} */}
        </div>
      </Link>
    </ModalTrigger>
  )
}

type Notifications = ReturnType<typeof useNotification>["notifications"]
const mapNotificationToView = (notifications: IMessage[]) => {
  const mappedNotifications = notifications.map((notification) => ({
    id: notification._id,
    read: notification.read,
    subject: notification.payload["subject"] as string,
    content: notification.payload["message"] as string,
    emphasis: notification.payload["emphasis"] as string,
    status: notification.payload["status"] as string,
    path: notification.payload["path"] as string,
    createdAt: notification.createdAt,
  }))

  return mappedNotifications
}

const createDetail = (content: string, emphasis: string) => {
  const emphasizedText = <span className="text-primary">{emphasis}</span>

  if (content.startsWith(emphasis)) {
    const [lowerHalf] = content.split(emphasis)
    return [emphasizedText, lowerHalf]
  } else if (content.endsWith(emphasis)) {
    const [upperHalf] = content.split(emphasis)
    return [upperHalf, emphasizedText]
  } else {
    const [upperHalf, lowerHalf] = content.split(emphasis)
    return [upperHalf, emphasizedText, lowerHalf]
  }
}

type NotificationProps = {
  data: ReturnType<typeof mapNotificationToView>[number]
  isLastItem: boolean
  onNotificationSelect: () => void
}

// type NotificationType = IDonationNotification | IVolunteerNotification

// interface INotification {
//   timestamp: string | Moment
//   imageUrl: string
//   acccountName: string
//   campaign: string
//   seen: boolean
// }

// interface IVolunteerNotification extends INotification {
//   type: "volunteer"
// }

// interface IDonationNotification extends INotification {
//   type: "donation"
//   amount: number
//   currency: "naira" | "dollar"
// }

// const notifications: NotificationType[] = [
//   {
//     type: "donation",
//     timestamp: moment(),
//     imageUrl,
//     acccountName: "Phoenix Baker",
//     campaign: "Help Kunle",
//     seen: true,
//     amount: 5000,
//     currency: "naira",
//   },
//   {
//     type: "volunteer",
//     timestamp: moment().subtract(2, "minutes"),
//     imageUrl,
//     acccountName: "Lana Steiner",
//     campaign: "Lagos Food Bank",
//     seen: true,
//   },
//   {
//     type: "donation",
//     timestamp: moment().subtract(5, "minutes"),
//     imageUrl,
//     acccountName: "Phoenix Baker",
//     campaign: "Help Kunle beat Cancer",
//     seen: false,
//     amount: 100000,
//     currency: "naira",
//   },
//   {
//     type: "volunteer",
//     timestamp: moment().subtract(10, "minutes"),
//     imageUrl,
//     acccountName: "Lana Steiner",
//     campaign: "Lagos Food Bank",
//     seen: false,
//   },
//   {
//     type: "donation",
//     timestamp: moment().subtract(1, "days"),
//     imageUrl,
//     acccountName: "Phoenix Baker",
//     campaign: "Help Kunle beat Cancer",
//     seen: true,
//     amount: 100000,
//     currency: "naira",
//   },
//   {
//     type: "volunteer",
//     timestamp: moment().subtract(1, "weeks"),
//     imageUrl,
//     acccountName: "Lana Steiner",
//     campaign: "Lagos Food",
//     seen: false,
//   },
//   {
//     type: "volunteer",
//     timestamp: moment().subtract(2, "weeks"),
//     imageUrl,
//     acccountName: "Demi Wikinson",
//     campaign: "Lagos Food Bank",
//     seen: true,
//   },
//   {
//     type: "donation",
//     timestamp: moment().subtract(1, "months"),
//     imageUrl,
//     acccountName: "Phoenix Baker",
//     campaign: "Help Kunle beat Cancer",
//     seen: false,
//     amount: 100000,
//     currency: "naira",
//   },
//   {
//     type: "volunteer",
//     timestamp: moment().subtract(3, "months"),
//     imageUrl,
//     acccountName: "Demi Wikinson",
//     campaign: "Lagos Food Bank",
//     seen: true,
//   },
//   {
//     type: "donation",
//     timestamp: moment().subtract(1, "years"),
//     imageUrl,
//     acccountName: "Phoenix Baker",
//     campaign: "Help Kunle beat Cancer",
//     seen: false,
//     amount: 100000,
//     currency: "naira",
//   },
//   {
//     type: "volunteer",
//     timestamp: moment().subtract(2, "years"),
//     imageUrl,
//     acccountName: "Demi Wikinson",
//     campaign: "Lagos Food Bank",
//     seen: true,
//   },
// ]
