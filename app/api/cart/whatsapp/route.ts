import { NextResponse } from "next/server";
import { ADD_ONS, calculateItemPrice, getProduct } from "@/lib/catalog-engine";
import type { PortionSize, SpiceLevel, SoupAddOn } from "@/types/soup";

const WHATSAPP_NUMBER = "923154996438";
const VALID_SIZES: PortionSize[] = ["BOWL_8OZ", "BOWL_16OZ", "FAMILY_32OZ"];
const VALID_SPICE_LEVELS: SpiceLevel[] = ["Mild", "Medium", "Hot", "Chef Extra Spicy"];

interface CartPayloadItem {
  productId?: unknown;
  quantity?: unknown;
  size?: unknown;
  spiceLevel?: unknown;
  addOns?: unknown;
  specialInstructions?: unknown;
}

interface NormalizedCartItem {
  productName: string;
  quantity: number;
  size: PortionSize;
  spiceLevel?: SpiceLevel;
  addOns: SoupAddOn[];
  specialInstructions?: string;
  lineTotal: number;
}

function isPortionSize(value: unknown): value is PortionSize {
  return typeof value === "string" && VALID_SIZES.includes(value as PortionSize);
}

function isSpiceLevel(value: unknown): value is SpiceLevel {
  return typeof value === "string" && VALID_SPICE_LEVELS.includes(value as SpiceLevel);
}

function roundCurrency(value: number) {
  return Number(value.toFixed(2));
}

function buildWhatsAppUrl(items: NormalizedCartItem[], subtotal: number, shippingFee: number, grandTotal: number) {
  const message = [
    "ZEVA JEE G — NEW CART ORDER",
    "",
    "Items:",
    ...items.flatMap((item, index) => [
      String(index + 1) + ". " + item.productName + " × " + item.quantity + " (" + item.size.replace("BOWL_", "").replace("FAMILY_", "") + ")",
      item.spiceLevel ? "   Spice: " + item.spiceLevel : "",
      item.addOns.length > 0 ? "   Add-ons: " + item.addOns.map((addOn) => addOn.name).join(", ") : "",
      item.specialInstructions ? "   Note: " + item.specialInstructions : "",
      "   Line total: $" + item.lineTotal.toFixed(2),
    ].filter(Boolean)),
    "",
    "Subtotal: $" + subtotal.toFixed(2),
    "Shipping: " + (shippingFee === 0 ? "FREE" : "$" + shippingFee.toFixed(2)),
    "Grand Total: $" + grandTotal.toFixed(2),
    "",
    "Please confirm this order and share the expected dispatch time.",
  ].join("\n");

  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: unknown };

    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
      return NextResponse.json({ success: false, error: "Your cart is empty or invalid" }, { status: 400 });
    }

    const normalizedItems = (body.items as unknown[]).map((rawItem) => {
      const item = (rawItem ?? {}) as CartPayloadItem;
      const productId = typeof item.productId === "string" ? item.productId : "";
      const product = getProduct(productId);
      const size = item.size;
      const quantity = item.quantity;

      if (!product || !isPortionSize(size) || !product.availableSizes.includes(size) || !Number.isInteger(quantity) || (quantity as number) < 1 || (quantity as number) > 99) {
        return null;
      }

      const addOnIds = item.addOns === undefined ? [] : item.addOns;
      if (!Array.isArray(addOnIds) || !addOnIds.every((id) => typeof id === "string")) {
        return null;
      }

      const uniqueAddOnIds = [...new Set(addOnIds as string[])];
      if (uniqueAddOnIds.length !== addOnIds.length) {
        return null;
      }

      const addOns = uniqueAddOnIds.map((id) => ADD_ONS.find((addOn) => addOn.id === id));
      if (addOns.some((addOn) => !addOn)) {
        return null;
      }

      const spiceLevel = item.spiceLevel;
      if (spiceLevel !== undefined && (!product.allowSpiceCustomization || !isSpiceLevel(spiceLevel))) {
        return null;
      }

      const specialInstructions = item.specialInstructions;
      if (specialInstructions !== undefined && (typeof specialInstructions !== "string" || specialInstructions.length > 300)) {
        return null;
      }

      const trustedAddOns = addOns as SoupAddOn[];
      const trustedQuantity = quantity as number;
      return {
        productName: product.name,
        quantity: trustedQuantity,
        size,
        spiceLevel: spiceLevel as SpiceLevel | undefined,
        addOns: trustedAddOns,
        specialInstructions: specialInstructions as string | undefined,
        lineTotal: roundCurrency(calculateItemPrice(product.id, size, trustedAddOns) * trustedQuantity),
      } satisfies NormalizedCartItem;
    });

    if (normalizedItems.some((item) => item === null)) {
      return NextResponse.json({ success: false, error: "One or more cart items are invalid" }, { status: 400 });
    }

    const validItems = normalizedItems as NormalizedCartItem[];
    const subtotal = roundCurrency(validItems.reduce((sum, item) => sum + item.lineTotal, 0));
    const shippingFee = subtotal >= 100 ? 0 : 12;
    const grandTotal = roundCurrency(subtotal + shippingFee);

    return NextResponse.json({
      success: true,
      whatsappUrl: buildWhatsAppUrl(validItems, subtotal, shippingFee, grandTotal),
      totals: { subtotal, shippingFee, grandTotal },
    });
  } catch (error) {
    console.error("Failed to prepare cart WhatsApp checkout:", error);
    return NextResponse.json({ success: false, error: "We could not prepare your WhatsApp order" }, { status: 500 });
  }
}
