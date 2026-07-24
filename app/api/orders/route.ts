import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedAccount } from "@/lib/auth";
import { BOX_CAPACITY, BOX_PRICES, BROTH_CATALOG, getCatalogItem } from "@/lib/catalog";

export async function GET() {
  try {
    const account = await getAuthenticatedAccount();

    const orders = await db.order.findMany({
      where: account ? { userId: account.id } : { userId: null },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { success: false, error: "Order history is temporarily unavailable" },
      { status: 503 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, email, boxSize: requestedBoxSize, shippingAddress, items } = body;

    if (!customerName || !email || !requestedBoxSize || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: "Missing required order fields" },
        { status: 400 }
      );
    }

    if (requestedBoxSize !== "4-pack" && requestedBoxSize !== "8-pack") {
      return NextResponse.json({ success: false, error: "Invalid box size" }, { status: 400 });
    }
    const boxSize: "4-pack" | "8-pack" = requestedBoxSize;

    const normalizedItems = items
      .map((item: { flavorId?: string; flavorName?: string; quantity?: number }) => {
        const flavor = item.flavorId ? getCatalogItem(item.flavorId) : undefined;
        const catalogFlavor = flavor ?? (item.flavorName ? BROTH_CATALOG.find((candidate) => candidate.name === item.flavorName) : undefined);
        const quantity = Number(item.quantity);
        return catalogFlavor && Number.isInteger(quantity) && quantity > 0
          ? { flavorId: catalogFlavor.id, flavorName: catalogFlavor.name, quantity }
          : null;
      })
      .filter((item): item is { flavorId: string; flavorName: string; quantity: number } => item !== null);

    const totalJars = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
    if (normalizedItems.length === 0 || totalJars > BOX_CAPACITY[boxSize]) {
      return NextResponse.json({ success: false, error: "Select a valid number of jars for this box" }, { status: 400 });
    }

    const account = await getAuthenticatedAccount();
    const serverTotalPrice = BOX_PRICES[boxSize];

    // Try creating order in database
    try {
      const newOrder = await db.order.create({
        data: {
          customerName,
          email,
          boxSize,
          totalPrice: serverTotalPrice,
          shippingAddress: shippingAddress || "Express Temperature Controlled Delivery",
          ...(account ? { userId: account.id } : {}),
          items: {
            create: normalizedItems.map((item) => ({
              flavorName: item.flavorName,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      return NextResponse.json({ success: true, order: newOrder });
    } catch (error) {
      console.error("Failed to persist order:", error);
      return NextResponse.json(
        { success: false, error: "Your order could not be saved. Please try again." },
        { status: 503 },
      );
    }
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { success: false, error: "Server error processing order" },
      { status: 500 }
    );
  }
}
