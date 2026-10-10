
document.addEventListener("DOMContentLoaded", () => {
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
    const totalScrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage = totalScrollable > 0
      ? (window.scrollY / totalScrollable) * 100
      : 0;

    progressBar.style.width = `${Math.min(100, percentage)}%`;
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // ==========================================
  // 3. START THE STORY
  // ==========================================

  document.getElementById("beginStory").addEventListener("click", () => {
    document.getElementById("journey").scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start"
    });
  });

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

    particle.addEventListener("animationend", () => particle.remove());

    window.setTimeout(() => {
      if (particle.isConnected) particle.remove();
    }, 20000);
  }

  if (!reducedMotion) {
    for (let i = 0; i < 12; i++) {
      window.setTimeout(createLight, i * 250);
    }

    window.setInterval(createLight, 900);
  }

  // ==========================================
  // 5. HOUSEWARMING EVENT DETAILS
  // ==========================================

  const eventTitle = "Housewarming Ceremony - Muringathery House";
  const eventDescription =
    "With grateful hearts, we invite you to celebrate our new home. We look forward to welcoming you!";

  const eventLocation = "Muringathery House, Mullurkara, Kerala";
  const mapUrl =
    "https://maps.app.goo.gl/MheoGzrJeMvb5FfPA?g_st=ic";

  // Event time: 18 October 2026, 12:00 PM IST.
  // End time below: 1:30 PM IST.
  const eventStart = "20261018T063000Z";
  const eventEnd = "20261018T080000Z";

  // IMPORTANT:
  // Replace this with your real WhatsApp number.
  // Include India's country code 91, without +, spaces or dashes.
  // Example format: "919876543210"
  const whatsappNumber = "918714143988";

  const whatsappMessage =
    "Hello! Thank you for inviting me to your housewarming ceremony " +
    "at Muringathery House, Mullurkara, on Sunday, 18 October 2026 " +
    "at 12:00 PM. I would like to confirm my attendance.";

  // ==========================================
  // 6. GOOGLE CALENDAR
  // ==========================================

  const googleCalendarButton = document.getElementById("googleCalendar");

  const calendarParameters = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle,
    dates: `${eventStart}/${eventEnd}`,
    details:
      `${eventDescription}\n\nVenue: ${eventLocation}\nMap: ${mapUrl}`,
    location: eventLocation
  });

  googleCalendarButton.href =
    `https://calendar.google.com/calendar/render?${calendarParameters.toString()}`;

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

  document
    .getElementById("downloadCalendar")
    .addEventListener("click", () => {
      const now = new Date();

      const timestamp = now
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");

      const calendarLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Our New Beginning//Housewarming Invitation//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:housewarming-20261018-${timestamp}@invitation.local`,
        `DTSTAMP:${timestamp}`,
        `DTSTART:${eventStart}`,
        `DTEND:${eventEnd}`,
        `SUMMARY:${escapeICS(eventTitle)}`,
        `DESCRIPTION:${escapeICS(
          `${eventDescription}\nVenue: ${eventLocation}\nMap: ${mapUrl}`
        )}`,
        `LOCATION:${escapeICS(eventLocation)}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ];

      // ICS files use CRLF line endings.
      const calendarFile = new Blob(
        [calendarLines.join("\r\n") + "\r\n"],
        { type: "text/calendar;charset=utf-8" }
      );

      const fileUrl = URL.createObjectURL(calendarFile);
      const downloadLink = document.createElement("a");

      downloadLink.href = fileUrl;
      downloadLink.download = "Muringathery-House-Housewarming.ics";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    });

  // ==========================================
  // 8. WHATSAPP CONFIRMATION
  // ==========================================

  const whatsappButton = document.getElementById("whatsappConfirm");

  whatsappButton.href =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  whatsappButton.addEventListener("click", (event) => {
    if (
      whatsappNumber.includes("YOURNUMBER") ||
      !/^\d{10,15}$/.test(whatsappNumber)
    ) {
      event.preventDefault();

      alert(
        "Please update the WhatsApp number in script.js first. " +
        "Include the country code, without spaces or the + symbol."
      );
    }
  });

  // ==========================================
  // 9. SHARE THE INVITATION
  // ==========================================

  const shareButton = document.getElementById("shareInvitation");

  const shareText =
    "You're warmly invited to our Housewarming Ceremony!\n\n" +
    "Date: Sunday, 18 October 2026\n" +
    "Time: 12:00 PM\n" +
    "Venue: Muringathery House, Mullurkara, Kerala\n\n" +
    `Google Maps: ${mapUrl}\n\n` +
    "We would love to celebrate this special day with you!";

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
        // A cancelled share is normal; don't show an error.
        if (error.name !== "AbortError") {
          console.error("Sharing failed:", error);
        }
      }

      return;
    }

    // Fallback for browsers without native sharing.
    const whatsappShareUrl =
      `https://wa.me/?text=${encodeURIComponent(
        `${shareText}\n\nInvitation: ${window.location.href}`
      )}`;

    window.open(whatsappShareUrl, "_blank", "noopener,noreferrer");
  });

  // ==========================================
  // 10. COUNTDOWN TIMER
  // ==========================================

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
    const remaining = eventDate - Date.now();

    if (remaining <= 0) {
      if (!countdownFinished) {
        countdownFinished = true;

        countdown.innerHTML =
          '<p class="countdown-finished">' +
          "Today is the day! We can't wait to welcome you." +
          "</p>";
      }

      return;
    }

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    dayElement.textContent = String(days).padStart(2, "0");
    hourElement.textContent = String(hours).padStart(2, "0");
    minuteElement.textContent = String(minutes).padStart(2, "0");
    secondElement.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
});
