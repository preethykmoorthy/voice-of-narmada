const loginForm = document.getElementById("loginForm");
const dashboard = document.getElementById("dashboard");
const loginMessage = document.getElementById("loginMessage");
const messagesBox = document.getElementById("messages");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    loginMessage.textContent = "Login failed. Check your email and password.";
    loginMessage.className = "form-message error";
    return;
  }

  loginForm.hidden = true;
  dashboard.hidden = false;
  loadMessages();
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  dashboard.hidden = true;
  loginForm.hidden = false;
});

async function loadMessages() {
  messagesBox.textContent = "Loading...";

  const { data, error } = await supabaseClient
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
  console.error(error);
  messagesBox.innerHTML = `
    <p class="error-text">
      Could not load messages.<br>
      ${escapeHtml(error.message)}
    </p>
  `;
  return;
  }

  messagesBox.innerHTML = data.map(item => `
    <article class="admin-message">
      <div class="message-top">
        <strong>${escapeHtml(item.reference_code)}</strong>
        <select data-id="${item.id}" class="status-select">
          ${["Received","Under Review","Action Taken","Closed"].map(s =>
            `<option ${s === item.status ? "selected" : ""}>${s}</option>`
          ).join("")}
        </select>
      </div>
      <p class="meta">${escapeHtml(item.category)} · ${escapeHtml(new Date(item.created_at).toLocaleString())}</p>
      <p>${escapeHtml(item.message)}</p>
    </article>
  `).join("");

  document.querySelectorAll(".status-select").forEach(select => {
    select.addEventListener("change", async () => {
      const id = select.dataset.id;
      const { error } = await supabaseClient
        .from("messages")
        .update({ status: select.value, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) alert("Could not update status.");
    });
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}
