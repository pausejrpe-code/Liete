import type { Metadata } from "next";
import { OrganizerRegistrationExperience } from "../../_auth/auth-experience";

export const metadata: Metadata = { title: "Cadastro de organizador — Liete" };

export default function OrganizerRegistrationPage() { return <OrganizerRegistrationExperience />; }
