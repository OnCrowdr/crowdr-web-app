"use client"
import {
  Children,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  isValidElement,
  useState,
  useEffect,
} from "react"
import _ from "lodash"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { RFC } from "@/types"

const Tabs: Tabs = ({ children, activeTab: initialTab, styles }) => {
  const currentRoute = usePathname()
  const tabs = (Children.map(children, (child) => child)?.filter(
    (child) => isValidElement<TabItemProps>(child) && child.props.heading
  ) || []) as ReactElement<TabItemProps>[]
  const tabHeadings = (tabs as ReactElement<TabItemProps>[]).map(
    ({ props }) => ({
      heading: props.heading,
      href: props.href,
    })
  )

  const activeTabSetter = () =>
    initialTab ? initialTab : tabHeadings[0]?.heading

  const [activeTab, setActiveTab] = useState(activeTabSetter)
  useEffect(() => {
    setActiveTab(activeTabSetter)
  }, [initialTab])
  
  return (
    <div>
      <div
        className={
          "flex gap-4 border-b boder-[#E4E7EC] overflow-x-auto no-scrollbar mb-8 " +
          styles?.header
        }
      >
        {tabHeadings?.map(({ heading, href }) => {
          const props: any = href // use current url to determine current tab, but if href and activeTab(initialTab) are present, use tab==activeTab instead
            ? { href, currentRoute, ...(initialTab ? { activeTab } : {}) }
            : { activeTab, onSelectTab: setActiveTab }

          return <TabHeading key={heading} heading={heading} {...props} />
        })}
      </div>

      {tabs?.map((tab) => (
        <TabContent key={tab.props.heading} tab={tab} activeTab={activeTab} />
      ))}
    </div>
  )
}

Tabs.Item = ({ children }) => {
  return (
    <div className="mt-6">
      <div className="bg-[#F9F9F9] p-4">{children}</div>
    </div>
  )
}

const TabHeading: RFC<TabHeadingProps> = ({
  heading: tab,
  activeTab,
  onSelectTab,
  href,
  currentRoute,
}) => {
  const activeTabStyle =
    "text-[#00B964] bg-[#FCFCFC] border-b-2 border-[#00B964]"
  const inActiveTabStyle = "text-[#667085]"
  const hasInitialTabAndIsLink = href && activeTab
  const tabIdentifier = hasInitialTabAndIsLink ? tab : href || tab
  const selectedIdentifier = hasInitialTabAndIsLink
    ? activeTab
    : currentRoute || activeTab

  const props: any = {
    className: `text-sm cursor-pointer whitespace-nowrap p-3 ${
      tabIdentifier === selectedIdentifier ? activeTabStyle : inActiveTabStyle
    }`,
  }

  if (onSelectTab) {
    props.onClick = () => onSelectTab(tab)
  }

  return (
    <>
      {href ? (
        <Link href={href} {...props}>
          {tab}
        </Link>
      ) : (
        <span {...props}>{tab}</span>
      )}
    </>
  )
}

const TabContent: RFC<TabContentProps> = ({ tab, activeTab }) => {
  return tab.props.heading == activeTab ? <div>{tab.props.children}</div> : null
}

export default Tabs

type Tabs = RFC<TabsProps> & { Item: RFC<TabItemProps> }

type TabsProps = {
  activeTab?: string
  children:
    | ReactElement<TabItemProps>[]
    | ReactElement<TabItemProps>
    | ReactNode
  styles?: { header: string }
}

type TabItemProps = {
  heading: string
  children: ReactNode
  href?: string
}

type TabHeadingProps = {
  heading: string
  activeTab?: string
  onSelectTab?: Dispatch<SetStateAction<string>>
  href?: string
  currentRoute: string
}

type TabContentProps = {
  activeTab: string
  tab: ReactElement<TabItemProps>
}
