"use client";

import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface TimePickerProps {
  label?: string;
  value?: string;
  onChange?: (time: string) => void;
  error?: string;
}

export function TimePicker({
  label = "Event Time",
  value,
  onChange,
  error,
}: TimePickerProps) {
  const parsedValue = value ? new Date(`2000-01-01T${value}`) : null;

  const handleChange = (newValue: Date | null) => {
    if (!newValue) return;

    const hh = String(newValue.getHours()).padStart(2, "0");
    const mm = String(newValue.getMinutes()).padStart(2, "0");

    onChange?.(`${hh}:${mm}`);
  };

  return (
    <div className="flex flex-col">
      <Label className="text-base font-normal text-[#E7F2FF] mb-3">
        {label}
      </Label>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopTimePicker
          value={parsedValue}
          onChange={handleChange}
          ampm={true}
          slots={{
            openPickerIcon: () => (
              <Image src="/icons/time.svg" alt="Clock" width={18} height={18} />
            ),
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              placeholder: "Select start time",
              autoFocus: false,
              InputProps: {
                sx: {
                  background: "#182830",

                  color: "#DCFFF8",
                  borderRadius: "12px",
                  cursor: "pointer",
                  flexDirection: "row",

                  height: "48px",

                  "& .MuiInputAdornment-root": {
                    marginLeft: "-9px",
                    marginRight: "15px",
                    order: -1,
                  },

                  "& input": {
                    cursor: "pointer",
                    padding: "0",
                    fontSize: "16px",
                    "&::placeholder": {
                      color: "#DCFFF8",
                      opacity: 1,
                    },
                  },

                  "& fieldset": {
                    borderColor: "transparent !important",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#243B47 !important",
                    outline: "1px !important",
                  },
                },
              },

              FormHelperTextProps: {
                sx: {
                  display: "none",
                },
              },
            },

            desktopPaper: {
              sx: {
                background: "#182830",
                color: "#DCFFF8",
                borderRadius: "12px",
              },
            },

            popper: {
              sx: {
                "& .MuiClock-clock": {
                  background: "#243B47",
                },

                "& .MuiClockNumber-root": {
                  color: "#DCFFF8",
                },

                "& .Mui-selected": {
                  backgroundColor: "#DCFFF8 !important",
                  color: "#59deca !important",
                  fontWeight: 600,
                },

                "& .MuiClockPointer-root": {
                  backgroundColor: "#DCFFF8",
                },

                "& .MuiClockPointer-thumb": {
                  backgroundColor: "#DCFFF8",
                  borderColor: "#DCFFF8",
                },
              },
            },
          }}
        />
      </LocalizationProvider>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
