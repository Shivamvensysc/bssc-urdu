import React from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

interface DateSelectProps {
  value: {
    day: string;
    month: string;
    year: string;
  };
  onChange: (field: "day" | "month" | "year", value: string) => void;
  onBlur: (field: "day" | "month" | "year") => void;
  errors?: {
    day?: string | false;
    month?: string | false;
    year?: string | false;
  };
  touched?: {
    day?: boolean;
    month?: boolean;
    year?: boolean;
  };
  required?: boolean;
  label?: string;
  hi?: string;
  note?: string;
  className?: string;
  maxYear?: number;
  minYear?: number;
  dayLabel?: string;
  monthLabel?: string;
  yearLabel?: string;
}

interface SelectBoxProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  error?: string | false;
  children: React.ReactNode;
  className?: string;
  placeholder?: string;
}

const SelectBox: React.FC<SelectBoxProps> = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  children,
  className = "",
  placeholder,
}) => (
  <div className="relative">
    <select
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`w-full border rounded-lg appearance-none pr-9 px-4 py-3 text-[15px] outline-none transition-colors ${
        error ? "border-red-500" : "border-[#B9C2BD]"
      } focus:border-[#003A2B] ${className}`}
      style={{ color: "#12233F" }}
    >
      <option value="">{placeholder || "Select"}</option>
      {children}
    </select>
    <ChevronDown
      size={15}
      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ color: "#5B6B84" }}
    />
  </div>
);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DateSelect: React.FC<DateSelectProps> = ({
  value,
  onChange,
  onBlur,
  errors = {},
  touched = {},
  required = false,
  label,
  hi,
  note,
  className = "",
  maxYear = new Date().getFullYear(),
  minYear = 1900,
  dayLabel = "Day",
  monthLabel = "Month",
  yearLabel = "Year",
}) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i,
  );

  const handleChange =
    (field: "day" | "month" | "year") =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(field, e.target.value);
    };

  const handleBlur = (field: "day" | "month" | "year") => () => {
    onBlur(field);
  };

  const hasError =
    touched?.day && (errors?.day || errors?.month || errors?.year);

  const content = (
    <div className={`grid grid-cols-3 gap-3 max-w-md ${className}`}>
      <SelectBox
        name="dobDay"
        value={value.day}
        onChange={handleChange("day")}
        onBlur={handleBlur("day")}
        error={touched?.day && errors?.day}
        placeholder={dayLabel}
      >
        {days.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </SelectBox>
      <SelectBox
        name="dobMonth"
        value={value.month}
        onChange={handleChange("month")}
        onBlur={handleBlur("month")}
        error={touched?.month && errors?.month}
        placeholder={monthLabel}
      >
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>
            {m}
          </option>
        ))}
      </SelectBox>
      <SelectBox
        name="dobYear"
        value={value.year}
        onChange={handleChange("year")}
        onBlur={handleBlur("year")}
        error={touched?.year && errors?.year}
        placeholder={yearLabel}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </SelectBox>
    </div>
  );

  if (!label && !note) {
    return content;
  }

  return (
    <div className="mb-6">
      {(label || hi) && (
        <div className="mb-2">
          <div
            className="text-[12.5px] font-extrabold tracking-wide"
            style={{ color: "#12233F" }}
          >
            {required && <span style={{ color: "#B3432B" }}>* </span>}
            {label}
          </div>
          {hi && (
            <div
              className="text-[11.5px] font-medium"
              style={{ color: "#5B6B84" }}
            >
              {hi}
            </div>
          )}
        </div>
      )}
      {content}
      {hasError && (
        <div
          className="flex items-center gap-1 mt-1.5 text-[11.5px] font-bold"
          style={{ color: "#B3432B" }}
        >
          <AlertCircle size={12} />
          {errors?.day || errors?.month || errors?.year}
        </div>
      )}
      {note && (
        <div
          className="text-[11px] font-semibold mt-1.5 leading-relaxed"
          style={{ color: "#8F5522" }}
        >
          {note}
        </div>
      )}
    </div>
  );
};

export default DateSelect;
