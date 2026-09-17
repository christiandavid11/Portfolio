const navButtons = document.querySelectorAll("[data-section]");
const panels = document.querySelectorAll("[data-panel]");
const themeButtons = document.querySelectorAll("[data-theme]");
const catToggle = document.querySelector(".cat-toggle");
const chatButton = document.querySelector(".chat-button");
const chatWindow = document.querySelector(".chat-window");
const chatClose = document.querySelector(".chat-close");
const chatComposer = document.querySelector(".chat-composer");
const chatThread = document.querySelector(".chat-thread");
const paymentRequest = document.querySelector(".payment-request");
const paymentButton = document.querySelector(".payment-button");
const stripeDialog = document.querySelector(".stripe-dialog");
const stripeDialogClose = document.querySelector(".stripe-dialog-close");
const stripeQr = document.querySelector(".stripe-qr");

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

chatButton.addEventListener("click", () => {
  chatWindow.showModal();
});

chatClose.addEventListener("click", () => {
  chatWindow.close();
});

chatWindow.addEventListener("click", (event) => {
  if (event.target === chatWindow) {
    chatWindow.close();
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
