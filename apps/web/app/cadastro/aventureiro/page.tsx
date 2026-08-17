import type { Metadata } from "next";
import { TravelerRegistrationExperience } from "../../_auth/auth-experience";

export const metadata: Metadata = { title: "Cadastro de aventureiro — Liete" };

export default function TravelerRegistrationPage() { return <TravelerRegistrationExperience />; }
