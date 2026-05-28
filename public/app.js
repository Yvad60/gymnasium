let sessionId = crypto.randomUUID();

const chatMessages = document.getElementById("chat-messages");
const chatForm     = document.getElementById("chat-form");
const userInput    = document.getElementById("user-input");
const resetBtn     = document.getElementById("reset-btn");
const streamToggle = document.getElementById("stream-toggle");

resetBtn.addEventListener("click", async () => {
  await fetch("/api/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  sessionId = crypto.randomUUID();
  chatMessages.innerHTML = "";
  appendMessage("assistant", "Conversation reset. How can I help you?");
});

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage("user", text);
  userInput.value = "";
  userInput.disabled = true;
  chatForm.querySelector("button").disabled = true;

  const thinkingEl = appendMessage("assistant thinking", "Thinking…");

  try {
    if (streamToggle.checked) {
      await sendStreaming(text, thinkingEl);
    } else {
      await sendNonStreaming(text, thinkingEl);
    }
  } catch (err) {
    thinkingEl.remove();
    appendMessage("assistant", `Network error: ${err.message}`);
  } finally {
    userInput.disabled = false;
    chatForm.querySelector("button").disabled = false;
    userInput.focus();
  }
});

async function sendNonStreaming(text, thinkingEl) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, session_id: sessionId }),
  });
  thinkingEl.remove();
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    appendMessage("assistant", `Error: ${err.detail ?? res.statusText}`);
    return;
  }
  const data = await res.json();
  const msgEl = appendMessage("assistant", data.reply ?? "");
  if (data.tools_used && data.tools_used.length > 0) {
    appendToolBadges(msgEl, data.tools_used);
  }
  if (data.next_input_recommendation && data.next_input_recommendation.length > 0) {
    appendRecommendations(msgEl, data.next_input_recommendation);
  }
}

async function sendStreaming(text, thinkingEl) {
  const res = await fetch("/api/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, session_id: sessionId }),
  });
  if (!res.ok) {
    thinkingEl.remove();
    const err = await res.json().catch(() => ({}));
    appendMessage("assistant", `Error: ${err.detail ?? res.statusText}`);
    return;
  }

  let msgEl = null;
  let bubble = null;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      if (!part.startsWith("data: ")) continue;
      const data = part.slice(6);
      if (data === "[DONE]") break;
      try {
        const frame = JSON.parse(data);
        if (typeof frame === "string") {
          if (!msgEl) {
            thinkingEl.remove();
            msgEl = appendMessage("assistant", "");
            bubble = msgEl.querySelector(".bubble");
          }
          bubble.textContent += frame;
        } else if (frame.type === "meta" && msgEl) {
          if (frame.tools_used?.length) appendToolBadges(msgEl, frame.tools_used);
          if (frame.next_input_recommendation?.length) appendRecommendations(msgEl, frame.next_input_recommendation);
        }
      } catch (e) {
        console.warn("Bad SSE frame:", data, e);
      }
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  if (!msgEl) thinkingEl.remove();
}

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event("submit"));
  }
});

function appendMessage(roleClass, text) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${roleClass}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  wrapper.appendChild(bubble);
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return wrapper;
}

function appendRecommendations(wrapper, recommendations) {
  const row = document.createElement("div");
  row.className = "recommendations";
  recommendations.forEach((text) => {
    const btn = document.createElement("button");
    btn.className = "recommendation-btn";
    btn.textContent = text;
    btn.addEventListener("click", () => {
      userInput.value = text;
      chatForm.dispatchEvent(new Event("submit"));
    });
    row.appendChild(btn);
  });
  wrapper.appendChild(row);
}

function appendToolBadges(wrapper, tools) {
  const row = document.createElement("div");
  row.className = "tool-badges";
  tools.forEach((name) => {
    const badge = document.createElement("span");
    badge.className = "tool-badge";
    badge.textContent = `⚙ ${name}`;
    row.appendChild(badge);
  });
  wrapper.appendChild(row);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

