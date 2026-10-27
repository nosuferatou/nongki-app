"use client";

import { useRef, useState, type ChangeEvent, type FocusEvent } from "react";

type LocationUrlInputProps = {
  className: string;
  labelClassName: string;
  initialValue?: string;
};

function getLocationUrlError(value: string): string | null {
  if (!/^https?:\/\//i.test(value)) {
    return "Please enter a valid URL starting with http:// or https://.";
  }

  try {
    const url = new URL(value);
    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      !url.hostname
    ) {
      return "Please enter a valid URL.";
    }
  } catch {
    return "Please enter a valid URL.";
  }

  return null;
}

export default function LocationUrlInput({
  className,
  labelClassName,
  initialValue = "",
}: LocationUrlInputProps) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const error = value ? getLocationUrlError(value) : null;

  function updateValue(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;
    setValue(nextValue);
    setTouched(true);
    event.currentTarget.setCustomValidity(
      nextValue ? getLocationUrlError(nextValue) ?? "" : "",
    );
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setTouched(true);
    const currentValue = event.currentTarget.value;
    event.currentTarget.setCustomValidity(
      currentValue ? getLocationUrlError(currentValue) ?? "" : "",
    );
  }

  return (
    <div>
      <label htmlFor="locationUrl" className={labelClassName}>
        Location URL <span aria-hidden="true">*</span>
      </label>
      <input
        ref={inputRef}
        id="locationUrl"
        name="locationUrl"
        type="url"
        value={value}
        onChange={updateValue}
        onBlur={handleBlur}
        placeholder="e.g., https://maps.app.goo.gl/... (copy link from Google Maps here)"
        required
        aria-invalid={touched && Boolean(error)}
        aria-describedby={touched && error ? "location-url-error" : undefined}
        className={`${className} ${
          touched && error ? "border-red-500 focus-visible:outline-red-500" : ""
        }`}
      />
      {touched && error && (
        <p id="location-url-error" className="mt-1 text-sm text-red-500">
          Please enter a valid URL.
        </p>
      )}
    </div>
  );
}
