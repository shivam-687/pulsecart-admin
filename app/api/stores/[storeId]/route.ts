import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { UpdateStoreSchema } from "../store-schema";
import { isZodError } from "@/lib/utils";
import { z } from "zod";


export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }
    const {id, ...rest} = UpdateStoreSchema.parse({...body, id: params.storeId});

    const store = await prismadb.store.updateMany({
      where: {
        id,
        userId,
      },
      data: rest
    });
  
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    if (isZodError(error)) {
      const zerror = error as z.ZodError;
      return new NextResponse(JSON.stringify(zerror), { status: 400 })
    }
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId
      }
    });
  
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prismadb.store.findFirst({
      where: {
        OR: [
          {
            id: params.storeId
          },
          {
            slug: params.storeId
          }
        ]
      },
      select: {
        name: true,
        slug: true,
        id: true
      }
    });
  
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
