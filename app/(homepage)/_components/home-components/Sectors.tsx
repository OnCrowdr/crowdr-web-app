"use client";
import "../home-styles/sectors.css";

type Sector = {
  name: string;
  bgColor: string;
  color?: string;
};

const colorOptions = {
  darkGreen: "#2B5F49",
  red: "#D43731",
  milk: "#E6E6E6",
  maroon: "#713045",
  blue: "#4266AC",
  yellow: "#FFCD29",
  lightGreen: "#DFEBE9",
  mediumGreen: "#7CB855",
  lightMaroon: "#8C284A",
  lightBlue: "#5F94CB",
  orange: "#E37138",
  darkBlue: "#304471",
};
const sectors1: Sector[] = [
  { name: "Hunger", bgColor: colorOptions.darkGreen },
  { name: "Wildlife", bgColor: colorOptions.darkGreen },
  { name: "Poverty", bgColor: colorOptions.red },
  { name: "Disaster", bgColor: colorOptions.milk, color: "black" },

  { name: "Charity", bgColor: colorOptions.darkGreen },
  { name: "Academics", bgColor: colorOptions.maroon },
  { name: "Medical", bgColor: colorOptions.blue },
  { name: "Community", bgColor: colorOptions.yellow, color: "black" },
  { name: "Crisis", bgColor: colorOptions.lightGreen, color: "black" },
  { name: "Events", bgColor: colorOptions.mediumGreen, color: "black" },
  // {name : "Hunger", color : colorOptions.darkGreen },
];
const sectors2: Sector[] = [
  { name: "Equality", bgColor: colorOptions.lightMaroon },
  { name: "Climate", bgColor: colorOptions.maroon },
  { name: "Legal", bgColor: colorOptions.red },
  { name: "Political", bgColor: colorOptions.blue },

  { name: "Housing", bgColor: colorOptions.maroon },
  { name: "Health", bgColor: colorOptions.lightBlue },
  { name: "Women", bgColor: colorOptions.orange },
  { name: "Disability", bgColor: colorOptions.darkBlue },
  { name: "Enviroment", bgColor: colorOptions.orange },
  { name: "Youth", bgColor: colorOptions.darkGreen },
  // {name : "Hunger", color : colorOptions.darkGreen },
];

const OurFeaturesAnimation = () => {
  return (
    <section className="sectors">
      <div className="position-relative marquee-container d-none d-sm-block">
        <ul className="marquee d-flex justify-content-around" >
          {sectors1.map((sector, index) => (
            <li
              key={index}
              style={{
                background: sector.bgColor,
                color: sector?.color || "white",
              }}
            >
              {sector.name}
            </li>
          ))}
        </ul>
        <ul className="marquee marquee2 d-flex justify-content-around">
          {sectors1.map((sector, index) => (
            <li
              key={index}
              style={{
                background: sector.bgColor,
                color: sector?.color || "white",

              }}
            >
              {sector.name}
            </li>
          ))}
        </ul>
      </div>


      <div className="position-relative marquee-container d-none d-sm-block">
        <ul className="marquee-sector2 d-flex justify-content-around" >
          {sectors2.map((sector, index) => (
            <li
              key={index}
              style={{
                background: sector.bgColor,
                color: sector?.color || "white",
              }}
            >
              {sector.name}
            </li>
          ))}
        </ul>
        <ul className="marquee-sector2 marquee2-sector2 d-flex justify-content-around">
          {sectors2.map((sector, index) => (
            <li
              key={index}
              style={{
                background: sector.bgColor,
                color: sector?.color || "white",

              }}
            >
              {sector.name}
            </li>
          ))}
        </ul>
      </div>
      </section>
  );
};

export default OurFeaturesAnimation;
