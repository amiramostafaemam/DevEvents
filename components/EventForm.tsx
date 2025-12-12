// components/EventForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema, EventFormData } from "@/lib/validation";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { IEventSerialized } from "@/database/event.model";
import { Calendar28 } from "@/components/DatePicker";
import { TimePicker } from "@/components/TimePicker";
import { toast } from "sonner";
import { MapPin, Pencil, Trash2, X } from "lucide-react";
import { EventType } from "./EventType";
import LoadingButton from "@/components/LoadingButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { compressImage } from "@/lib/imageCompression";

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

interface EventFormProps {
  event?: IEventSerialized;
  createdBy?: "user" | "admin";
}
const EventForm = ({ event, createdBy = "user" }: EventFormProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isEditMode = !!event;
  const isAdminRoute = pathname?.startsWith("/admin");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(event?.image || "");
  const [tags, setTags] = useState<string[]>(event?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [agenda, setAgenda] = useState<string[]>(event?.agenda || []);
  const [agendaInput, setAgendaInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [audience, setAudience] = useState<string[]>(
    Array.isArray(event?.audience) ? event.audience : []
  );
  const [audienceInput, setAudienceInput] = useState("");
  const [editingAudienceIndex, setEditingAudienceIndex] = useState<
    number | null
  >(null);

  // State for duplicate event alert
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [duplicateEventTitle, setDuplicateEventTitle] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema.partial({ image: true })),
    mode: "onTouched",
    defaultValues: event
      ? {
          title: event.title,
          description: event.description,
          overview: event.overview,
          location: event.location,
          date: event.date,
          time: event.time,
          mode: event.mode as "online" | "offline" | "hybrid",

          audience: Array.isArray(event.audience) ? event.audience : [],

          organizer: event.organizer,
          tags: event.tags,
          agenda: event.agenda,
        }
      : {
          date: "",
          time: "",
          mode: undefined as "online" | "offline" | "hybrid" | undefined,
          tags: [],
          agenda: [],
          audience: [],
        },
  });

  useEffect(() => {
    if (event) {
      setValue("tags", event.tags || []);
      setValue("agenda", event.agenda || []);

      const audienceArray = Array.isArray(event.audience) ? event.audience : [];
      setValue("audience", audienceArray);
      setAudience(audienceArray);
    }
  }, [event, setValue]);

  const handleDateChange = (date: string) => {
    setValue("date", date, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleDateBlur = async () => {
    await trigger("date");
  };

  // Handle image upload with compression
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file, 1200, 0.8);

        setValue("image", compressedFile);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.onerror = () => {
          toast.error("Failed to read image file", {
            style: {
              background: "#DC2626",
              color: "#FFFFFF",
              border: "1px solid #B91C1C",
            },
          });
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        toast.error("Failed to process image", {
          style: {
            background: "#DC2626",
            color: "#FFFFFF",
            border: "1px solid #B91C1C",
          },
        });
      }
    }
  };

  const addTag = async () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
      await trigger("tags");
    }
  };

  const removeTag = async (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue("tags", newTags);
    await trigger("tags");
  };

  const addAgendaItem = async () => {
    if (agendaInput.trim()) {
      let updatedAgenda;
      if (editingIndex !== null) {
        updatedAgenda = [...agenda];
        updatedAgenda[editingIndex] = agendaInput.trim();
        setEditingIndex(null);
      } else {
        updatedAgenda = [...agenda, agendaInput.trim()];
      }
      setAgenda(updatedAgenda);
      setValue("agenda", updatedAgenda);
      setAgendaInput("");
      await trigger("agenda");
    }
  };

  const editAgendaItem = (index: number) => {
    setAgendaInput(agenda[index]);
    setEditingIndex(index);
  };

  const removeAgendaItem = async (index: number) => {
    const updatedAgenda = agenda.filter((_, i) => i !== index);
    setAgenda(updatedAgenda);
    setValue("agenda", updatedAgenda);

    if (editingIndex === index) {
      setEditingIndex(null);
      setAgendaInput("");
    }
    await trigger("agenda");
  };

  const addAudienceItem = async () => {
    if (audienceInput.trim()) {
      let updatedAudience;
      if (editingAudienceIndex !== null) {
        updatedAudience = [...audience];
        updatedAudience[editingAudienceIndex] = audienceInput.trim();
        setEditingAudienceIndex(null);
      } else {
        updatedAudience = [...audience, audienceInput.trim()];
      }
      setAudience(updatedAudience);
      setValue("audience", updatedAudience);
      setAudienceInput("");
      await trigger("audience");
    }
  };

  const editAudienceItem = (index: number) => {
    setAudienceInput(audience[index]);
    setEditingAudienceIndex(index);
  };

  const removeAudienceItem = async (index: number) => {
    const updatedAudience = audience.filter((_, i) => i !== index);
    setAudience(updatedAudience);
    setValue("audience", updatedAudience);

    if (editingAudienceIndex === index) {
      setEditingAudienceIndex(null);
      setAudienceInput("");
    }
    await trigger("audience");
  };

  const resetForm = () => {
    reset({
      title: "",
      description: "",
      overview: "",
      location: "",
      date: "",
      time: "",
      mode: undefined as "online" | "offline" | "hybrid" | undefined,
      audience: [],
      organizer: "",
      tags: [],
      agenda: [],
      image: undefined,
    });
    setTags([]);
    setAgenda([]);
    setAudience([]);
    setImagePreview("");
    setTagInput("");
    setAgendaInput("");
    setAudienceInput("");
    setEditingIndex(null);
    setEditingAudienceIndex(null);
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);

    try {
      if (!data.tags || data.tags.length === 0) {
        toast.error("Please add at least one tag", {
          style: {
            background: "#DC2626",
            color: "#FFFFFF",
            border: "1px solid #B91C1C",
          },
        });
        setIsSubmitting(false);
        return;
      }

      if (!data.agenda || data.agenda.length === 0) {
        toast.error("Please add at least one agenda item", {
          style: {
            background: "#DC2626",
            color: "#FFFFFF",
            border: "1px solid #B91C1C",
          },
        });
        setIsSubmitting(false);
        return;
      }

      if (!data.audience || data.audience.length === 0) {
        toast.error("Please add at least one target audience", {
          style: {
            background: "#DC2626",
            color: "#FFFFFF",
            border: "1px solid #B91C1C",
          },
        });
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      if (!isEditMode) {
        const slug = generateSlug(data.title);
        formData.append("slug", slug);
      }
      formData.append("description", data.description);
      formData.append("overview", data.overview);
      formData.append("location", data.location);
      formData.append("date", data.date);
      formData.append("time", data.time);
      formData.append("mode", data.mode);
      formData.append("audience", JSON.stringify(data.audience));
      formData.append("organizer", data.organizer);
      formData.append("tags", JSON.stringify(data.tags));
      formData.append("agenda", JSON.stringify(data.agenda));

      // Add createdBy only when creating (not editing)
      if (!isEditMode) {
        formData.append("createdBy", createdBy);
      }

      if (data.image) {
        formData.append("image", data.image);
      } else if (!isEditMode) {
        toast.error("Please select an image", {
          style: {
            background: "#DC2626",
            color: "#FFFFFF",
            border: "1px solid #B91C1C",
          },
        });
        setIsSubmitting(false);
        return;
      }

      const url = isEditMode ? `/api/events/${event._id}` : "/api/events";
      const method = isEditMode ? "PUT" : "POST";

      const prepTime = performance.now();

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const responseTime = performance.now();

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("Server returned an invalid response");
      }

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = (result.message || "").toLowerCase();
        const errorDetail = (result.error || "").toLowerCase();

        const isDuplicate =
          errorDetail.includes("e11000") ||
          errorDetail.includes("duplicate key") ||
          errorDetail.includes("dup key") ||
          errorMessage.includes("already exists") ||
          errorMessage.includes("duplicate") ||
          (response.status === 500 && errorDetail.includes("duplicate"));

        if (isDuplicate) {
          setDuplicateEventTitle(data.title);
          setShowDuplicateAlert(true);
          return;
        }

        // For other errors, build error message
        let finalErrorMessage =
          result.message ||
          result.error ||
          `Failed to ${isEditMode ? "update" : "create"} event`;

        if (result.errors && typeof result.errors === "object") {
          const fieldErrors = Object.entries(result.errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join(", ");
          if (fieldErrors) {
            finalErrorMessage += ` - ${fieldErrors}`;
          }
        }

        throw new Error(finalErrorMessage);
      }

      // Determine success message based on who created the event
      let successMessage = `Event ${
        isEditMode ? "updated" : "created"
      } successfully!`;

      // If it's a user (not admin) creating a new event, show approval message
      if (
        !isEditMode &&
        createdBy === "user" &&
        result.message?.includes("submitted for approval")
      ) {
        successMessage =
          "Event created successfully! Your event is waiting for admin approval.";
      } else if (!isEditMode && createdBy === "user") {
        // Fallback in case API message format changes
        successMessage =
          "Event created successfully! Your event is waiting for admin approval.";
      }

      toast.success(successMessage, {
        style: {
          background: "#59DECA",
          color: "#030708",
          border: "transparent",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: "semibold",
          padding: "12px 16px",
        },
      });

      const totalTime = performance.now();

      if (!isEditMode) {
        resetForm();
      }

      // Navigate after a short delay to show the success message
      setTimeout(() => {
        if (isAdminRoute) {
          router.push("/admin");
        } else {
          router.push("/");
        }
        router.refresh();
      }, 1000);
    } catch (error) {
      let errorMessage = `Failed to ${isEditMode ? "update" : "create"} event`;
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        style: {
          background: "#DC2626",
          color: "#FFFFFF",
          border: "transparent",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: "semibold",
          padding: "12px 16px",
        },
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <AlertDialog
        open={showDuplicateAlert}
        onOpenChange={setShowDuplicateAlert}
      >
        <AlertDialogContent className="bg-[#0D161A] border-transparent text-[#DCFFF8]">
          <AlertDialogHeader>
            <AlertDialogDescription className="text-[#DCFFF8] text-base">
              Event with the title{" "}
              <span className="font-semibold text-xl text-red-600 capitalize">
                {duplicateEventTitle}
              </span>{" "}
              already exists. Please use a different title for your event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowDuplicateAlert(false)}
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-[#f1fbfd] font-semibold text-base"
            >
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <h1 className="text-5xl font-semibold text-center mb-8">
        {isEditMode ? "Edit Event" : "Create an Event"}
      </h1>
      <div className="bg-[#0D161A] border-[#243B47] p-5 rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-4 py-3">
          {/* Event Title */}
          <div>
            <label
              htmlFor="title"
              className="text-base font-normal text-[#E7F2FF]"
            >
              Event Title
            </label>
            <input
              {...register("title")}
              type="text"
              id="title"
              placeholder="Enter event title"
              className="bg-[#182830] border-[#243B47] text-[#DCFFF8] py-3 w-full px-4 mt-3 rounded-xl text-base placeholder:text-[#DCFFF8] placeholder:text-base focus:border-[#DCFFF8] focus:outline-1"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Event Date */}
          <Calendar28
            label="Event Date"
            placeholder="Select event date"
            value={watch("date")}
            onChange={(date) => setValue("date", date)}
            onBlur={handleDateBlur}
            error={errors.date?.message}
          />

          {/* Event Time */}
          <TimePicker
            value={watch("time")}
            onChange={(val) =>
              setValue("time", val, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
            error={errors.time?.message}
          />

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="text-base font-normal text-[#E7F2FF]"
            >
              Event Venue
            </label>
            <div className="relative w-full mt-3">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-[#DCFFF8] pointer-events-none z-10" />
              <input
                {...register("location")}
                type="text"
                id="location"
                placeholder="Enter venue or online link"
                className="bg-[#182830] border-[#243B47] text-[#DCFFF8] py-3 w-full pl-11 pr-4 rounded-xl text-base placeholder:text-[#DCFFF8] placeholder:text-base focus:border-[#DCFFF8] focus:outline-1"
              />
            </div>
            {errors.location && (
              <p className="text-red-600 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Event Mode */}
          <EventType
            label="Event Type"
            value={watch("mode")}
            onChange={(value) =>
              setValue("mode", value, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
            error={errors.mode?.message}
          />

          {/* Image Upload */}
          <div>
            <label
              htmlFor="image"
              className="block mb-2 text-base font-normal text-[#E7F2FF]"
            >
              Event Image / Banner{" "}
              {isEditMode && "(Leave empty to keep current image)"}
            </label>
            <div className="bg-[#182830] border-[#243B47] text-[#DCFFF8] py-3 w-full px-4 mt-3 rounded-xl text-base placeholder:text-[#DCFFF8] placeholder:text-base focus:border-[#DCFFF8] focus:outline-1">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="cursor-pointer flex flex-col items-center"
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={300}
                    height={300}
                    className="rounded-lg my-2"
                  />
                ) : (
                  <div className="flex items-center text-base">
                    <Image
                      src="/icons/upload.svg"
                      alt="Upload Icon"
                      width={22}
                      height={22}
                      className="me-2"
                    />
                    Upload event image or banner
                  </div>
                )}
              </label>
            </div>
            {errors.image && (
              <p className="text-red-600 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="text-base font-normal text-[#E7F2FF]"
            >
              Tags
            </label>
            <div className="flex gap-2 mb-2 mt-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Add tags such as React, Next, JS"
                className="bg-[#182830] border-[#243B47] text-[#DCFFF8] py-3 w-full px-4 rounded-xl text-base placeholder:text-[#DCFFF8] placeholder:text-base focus:border-[#DCFFF8] focus:outline-1"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 bg-[#59DECA] hover:bg-[#48ac9d] rounded-lg text-[#030708] font-medium cursor-pointer"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#182830] rounded-full text-base flex items-center gap-2 text-[#DCFFF8]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-red-500 hover:text-red-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            {errors.tags && (
              <p className="text-red-600 text-sm mt-1">{errors.tags.message}</p>
            )}
          </div>

          {/* Agenda */}
          <div>
            <label
              htmlFor="agenda"
              className="text-base font-normal text-[#E7F2FF]"
            >
              Agenda
            </label>
            <div className="flex gap-2 mb-2 mt-3">
              <input
                type="text"
                value={agendaInput}
                onChange={(e) => setAgendaInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAgendaItem())
                }
                placeholder="Enter event timeline"
                className="bg-[#182830] border-[#243B47] text-[#DCFFF8] py-3 w-full px-4 rounded-xl text-base placeholder:text-[#DCFFF8] placeholder:text-base focus:border-[#DCFFF8] focus:outline-1"
              />
              <button
                type="button"
                onClick={addAgendaItem}
                className={`${
                  editingIndex !== null ? "px-2" : "px-4"
                } bg-[#59DECA] hover:bg-[#48ac9d] rounded-lg text-[#030708] font-medium cursor-pointer`}
              >
                {editingIndex !== null ? "Update" : "Add"}
              </button>
            </div>
            <ul className="space-y-2">
              {agenda.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between px-4 py-2 bg-[#182830] rounded-full text-base gap-2 text-[#DCFFF8]"
                >
                  <span className="flex-1">{item}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => editAgendaItem(index)}
                      className="text-[#59DECA] hover:text-[#48ac9d] font-medium cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAgendaItem(index)}
                      className="text-red-500 hover:text-red-600 font-medium cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {errors.agenda && (
              <p className="text-red-600 text-sm mt-1">
                {errors.agenda.message}
              </p>
            )}
          </div>

          {/* Target Audience */}
          <div>
            <label
              htmlFor="audience"
              className="text-base font-normal text-[#E7F2FF]"
            >
              Target Audience
            </label>
            <div className="flex gap-2 mb-2 mt-3">
              <input
                type="text"
                value={audienceInput}
                onChange={(e) => setAudienceInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAudienceItem())
                }
                placeholder="e.g., Developers, Designers, Students"
                className="bg-[#182830] border-[#243B47] text-[#DCFFF8] py-3 w-full px-4 rounded-xl text-base placeholder:text-[#DCFFF8] placeholder:text-base focus:border-[#DCFFF8] focus:outline-1 "
              />
              <button
                type="button"
                onClick={addAudienceItem}
                className={`${
                  editingAudienceIndex !== null ? "px-2" : "px-4"
                } bg-[#59DECA] hover:bg-[#48ac9d] rounded-lg text-[#030708] font-medium cursor-pointer`}
              >
                {editingAudienceIndex !== null ? "Update" : "Add"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(audience) &&
                audience.map((item, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-[#182830] rounded-full text-sm text-[#DCFFF8]"
                  >
                    <span>{item}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => editAudienceItem(index)}
                        className="text-[#59DECA] hover:text-[#48ac9d] p-1 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAudienceItem(index)}
                        className="text-red-500 hover:text-red-600 p-1 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </span>
                ))}
            </div>
            {errors.audience && (
              <p className="text-red-600 text-sm mt-1">
                {errors.audience.message}
              </p>
            )}
          </div>

          {/* Organizer */}
          <div>
            <label
              htmlFor="organizer"
              className="text-base font-normal text-[#E7F2FF]"
            >
              Event Organizer
            </label>
            <input
              {...register("organizer")}
              type="text"
              id="organizer"
              placeholder="Organized by ..."
              className="bg-[#182830] border-[#243B47] text-[#DCFFF8] py-3 w-full px-4 mt-3 rounded-xl text-base placeholder:text-[#DCFFF8] placeholder:text-base focus:border-[#DCFFF8] focus:outline-1"
            />
            {errors.organizer && (
              <p className="text-red-600 text-sm mt-1">
                {errors.organizer.message}
              </p>
            )}
          </div>

          {/* Overview */}
          <div>
            <label
              htmlFor="overview"
              className="text-base font-normal text-[#E7F2FF]"
            >
              Event Overview
            </label>
            <textarea
              {...register("overview")}
              id="overview"
              rows={3}
              placeholder="What's this event about? Give a quick overview"
              className="bg-[#182830] border-[#243B47] text-[#DCFFF8] py-3 w-full px-4 mt-3 rounded-xl text-base placeholder:text-[#DCFFF8] placeholder:text-base focus:border-[#DCFFF8] focus:outline-1"
            />
            {errors.overview && (
              <p className="text-red-600 text-sm mt-1">
                {errors.overview.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="text-base font-normal text-[#E7F2FF]"
            >
              Event Description
            </label>
            <textarea
              {...register("description")}
              id="description"
              rows={6}
              placeholder="Detailed description of your event, including key highlights and what attendees will gain"
              className="bg-[#182830] border-[#243B47] text-[#DCFFF8] py-3 w-full px-4 mt-3 rounded-xl text-base placeholder:text-[#DCFFF8] placeholder:text-base focus:border-[#DCFFF8] focus:outline-1"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Button */}

          <div>
            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              loadingText={isEditMode ? "Updating Event" : "Creating Event"}
              variant="primary"
              size="lg"
              className=" py-3 px-5 bg-[#59DECA] hover:bg-[#4FB8A6] cursor-pointer rounded-xl font-semibold text-[18px]  disabled:cursor-not-allowed  transition-colors text-[#030708] disabled:bg-[#182830] disabled:text-[#dcfff8]"
            >
              {isEditMode ? "Update Event" : "Create Event"}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
