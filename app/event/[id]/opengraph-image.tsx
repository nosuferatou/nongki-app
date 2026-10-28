import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const alt = "Nongki event preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const colors = {
  primaryDark: "#202734",
  secondaryDark: "#36415A",
  primaryLight: "#B7D894",
  white: "#FFFFFF",
};

async function loadPoppinsFont(weight: 500 | 700): Promise<ArrayBuffer> {
  const stylesheetResponse = await fetch(
    `https://fonts.googleapis.com/css2?family=Poppins:wght@${weight}&display=swap`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
      },
      cache: "force-cache",
    },
  );
  if (!stylesheetResponse.ok) {
    throw new Error(`Unable to load Poppins font stylesheet (${weight}).`);
  }

  const stylesheet = await stylesheetResponse.text();
  const latinFace = stylesheet
    .match(/\/\*\s*latin\s*\*\/\s*@font-face\s*{[^}]+}/g)
    ?.find((face) => new RegExp(`font-weight:\\s*${weight}\\s*;`).test(face));
  const fontUrl = latinFace?.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
  if (!fontUrl) {
    throw new Error(`Unable to find the Poppins ${weight} font file.`);
  }

  const fontResponse = await fetch(fontUrl, { cache: "force-cache" });
  if (!fontResponse.ok) {
    throw new Error(`Unable to download the Poppins ${weight} font file.`);
  }

  return fontResponse.arrayBuffer();
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
  const [{ id }, fontMedium, fontBold] = await Promise.all([
    params,
    loadPoppinsFont(500),
    loadPoppinsFont(700),
  ]);
  const event = await prisma.event.findUnique({
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

  const isEventFound = event !== null;
  const title = event?.title ?? "Gather with Nongki";
  const acceptedGuests = event?._count.guests ?? 0;
  const remainingQuota = event
    ? Math.max(0, event.maxGuests - acceptedGuests)
    : null;
  const dateLabel = event
    ? formatEventDate(event.eventDate, event.endDate)
    : "Plan your next gathering";
  const quotaLabel =
    remainingQuota === null
      ? "Make time together"
      : remainingQuota === 0
        ? "Event full"
        : `${remainingQuota} ${remainingQuota === 1 ? "spot" : "spots"} left`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: colors.primaryDark,
          color: colors.white,
          fontFamily: "Poppins",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            color: colors.primaryLight,
            fontSize: "24px",
            fontWeight: 500,
            letterSpacing: "-0.3px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "13px",
              backgroundColor: colors.primaryLight,
              color: colors.primaryDark,
              fontSize: "23px",
              fontWeight: 700,
            }}
          >
            N
          </div>
          Nongki Workspace
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingTop: "24px",
            paddingBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              marginBottom: "16px",
              color: colors.primaryLight,
              fontSize: "18px",
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            {isEventFound ? "You’re invited" : "Nongki events"}
          </div>
          <div
            style={{
              display: "flex",
              maxHeight: "270px",
              overflow: "hidden",
              color: colors.white,
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-2.5px",
            }}
          >
            {title.length > 105 ? `${title.slice(0, 102).trimEnd()}…` : title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "15px 22px",
              borderRadius: "999px",
              backgroundColor: colors.secondaryDark,
              color: colors.white,
              fontSize: "20px",
              fontWeight: 500,
            }}
          >
            {dateLabel}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "15px 22px",
              borderRadius: "999px",
              backgroundColor: colors.secondaryDark,
              color: colors.primaryLight,
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            {quotaLabel}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Poppins",
          data: fontMedium,
          style: "normal",
          weight: 500,
        },
        {
          name: "Poppins",
          data: fontBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
