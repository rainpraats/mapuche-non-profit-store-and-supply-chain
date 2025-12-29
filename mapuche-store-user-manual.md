# User Manual: Mapuche Community Store & Supply Chain Management System

Welcome to the **Mapuche Non-Profit Store** application. This platform digitizes the supply chain—from the farmer's harvest to the final sale—ensuring transparency and reducing administrative work for our volunteers.

---

## 1. Getting Started

### Access and Login

1. Open the application in your web browser.
2. Enter your assigned **Username** and **Password**.
3. Click **Login**.
4. Once authenticated, you will be directed to the **Home Page** dashboard.

> Please note that your access to specific features (like Admin settings or Order management) depends on your assigned role: **Admin, Volunteer, Supplier, Delivery Driver, or Customer.**

---

## 2. Navigation Overview

The application is organized into different features accessible via the navigation bar:

- **Home:** Here you can navigate to the different pages on the application.
- **Orders:** Add new orders and manage existing ones.
- **Stock:** Lists the current inventory of the store.
- **Users:** Administration of community members and staff roles.
- **Settings:** Personal account information and the option to delete your account.

---

## 3. Supply Chain Management (Orders)

The system uses an immutable ledger to track goods.

### Creating an Order (Volunteers/Admins)

1. Navigate to the **Orders** page.
2. Click **Create New Order**.
3. Select the **Supplier**, the **Delivery Driver**, and the items required (e.g., Oats).
4. Set a **Due Date** and click **Submit**.

### The Transfer Process

- **Suppliers:** Log in to your dashboard to **Accept** or **Decline** requests.
- **Pick-up:** When the driver meets the supplier, the driver scans the suppliers's QR code and inspects the order. If everything is in order they press verify order to mark the shipment as "Shipped."
- **Drop-off:** When the driver arrives at the store, the Volunteer scans the driver's QR code. This action **automatically moves the items into the Store Stock**.

---

## 4. Inventory Control (Stock)

The **Stock** page provides a live view of all items currently in the store.

Stock levels are updated automatically by deliveries and sales, removing the need for manual inventory counting.

---

## 5. Member & User Management

### Adding New Members

1. Go to the **Users** page.
2. Enter the name, role, and initial password.
3. Click **Add User**.
4. **Note:** Names are stored in a private database (MongoDB), while a secure hash is stored on the blockchain to protect member identities.

Editing and deleteing users can be done by finding the user in the list of users and pressing the edit or delete buttons next to their account.

### Editing Members

While editing you have the option to assign a user a new password. If no password is entered then the original password will not be changed.

---

## 6. Making a Sale (Shopping Cart)

### Identity Verification

Because the store limits who can buy goods, Volunteers must verify a customer's physical ID against the name listed in the system before confirming any trade.

### For Customers

1. Go to the **Shopping Cart** page.
2. Use your device camera to scan the QR codes on the physical food packages.
3. Review your items and click **Checkout**.
4. A **Personal QR Code** will be generated on your screen.

### For Volunteers

1. On your dashboard, select **Scan Customer Cart**.
2. Scan the customer’s screen.
3. Verify their physical ID.
4. Confirm the transaction to finalize the sale and update the blockchain inventory.

---

## 7. Troubleshooting

| Issue                                   | Solution                                                                           |
| :-------------------------------------- | :--------------------------------------------------------------------------------- |
| **Login Failed**                        | Check Caps Lock. Contact an Admin to reset your password if you are locked out.    |
| **QR Code won't scan**                  | Increase screen brightness on the phone and clean the camera lens.                 |
| **Missing Stock**                       | Ensure the QR code was scanned upon delivery otherwise the stock wont get updated. |
| **Message saying something went wrong** | The backend may be offline. Wait a moment and refresh, or contact a technician.    |

---
