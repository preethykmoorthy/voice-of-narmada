const form = document.getElementById("voiceForm");
const message = document.getElementById("message");
const count = document.getElementById("count");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");

message.addEventListener("input", () => {
  count.textContent = message.value.length;
});

function makeReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return "VON-" + [...bytes].map(b => chars[b % chars.length]).join("");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "";
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  const reference = makeReference();
  const category = document.getElementById("category").value;
  const text = message.value.trim();

  const { error } = await supabaseClient.from("messages").insert({
    reference_code: reference,
    category,
    message: text
  });

  if (error) {
  formMessage.innerHTML = `
    <strong>Something went wrong.</strong><br>
    ${escapeHtml(error.message)}
  `;
  formMessage.className = "form-message error";
  }
  else {
    form.reset();
    count.textContent = "0";
    formMessage.innerHTML =
      `Submitted anonymously. Your reference code is <strong>${reference}</strong>.<br>` +
      `Save this code to check the status later.`;
    formMessage.className = "form-message success";
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "Submit Anonymously";
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}