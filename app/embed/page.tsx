export default function EmbedPage() {
  const exampleCode = `<script
  src="https://YOUR-DOMAIN.com/widget.js"
  data-name="Fresh Cuts Barbershop"
  data-api="https://YOUR-DOMAIN.com/api/demo-chat"
  data-color="#6d5cfc"
  data-greeting="Hey! I'm the Fresh Cuts assistant. Ask me about services, prices, or book an appointment!"
  data-position="right"
  data-questions="What are your prices?|Are you open today?|How do I book?"
  data-prompt="You are the AI assistant for Fresh Cuts Barbershop in Sacramento, CA.

SERVICES:
- Regular Haircut: $30
- Skin Fade: $35
- Beard Trim: $15
- Haircut + Beard: $40
- Kids Cut: $20

HOURS: Mon-Fri 9am-7pm, Sat 8am-5pm, Sun Closed
PHONE: (916) 555-0199

Be friendly and helpful. Keep answers to 1-3 sentences. If you don't know, say to call the shop."
><\/script>`;

  const minimalCode = `<script
  src="https://YOUR-DOMAIN.com/widget.js"
  data-name="My Business Name"
  data-api="https://YOUR-DOMAIN.com/api/demo-chat"
  data-prompt="You are the assistant for My Business. Answer questions about services and hours."
><\/script>`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold">Embed AI Assistant on Any Website</h1>
      <p className="mb-10 text-muted">
        One script tag. Drop it into any HTML page and your AI assistant appears as a chat bubble.
      </p>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold">How It Works</h2>
        <div className="space-y-3 text-sm text-muted leading-relaxed">
          <p>
            The widget is a single JavaScript file hosted on your server. When you add the{" "}
            <code className="rounded bg-card px-1.5 py-0.5 text-xs">&lt;script&gt;</code> tag
            to any webpage, it creates a chat bubble in the corner. Clicking it opens the AI
            assistant, which calls your API to generate responses.
          </p>
          <p>
            All the business info (name, services, hours, personality) is set right in the
            script tag using <code className="rounded bg-card px-1.5 py-0.5 text-xs">data-</code> attributes.
            No database needed -- each website gets its own config right in the embed code.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold">Minimal Example</h2>
        <pre className="overflow-x-auto rounded-xl border border-border bg-card p-5 text-sm text-green font-mono leading-relaxed">
          {minimalCode}
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold">Full Example (Barber Shop)</h2>
        <pre className="overflow-x-auto rounded-xl border border-border bg-card p-5 text-sm text-green font-mono leading-relaxed">
          {exampleCode}
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold">All Options</h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 font-medium">Attribute</th>
                <th className="px-4 py-3 font-medium">Required</th>
                <th className="px-4 py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-mono text-xs text-foreground">data-api</td>
                <td className="px-4 py-2.5 text-accent">Yes</td>
                <td className="px-4 py-2.5">URL to your chat API endpoint</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-mono text-xs text-foreground">data-prompt</td>
                <td className="px-4 py-2.5 text-accent">Yes</td>
                <td className="px-4 py-2.5">System prompt -- all the business info, personality, and rules for the AI</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-mono text-xs text-foreground">data-name</td>
                <td className="px-4 py-2.5">No</td>
                <td className="px-4 py-2.5">Display name in the chat header (default: &quot;AI Assistant&quot;)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-mono text-xs text-foreground">data-color</td>
                <td className="px-4 py-2.5">No</td>
                <td className="px-4 py-2.5">Accent color for the bubble and buttons (default: #6d5cfc)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-mono text-xs text-foreground">data-greeting</td>
                <td className="px-4 py-2.5">No</td>
                <td className="px-4 py-2.5">First message the assistant shows when chat opens</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2.5 font-mono text-xs text-foreground">data-position</td>
                <td className="px-4 py-2.5">No</td>
                <td className="px-4 py-2.5">&quot;right&quot; or &quot;left&quot; (default: right)</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-mono text-xs text-foreground">data-questions</td>
                <td className="px-4 py-2.5">No</td>
                <td className="px-4 py-2.5">Quick-tap questions, separated by | (pipe)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold">Steps for Any Website</h2>
        <div className="space-y-4">
          {[
            {
              num: "1",
              title: "Copy the script tag",
              desc: "Grab the example above and customize the data attributes with the business info.",
            },
            {
              num: "2",
              title: "Paste before </body>",
              desc: "Add it to the HTML of any website -- WordPress, Squarespace, Wix, plain HTML, anything.",
            },
            {
              num: "3",
              title: "Done",
              desc: "The chat bubble appears. Customers can ask questions, book appointments, get answers 24/7.",
            },
          ].map((s) => (
            <div key={s.num} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                {s.num}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{s.title}</h3>
                <p className="text-sm text-muted">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center">
        <h3 className="mb-2 text-xl font-bold">Works on Any Platform</h3>
        <p className="mb-4 text-sm text-muted">
          WordPress, Squarespace, Wix, Shopify, plain HTML, React, Next.js -- if it has HTML, it works.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-muted">
          <span className="rounded-full border border-border px-3 py-1">WordPress</span>
          <span className="rounded-full border border-border px-3 py-1">Squarespace</span>
          <span className="rounded-full border border-border px-3 py-1">Wix</span>
          <span className="rounded-full border border-border px-3 py-1">Shopify</span>
          <span className="rounded-full border border-border px-3 py-1">HTML</span>
          <span className="rounded-full border border-border px-3 py-1">React</span>
          <span className="rounded-full border border-border px-3 py-1">Next.js</span>
        </div>
      </section>
    </div>
  );
}
