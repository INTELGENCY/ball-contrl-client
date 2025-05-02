import React from "react";

const SectionWrapper = ({
  height,
  children,
  color,
  shadow,
  justifyContent,
  alignItems,
  direction,
  margin,
  gap,
  border,
  width,
  ...rest
}) => {
  const classNames = Object.entries(rest)
    .map(([key, value]) => {
      if (typeof value === "boolean") {
        return value ? ` ${key}` : "";
      }
      return ` ${key}-${value}`;
    })
    .join("");

  return (
    <div
      className={`w-full py-3.5 flex justify-center items-center  ${color} ${shadow} ${classNames} ${margin}`}
      style={{ height }}
    >
      <div
        className={`md:w-[${
          width ? width : "90%"
        }] w-[90%] flex justify-${justifyContent} items-${alignItems} ${gap} flex-${direction} ${border}`}
      >
        {children}
      </div>
    </div>
  );
};

export default SectionWrapper;
