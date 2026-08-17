import type { Metadata } from "next";
import { NewExcursionJourney } from "./new-excursion-journey";

export const metadata: Metadata = {
  title: "Nova excursão — Liete",
  description: "Crie e revise uma nova excursão."
};

export default function NewExcursionPage() {
  return <NewExcursionJourney />;
}
