Design a Tablet POS “Printer Settings” screen for a restaurant system.

IMPORTANT CONSTRAINTS:

This screen handles hardware management only.

DO NOT include printer routing, category assignment, auto-print settings, or receipt behavior configuration.

All business logic is handled in Backoffice.

The screen must include:

Printer List Section

Card layout

Each card shows:

Printer name

Connection type (LAN / Bluetooth)

IP address or Bluetooth ID

Status indicator (Connected / Offline / Connecting)

Action buttons:

Test Print

Rename

Reconnect

Remove

Add Printer Button

Prominent primary CTA at bottom.

Add Printer Flow:

Step 1: Select connection type (LAN / Bluetooth)

LAN Flow:

Auto-scan network printers

Manual IP input fallback

Connect button

Loading state

Success/error feedback

Bluetooth Flow:

Show available devices

Pair and connect

Handle Bluetooth disabled state

Empty State
If no printers:

Illustration

Title: “No printers connected”

CTA: Add Printer

Design Requirements:

Clean tablet-optimized UI

Large touch targets

Clear status color indicators

Operationally focused

Minimal technical complexity

Restaurant-grade reliability