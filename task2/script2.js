 // Time tracking variables
        let totalMilliseconds = 0;
        let timerRunning = false;
        let intervalId = null;
        let lapNumber = 0;

        // Start button handler
        function handleStart() {
            if (timerRunning) return;
            
            timerRunning = true;
            intervalId = setInterval(tick, 10);
            
            document.getElementById('btnStart').disabled = true;
            document.getElementById('btnPause').disabled = false;
            document.getElementById('btnLap').disabled = false;
        }

        // Pause button handler
        function handlePause() {
            if (!timerRunning) return;
            
            timerRunning = false;
            clearInterval(intervalId);
            
            document.getElementById('btnStart').disabled = false;
            document.getElementById('btnPause').disabled = true;
        }

        // Reset button handler
        function handleReset() {
            timerRunning = false;
            clearInterval(intervalId);
            totalMilliseconds = 0;
            lapNumber = 0;
            
            updateDisplay();
            
            document.getElementById('btnStart').disabled = false;
            document.getElementById('btnPause').disabled = true;
            document.getElementById('btnLap').disabled = true;
            document.getElementById('lapsDisplay').innerHTML = '<div class="no-data">No laps yet</div>';
        }

        // Lap button handler
        function handleLap() {
            if (!timerRunning) return;
            
            lapNumber++;
            let currentTime = formatTime(totalMilliseconds);
            let lapsContainer = document.getElementById('lapsDisplay');
            
            if (lapNumber === 1) {
                lapsContainer.innerHTML = '';
            }
            
            let newLap = document.createElement('div');
            newLap.className = 'lap-entry';
            newLap.innerHTML = '<span class="lap-label">Lap ' + lapNumber + '</span><span class="lap-value">' + currentTime + '</span>';
            
            lapsContainer.insertBefore(newLap, lapsContainer.firstChild);
        }

        // Timer tick function (runs every 10ms)
        function tick() {
            totalMilliseconds += 10;
            updateDisplay();
        }

        // Update the display
        function updateDisplay() {
            document.getElementById('timeDisplay').textContent = formatTime(totalMilliseconds);
        }

        // Format milliseconds to HH:MM:SS.MS
        function formatTime(ms) {
            let h = Math.floor(ms / 3600000);
            let m = Math.floor((ms % 3600000) / 60000);
            let s = Math.floor((ms % 60000) / 1000);
            let milli = Math.floor((ms % 1000) / 10);
            
            return pad(h) + ':' + pad(m) + ':' + pad(s) + '.' + pad(milli);
        }

        // Add leading zero if needed
        function pad(num) {
            return num < 10 ? '0' + num : num;
        }
