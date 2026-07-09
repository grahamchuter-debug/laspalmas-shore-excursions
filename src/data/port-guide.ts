import type { FAQ } from "./types";

export interface Terminal {
  name: string;
  quay: string;
  usedBy: string;
  cityAccess: string;
}

export interface PortGuideSection {
  heading: string;
  paragraphs: string[];
}

export const portGuideContent = {
  title: "Las Palmas Cruise Port Guide",
  subtitle: "Terminal location, Las Canteras access, Vegueta transfers, island excursion staging and return-to-ship strategy for Las Palmas cruise passengers.",
  terminals: [
    {
      name: "Muelle Santa Catalina",
      quay: "Main cruise terminal at Las Palmas de Gran Canaria waterfront",
      usedBy: "Most mainstream and premium ships calling at Gran Canaria",
      cityAccess: "15-25 min walk to Las Canteras; 15-20 min taxi to Vegueta; excursion coaches at terminal zone",
    },
    {
      name: "Santa Catalina Park",
      quay: "Waterfront park adjacent to cruise terminal",
      usedBy: "Independent cruise visitors orienting from terminal",
      cityAccess: "Immediate green space, cafés and Las Canteras promenade access",
    },
    {
      name: "Excursion coach staging",
      quay: "Designated pickup points near cruise terminal",
      usedBy: "Island tour and city shore excursion operators",
      cityAccess: "Direct boarding with ship-time aligned departures to Roque Nublo, dunes and city routes",
    },
  ] as Terminal[],
  sections: [
    {
      heading: "Terminal and first steps",
      paragraphs: [
        "Las Palmas' terminal at Muelle Santa Catalina puts you within walking distance of Las Canteras beach and Santa Catalina park. This is one of the stronger city-beach cruise port locations in the Canary Islands.",
        "Keep your ship card and photo ID with you. Decide early whether your day is city-focused (walkable) or island-focused (excursion coach required).",
        "Independent travellers should screenshot terminal location and all-aboard time before leaving the quay.",
      ],
    },
    {
      heading: "Getting around the city",
      paragraphs: [
        "Walking works for Las Canteras promenade and Santa Catalina park from the terminal.",
        "Taxis (EUR 8-15) and Global buses reach Vegueta, Triana and Mercado del Puerto efficiently.",
        "The historic quarter has cobbled lanes — comfortable shoes help. Las Canteras offers reef-protected swimming.",
      ],
    },
    {
      heading: "Island tour transfer reality",
      paragraphs: [
        "Roque Nublo sits roughly 45 km inland — typically 45-60 minutes each way by coach plus a 30-45 minute walk at altitude.",
        "Maspalomas dunes are 55 km south — 50-70 minutes each way. Bandama caldera is closer at 20 km — 30-40 minutes each way.",
        "A well-paced island excursion delivers meaningful scenery time, but avoid trying to add deep city touring on the same day.",
      ],
    },
    {
      heading: "Return to ship strategy",
      paragraphs: [
        "Target return to terminal area 60-90 minutes before all-aboard.",
        "Island excursions should build conservative buffers; city independent days still need discipline near end of call.",
        "On independent days, keep final stops near Las Canteras or Santa Catalina for an easy walk back to Muelle Santa Catalina.",
      ],
    },
  ] as PortGuideSection[],
  faqs: [
    {
      question: "How far is Las Canteras beach from the cruise terminal?",
      answer: "Usually around 15-25 minutes on foot via a pleasant waterfront route.",
    },
    {
      question: "Can I walk to Vegueta from the cruise ship?",
      answer: "It is possible but not recommended — taxi or bus is faster and more comfortable.",
    },
    {
      question: "How long should I allow returning from Roque Nublo?",
      answer: "At least 45-60 minutes coach travel plus a conservative 60-90 minute all-aboard buffer.",
    },
    {
      question: "Is Las Palmas suitable for independent port days?",
      answer: "Yes, especially for city and beach focus. Island highlights require organised excursions.",
    },
  ] as FAQ[],
};

export const terminals = portGuideContent.terminals;
export const portGuideSections = portGuideContent.sections;
export const portGuideFaqs = portGuideContent.faqs;
