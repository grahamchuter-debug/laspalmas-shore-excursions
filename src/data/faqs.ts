import type { FAQ } from "./types";
import { getHomepageFaqs } from "./homepage";

export const extraFaqs: FAQ[] = [
  {
    question: "Where do cruise ships dock in Las Palmas?",
    answer:
      "At Muelle Santa Catalina, near Santa Catalina park with easy access to Las Canteras beach on foot.",
  },
  {
    question: "Is Las Palmas a walkable cruise port?",
    answer:
      "Partially. Las Canteras is walkable from the terminal; Vegueta and island highlights need taxi, bus or excursion.",
  },
  {
    question: "How far is Roque Nublo from Las Palmas cruise port?",
    answer:
      "About 45 km inland, typically 45-60 minutes each way by coach depending traffic and route.",
  },
  {
    question: "What is the best first excursion in Las Palmas?",
    answer:
      "For island breadth, A Taste of Gran Canaria. For mountain scenery, Gran Canaria and Roque Nublo. For city focus, Half-Day Las Palmas.",
  },
  {
    question: "Can I explore Las Palmas independently instead of booking a tour?",
    answer:
      "Yes for the city — Las Canteras, Vegueta via taxi and Triana are all practical. Island highlights need organised tours.",
  },
  {
    question: "Is Roque Nublo worth visiting on a port day?",
    answer:
      "Yes on standard or long calls if scenery is your priority — it is Gran Canaria's most dramatic natural landmark.",
  },
  {
    question: "Are Las Palmas beaches practical on a cruise call?",
    answer:
      "Las Canteras absolutely — walkable and excellent. Southern resort beaches need long transfers unless part of a dune excursion.",
  },
  {
    question: "How much should I budget for taxis in Las Palmas?",
    answer:
      "Short central rides EUR 8-15; Las Canteras from terminal EUR 5-10; Vegueta EUR 8-12 depending traffic.",
  },
  {
    question: "Is Las Palmas suitable for families?",
    answer:
      "Very suitable — Las Canteras beach, manageable city distances and family excursion options work well for mixed-age groups.",
  },
  {
    question: "How early should I return to the ship?",
    answer:
      "Aim to be back near Muelle Santa Catalina 60-90 minutes before all-aboard, especially after island excursions.",
  },
  {
    question: "What should I eat in Las Palmas on a cruise day?",
    answer:
      "Prioritise papas arrugadas with mojo, fresh Atlantic fish, gofio and Canarian wine if timing allows.",
  },
  {
    question: "Is weather a major factor in Las Palmas planning?",
    answer:
      "Coast is reliably mild; highland excursions can be cooler and cloudier — pack layers for Roque Nublo and Bandama.",
  },
  {
    question: "Can I do the city and a full island tour in one day?",
    answer:
      "Not with depth in both. Choose one primary anchor — city or island — for a satisfying port day.",
  },
  {
    question: "Are private tours useful in Las Palmas?",
    answer:
      "Yes for mixed mobility, family groups and travellers wanting custom pace across city and island highlights.",
  },
  {
    question: "What are the strongest categories of Las Palmas shore excursions?",
    answer:
      "Island highlights, volcanic landscapes, historic city tours, food and wine, beach days, private tours and short port call options.",
  },
];

export function getAllFaqs(): FAQ[] {
  return [...getHomepageFaqs(), ...extraFaqs];
}
