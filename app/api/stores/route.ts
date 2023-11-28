import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
import { CreateStoreSchema } from './store-schema';
import { isZodError } from '@/lib/utils';
import { z } from 'zod';

export async function POST(
  req: Request,
  res: NextResponse
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    const input = CreateStoreSchema.parse(body);
    const store = await prismadb.store.create({
      data: {
        ...input,
        userId
      }
    });

    return NextResponse.json(store);
  } catch (error: any) {
    console.log('[STORES_POST]', error);
    if (isZodError(error)) {
      const zerror = error as z.ZodError;
      return new NextResponse(JSON.stringify(zerror), { status: 400 })
    }
    return new NextResponse("Internal error", { status: 500 });
  }
};
