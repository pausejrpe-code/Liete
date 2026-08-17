import type { Metadata } from "next";
import { ProfileChoiceExperience } from "../_auth/auth-experience";

export const metadata: Metadata = { title: "Criar conta — Liete" };

export default function RegistrationChoicePage() { return <ProfileChoiceExperience />; }
