import clientPromise from "@/app/lib/mongodb";
import { Product } from "@/app/models/Product";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDatabase from "@/app/lib/database";
import { Category } from "@/app/models/Category";

export async function GET(request) {
  await connectDatabase();
  return NextResponse.json(await Category.find({}).populate("parent"));
}

export async function POST(request) {
  await connectDatabase();
  const { name, parent, properties } = await request.json();
  const categoryDoc = await Category.create({ name, parent, properties });
  return NextResponse.json(categoryDoc);
}

export async function PUT(request) {
  await connectDatabase();
  const { name, parent, properties, _id } = await request.json();
  const categoryDoc = await Category.updateOne(
    { _id },
    { name, parent, properties }
  );
  return NextResponse.json(categoryDoc);
}

export async function DELETE(request) {
  await connectDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    await Category.deleteOne({ _id: id });
    return NextResponse.json(true);
  }
}
