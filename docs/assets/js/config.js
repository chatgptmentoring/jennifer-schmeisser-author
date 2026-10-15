/* ==========================================================================
   SITE SETTINGS: the one file to edit when details change.
   ========================================================================== */
window.SITE_CONFIG = {
  author: "Jennifer A. Schmeisser",

  book: {
    title: "When the Blueprint Burned",
    subtitle: "A Unicorn Mama Memoir of Neurodiversity, Strength, Joy & Humor",
    // Paste the Amazon link here when the book goes live. Every "Get the Book"
    // button on the site switches from "Coming soon" to "Buy on Amazon" automatically.
    amazonUrl: "",
    launchNote: "Coming soon to Amazon"
  },

  // Placeholder address for the demo. Replace with Jennifer's real email.
  email: "hello@jenniferschmeisser.com",

  socials: {
    facebook: "https://www.facebook.com/jennifer.schmeisser.5",
    instagram: "https://www.instagram.com/jensmizer/",
    linkedin: "https://www.linkedin.com/in/jenniferschmeisser7/",
    threads: "https://www.threads.com/@jensmizer"
  },

  // Demo forms don't send anything. In production, point this at a form
  // service (e.g. Formspree) and the forms will post there.
  formEndpoint: "",

  // Sparkle AI: leave empty to run the built-in demo brain (no server needed).
  // In production, set this to a secure serverless endpoint that calls an LLM
  // trained on the full manuscript. See README.md.
  ai: { endpoint: "" }
};
