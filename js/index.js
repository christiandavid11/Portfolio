const navButtons = document.querySelectorAll("[data-section]");
const panels = document.querySelectorAll("[data-panel]");
const themeButtons = document.querySelectorAll("[data-theme]");
const catToggle = document.querySelector(".cat-toggle");
const chatButton = document.querySelector(".chat-button");
const chatWindow = document.querySelector(".chat-window");
const chatClose = document.querySelector(".chat-close");
const chatMinimize = document.querySelector(".chat-minimize");
const chatRestore = document.querySelector(".chat-restore");
const chatView = document.querySelector(".chat-view");
const emailView = document.querySelector(".email-view");
const chatTitle = document.querySelector("#chat-title");
const chatSubtitle = document.querySelector(".chat-subtitle-text");
const chatStatusDot = document.querySelector(".chat-status-dot");
const chatComposer = document.querySelector(".chat-composer");
const chatThread = document.querySelector(".chat-thread");
const paymentRequest = document.querySelector(".payment-request");
const paymentButton = document.querySelector(".payment-button");
const stripeDialog = document.querySelector(".stripe-dialog");
const stripeDialogClose = document.querySelector(".stripe-dialog-close");
const stripeQr = document.querySelector(".stripe-qr");
const chatEmail = document.querySelector(".chat-email");
const emailBack = document.querySelector(".email-back");
const emailForm = document.querySelector(".email-form");
const emailFormStatus = document.querySelector(".email-form-status");
let isMinimizing = false;
let emailSubmissionId = 0;

const testPaymentPayload = "stripe-test://payment?amount=25000&currency=php&description=Portfolio%20message";

function openStripeTestPayment() {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=${encodeURIComponent(testPaymentPayload)}`;
  stripeQr.src = qrUrl;
  if (!stripeDialog.open) {
    stripeDialog.showModal();
  }
}

function showSection(sectionName) {
  panels.forEach((panel) => {
    panel.classList.toggle("is-visible", panel.dataset.panel === sectionName);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.section === sectionName);
  });
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showSection(button.dataset.section);
    history.replaceState(null, "", `#${button.dataset.section}`);
  });
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode", button.dataset.theme === "dark");
    themeButtons.forEach((themeButton) => {
      themeButton.classList.toggle("is-selected", themeButton === button);
    });
  });
});

catToggle.addEventListener("click", () => {
  const isPlayful = document.body.classList.toggle("playful");
  catToggle.setAttribute("aria-pressed", String(isPlayful));
});

function setContactView(view) {
  const isEmailView = view === "email";
  chatView.hidden = isEmailView;
  emailView.hidden = !isEmailView;
  chatTitle.textContent = isEmailView ? "Email Christian David" : "Christian David";
  chatSubtitle.textContent = isEmailView ? "Send a message directly" : "Usually replies quickly";
  chatStatusDot.hidden = isEmailView;
}

function openContactPanel(view = "chat") {
  setContactView(view);
  chatRestore.hidden = true;
  if (!chatWindow.open) {
    chatWindow.showModal();
  }
}

chatButton.addEventListener("click", () => {
  openContactPanel();
});

chatRestore.addEventListener("click", () => {
  openContactPanel(emailView.hidden ? "chat" : "email");
});

chatClose.addEventListener("click", () => {
  chatWindow.close();
});

chatMinimize.addEventListener("click", () => {
  isMinimizing = true;
  chatWindow.close();
  chatRestore.hidden = false;
});

chatWindow.addEventListener("close", () => {
  if (isMinimizing) {
    isMinimizing = false;
    return;
  }

  emailSubmissionId += 1;
  emailForm.reset();
  emailFormStatus.textContent = "";
  emailFormStatus.hidden = true;
  const emailSubmitButton = emailForm.querySelector('button[type="submit"]');
  emailSubmitButton.disabled = false;
  emailSubmitButton.innerHTML = 'Send email <span aria-hidden="true">↗</span>';
  chatComposer.reset();
  chatComposer.hidden = false;
  chatThread.querySelectorAll(".message-outgoing").forEach((message) => message.remove());
  paymentRequest.hidden = true;
  chatThread.scrollTop = 0;
  setContactView("chat");
  chatRestore.hidden = true;
});

chatWindow.addEventListener("click", (event) => {
  if (event.target === chatWindow) {
    chatWindow.close();
  }
});

chatEmail.addEventListener("click", (event) => {
  setContactView("email");
  emailForm.querySelector("input").focus();
});

emailBack.addEventListener("click", () => {
  setContactView("chat");
});

emailForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = emailForm.querySelector('button[type="submit"]');
  const submissionId = ++emailSubmissionId;
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  emailFormStatus.hidden = true;

  try {
    const response = await fetch(emailForm.action, {
      method: "POST",
      body: new FormData(emailForm),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Formspree returned ${response.status}`);
    }

    if (submissionId !== emailSubmissionId) return;
    emailForm.reset();
    emailFormStatus.textContent = "Thanks! Your email has been sent.";
    emailFormStatus.hidden = false;
  } catch (error) {
    if (submissionId !== emailSubmissionId) return;
    console.error("Unable to send email through Formspree.", error);
    emailFormStatus.textContent = "There was a problem sending your email. Please try again.";
    emailFormStatus.hidden = false;
  } finally {
    if (submissionId === emailSubmissionId) {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Send email <span aria-hidden="true">↗</span>';
    }
  }
});

chatComposer.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = chatComposer.elements.message;
  const messageText = input.value.trim();

  if (!messageText) return;

  const message = document.createElement("div");
  message.className = "message message-outgoing";
  message.innerHTML = "<p></p><time>Now</time>";
  message.querySelector("p").textContent = messageText;
  chatThread.append(message);
  input.value = "";
  chatComposer.hidden = true;
  paymentRequest.hidden = false;

  message.scrollIntoView({ behavior: "smooth", block: "nearest" });
  openStripeTestPayment();
});

paymentButton.addEventListener("click", () => {
  openStripeTestPayment();
});

stripeDialogClose.addEventListener("click", () => {
  stripeDialog.close();
});

stripeDialog.addEventListener("click", (event) => {
  if (event.target === stripeDialog) {
    stripeDialog.close();
  }
});

const initialSection = window.location.hash.slice(1);
if (document.querySelector(`[data-panel="${initialSection}"]`)) {
  showSection(initialSection);
}
