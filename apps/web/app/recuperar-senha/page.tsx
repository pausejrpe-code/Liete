import type { Metadata } from "next";
import { RecoveryExperience } from "../_auth/auth-experience";

export const metadata: Metadata = { title: "Recuperar acesso — Liete" };

export default function RecoveryPage() { return <RecoveryExperience />; }
