import { NextResponse } from "next/server";
import { zfd } from "zod-form-data";

const schema = zfd.formData({ file: zfd.file() });
export async function POST(response) {
  const { file: files } = schema.parse(await response.formData());
  return NextResponse.json(files?.length);
}
