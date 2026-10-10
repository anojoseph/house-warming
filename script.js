
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ==========================================
  // 1. STORYTELLING SCROLL ANIMATIONS
  // ==========================================

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // ==========================================
  // 2. SCROLL PROGRESS
  // ==========================================

  const progressBar = document.getElementById("readingProgress");

  function updateProgress() {
    if (!progressBar) return;

    const totalScrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage =
      totalScrollable > 0
        ? (window.scrollY / totalScrollable) * 100
        : 0;

    progressBar.style.width =
      `${Math.min(100, Math.max(0, percentage))}%`;
  }

  window.addEventListener("scroll", updateProgress, {
    passive: true
  });

  window.addEventListener("resize", updateProgress);

  updateProgress();

  // ==========================================
  // 3. START THE STORY
  // Compatible with old and updated HTML
  // ==========================================

  const beginStoryButton = document.getElementById("beginStory");
  const journeySection = document.getElementById("journey");

  if (beginStoryButton && journeySection) {
    beginStoryButton.addEventListener("click", () => {
      journeySection.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  }

  // ==========================================
  // 4. FLOATING GOLDEN LIGHTS
  // ==========================================

  const ambientLayer = document.getElementById("ambientLayer");

  function createLight() {
    if (reducedMotion || !ambientLayer) return;

    const particle = document.createElement("span");
    particle.className = "light-particle";

    const size = 2 + Math.random() * 3;

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.setProperty(
      "--duration",
      `${10 + Math.random() * 8}s`
    );

    particle.style.setProperty(
      "--drift",
      `${Math.round(Math.random() * 70 - 35)}px`
    );

    ambientLayer.appendChild(particle);

    particle.addEventListener(
      "animationend",
      () => particle.remove(),
      { once: true }
    );

    window.setTimeout(() => {
      if (particle.isConnected) {
        particle.remove();
      }
    }, 20000);
  }

  if (!reducedMotion && ambientLayer) {
    for (let i = 0; i < 12; i++) {
      window.setTimeout(createLight, i * 250);
    }

    window.setInterval(createLight, 900);
  }

  // ==========================================
  // 5. HOUSEWARMING EVENT DETAILS
  // ==========================================

  const eventTitle =
    "Housewarming Ceremony - Muringathery House";

  const eventDescription =
    "With God's blessings and grateful hearts, we invite you " +
    "to celebrate the housewarming of our new home. " +
    "Your presence and blessings will make our day special.";

  const eventLocation =
    "Muringathery House, Mullurkara, Kerala";

  // Keep this as a plain URL, not Markdown.
  const mapUrl =
    "https://maps.app.goo.gl/MheoGzrJeMvb5FfPA?g_st=ic";

  // 18 October 2026, 12:00 PM IST.
  // 12:00 PM IST = 06:30 UTC.
  // Event ends at 1:30 PM IST = 08:00 UTC.
  const eventStart = "20261018T063000Z";
  const eventEnd = "20261018T080000Z";

  // WhatsApp number with country code.
  // Keep digits only: country code + mobile number.
  const whatsappNumber = "918714143988";

  const whatsappMessage =
    "Hello! Thank you for inviting me to your housewarming " +
    "ceremony at Muringathery House, Mullurkara, on Sunday, " +
    "18 October 2026 at 12:00 PM. I would like to confirm " +
    "my attendance.";

  // Shared event description
  const fullEventDescription =
    `${eventDescription}\n\n` +
    `Venue: ${eventLocation}\n` +
    `Google Maps: ${mapUrl}`;

  // ==========================================
  // 6. GOOGLE CALENDAR
  // ==========================================

  const googleCalendarButton =
    document.getElementById("googleCalendar");

  if (googleCalendarButton) {
    const calendarParameters = new URLSearchParams({
      action: "TEMPLATE",
      text: eventTitle,
      dates: `${eventStart}/${eventEnd}`,
      details: fullEventDescription,
      location: eventLocation
    });

    googleCalendarButton.href =
      "https://calendar.google.com/calendar/render?" +
      calendarParameters.toString();
  }

  // ==========================================
  // 7. DOWNLOAD CALENDAR EVENT (.ICS)
  // ==========================================

  function escapeICS(value) {
    return String(value)
      .replace(/\\/g, "\\\\")
      .replace(/\r\n|\r|\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }

  function getICSTimestamp(date) {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  }

  const downloadCalendarButton =
    document.getElementById("downloadCalendar");

  if (downloadCalendarButton) {
    downloadCalendarButton.addEventListener("click", () => {
      const timestamp = getICSTimestamp(new Date());

      const calendarLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Our New Beginning//Housewarming Invitation//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        "UID:housewarming-20261018@muringathery-house",
        `DTSTAMP:${timestamp}`,
        `DTSTART:${eventStart}`,
        `DTEND:${eventEnd}`,
        `SUMMARY:${escapeICS(eventTitle)}`,
        `DESCRIPTION:${escapeICS(fullEventDescription)}`,
        `LOCATION:${escapeICS(eventLocation)}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ];

      const calendarFile = new Blob(
        [calendarLines.join("\r\n") + "\r\n"],
        {
          type: "text/calendar;charset=utf-8"
        }
      );

      const fileUrl = URL.createObjectURL(calendarFile);
      const downloadLink = document.createElement("a");

      downloadLink.href = fileUrl;
      downloadLink.download =
        "Muringathery-House-Housewarming.ics";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
      }, 1000);
    });
  }

  // ==========================================
  // 8. WHATSAPP CONFIRMATION
  // ==========================================

  const whatsappButton =
    document.getElementById("whatsappConfirm");

  if (whatsappButton) {
    const validWhatsAppNumber = /^\d{10,15}$/.test(
      whatsappNumber
    );

    if (validWhatsAppNumber) {
      whatsappButton.href =
        `https://wa.me/${whatsappNumber}?text=` +
        encodeURIComponent(whatsappMessage);

      whatsappButton.target = "_blank";
      whatsappButton.rel = "noopener noreferrer";
    } else {
      whatsappButton.href = "#";

      whatsappButton.addEventListener("click", (event) => {
        event.preventDefault();

        alert(
          "Please update the WhatsApp number in script.js. " +
          "Include the country code without spaces or the + symbol."
        );
      });
    }
  }

  // ==========================================
  // 9. SHARE THE INVITATION
  // ==========================================

  const shareButton =
    document.getElementById("shareInvitation");

  const shareText =
    "You're warmly invited to our Housewarming Ceremony!\n\n" +
    "Date: Sunday, 18 October 2026\n" +
    "Time: 12:00 PM\n" +
    "Venue: Muringathery House, Mullurkara, Kerala\n\n" +
    `Google Maps: ${mapUrl}\n\n` +
    "We would love to celebrate this special day with you!";

  if (shareButton) {
    shareButton.addEventListener("click", async () => {
      const shareData = {
        title: "Housewarming Invitation",
        text: shareText,
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (error) {
          // A cancelled share is normal.
          if (error.name !== "AbortError") {
            console.error("Sharing failed:", error);
          }
        }

        return;
      }

      // Fallback for browsers without native sharing.
      const whatsappShareUrl =
        "https://wa.me/?text=" +
        encodeURIComponent(
          `${shareText}\n\nInvitation: ${window.location.href}`
        );

      window.open(
        whatsappShareUrl,
        "_blank",
        "noopener,noreferrer"
      );
    });
  }

  // ==========================================
  // 10. COUNTDOWN TIMER
  // ==========================================

  // Browser-local timestamp for 12:00 PM in India.
  const eventDate = new Date(
    "2026-10-18T12:00:00+05:30"
  ).getTime();

  const countdown = document.getElementById("countdown");

  const dayElement = document.getElementById("days");
  const hourElement = document.getElementById("hours");
  const minuteElement = document.getElementById("minutes");
  const secondElement = document.getElementById("seconds");

  let countdownFinished = false;

  function updateCountdown() {
    if (!countdown) return;

    const remaining = eventDate - Date.now();

    if (remaining <= 0) {
      if (!countdownFinished) {
        countdownFinished = true;

        const now = new Date();
        const eventDay = new Date(
          "2026-10-18T00:00:00+05:30"
        );

        const isEventDay =
          now.getFullYear() === eventDay.getFullYear() &&
          now.getMonth() === eventDay.getMonth() &&
          now.getDate() === eventDay.getDate();

        countdown.innerHTML = "";

        const message = document.createElement("p");
        message.className = "countdown-finished";

        message.textContent = isEventDay
          ? "Today is the day! We can't wait to welcome you."
          : "Thank you for being part of our special beginning.";

        countdown.appendChild(message);
      }

      return;
    }

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor(
      (remaining % 86400000) / 3600000
    );
    const minutes = Math.floor(
      (remaining % 3600000) / 60000
    );
    const seconds = Math.floor(
      (remaining % 60000) / 1000
    );

    if (dayElement) {
      dayElement.textContent = String(days).padStart(2, "0");
    }

    if (hourElement) {
      hourElement.textContent = String(hours).padStart(2, "0");
    }

    if (minuteElement) {
      minuteElement.textContent = String(minutes).padStart(2, "0");
    }

    if (secondElement) {
      secondElement.textContent = String(seconds).padStart(2, "0");
    }
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
});
