import { useEffect } from "react";

export default function SEO({
  title = "TapMilan | Digital Business Card, Visiting Card & NFC Card India",
  description = "TapMilan helps professionals and businesses create digital business cards, smart visiting cards and NFC cards. Share your profile, WhatsApp, phone, social links and business details instantly.",
  noIndex = false,
}) {
  useEffect(() => {
    // TITLE
    document.title = title;

    // DESCRIPTION
    let descriptionTag = document.querySelector(
      'meta[name="description"]'
    );

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute("content", description);

    // ROBOTS
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
      noIndex ? "noindex, nofollow" : "index, follow"
    );
  }, [title, description, noIndex]);

  return null;
}