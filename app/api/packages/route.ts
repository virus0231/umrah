import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { Package } from "@/models";
import formidable from "formidable";
import { type NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

function nextRequestToNodeRequest(request: NextRequest) {
  const readable = Readable.fromWeb(
    request.body as any
  ) as unknown as NodeJS.ReadableStream;
  (readable as any).headers = Object.fromEntries(request.headers.entries());
  (readable as any).method = request.method;
  (readable as any).url = request.url;
  return readable;
}

async function parseForm(request: NextRequest) {
  const form = formidable({
    multiples: true,
    uploadDir: "./public/uploads",
    keepExtensions: true,
  });

  const nodeRequest = nextRequestToNodeRequest(request);

  return new Promise((resolve, reject) => {
    form.parse(nodeRequest, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function GET() {
  try {
    const packages = await Package.findAll({
      order: [["updatedAt", "DESC"]],
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fields, files }: any = await parseForm(request);

    const imageUrl =
      (files.uploadedImage?.[0] &&
        path.basename(files.uploadedImage[0].filepath)) ||
      (files.uploadedImage && path.basename(files.uploadedImage.filepath)) ||
      "";

    const gallery = Array.isArray(files.gallery)
      ? files.gallery.map((file: any) => path.basename(file.filepath))
      : files.gallery
      ? [path.basename(files.gallery.filepath)]
      : [];

    // const packageData = await request.json();
    // console.log("Creating package with data:", packageData);

    console.log("Creating package with data:", fields);

    const newPackage = await Package.create({
      title: fields.title?.[0],
      description: fields.description?.[0] || "",
      imageUrl: fields.image || "",
      uploadedImage: imageUrl,
      gallery,
      starRating: parseInt(fields.stars?.[0], 10) || 1,
      nights: parseInt(fields.nights?.[0], 10) || 1,
      hotels: JSON.parse(fields.hotels?.[0] || "{}"),
      price: parseFloat(fields.price?.[0]) || 0,
      category: fields.category?.[0] || "",
      packageIncludes: JSON.parse(fields.packageIncludes?.[0] || "[]"),
      hotelMakkahDetails: fields.hotelMakkahDetails?.[0] || "",
      hotelMedinaDetails: fields.hotelMedinaDetails?.[0] || "",
      status: "active",
    });

    return NextResponse.json(newPackage);
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
