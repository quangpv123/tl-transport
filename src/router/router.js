import { Route, Routes, Navigate } from "react-router-dom";
import Customers from "../customers/ListCustomers";
import InfoCustomer from "../infoCustomer/InfoCustomer";
import Items from "../infoCustomer/items/Items";
import PaymentHistory from "../infoCustomer/paymentHistory/PaymentHistory";
import Report from "../infoCustomer/report/Report";
import DebitHistory from "../infoCustomer/debitHistory/DebitHistory";
function RouteItems() {
    return (
        <Routes>
            <Route
                index
                element={<Customers />}
            />
            <Route
                path=":id"
                element={<InfoCustomer />}
            >
                <Route
                    index
                    element={<Navigate to={'items'} />}
                />
                <Route
                    path="items"
                    element={<Items />}
                />
                <Route
                    path="debit-histories"
                    element={<DebitHistory />}
                />
                <Route
                    path="payment-histories"
                    element={<PaymentHistory />}
                />
                <Route
                    path="report"
                    element={<Report />}
                />
               
            </Route>
        </Routes>
    );
}
export default RouteItems