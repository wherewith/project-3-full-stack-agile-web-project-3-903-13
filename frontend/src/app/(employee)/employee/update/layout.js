import EmployeeNavbar from "@/components/EmployeeNavbar";
import "../../../globals.css";
import { TransactionProvider } from "@/components/transactions/TransactionContext";

export default function CategoryLayout({ children }) {
  return (
    <TransactionProvider>
    <>
    <EmployeeNavbar
        links={[
          { name: "Inventory", route: "/employee/manager/inventory" },
          { name: "Menu Items", route: "/employee/manager/menu-items" },
          { name: "Inventory Usage", route: "/employee/manager/inventory-usage" },
          { name: "Excess Report", route: "/employee/manager/excess-report" },
          { name: "Sales Report", route: "/employee/manager/sales-report" },
          { name: "Restock Report", route: "/employee/manager/restock-report" },
          { name: "What Sells Duo", route: "/employee/manager/what-sells-together" },
          { name: "Order Management", route: "/employee/manager/order-management" },
          { name: "Kitchen", route: "/employee/manager/kitchen" }

        ]}
      ></EmployeeNavbar>
      <main className="flex-1">{children}</main>
    </>
    </TransactionProvider>
  );
}