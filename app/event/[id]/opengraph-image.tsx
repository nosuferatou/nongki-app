import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const alt = "Nongki event preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type EventImageData = {
  title: string;
  eventDate: Date;
  endDate: Date;
  maxGuests: number;
  _count: {
    guests: number;
  };
};

function createImage(
  title: string,
  subtitle: string,
  quota: string,
): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px",
          backgroundColor: "#202734",
          color: "#FFFFFF",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            marginBottom: "24px",
            color: "#B7D894",
            fontSize: "28px",
          }}
        >
          NONGKI
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: "1000px",
            marginBottom: "28px",
            fontSize: "64px",
            fontWeight: 700,
            lineHeight: 1.15,
            overflow: "hidden",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginBottom: "18px",
            color: "#FFFFFF",
            fontSize: "28px",
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            display: "flex",
            color: "#B7D894",
            fontSize: "26px",
            fontWeight: 700,
          }}
        >
          {quota}
        </div>
      </div>
    ),
    size,
  );
}

function formatEventDate(startDate: Date, endDate: Date): string {
  const dayFormatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeFormatter = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  });

  const startDay = dayFormatter.format(startDate);
  const endDay = dayFormatter.format(endDate);
  const startTime = timeFormatter.format(startDate);
  const endTime = timeFormatter.format(endDate);

  return startDay === endDay
    ? `${startDay} · ${startTime} – ${endTime}`
    : `${startDay}, ${startTime} – ${endDay}, ${endTime}`;
}

export default async function EventOpenGraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let event: EventImageData | null = null;

  try {
    const { id } = await params;
    event = await prisma.event.findUnique({
      where: { id },
      select: {
        title: true,
        eventDate: true,
        endDate: true,
        maxGuests: true,
        _count: {
          select: {
            guests: {
              where: { status: "ATTENDING" },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to load event data for Open Graph image.", error);
    return createImage("Nongki Event", "Plan your next gathering", "NONGKI");
  }

  if (!event) {
    return createImage("Nongki Event", "Plan your next gathering", "NONGKI");
  }

  const acceptedGuests = event._count.guests;
  const remainingQuota = Math.max(0, event.maxGuests - acceptedGuests);
  const quotaLabel =
    remainingQuota === 0
      ? "Event full"
      : `${remainingQuota} ${remainingQuota === 1 ? "spot" : "spots"} left`;

  return createImage(
    event.title.slice(0, 120),
    formatEventDate(event.eventDate, event.endDate),
    quotaLabel,
  );
}
