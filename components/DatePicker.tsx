//components/DatePicker.tsx
"use client";

import * as React from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import "react-day-picker/dist/style.css";
import { CaptionLabel } from "react-day-picker";

import { cn } from "@/lib/utils";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (date: string) => void;
  onBlur?: () => void;
  error?: string;
}

export function Calendar28({
  label = "Event Date",
  placeholder = "Select event date",
  value,
  onChange,
  onBlur,
  error,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Initialize with undefined to avoid SSR mismatch
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [month, setMonth] = React.useState<Date | undefined>(undefined);
  const [inputValue, setInputValue] = React.useState("");

  // Run only on client side after mount
  React.useEffect(() => {
    setMounted(true);

    if (value && value.trim() !== "") {
      const newDate = new Date(value);
      if (isValidDate(newDate)) {
        setDate(newDate);
        setMonth(newDate);
        setInputValue(formatDate(newDate));
      }
    } else {
      setMonth(new Date());
    }
  }, []);

  // Update when value prop changes
  React.useEffect(() => {
    if (!mounted) return;

    if (value && value.trim() !== "") {
      const newDate = new Date(value);
      if (isValidDate(newDate)) {
        setDate(newDate);
        setInputValue(formatDate(newDate));
        setMonth(newDate);
      }
    } else {
      setDate(undefined);
      setInputValue("");
    }
  }, [value, mounted]);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setInputValue(formatDate(newDate));
    setOpen(false);

    if (newDate && isValidDate(newDate)) {
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, "0");
      const day = String(newDate.getDate()).padStart(2, "0");
      onChange?.(`${year}-${month}-${day}`);
    } else {
      onChange?.("");
    }

    onBlur?.();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const parsedDate = new Date(newValue);
    if (isValidDate(parsedDate)) {
      setDate(parsedDate);
      setMonth(parsedDate);

      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const day = String(parsedDate.getDate()).padStart(2, "0");
      onChange?.(`${year}-${month}-${day}`);
    }
  };

  const handleInputBlur = () => {
    onBlur?.();
  };

  const goToPreviousMonth = () => {
    if (!month) return;
    const newDate = new Date(month);
    newDate.setMonth(newDate.getMonth() - 1);
    setMonth(newDate);
  };

  const goToNextMonth = () => {
    if (!month) return;
    const newDate = new Date(month);
    newDate.setMonth(newDate.getMonth() + 1);
    setMonth(newDate);
  };

  // Don't render calendar until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor="date" className="text-base font-normal text-[#E7F2FF]">
          {label}
        </Label>
        <div className="relative">
          <div className="flex bg-[#182830] border-[#243B47] text-[#DCFFF8] focus:border-[#DCFFF8] py-[6.3px] rounded-xl w-full text-base focus:outline-1">
            <CalendarIcon className="size-[18px] pointer-events-none mt-2 absolute left-3" />
            <Input
              id="date"
              placeholder={placeholder}
              className="placeholder:text-[#DCFFF8] border-none pl-10 placeholder:text-base"
              disabled
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="date" className="text-base font-normal text-[#E7F2FF]">
        {label}
      </Label>

      <div className="relative">
        <div className="flex bg-[#182830] border-[#243B47] text-[#DCFFF8] focus:border-[#DCFFF8] py-[6.3px] rounded-xl w-full text-base focus:outline-1 ">
          <CalendarIcon className=" size-[18px] pointer-events-none mt-2 absolute left-3" />

          <Input
            id="date"
            value={inputValue}
            placeholder={placeholder}
            className=" placeholder:text-[#DCFFF8] border-none pl-10 placeholder:text-base"
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
              }
            }}
          />
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Open calendar"
            />
          </PopoverTrigger>

          <PopoverContent
            className="w-auto overflow-hidden p-0 bg-[#182830] border-transparent"
            align="start"
            sideOffset={10}
          >
            <style jsx global>{`
              .custom-datepicker {
                background: #182830;
                color: #dcfff8;
                padding: 20px 15px;
              }
              .custom-datepicker .rdp-day {
                border-radius: 50%;
                transition: background-color 0.2s;
              }
            `}</style>
            <div className="custom-datepicker">
              <DayPicker
                mode="single"
                navLayout="around"
                selected={date}
                onSelect={handleDateChange}
                month={month}
                onMonthChange={setMonth}
                fromYear={2026}
                showOutsideDays
                animate
                components={{
                  CaptionLabel(props) {
                    return (
                      <CaptionLabel
                        {...props}
                        className="text-[#DCFFF8] mt-2"
                      />
                    );
                  },
                  Chevron(props) {
                    return props.orientation === "left" ? (
                      <ChevronLeft className="text-[#DCFFF8]" />
                    ) : (
                      <ChevronRight className="text-[#DCFFF8]" />
                    );
                  },

                  DayButton: ({ day, modifiers, ...props }) => {
                    const isToday = modifiers?.today;
                    const isSelected = modifiers?.selected;
                    const isOutside = modifiers?.outside;

                    return (
                      <button
                        {...props}
                        className={cn(
                          "w-8 h-8 rounded-full text-[#DCFFF8] hover:bg-[#243B47] transition-colors cursor-pointer",
                          isOutside
                            ? "text-[#475569] opacity-40"
                            : "text-[#DCFFF8]",
                          !isOutside && "hover:bg-[#243B47]",
                          isToday &&
                            !isSelected &&
                            "font-bold text-lg text-[#59deca]",
                          isSelected &&
                            "bg-[#DCFFF8] text-[#59deca] font-semibold"
                        )}
                      >
                        {day.date.getDate()}
                      </button>
                    );
                  },
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
