import type { Metadata } from "next";
import { ProfileDashboard } from "./profile-dashboard";

export const metadata: Metadata = {
  description:
    "Gerencie cadastro, documentos, repasses e preferências do organizador.",
  title: "Perfil do organizador — Liete"
};

export default function OrganizerProfilePage() {
  return <ProfileDashboard />;
}
