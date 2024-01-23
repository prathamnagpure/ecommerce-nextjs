import { NextResponse } from "next/server";
import { zfd } from "zod-form-data";
import { Image } from "@/app/models/Image";
import connectDatabase from "@/app/lib/database";

const schema = zfd.formData({ file: zfd.repeatableOfType(zfd.file()) });
export async function POST(request) {
  const { file: files } = schema.parse(await request.formData());
  const ids = [];
  for (const file of files) {
    const fileExtension = file.name.split(".").pop();
    const newFileName = Date.now() + "." + fileExtension;
    const imageDoc = await Image.create({
      name: newFileName,
      img: {
        data: new Buffer.from(await file.arrayBuffer()),
        contentType: "image/" + fileExtension,
      },
    });
    ids.push(imageDoc._id);
    console.log(imageDoc);
  }
  return NextResponse.json(ids);
}

export async function GET(request) {
  await connectDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    return NextResponse.json(await Image.findById(id).lean());
  }
  return NextResponse.json(true);
}
