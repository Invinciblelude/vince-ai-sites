(function () {
  var cfg = {
    name: "",
    prompt: "",
    api: "",
    color: "#6d5cfc",
    greeting: "",
    position: "right",
    questions: [],
  };

  var script = document.currentScript;
  if (script) {
    cfg.name = script.getAttribute("data-name") || "AI Assistant";
    cfg.prompt = script.getAttribute("data-prompt") || "";
    cfg.api = script.getAttribute("data-api") || "";
    cfg.color = script.getAttribute("data-color") || "#6d5cfc";
    cfg.greeting =
      script.getAttribute("data-greeting") ||
      "Hi! How can I help you today?";
    cfg.position = script.getAttribute("data-position") || "right";
    var q = script.getAttribute("data-questions");
    cfg.questions = q ? q.split("|") : [];
  }

  if (!cfg.api) {
    console.warn("AI Widget: data-api is required.");
    return;
  }

  var messages = [];
  var isOpen = false;
  var isLoading = false;

  var posCSS = cfg.position === "left" ? "left:24px;" : "right:24px;";

  // --- Bubble ---
  var bubble = document.createElement("div");
  bubble.id = "ai-widget-bubble";
  bubble.innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:18px;">💬</span><span style="font-size:14px;">Chat with us</span></div>';
  bubble.style.cssText =
    "position:fixed;bottom:24px;" +
    posCSS +
    "z-index:99999;background:" +
    cfg.color +
    ";color:#fff;padding:12px 20px;border-radius:50px;cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,0.3);transition:transform .15s;";
  bubble.onmouseenter = function () {
    bubble.style.transform = "scale(1.05)";
  };
  bubble.onmouseleave = function () {
    bubble.style.transform = "scale(1)";
  };
  bubble.onclick = function () {
    isOpen = true;
    bubble.style.display = "none";
    panel.style.display = "flex";
  };
  document.body.appendChild(bubble);

  // --- Panel ---
  var panel = document.createElement("div");
  panel.id = "ai-widget-panel";
  panel.style.cssText =
    "position:fixed;bottom:24px;" +
    posCSS +
    "z-index:99999;width:380px;height:520px;display:none;flex-direction:column;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 8px 40px rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.08);";

  // Header
  var header = document.createElement("div");
  header.style.cssText =
    "background:" +
    cfg.color +
    ";padding:14px 16px;display:flex;justify-content:space-between;align-items:center;";
  header.innerHTML =
    '<div><div style="font-size:14px;font-weight:600;color:#fff;">' +
    esc(cfg.name) +
    '</div><div style="font-size:12px;color:rgba(255,255,255,0.7);">Ask me anything</div></div>';
  var closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  closeBtn.style.cssText =
    "background:none;border:none;color:rgba(255,255,255,0.7);font-size:18px;cursor:pointer;padding:0;";
  closeBtn.onclick = function () {
    isOpen = false;
    panel.style.display = "none";
    bubble.style.display = "flex";
  };
  header.appendChild(closeBtn);
  panel.appendChild(header);

  // Messages area
  var msgsEl = document.createElement("div");
  msgsEl.style.cssText =
    "flex:1;overflow-y:auto;padding:12px 16px;background:#0a0a10;";
  panel.appendChild(msgsEl);

  // Quick questions
  var quickEl = document.createElement("div");
  quickEl.style.cssText =
    "display:flex;gap:6px;padding:0 16px 8px;overflow-x:auto;background:#0a0a10;";
  panel.appendChild(quickEl);

  // Input area
  var inputArea = document.createElement("form");
  inputArea.style.cssText =
    "display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,0.08);background:#0a0a10;";
  var inputEl = document.createElement("input");
  inputEl.placeholder = "Type a message...";
  inputEl.style.cssText =
    "flex:1;border:1px solid rgba(255,255,255,0.1);background:#14141e;color:#f0f0f5;border-radius:8px;padding:10px 12px;font-size:13px;outline:none;font-family:inherit;";
  var sendBtn = document.createElement("button");
  sendBtn.type = "submit";
  sendBtn.textContent = "Send";
  sendBtn.style.cssText =
    "background:" +
    cfg.color +
    ";color:#fff;border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;";
  inputArea.appendChild(inputEl);
  inputArea.appendChild(sendBtn);
  inputArea.onsubmit = function (e) {
    e.preventDefault();
    sendMessage(inputEl.value.trim());
  };
  panel.appendChild(inputArea);
  document.body.appendChild(panel);

  renderMessages();

  function sendMessage(text) {
    if (!text || isLoading) return;
    inputEl.value = "";
    messages.push({ role: "user", content: text });
    isLoading = true;
    renderMessages();

    fetch(cfg.api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt: cfg.prompt,
        messages: messages,
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("API error");
        var reader = res.body.getReader();
        var decoder = new TextDecoder();
        var content = "";
        messages.push({ role: "assistant", content: "" });

        function read() {
          reader.read().then(function (result) {
            if (result.done) {
              isLoading = false;
              renderMessages();
              return;
            }
            var lines = decoder.decode(result.value, { stream: true }).split("\n");
            for (var i = 0; i < lines.length; i++) {
              if (lines[i].indexOf("data: ") === 0) {
                var d = lines[i].slice(6);
                if (d === "[DONE]") continue;
                try {
                  var delta =
                    JSON.parse(d).choices &&
                    JSON.parse(d).choices[0] &&
                    JSON.parse(d).choices[0].delta &&
                    JSON.parse(d).choices[0].delta.content;
                  if (delta) {
                    content += delta;
                    messages[messages.length - 1].content = content;
                    renderMessages();
                  }
                } catch (e) {}
              }
            }
            read();
          });
        }
        read();
      })
      .catch(function () {
        messages.push({
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        });
        isLoading = false;
        renderMessages();
      });
  }

  function renderMessages() {
    var html = "";
    if (messages.length === 0) {
      html +=
        '<div style="margin-bottom:12px;"><div style="max-width:85%;background:#14141e;color:#f0f0f5;border-radius:8px;padding:8px 12px;font-size:13px;line-height:1.5;">' +
        esc(cfg.greeting) +
        "</div></div>";
    }
    for (var i = 0; i < messages.length; i++) {
      var m = messages[i];
      var isUser = m.role === "user";
      html +=
        '<div style="margin-bottom:12px;display:flex;justify-content:' +
        (isUser ? "flex-end" : "flex-start") +
        ';"><div style="max-width:85%;background:' +
        (isUser ? cfg.color : "#14141e") +
        ";color:" +
        (isUser ? "#fff" : "#f0f0f5") +
        ';border-radius:8px;padding:8px 12px;font-size:13px;line-height:1.5;white-space:pre-wrap;">' +
        esc(m.content) +
        "</div></div>";
    }
    if (isLoading && messages.length && messages[messages.length - 1].role !== "assistant") {
      html +=
        '<div style="margin-bottom:12px;"><div style="background:#14141e;color:#888;border-radius:8px;padding:8px 12px;font-size:13px;">Typing...</div></div>';
    }
    msgsEl.innerHTML = html;
    msgsEl.scrollTop = msgsEl.scrollHeight;

    quickEl.innerHTML = "";
    if (messages.length === 0 && cfg.questions.length > 0) {
      for (var j = 0; j < cfg.questions.length; j++) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = cfg.questions[j];
        btn.style.cssText =
          "flex-shrink:0;background:none;border:1px solid rgba(255,255,255,0.1);color:#888;border-radius:20px;padding:4px 12px;font-size:11px;cursor:pointer;font-family:inherit;white-space:nowrap;";
        (function (q) {
          btn.onclick = function () {
            sendMessage(q);
          };
        })(cfg.questions[j]);
        quickEl.appendChild(btn);
      }
    }
  }

  function esc(s) {
    if (!s) return "";
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }
})();
