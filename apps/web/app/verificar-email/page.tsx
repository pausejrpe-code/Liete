import type { Metadata } from "next";
import { EmailVerificationExperience } from "../_auth/auth-experience";

export const metadata: Metadata = { title: "Verificar e-mail — Liete" };

export default function EmailVerificationPage() { return <EmailVerificationExperience />; }
