import Script from "next/script";

const BASE_URL = "https://foremost.ai";

// Organization Schema - Core business identity
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Foremost.ai",
  alternateName: "Foremost",
  url: BASE_URL,
  description:
    "Board-level AI advisory firm helping boards and executive teams cut through AI noise with clarity, rigour, and measurable outcomes.",
  foundingDate: "2024",
  areaServed: [
    {
      "@type": "Country",
      name: "United Kingdom",
    },
    {
      "@type": "Place",
      name: "Europe",
    },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "office@foremost.ai",
    contactType: "customer service",
    availableLanguage: "English",
  },
  sameAs: ["https://linkedin.com/company/foremost-ai"],
};

// ProfessionalService Schema - Service offerings
export const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${BASE_URL}/#service`,
  name: "Foremost.ai",
  url: BASE_URL,
  description:
    "Applied intelligence for the boardroom. Strategic AI advisory for boards and executive teams.",
  provider: {
    "@id": `${BASE_URL}/#organization`,
  },
  serviceType: [
    "AI Consulting",
    "AI Advisory",
    "Board Advisory",
    "Executive AI Strategy",
    "AI Governance",
    "AI Implementation Strategy",
  ],
  areaServed: [
    {
      "@type": "Country",
      name: "United Kingdom",
    },
    {
      "@type": "Place",
      name: "Europe",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI Advisory Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Strategic Clarity",
          description:
            "Helping leaders cut through AI noise, identify where AI genuinely accelerates their goals, and move forward with clear priorities.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Applied Intelligence",
          description:
            "Ensuring AI creates value through reimagining business models or driving efficiency with measurable outcomes.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Human Potential",
          description:
            "Designing organisations where human judgement remains central and imagination is unlocked through AI.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Governance as Enabler",
          description:
            "Creating guardrails that allow organisations to move faster with conviction and confidence.",
        },
      },
    ],
  },
};

// WebSite Schema - Site-level metadata
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Foremost.ai",
  description: "Board-Level AI Advisory",
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
  inLanguage: "en-GB",
};

// BreadcrumbList Schema Generator
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Predefined breadcrumbs for each page
export const breadcrumbs = {
  home: generateBreadcrumbSchema([{ name: "Home", url: BASE_URL }]),
  howWeThink: generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "How We Think", url: `${BASE_URL}/how-we-think` },
  ]),
  whoWeAre: generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Who We Are", url: `${BASE_URL}/who-we-are` },
  ]),
  contact: generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Contact", url: `${BASE_URL}/contact` },
  ]),
  careers: generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Careers", url: `${BASE_URL}/careers` },
  ]),
  privacyPolicy: generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Privacy Policy", url: `${BASE_URL}/privacy-policy` },
  ]),
};

// Component to inject schema into page head
interface SchemaScriptProps {
  schema: object | object[];
}

export function SchemaScript({ schema }: SchemaScriptProps) {
  const schemas = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemas.map((s, index) => (
        <Script
          key={index}
          id={`schema-${index}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
}

// Person schema for team members
export const founderSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Vitalij Farafonov",
  jobTitle: "Founder & Managing Partner",
  worksFor: {
    "@id": `${BASE_URL}/#organization`,
  },
  sameAs: ["https://linkedin.com/in/vitalijfarafonov"],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "MIT",
    department: "AI for Senior Executives Programme",
  },
};
