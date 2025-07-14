import { RFC } from "@/types";

const Drawer: RFC<DrawerProps> = ({ id, children, ariaLabel }) => {
  // TODO: POSSIBLY USE FLOWBITE REACT FOR DRAWER
  return (
    <div
      id={id}
      tabIndex={-1}
      aria-hidden="true"
      aria-label={ariaLabel}
      className="fixed top-0 left-0 z-40 h-full w-min overflow-y-auto transition-transform -translate-x-full bg-white"
    >
      {children}
    </div>
  );
};

export default Drawer;

type DrawerProps = {
  id: string;
  children: React.ReactNode;
  ariaLabel?: string
};
