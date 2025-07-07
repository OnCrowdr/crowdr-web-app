import { CampaignStatus } from "@/types/Campaign";
import { RFC } from "@/types";

const Label: RFC<LabelProps> = ({
  text,
  textColor = "#027A48",
  bgColor = "#ECFDF3",
  dotColor,
  className,
}) => {
  return (
    <div
      style={{ backgroundColor: bgColor, color: textColor }}
      className={
        "inline-flex shrink-0 self-start items-center rounded-full px-2.5 py-1 " +
        className
      }>
      {dotColor && (
        <span
          style={{ backgroundColor: dotColor }}
          className="rounded-full h-2 w-2 mr-[6px]"></span>
      )}
      <span style={{ color: textColor, fontSize: "12px" }}>{text}</span>
    </div>
  );
};

export default Label;

type LabelProps = {
  text: string;
  textColor?: string;
  bgColor?: string;
  dotColor?: string;
  className?: string;
};

const Completed = <Label text="Completed" dotColor="#12B76A" />;
const InProgress = (
  <Label
    text="In progress"
    textColor="#B54708"
    bgColor="#FFFAEB"
    dotColor="#F79009"
  />
);
const Declined = (
  <Label
    text="Declined"
    textColor="#B42318"
    bgColor="#F04438"
    dotColor="#F04438"
  />
);
const InReview = (
  <Label
    text="In review"
    textColor="#344054"
    bgColor="#F2F4F7"
    dotColor="#667085"
  />
);

export const label = (type: CampaignStatus) => {
  switch (type) {
    case "completed":
      return Completed;

    case "in-progress":
      return InProgress;

    case "declined":
      return Declined;

    case "in-review":
      return InReview;
  }
};
