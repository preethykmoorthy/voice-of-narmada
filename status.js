const form = document.getElementById("statusForm");
const result = document.getElementById("statusResult");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  result.textContent = "Checking...";

  const reference = document
    .getElementById("reference")
    .value
    .trim()
    .toUpperCase();

  if (!reference) {
    result.innerHTML =
      "<p class='error-text'>Please enter your reference code.</p>";
    return;
  }

  const { data, error } = await supabaseClient
    .rpc("check_message_status", {
      lookup_reference_code: reference
    });

  if (error) {
    console.error(error);
    result.innerHTML =
      "<p class='error-text'>Unable to check the status right now. Please try again.</p>";
    return;
  }

  if (!data || data.length === 0) {
    result.innerHTML =
      "<p class='error-text'>Reference code not found.</p>";
    return;
  }

  const message = data[0];

  const date = new Date(message.created_at).toLocaleString();

  result.innerHTML = `
    <div class="status-box">
      <p><strong>Status:</strong> ${escapeHtml(message.status)}</p>
      <p><strong>Reference:</strong> ${escapeHtml(message.reference_code)}</p>
      <p><strong>Submitted:</strong> ${escapeHtml(date)}</p>
    </div>
  `;
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}