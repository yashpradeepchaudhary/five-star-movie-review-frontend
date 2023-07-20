import React from "react";
import { ImGift } from "react-icons/im";

const commonPosterUI =
  "flex justify-center items-center border border-dashed rounded aspect-video dark:border-dark-subtle border-light-subtle cursor-pointer";

export default function PosterSelector({
  name,
  accept,
  label,
  selectedPoster,
  className,
  onChange,
}) {
  return (
    <div>
      <input
        accept={accept}
        onChange={onChange}
        name={name}
        id={name}
        type="file"
        hidden
      />
      <label htmlFor={name}>
        {selectedPoster ? (
          <img
            className={commonPosterUI + " object-cover" + className}
            src={selectedPoster}
            alt=""
          />
        ) : (
          <PosterUI label={label} className={className}/>
        )}
      </label>
    </div>
  );
}

const PosterUI = ({label,className}) => {
  return (
    <div className={commonPosterUI + ' ' + className}>
      <span className="dark:text-dark-subtle text-light-subtle">
        {label}
      </span>
    </div>
  );
};
