document.addEventListener('DOMContentLoaded', function() {
    // Initialize Chart
    const ctx = document.getElementById('pieChart').getContext('2d');
    let pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Sleeping: 8h', 'Working: 8h', 'Traveling: 40m', 'Having Fun: 2h', 'Other: 2h 20m'],
            datasets: [{
                data: [480, 480, 40, 120, 140],
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
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const hours = Math.floor(value / 60);
                            const minutes = value % 60;
                            let timeString = '';
                            
                            if (hours > 0) timeString += `${hours}h `;
                            if (minutes > 0 || hours === 0) timeString += `${minutes}m`;
                            
                            return `${label}: ${timeString.trim()} (${((value / (24*60)) * 100).toFixed(1)}%)`;
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

    function minutesToTimeString(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        let timeString = '';
        
        if (hours > 0) timeString += `${hours}h`;
        if (mins > 0) {
            if (hours > 0) timeString += ' ';
            timeString += `${mins}m`;
        }
        
        return timeString || '0m';
    }

    function updateChart() {
        let totalMinutes = 24 * 60;
        let enteredMinutes = 0;
        
        const activities = ['sleeping', 'working', 'traveling', 'fun'];
        let minutesData = [];
        let timeStrings = [];
        
        activities.forEach(activity => {
            const input = document.getElementById(activity);
            const value = input.value.trim();
            let minutes = 0;
            
            // Parse the input value
            if (value.includes('h')) {
                const hours = parseFloat(value.replace(/h.*/, '')) || 0;
                const minsPart = value.includes('m') ? value.replace(/.*h/, '') : '0m';
                const mins = parseFloat(minsPart.replace('m', '')) || 0;
                minutes = hours * 60 + mins;
            } else if (value.includes('m')) {
                minutes = parseFloat(value.replace('m', '')) || 0;
            } else if (!isNaN(value)) {
                minutes = parseFloat(value) * 60;
            }
            
            if (isNaN(minutes)) {
                minutes = parseFloat(input.getAttribute('data-minutes')) || 0;
            }
            
            minutesData.push(minutes);
            enteredMinutes += minutes;
            
            // Store the formatted time string
            timeStrings.push(minutesToTimeString(minutes));
        });
        
        // Calculate "Other" time
        const otherMinutes = Math.max(0, totalMinutes - enteredMinutes);
        minutesData.push(otherMinutes);
        timeStrings.push(minutesToTimeString(otherMinutes));
        
        // Update chart data and labels
        pieChart.data.datasets[0].data = minutesData;
        pieChart.data.labels = [
            `Sleeping: ${timeStrings[0]}`,
            `Working: ${timeStrings[1]}`,
            `Traveling: ${timeStrings[2]}`,
            `Having Fun: ${timeStrings[3]}`,
            `Other: ${timeStrings[4]}`
        ];
        pieChart.update();
        
        // Calculate and update percentages
        const percentages = minutesData.map(min => ((min / totalMinutes) * 100).toFixed(2));
        
        document.getElementById('sleep-percent').textContent = `${percentages[0]}%`;
        document.getElementById('work-percent').textContent = `${percentages[1]}%`;
        document.getElementById('travel-percent').textContent = `${percentages[2]}%`;
        document.getElementById('fun-percent').textContent = `${percentages[3]}%`;
        document.getElementById('other-percent').textContent = `${percentages[4]}%`;
        
        // Update data-minutes attributes
        document.getElementById('sleeping').setAttribute('data-minutes', minutesData[0]);
        document.getElementById('working').setAttribute('data-minutes', minutesData[1]);
        document.getElementById('traveling').setAttribute('data-minutes', minutesData[2]);
        document.getElementById('fun').setAttribute('data-minutes', minutesData[3]);
    }
});
