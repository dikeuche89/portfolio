import type { Metadata } from "next";
import AfterHours from "@/components/AfterHours";

export const metadata: Metadata = {
  title: "After hours — Make your mark",
  description:
    "A small experiment in type and tension. Make a typographic poster, pull it into shape, and take it with you. By Dike Uche.",
  alternates: { canonical: "/after-hours" },
  openGraph: {
    title: "After hours — Make your mark",
    description: "Your words. A little tension. Something entirely yours.",
    url: "/after-hours",
  },
};

export default function AfterHoursPage() {
  return <AfterHours />;
}
