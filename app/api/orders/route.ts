import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedAccount } from "@/lib/auth";
import { calculateItemPrice } from "@/lib/catalog-engine";
import { CartItem, OrderStatus } from "@/types/soup";

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
    const body = await req.json();
    const { items, customerName, email, shippingAddress, subtotal, tax, shippingFee, grandTotal } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    // Create order in database
    // Note: We'll need to update the Prisma schema eventually to support these rich fields.
    // For now, we'll store JSON in a string field or use the existing schema if possible.
    const newOrder = await db.order.create({
      data: {
        userId: account?.id,
        customerName: customerName || "Guest",
        email: email || "guest@example.com",
        shippingAddress: shippingAddress || "Default Address",
        totalPrice: grandTotal,
        boxSize: "Custom Curation", // Legacy field
        items: {
          create: items.map((item: CartItem) => ({
            flavorName: `${item.productId} (${item.size})`, // Store config in name for now
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Failed to place order:", error);
    return NextResponse.json({ success: false, error: "Order failed" }, { status: 500 });
  }
}
