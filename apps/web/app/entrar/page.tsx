import type { Metadata } from "next";
import { LoginExperience } from "../_auth/auth-experience";

export const metadata: Metadata = { title: "Entrar — Liete" };

export default function LoginPage() { return <LoginExperience />; }
