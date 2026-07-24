import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedAccount } from "@/lib/auth";
import { getCatalogItem } from "@/lib/catalog";

interface CartPayloadItem {
  flavorId: string;
  quantity: number;
}

export async function GET() {
  const account = await getAuthenticatedAccount();
  if (!account) return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });

  const cart = await db.cart.findUnique({
    where: { userId: account.id },
    include: { items: true },
  });

  return NextResponse.json({
    success: true,
    items: cart?.items.map((item) => ({ flavorId: item.flavorId, quantity: item.quantity })) ?? [],
  });
}

export async function PUT(request: Request) {
  const account = await getAuthenticatedAccount();
  if (!account) return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });

  const body = (await request.json()) as { items?: CartPayloadItem[] };
  if (!Array.isArray(body.items)) {
    return NextResponse.json({ success: false, error: "Cart items must be an array" }, { status: 400 });
  }

  const items = body.items
    .filter((item) => getCatalogItem(item.flavorId) && Number.isInteger(item.quantity) && item.quantity > 0)
    .map((item) => ({
      flavorId: item.flavorId,
      flavorName: getCatalogItem(item.flavorId)!.name,
      quantity: Math.min(item.quantity, 8),
    }));

  const cart = await db.cart.upsert({
    where: { userId: account.id },
    update: {
      items: {
        deleteMany: {},
        create: items,
      },
    },
    create: {
      userId: account.id,
      items: { create: items },
    },
    include: { items: true },
  });

  return NextResponse.json({
    success: true,
    items: cart.items.map((item) => ({ flavorId: item.flavorId, quantity: item.quantity })),
  });
}