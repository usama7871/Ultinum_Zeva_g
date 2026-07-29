# Implementation Plan - Phase 2: Smart Cart & Customization State

## Objective
Implement a world-class, session-persistent cart system that handles complex item customizations and provides real-time feedback.

## Key Files & Context
- `context/CartContext.tsx`: (New) React Context for global cart state with `localStorage` persistence.
- `app/layout.tsx`: To be updated with `CartProvider`.
- `components/cart/CartDrawer.tsx`: (New/Refactor) Highly interactive slide-over for cart management.

## Implementation Steps

### 1. Cart Context Engine
- [x] Create `context/CartContext.tsx`:
    - Implement `addItem`, `removeItem`, `updateQuantity`, and `updateItemConfig`.
    - Logic for merging identical items (same size/spice/addons).
    - Session persistence via `localStorage`.
    - Real-time subtotal calculation using `catalog-engine`.

### 2. Global Integration
- [ ] Wrap the application in `CartProvider` within `app/layout.tsx`.

### 3. Tactile Cart UI (Next Turn)
- [ ] Build `components/cart/CartDrawer.tsx` (replacing the old `TastingBoxDrawer` logic).
- [ ] Add customization controls (size/spice) inside the cart.
- [ ] Implement the "Unlock Tracker" (e.g., Progress bar to free garlic bread).
- [ ] Add glassmorphic aesthetics and smooth exit/entrance animations.

## Verification & Testing
- [ ] Verify cart persistence after page reload.
- [ ] Test item merging logic with different configurations.
- [ ] Ensure subtotal updates instantly when changing sizes in cart.
