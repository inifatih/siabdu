"use server";
// Import Component
import FormSkrining from "@/components/FormSkrining";
import { getSkrining } from "./action";

export default async function Skrining() {

  return (
    <>
      <FormSkrining getSkrining={getSkrining} />
    </>
  );
}