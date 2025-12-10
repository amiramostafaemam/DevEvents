"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type EventTypeValue = "online" | "offline" | "hybrid";

interface EventTypeProps {
  label?: string;
  value?: EventTypeValue;
  onChange?: (value: EventTypeValue) => void;
  error?: string;
  placeholder?: string;
}

export function EventType({
  label = "Event Type",
  value,
  onChange,
  error,
  placeholder = "Select event type",
}: EventTypeProps) {
  return (
    <div className="">
      <Label className="text-base font-normal text-[#E7F2FF] mb-3">
        {label}
      </Label>

      <Select
        value={value}
        onValueChange={(value) => onChange?.(value as EventTypeValue)}
      >
        <SelectTrigger className="bg-[#182830] border-transparent text-[#DCFFF8] px-4 rounded-lg text-base focus:border-[#DCFFF8] focus:outline-none  w-full cursor-pointer [&>span]:text-[#DCFFF8] min-h-12">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="bg-[#182830] border-[#243B47] rounded-xl py-2">
          <SelectItem
            value="online"
            className="text-[#DCFFF8] focus:bg-[#DCFFF8] focus:text-[#182830] cursor-pointer rounded-lg"
          >
            Online
          </SelectItem>
          <SelectItem
            value="offline"
            className="text-[#DCFFF8] focus:bg-[#DCFFF8] focus:text-[#182830] cursor-pointer rounded-lg"
          >
            Offline
          </SelectItem>
          <SelectItem
            value="hybrid"
            className="text-[#DCFFF8] focus:bg-[#DCFFF8] focus:text-[#182830] cursor-pointer rounded-lg"
          >
            Hybrid
          </SelectItem>
        </SelectContent>
      </Select>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
