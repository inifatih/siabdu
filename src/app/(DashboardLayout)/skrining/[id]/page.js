"use client";

import FormSkrining from "@/components/FormSkrining";
import { useParams } from "next/navigation";
import { fetchSkriningById, updateSkrining } from '../action';

export default function EditSkrining() {
  const params = useParams();
  const skriningId = params?.id; // Ambil ID dari URL

  return (
    <FormSkrining fetchSkriningById={fetchSkriningById} updateSkrining={updateSkrining} skriningId={skriningId} />
  );
}
