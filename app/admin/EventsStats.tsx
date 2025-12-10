"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Calendar,
  CalendarDays,
  History,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";
import { IEvent } from "@/database/event.model";
import { Spinner } from "@/components/ui/spinner";

interface EventsStatsProps {
  events: IEvent[];
}

export default function EventsStats({ events }: EventsStatsProps) {
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const activeEvents = events.filter((e) => new Date(e.date) > now).length;
  const pastEvents = events.filter((e) => new Date(e.date) < now).length;

  useEffect(() => {
    const fetchTotalBookings = async () => {
      try {
        const response = await fetch("/api/bookings");
        const data = await response.json();

        if (data.success) {
          setTotalBookings(data.count || 0);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalBookings();
  }, []);

  const stats = [
    {
      label: "Total Events",
      value: events.length,
      icon: CalendarDays,
      color: "cyan",
    },
    {
      label: "Active Events",
      value: activeEvents,
      icon: Activity,
      color: "green",
    },
    {
      label: "Past Events",
      value: pastEvents,
      icon: History,
      color: "slate",
    },
    {
      label: "Total Bookings",
      value: loading ? <Spinner className="mt-5" /> : totalBookings,
      icon: Ticket,
      color: "purple",
    },
  ];

  const colorClasses = {
    cyan: {
      text: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    green: {
      text: "text-green-400",
      bg: "bg-green-500/10",
    },
    slate: {
      text: "text-slate-400",
      bg: "bg-slate-500/10",
    },
    purple: {
      text: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colors = colorClasses[stat.color as keyof typeof colorClasses];

        return (
          <div
            key={index}
            className="bg-[#182830] rounded-xl p-6 border border-[#182830] hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-base mb-2">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`${colors.bg} ${colors.text} p-3 rounded-lg`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
