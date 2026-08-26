import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedAccount } from "@/lib/auth";
import { BOX_CAPACITY, BOX_PRICES, getCatalogItem } from "@/lib/catalog";

interface OrderPayloadItem {
  flavorId: unknown;
  quantity: unknown;
}

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET() {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });

    const orders = await db.order.findMany({
      where: { userId: account.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const account = await getAuthenticatedAccount();
    const body = (await req.json()) as {
      items?: unknown;
      customerName?: unknown;
      email?: unknown;
      shippingAddress?: unknown;
      boxSize?: unknown;
    };

    const { items, customerName, email, shippingAddress, boxSize } = body;

    if (boxSize !== "4-pack" && boxSize !== "8-pack") {
      return NextResponse.json({ success: false, error: "Choose a valid pack size" }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > BOX_CAPACITY[boxSize]) {
      return NextResponse.json({ success: false, error: "Cart items are invalid" }, { status: 400 });
    }

    if (typeof customerName !== "string" || customerName.trim().length < 2 || customerName.length > 120) {
      return NextResponse.json({ success: false, error: "Enter a valid customer name" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: "Enter a valid email address" }, { status: 400 });
    }

    if (typeof shippingAddress !== "string" || shippingAddress.trim().length < 5 || shippingAddress.length > 500) {
      return NextResponse.json({ success: false, error: "Enter a valid shipping address" }, { status: 400 });
    }

    const normalizedItems = (items as OrderPayloadItem[]).map((item) => {
      const flavorId = typeof item?.flavorId === "string" ? item.flavorId : "";
      const quantity = item?.quantity;
      const flavor = getCatalogItem(flavorId);

      if (!flavor || !Number.isInteger(quantity) || (quantity as number) < 1 || (quantity as number) > BOX_CAPACITY[boxSize]) {
        return null;
      }

      return { flavorId: flavor.id, flavorName: flavor.name, quantity: quantity as number };
    });

    if (normalizedItems.some((item) => item === null)) {
      return NextResponse.json({ success: false, error: "One or more products are invalid" }, { status: 400 });
    }

    const validItems = normalizedItems as Array<{ flavorId: string; flavorName: string; quantity: number }>;
    const totalQuantity = validItems.reduce((sum, item) => sum + item.quantity, 0);

    if (totalQuantity !== BOX_CAPACITY[boxSize]) {
      return NextResponse.json({
        success: false,
        error: "A " + boxSize + " requires exactly " + BOX_CAPACITY[boxSize] + " jars",
      }, { status: 400 });
    }

    const newOrder = await db.order.create({
      data: {
        userId: account?.id,
        customerName: customerName.trim(),
        email: email.trim().toLowerCase(),
        shippingAddress: shippingAddress.trim(),
        totalPrice: BOX_PRICES[boxSize],
        boxSize,
        items: {
          create: validItems.map(({ flavorName, quantity }) => ({ flavorName, quantity })),
        },
      },
      include: { items: true },
    });

    const whatsappUrl = buildWhatsAppUrl(newOrder, validItems);

    return NextResponse.json({ success: true, order: newOrder, whatsappUrl });
  } catch (error) {
    console.error("Failed to place order:", error);
    return NextResponse.json({ success: false, error: "Order failed" }, { status: 500 });
  }
}
