import SidebarModal from "./SidebarModal"
import { useAtomValue } from "jotai"
import Notifications from "./Notifications"
import CompletionCard from "./CompletionCard"
import deleteCookie from "@/utils/api/deleteCookie"
import { modalStoreAtom } from "../../../../components/ModalTrigger"

import { RFC } from "@/types"
import local from "@/utils/local"
import { useAuth } from "@/contexts/AppProvider"

const Page: RFC = ({ children }) => {
  const modalStore = useAtomValue(modalStoreAtom)
  const { logout } = useAuth()

  const hideLogoutModal = () => {
    const modal = modalStore.get("logout-modal")
    modal?.hide()
  }

  return (
    <>
      <main className="grow overflow-y-auto overflow-x-hidden border-l-[0.7px] border-[rgba(56, 56, 56, 0.08)] px-5 md:px-8 pt-[9px] md:pt-[27px] pb-[27px]">
        {children}
      </main>

      <SidebarModal id="notifications" position="right">
        <Notifications />
      </SidebarModal>

      <SidebarModal id="logout-modal">
        <CompletionCard
          title="Log out of your account"
          text="Are you sure you want to log out of your account?"
          primaryButton={{
            label: "Log out",
            bgColor: "#D92D20",
            onClick: async () => {
              await logout()
              location.replace("/login")
            },
          }}
          secondaryButton={{
            label: "Cancel",
            onClick: hideLogoutModal,
          }}
          clearModal={hideLogoutModal}
          icon={
            <div className="grid place-items-center rounded-full bg-[#FEE4E2] p-3">
              <LogoutIcon />
            </div>
          }
        />
      </SidebarModal>
    </>
  )
}

export default Page

const LogoutIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M6 17C6 17.93 6 18.395 6.10222 18.7765C6.37962 19.8117 7.18827 20.6204 8.22354 20.8978C8.60504 21 9.07003 21 10 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H10C9.07003 3 8.60504 3 8.22354 3.10222C7.18827 3.37962 6.37962 4.18827 6.10222 5.22354C6 5.60504 6 6.07003 6 7M12 8L16 12M16 12L12 16M16 12H3"
        stroke="#D92D20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
