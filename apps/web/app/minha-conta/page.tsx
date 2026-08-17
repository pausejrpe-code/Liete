import type { Metadata } from "next";
import { TravelerAccount } from "./traveler-account";

export const metadata: Metadata = {
  description: "Gerencie dados pessoais, segurança e notificações.",
  title: "Minha conta — Liete"
};

export default function TravelerAccountPage() { return <TravelerAccount />; }
