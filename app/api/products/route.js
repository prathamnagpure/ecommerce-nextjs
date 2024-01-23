import clientPromise from "@/app/lib/mongodb";
import { Product } from "@/app/models/Product";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDatabase from "@/app/lib/database";

export async function GET(request) {
  await connectDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    return NextResponse.json(await Product.findById(id));
  }
  return NextResponse.json(await Product.find());
}

export async function POST(request) {
  const { title, description, price, images, category, properties } =
    await request.json();
  await connectDatabase();
  const productDoc = await Product.create({
    title,
    description,
    price,
    images,
    category,
    properties,
  });
  return NextResponse.json(productDoc);
}

export async function PUT(request) {
  const { _id, title, description, price, images, category, properties } =
    await request.json();
  await connectDatabase();
  await Product.updateOne(
    { _id },
    { title, description, price, images, category, properties }
  );

  return NextResponse.json(true);
}

export async function DELETE(request) {
  await connectDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    await Product.deleteOne({ _id: id });
    return NextResponse.json(true);
  }
}
