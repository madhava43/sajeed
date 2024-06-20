document.addEventListener('DOMContentLoaded', function () {
    const dailyReportButton = document.getElementById('daily-report');
    const monthlyReportButton = document.getElementById('monthly-report');
    const yearlyReportButton = document.getElementById('yearly-report');
    const reportResults = document.getElementById('report-results');
    const exportReportButton = document.getElementById('export-report');

    dailyReportButton.addEventListener('click', function () {
        const date = document.getElementById('report-date').value;
        if (!date) {
            alert("Please select a date for the daily report.");
            return;
        }
        fetchReport('daily', date);
    });

    monthlyReportButton.addEventListener('click', function () {
        const month = document.getElementById('report-month').value;
        if (!month) {
            alert("Please select a month for the monthly report.");
            return;
        }
        fetchReport('monthly', month);
    });

    yearlyReportButton.addEventListener('click', function () {
        const year = document.getElementById('report-year').value;
        if (!year) {
            alert("Please select a year for the yearly report.");
            return;
        }
        fetchReport('yearly', year);
    });

    async function fetchReport(reportType, date) {
        try {
            const response = await fetch(`http://localhost:3000/reports/${reportType}?date=${date}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const reportData = await response.json();
            displayReport(reportData);
        } catch (error) {
            console.error('Failed to fetch report:', error);
        }
    }

    function displayReport(data) {
        reportResults.innerHTML = `
            <h3>Report Results</h3>
            <p>Total Products Sold: ${data.totalProductsSold}</p>
            <p>Total Amount: $${data.totalAmount.toFixed(2)}</p>
            <table id="report-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity Sold</th>
                        <th>Total Sales</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.products.map(product => `
                        <tr>
                            <td>${product.name}</td>
                            <td>${product.quantity}</td>
                            <td>$${product.totalSales.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    exportReportButton.addEventListener('click', function () {
        exportTableToExcel('report-table', 'report');
    });

    function exportTableToExcel(tableID, filename = '') {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

        // Specify file name
        filename = filename ? filename + '.xls' : 'excel_data.xls';

        // Create download link element
        downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
    }
});
