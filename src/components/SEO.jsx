import { useEffect } from "react";

export default function SEO({
  title = "TapMilan | Digital Business Card, Visiting Card & NFC Card India",

  description = "TapMilan helps professionals and businesses create digital business cards, smart visiting cards and NFC cards. Share your profile, WhatsApp, phone, social links and business details instantly.",

  noIndex = false,
}) {
  useEffect(() => {
    // ==============================
    // PAGE TITLE
    // ==============================

    document.title = title;

    // ==============================
    // META DESCRIPTION
    // ==============================

    let descriptionTag = document.querySelector(
      'meta[name="description"]'
    );

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute("content", description);

    // ==============================
    // ROBOTS
    // ==============================

    let robotsTag = document.querySelector(
      'meta[name="robots"]'
    );

    if (!robotsTag) {
      robotsTag = document.createElement("meta");
      robotsTag.setAttribute("name", "robots");
      document.head.appendChild(robotsTag);
    }

    robotsTag.setAttribute(
      "content",
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    // ==============================
    // CANONICAL
    // ==============================

    let canonicalTag = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }

    canonicalTag.setAttribute(
      "href",
      "https://tapmilan.in/"
    );

    // ==============================
    // OPEN GRAPH
    // ==============================

    const setMetaProperty = (property, content) => {
      let tag = document.querySelector(
        `meta[property="${property}"]`
      );

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    setMetaProperty(
      "og:title",
      title
    );

    setMetaProperty(
      "og:description",
      description
    );

    setMetaProperty(
      "og:url",
      "https://tapmilan.in/"
    );

    setMetaProperty(
      "og:type",
      "website"
    );

    setMetaProperty(
      "og:site_name",
      "TapMilan"
    );

    // ==============================
    // TWITTER / X
    // ==============================

    const setMetaName = (name, content) => {
      let tag = document.querySelector(
        `meta[name="${name}"]`
      );

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    setMetaName(
      "twitter:card",
      "summary"
    );

    setMetaName(
      "twitter:title",
      title
    );

    setMetaName(
      "twitter:description",
      description
    );

    // ==============================
    // STRUCTURED DATA
    // ==============================

    let schemaTag = document.querySelector(
      'script[data-seo-schema="tapmilan"]'
    );

    if (!schemaTag) {
      schemaTag = document.createElement("script");
      schemaTag.type = "application/ld+json";
      schemaTag.setAttribute(
        "data-seo-schema",
        "tapmilan"
      );

      document.head.appendChild(schemaTag);
    }

    schemaTag.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "TapMilan",
      url: "https://tapmilan.in/",
      description:
        "Digital business cards, smart visiting cards and NFC cards for professionals and businesses.",
    });

    // ==============================
    // CLEANUP
    // ==============================

    return () => {
      // No cleanup required because
      // the next page will update these tags.
    };
  }, [title, description, noIndex]);

  return null;
}