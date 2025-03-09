"use server";
// Import Component
import DokumenSkrining from "@/components/DokumenSkrining";
import { fetchSkriningData } from "./action";

export default async function Skrining() {

  return (
    <>
      <DokumenSkrining fetchSkriningData={fetchSkriningData} />
    </>
  );
}