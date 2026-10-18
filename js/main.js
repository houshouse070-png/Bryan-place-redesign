
/* =========================================
   BRYAN PLACE — REDESIGN CONCEPT
   Shared JavaScript for all website pages
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Update the copyright year automatically.
  document.querySelectorAll("[data-year]").forEach(function (element) {
    element.textContent = new Date().getFullYear();
  });

  // Mobile navigation menu.
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    // Close the menu after a visitor selects a page.
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });

    // Close the menu if the visitor presses Escape.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.focus();
      }
    });
  }

  // Reveal elements as visitors scroll down the page.
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries, currentObserver) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealElements.forEach(function (element) {
      element.classList.add("will-reveal");
      observer.observe(element);
    });
  }

  // Contact form demonstration.
  // This does NOT send, email, or store the visitor's information.
  const contactForm = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      formStatus.textContent =
        "Demo only: your form has been tested, but no message was sent or saved.";

      formStatus.setAttribute("role", "status");
      contactForm.reset();
    });
  }
});
