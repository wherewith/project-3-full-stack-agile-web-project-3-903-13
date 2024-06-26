/**
 * @module TransactionModal
 */
import React, { useState } from "react";
import Link from 'next/link'

/**
 * Component that provides a modal to display and manage details of a specific transaction.
 * It allows users to view transaction details such as items, quantity, cost, and status.
 * Users can also cancel in-progress transactions or navigate to update the transaction's details.
 *
 * @function TransactionModal
 * @memberOf module:TransactionModal
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to call to close the modal.
 * @param {Object} props.transaction - The transaction data for the modal to display.
 * @param {Array} props.alltransactionData - Array of all transactions data.
 * @param {function} props.setAllData - Function to update the state of all transactions data after modifications.
 * @returns {React.Component} A React component representing a modal window that displays and manages transaction details.
 */
export default function TransactionModal({ isOpen, onClose, transaction, alltransactionData, setAllData }) {
    const [deleteMessage, setDeleteMessage] = useState("");
    const [updateMessage, setUpdateMessage] = useState("");

    if (!isOpen) return null;

    /**
     * Handles the cancellation of the transaction.
     * Attempts to cancel the transaction by sending a PATCH request to the server.
     * If successful, the transaction is removed from the display list or all data is cleared if it's the last transaction.
     * @memberOf module:TransactionModal
     */
    const handleCancel = async () => {
        try {
            const response = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/transactions/cancelOrder", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ transactionID: transaction.transactionid })
            });
        }
        catch (error) {
            console.log(error)
        }

        if (alltransactionData.length === 1) {
            setAllData("");
        } else {
            const updatedData = alltransactionData.filter(item => item.transactionid !== transaction.transactionid);
            setAllData(updatedData);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative">
                <div className="bg-white p-12 rounded-lg shadow-lg">
                    <button
                        className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    <div className="w-96">

                        <div className="flex justify-between">
                            <h2 className="text-2xl font-bold mb-4">
                                Transaction Details
                            </h2>

                            {transaction.status === 'in progress' && (
                                <div className="font-semibold text-yellow-400 text-lg"> In Progress </div>
                            )}

                            {transaction.status === "fulfilled" && (
                                <div className="font-semibold text-green-500 text-lg"> Completed </div>
                            )}

                            {transaction.status === "cancelled" && (
                                <div className="font-semibold text-red-500 text-lg"> Cancelled </div>
                            )}

                        </div>


                        <div className="mt-5 flex justify-between">
                            <div className="text-lg font-bold"> Item </div>
                            <div className="text-lg font-bold"> Quantity </div>
                        </div>
                        {transaction.components.map((item, index) => (
                            <div className="mb-2">
                                <div key={index} className="flex justify-between">
                                    <div> {item.itemname}</div>
                                    <div> {item.quantity} </div>
                                </div>
                                {item.modif && item.modif.length > 0 && item.modif.split(',').map((modif, index) => (
                                    modif.length > 0 && <div key={index} className="text-sm"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{modif.trim()}</div>
                                ))}
                            </div>
                        ))}

                        <div className="my-5 flex justify-between">
                            <div className="text-lg font-bold"> Cost </div>
                            <div>{transaction.cost.toFixed(2)}</div>
                        </div>

                        {transaction.status === "in progress" && (
                            <div className="flex justify-between">
                                <button
                                    onClick={() => {
                                        handleCancel();
                                        console.log(alltransactionData)
                                        onClose();
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Cancel
                                </button>

                                <Link
                                    href={{
                                        pathname: '/employee/update',
                                        query: {
                                            'status': transaction.status,
                                            'id': transaction.transactionid
                                        }
                                    }}
                                >
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                        Update
                                    </button>
                                </Link>

                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
