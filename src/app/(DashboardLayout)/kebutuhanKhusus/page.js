"use server";

import FormKebutuhanKhusus from "@/components/FormKebutuhanKhusus";
import { fetchSkriningData } from "../dokumen/action";
export default async function KebutuhanKhusus() {
  return(
    <>
      <FormKebutuhanKhusus/>
    </>
  );
};