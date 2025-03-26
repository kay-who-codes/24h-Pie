document.addEventListener('DOMContentLoaded', function() {
    // Initialize Chart
    const ctx = document.getElementById('pieChart').getContext('2d');
    let pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Sleeping', 'Working', 'Traveling', 'Having Fun', 'Other'],
            datasets: [{
                data: [480, 480, 40, 120, 140], // Initial values in minutes (8h, 8h, 40m, 2h, 2h20m)
                backgroundColor: [
                    '#4e79a7',
                    '#f28e2b',
                    '#e15759',
                    '#76b7b2',
                    '#59a14f'
                ],
                borderWidth: 1,
                borderColor: '#333'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e0e0e0',
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });

    // Get all input elements
    const inputs = document.querySelectorAll('input');
    
    // Add event listeners to all inputs
    inputs.forEach(input => {
        input.addEventListener('input', updateChart);
    });

    // Initial update
    updateChart();

    function updateChart() {
        let totalMinutes = 24 * 60; // 24 hours in minutes
        let enteredMinutes = 0;
        
        // Get values from all inputs and convert to minutes
        const activities = ['sleeping', 'working', 'traveling', 'fun'];
        let minutesData = [];
        
        activities.forEach(activity => {
            const input = document.getElementById(activity);
            const value = input.value.trim();
            let minutes = 0;
            
            // Parse the input value (supports h, m, or just numbers)
            if (value.includes('h')) {
                minutes = parseFloat(value.replace('h', '')) * 60;
            } else if (value.includes('m')) {
                minutes = parseFloat(value.replace('m', ''));
            } else if (!isNaN(value)) {
                // If just a number, assume it's hours
                minutes = parseFloat(value) * 60;
            }
            
            // If parsing failed, use the data-minutes attribute as fallback
            if (isNaN(minutes)) {
                minutes = parseFloat(input.getAttribute('data-minutes')) || 0;
            }
            
            minutesData.push(minutes);
            enteredMinutes += minutes;
        });
        
        // Calculate "Other" time
        const otherMinutes = Math.max(0, totalMinutes - enteredMinutes);
        minutesData.push(otherMinutes);
        
        // Update chart data
        pieChart.data.datasets[0].data = minutesData;
        pieChart.update();
        
        // Calculate and update percentages
        const percentages = minutesData.map(min => ((min / totalMinutes) * 100).toFixed(2));
        
        document.getElementById('sleep-percent').textContent = `${percentages[0]}%`;
        document.getElementById('work-percent').textContent = `${percentages[1]}%`;
        document.getElementById('travel-percent').textContent = `${percentages[2]}%`;
        document.getElementById('fun-percent').textContent = `${percentages[3]}%`;
        document.getElementById('other-percent').textContent = `${percentages[4]}%`;
        
        // Update data-minutes attributes for persistence
        document.getElementById('sleeping').setAttribute('data-minutes', minutesData[0]);
        document.getElementById('working').setAttribute('data-minutes', minutesData[1]);
        document.getElementById('traveling').setAttribute('data-minutes', minutesData[2]);
        document.getElementById('fun').setAttribute('data-minutes', minutesData[3]);
    }
});