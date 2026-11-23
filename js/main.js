document.addEventListener("DOMContentLoaded", () => {

  // MOBILE NAVIGATION
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const opened = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", opened);
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // BOOKING ASSISTANT
  const bookingModal = document.getElementById("bookingModal");
  const bookingForm = document.getElementById("bookingForm");
  const bookingFormFields = document.getElementById("bookingFormFields");
  const bookingResult = document.getElementById("bookingResult");
  const bookingSteps = document.querySelectorAll(".modal-step");
  const bookingNext = document.getElementById("bookingNext");
  const bookingBack = document.getElementById("bookingBack");
  const bookingStepLabel = document.getElementById("bookingStepLabel");

  let currentStep = 1;
  let bookingText = "";

  function openBooking() {
    if (!bookingModal) return;

    bookingModal.classList.add("open");
    document.body.classList.add("modal-open");
    currentStep = 1;
    showBookingStep();
  }

  function closeBooking() {
    if (!bookingModal) return;

    bookingModal.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  function showBookingStep() {
    bookingSteps.forEach(step => {
      step.classList.toggle(
        "active",
        Number(step.dataset.step) === currentStep
      );
    });

    if (bookingStepLabel) {
      bookingStepLabel.textContent = `Step ${currentStep} of 3`;
    }

    if (bookingBack) {
      bookingBack.style.visibility =
        currentStep === 1 ? "hidden" : "visible";
    }

    if (bookingNext) {
      bookingNext.textContent =
        currentStep === 3 ? "Prepare request" : "Continue";
    }
  }

  document.querySelectorAll("[data-open-booking]").forEach(button => {
    button.addEventListener("click", openBooking);
  });

  document.querySelectorAll("[data-close-booking]").forEach(button => {
    button.addEventListener("click", closeBooking);
  });

  if (bookingModal) {
    bookingModal.addEventListener("click", event => {
      if (event.target === bookingModal) {
        closeBooking();
      }
    });
  }

  if (bookingBack) {
    bookingBack.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;
        showBookingStep();
      }
    });
  }

  if (bookingNext && bookingForm) {
    bookingNext.addEventListener("click", () => {
      const activeStep = document.querySelector(
        `.modal-step[data-step="${currentStep}"]`
      );

      if (!activeStep) return;

      const requiredFields = activeStep.querySelectorAll("[required]");

      for (const field of requiredFields) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return;
        }
      }

      if (currentStep < 3) {
        currentStep++;
        showBookingStep();
        return;
      }

      prepareBooking();
    });
  }

  function prepareBooking() {
    const data = new FormData(bookingForm);

    bookingText =
`BRYAN PLACE — TABLE REQUEST

Name: ${data.get("name")}
Contact: ${data.get("contact")}
Preferred date: ${data.get("date")}
Preferred time: ${data.get("time")}
Number of guests: ${data.get("guests")}
Additional notes: ${data.get("notes") || "None"}

This is a request prepared using an independent website demo.
Please contact the restaurant directly to check availability.
`;

    const summary = document.getElementById("bookingSummary");

    if (summary) {
      summary.textContent = bookingText;
    }

    bookingFormFields.hidden = true;
    bookingResult.hidden = false;
  }

  const bookingReset = document.getElementById("bookingReset");

  if (bookingReset) {
    bookingReset.addEventListener("click", () => {
      bookingForm.reset();
      bookingFormFields.hidden = false;
      bookingResult.hidden = true;
      currentStep = 1;
      showBookingStep();
    });
  }

  const copyBooking = document.getElementById("copyBooking");

  if (copyBooking) {
    copyBooking.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(bookingText);
        copyBooking.textContent = "Copied!";
      } catch {
        copyBooking.textContent = "Copy unavailable";
      }
    });
  }

  const callRestaurant = document.getElementById("callRestaurant");

  if (callRestaurant) {
    callRestaurant.addEventListener("click", () => {
      window.location.href = "tel:+17404508008";
    });
  }

  // ASK BRYAN PLACE CHAT
  const chatToggle = document.getElementById("chatToggle");
  const chatPanel = document.getElementById("chatPanel");
  const chatClose = document.getElementById("chatClose");
  const chatBody = document.getElementById("chatBody");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");

  function addChatMessage(message, sender = "bot") {
    if (!chatBody) return;

    const bubble = document.createElement("div");
    bubble.className =
      sender === "user" ? "chat-message user" : "chat-message";

    bubble.textContent = message;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function openChat() {
    if (!chatPanel) return;

    chatPanel.classList.add("open");

    if (chatBody && chatBody.children.length === 0) {
      addChatMessage(
        "Welcome to the Bryan Place demo assistant. What would you like to know?"
      );
    }
  }

  if (chatToggle) {
    chatToggle.addEventListener("click", openChat);
  }

  if (chatClose) {
    chatClose.addEventListener("click", () => {
      chatPanel.classList.remove("open");
    });
  }

  function getChatResponse(question) {
    const q = question.toLowerCase();

    if (
      q.includes("brunch") ||
      q.includes("breakfast") ||
      q.includes("hour")
    ) {
      return "Published Sunday brunch hours are 10:30 AM to 2:00 PM. Please contact Bryan Place directly to confirm current hours and menu details.";
    }

    if (
      q.includes("event") ||
      q.includes("party") ||
      q.includes("birthday") ||
      q.includes("gathering")
    ) {
      return "You can start by using the Gathering Planner on our Gatherings page. It prepares an enquiry brief, but the restaurant must confirm availability and pricing.";
    }

    if (
      q.includes("location") ||
      q.includes("address") ||
      q.includes("where")
    ) {
      return "The listed address for this demo is 49 North 6th Street, Zanesville, Ohio 43701. Please verify the details before visiting.";
    }

    if (
      q.includes("phone") ||
      q.includes("call") ||
      q.includes("contact")
    ) {
      return "The listed phone number is (740) 450-8008. You can also visit the Contact page for more information.";
    }

    if (
      q.includes("book") ||
      q.includes("reservation") ||
      q.includes("table")
    ) {
      return "Use the Request a Table button to prepare your preferred date, time and guest details. This demo does not send or confirm reservations.";
    }

    if (q.includes("menu") || q.includes("food")) {
      return "Please contact Bryan Place directly for its latest menu and prices. This demonstration does not contain a verified current menu.";
    }

    return "Thanks for your question. For accurate information, please contact Bryan Place directly at (740) 450-8008.";
  }

  function sendChatMessage(message) {
    const question = message.trim();

    if (!question) return;

    addChatMessage(question, "user");
    addChatMessage(getChatResponse(question));
  }

  if (chatSend && chatInput) {
    chatSend.addEventListener("click", () => {
      sendChatMessage(chatInput.value);
      chatInput.value = "";
    });

    chatInput.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendChatMessage(chatInput.value);
        chatInput.value = "";
      }
    });
  }

  document.querySelectorAll("[data-question]").forEach(button => {
    button.addEventListener("click", () => {
      openChat();
      sendChatMessage(button.dataset.question);
    });
  });

  // GATHERING PLANNER
  const plannerForm = document.getElementById("plannerForm");
  const plannerResult = document.getElementById("plannerResult");
  const plannerSummary = document.getElementById("plannerSummary");

  let plannerText = "";

  if (plannerForm) {
    plannerForm.addEventListener("submit", event => {
      event.preventDefault();

      if (!plannerForm.reportValidity()) return;

      const details = {
        name: document.getElementById("eventName").value.trim(),
        contact: document.getElementById("eventEmail").value.trim(),
        occasion: document.getElementById("eventType").value,
        date: document.getElementById("eventDate").value,
        guests: document.getElementById("eventGuests").value,
        atmosphere: document.getElementById("eventMood").value,
        notes:
          document.getElementById("eventNotes").value.trim() || "None"
      };

      plannerText =
`BRYAN PLACE — GATHERING ENQUIRY

Name: ${details.name}
Contact: ${details.contact}
Occasion: ${details.occasion}
Preferred date: ${details.date}
Estimated guests: ${details.guests}
Preferred atmosphere: ${details.atmosphere}

Additional details:
${details.notes}

This enquiry brief was prepared using an independent website demo.
Please contact Bryan Place directly to discuss availability and pricing.
`;

      plannerSummary.textContent = plannerText;
      plannerResult.hidden = false;

      plannerResult.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  const copyPlanner = document.getElementById("copyPlanner");

  if (copyPlanner) {
    copyPlanner.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(plannerText);
        copyPlanner.textContent = "Copied!";
      } catch {
        copyPlanner.textContent = "Copy unavailable";
      }
    });
  }

  const printPlanner = document.getElementById("printPlanner");

  if (printPlanner) {
    printPlanner.addEventListener("click", () => {
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        alert("Please allow pop-ups to print your event brief.");
        return;
      }

      const safeText = plannerText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      printWindow.document.write(`
        <!doctype html>
        <html>
        <head>
          <title>Gathering Enquiry Brief</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #25291f;
            }
            pre {
              white-space: pre-wrap;
              font: 14px/1.8 Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          <h1>Bryan Place — Gathering Enquiry</h1>
          <pre>${safeText}</pre>
        </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    });
  }

  // CONTACT FORM
  const contactForm = document.getElementById("contactForm");
  const contactFeedback = document.getElementById("contactFeedback");

  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const name = document.getElementById("contactName").value;
      const email = document.getElementById("contactEmail").value;
      const subject = document.getElementById("contactSubject").value;
      const message = document.getElementById("contactMessage").value;

      const preparedMessage =
`Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`;

      if (contactFeedback) {
        contactFeedback.textContent =
          "Your message has been prepared. This demo does not send it. Copy the details and contact the restaurant directly.";
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(preparedMessage).catch(() => {});
      }
    });
  }

  // DATE VALIDATION
  const today = new Date().toISOString().split("T")[0];

  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.min = today;
  });

});
