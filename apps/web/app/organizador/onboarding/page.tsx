import type { Metadata } from "next";
import { OrganizerOnboardingExperience } from "../../_auth/auth-experience";

export const metadata: Metadata = { title: "Configurar perfil de organizador — Liete" };

export default function OrganizerOnboardingPage() { return <OrganizerOnboardingExperience />; }
