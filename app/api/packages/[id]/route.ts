import path from "path";
import { Readable } from "stream";
import { Package } from "@/models";
import formidable from "formidable";
import { type NextRequest, NextResponse } from "next/server";

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await Package.destroy({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { fields, files }: any = await parseForm(request);

    let imageUrl = "";
    if (files.uploadedImage) {
      if (Array.isArray(files.uploadedImage)) {
        imageUrl = path.basename(files.uploadedImage[0].filepath);
      } else if (files.uploadedImage.filepath) {
        imageUrl = path.basename(files.uploadedImage.filepath);
      }
    } else if (fields.uploadedImage) {
      imageUrl = Array.isArray(fields.uploadedImage)
        ? fields.uploadedImage[0]
        : fields.uploadedImage;
    }

    let gallery: string[] = [];
    if (files.gallery) {
      if (Array.isArray(files.gallery)) {
        gallery = files.gallery.map((file: any) =>
          path.basename(file.filepath)
        );
      } else if (files.gallery.filepath) {
        gallery = [path.basename(files.gallery.filepath)];
      }
    }
    // Accept galleryUrls as JSON string for URLs/filenames
    if (fields.galleryUrls) {
      let urls: string[] = [];
      try {
        urls = JSON.parse(
          Array.isArray(fields.galleryUrls)
            ? fields.galleryUrls[0]
            : fields.galleryUrls
        );
      } catch {}
      if (Array.isArray(urls)) {
        urls.forEach((g) => {
          if (!gallery.includes(g)) gallery.push(g);
        });
      }
    }

    const current = await Package.findByPk(params.id);
    const prevMain = current?.uploadedImage || "";
    const prevGallery = current?.gallery || [];

    const finalImageUrl = imageUrl || prevMain;

    const finalGallery = gallery.length > 0 ? gallery : prevGallery;

    const updatedPackage = await Package.update(
      {
        title: fields.title?.[0],
        description: fields.description?.[0] || "",
        imageUrl: fields.image || "",
        uploadedImage: finalImageUrl,
        gallery: JSON.stringify(finalGallery),
        starRating: fields.stars?.[0],
        nights: fields.nights?.[0],
        hotels: fields.hotels?.[0],
        price: fields.price?.[0],
        category: fields.category?.[0],
        packageIncludes: fields.packageIncludes?.[0] || [],
        hotelMakkahDetails: fields.hotelMakkahDetails?.[0] || "",
        hotelMedinaDetails: fields.hotelMedinaDetails?.[0] || "",
      },
      {
        where: { id: params.id },
        returning: true,
      }
    );

    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
