"use client";

import React, { useState, useEffect } from 'react';

/**
 * Formats a given total sales amount to a fixed decimal string, handling both number and string inputs.
 * @memberOf module:WhatSellsTogether
 * @param {number|string} totalSales - The total sales amount to format.
 * @returns {string} The formatted total sales amount, or 'N/A' if the input is invalid.
 */const formatTotalSales = (totalSales) => {
    if (typeof totalSales === 'number') {
        return totalSales.toFixed(2);
    } else if (typeof totalSales === 'string') {
        const parsed = parseFloat(totalSales);
        return isNaN(parsed) ? 'N/A' : parsed.toFixed(2);
    }
    return 'N/A'; // Return 'N/A' or some other placeholder if the value is not a number
};

/**
 * Fetches menu items from the backend and updates the state.
 * @memberOf module:WhatSellsTogether
 * @returns {JSON} An array of the menu items
 */
const getMenuItems = async () => {
    const items = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems");
    const data = await items.json();

    return data;
};


/**
 * Component for displaying and managing sales reports. It includes functionalities to fetch sales data,
 * generate sales reports, and filter reports based on specific menu items.
 * @module WhatSellsTogether
 */
export default function SalesReportPage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [hasFetched, setHasFetched] = useState(false);
    const [choice, setChoice] = useState("Select Menu Item")
    const [menuItems, setMenuItems] = useState([])

    /**
     * Fetches menu item data from the backend It sets various state
     * variables based on the response, such as report data, error messages, and loading state.
     * @memberOf module:WhatSellsTogether
     */
    const fetchMenuItems = async () => {
      try {
        const data = await getMenuItems();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    useEffect(() => {
        fetchMenuItems()
    }, [])

    /**
     * Fetches sales report data from the backend based on specified date ranges. It sets various state
     * variables based on the response, such as report data, error messages, and loading state.
     * @memberOf module:WhatSellsTogether
     */
    const fetchSalesReport = async () => {
        setLoading(true);
        setHasFetched(true); // Set to true when fetching
        setErrorMessage('');
        setSuccessMessage('');
        const object = JSON.stringify({
            "startDate": startDate,
            "endDate": endDate
        })
        try {
            const response = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/reports/whatSellsTogether", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: object
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.length === 0) {
                setErrorMessage('No entries found for the selected date range. Please try a different time range.');
            } else {
                setReportData(data);
                setSuccessMessage('What Sells Together Report generated successfully');
                setErrorMessage(''); // Clear error message if data is found
            }
        } catch (error) {
            console.error('Error fetching sales report:', error);
            setErrorMessage('Failed to fetch sales report. Please try again.');
        }
        setLoading(false);
    };


    /**
     * Handles the submission of the form to generate the sales report. Prevents the default form submission
     * behavior and triggers the report fetching.
     * @memberOf module:WhatSellsTogether
     * @param {Event} e - The event object associated with the form submission.
     */
    const handleGenerateReport = (e) => {
        e.preventDefault();
        fetchSalesReport();
    };

    return (
        <main className="min-h-screen bg-slate-100 flex flex-col" aria-labelledby="sales-report-title">
            <h1 className="text-4xl font-bold text-center mb-3 py-4">What Sells Together</h1>

            <div className="w-full max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
                <form onSubmit={handleGenerateReport} className="flex flex-col md:flex-row justify-between items-center my-4">
                    <input
                        data-testid = "start date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mb-2 p-2 w-1/5 md:mb-0 md:mr-2 border border-gray-500 bg-white rounded-md focus:outline-none"
                        required
                        aria-label="Start Date"
                    />
                    <input
                        data-testid = "end date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mb-2 p-2 w-1/5 md:mb-0 md:mr-2 border border-gray-500 bg-white rounded-md focus:outline-none"
                        required
                        aria-label="End Date"
                    />
                    <button type="submit" className="w-1/5 bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 font-semibold" disabled={loading}>
                        {loading ? 'Loading...' : 'Generate Report'}
                    </button>
                </form>
                <div className='flex flex-row gap-5'>
                <h1>Filter by item:</h1>
                <select name='menuItems' id='menuItemsSelect' className='mb-2' onChange={(e) => setChoice(e.target.value)}>
                <option>Select Menu Item</option>
                {menuItems.map((item,index) => ( 
                    <option key={item.menuid} value={item.itemname}>{item.itemname}</option> 
                    ))}
                </select>
                </div>
                <div className="text-center" aria-live="polite">
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}
                </div>
                {hasFetched && reportData.length === 0 && !loading && (
                    <p className="text-center text-red-500">No entries found for the selected date range. Please try a different time range.</p>
                )}
                {reportData.length > 0 && (
                    <div className="overflow-auto">
                        <table className="w-full table-auto border-collapse border border-gray-500">
                            <thead>
                                <tr>
                                    <th className="border border-gray-400 px-4 py-2">Item One Name</th>
                                    <th className="border border-gray-400 px-4 py-2">Item Two Name</th>
                                    <th className="border border-gray-400 px-4 py-2">Sales Including Both Items</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => (
                                    choice == "Select Menu Item" || item.m1name == choice 
                                     ?
                                        <tr key={index}>
                                        <td className="border border-gray-400 px-4 py-2">{item.m1name}</td>
                                        <td className="border border-gray-400 px-4 py-2">{item.m2name}</td>
                                        <td className="border border-gray-400 px-4 py-2">{(item.paircount)}</td>
                                    </tr>
                                    : choice == "Select Menu Item" || item.m2name == choice ?
                                        <tr key={index}>
                                        <td className="border border-gray-400 px-4 py-2">{item.m2name}</td>
                                        <td className="border border-gray-400 px-4 py-2">{item.m1name}</td>
                                        <td className="border border-gray-400 px-4 py-2">{(item.paircount)}</td>
                                        </tr>
                                    : <h1></h1>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}
