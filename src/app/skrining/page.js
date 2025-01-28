"use server";
// Import Component and Library
import FormSkrining from "@/components/FormSkrining";
import { getSkrining } from "./action";

export default async function Skrining() {

  return (
    <>
      <FormSkrining getSkrining={getSkrining} />
    </>
  );
}