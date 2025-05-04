document.addEventListener('DOMContentLoaded', function() {
    // Update time and date
    function updateDateTime() {
        const now = new Date();
        const timeDisplay = document.getElementById('time-display');
        const dateDisplay = document.getElementById('date-display');
        
        // Format time (HH:MM AM/PM)
        let hours = now.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes} ${ampm}`;
        
        // Format date (Day, Month Date)
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        dateDisplay.textContent = now.toLocaleDateString('en-US', options);
    }
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Dock item click handlers
    const dockItems = document.querySelectorAll('.dock-item');

    dockItems.forEach(item => {
        item.addEventListener('click', function() {
            const app = this.getAttribute('data-app');
            console.log(app);
            if (app === 'launchpad') {  // Changed from 'launch-pad' to 'launchpad'
                return;
            } else {
                openApp(app);
            }
            
            // Update active state
            dockItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Window management
    let zIndex = 100;
    let map = null;
    
    function openApp(app) {
        const windowContainer = document.getElementById('window-container');
        
        // Create new window
        const window = document.createElement('div');
        window.className = 'window active window-open';
        window.setAttribute('data-app', app);
        window.style.zIndex = zIndex++;
        
        // Window header
        const header = document.createElement('div');
        header.className = 'window-header';
        
        const controls = document.createElement('div');
        controls.className = 'window-controls';
        
        const closeBtn = document.createElement('div');
        closeBtn.className = 'window-control close';
        closeBtn.addEventListener('click', () => {
            window.classList.remove('active');
            setTimeout(() => {
                window.remove();
                if (app === 'maps' && map) {
                    map.remove();
                    map = null;
                }
            }, 200);
            document.querySelector(`.dock-item[data-app="${app}"]`).classList.remove('active');
        });
        
        const minimizeBtn = document.createElement('div');
        minimizeBtn.className = 'window-control minimize';
        minimizeBtn.addEventListener('click', () => {
            window.classList.remove('active');
            document.querySelector(`.dock-item[data-app="${app}"]`).classList.remove('active');
        });
        
        const maximizeBtn = document.createElement('div');
        maximizeBtn.className = 'window-control maximize';
        maximizeBtn.addEventListener('click', () => {
            window.classList.toggle('maximized');
            if (window.classList.contains('maximized')) {
                window.style.width = 'calc(100% - 20px)';
                window.style.height = 'calc(100% - 45px)';
                window.style.top = '10px';
                window.style.left = '10px';
            } else {
                window.style.width = '';
                window.style.height = '';
                window.style.top = '';
                window.style.left = '';
            }
        });
        
        controls.appendChild(closeBtn);
        controls.appendChild(minimizeBtn);
        controls.appendChild(maximizeBtn);
        
        const title = document.createElement('div');
        title.className = 'window-title';
        title.textContent = app.charAt(0).toUpperCase() + app.slice(1);
        
        header.appendChild(controls);
        header.appendChild(title);
        
        // Window content
        const content = document.createElement('div');
        content.className = 'window-content';
        
        // App-specific content
        switch(app) {
            case 'calculator':
                createCalculator(content);
                break;
            case 'notes':
                createNotes(content);
                break;
            case 'finder':
                createFinder(content);
                break;
            case 'maps':
                createMaps(content);
                break;
            case 'appstore':
                createAppStore(content);
                break;
            case 'safari':
                createSafari(content);
                break;
            case 'terminal':
                makeBasicTerminal(content);
                break;
// Add more cases for other apps
        }
        
        window.appendChild(header);
        window.appendChild(content);
        windowContainer.appendChild(window);
        
        // Make draggable
        makeDraggable(window, header);
    }
    
      
    function bringToFront(element) {
        element.style.zIndex = zIndex++;
    }
    
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        handle.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            
            bringToFront(element);
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Set the element's new position
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    // App-specific content creators
    function createCalculator(container) {
        container.innerHTML = `
        <div class="calculator">
            <div class="calculator-display" id="calc-display">0</div>
            <button class="calculator-btn" onclick="calcClear()">AC</button>
            <button class="calculator-btn" onclick="calcOperation('+/-')">+/-</button>
            <button class="calculator-btn" onclick="calcOperation('%')">%</button>
            <button class="calculator-btn operator" onclick="calcOperation('/')">÷</button>
            <button class="calculator-btn" onclick="calcNumber(7)">7</button>
            <button class="calculator-btn" onclick="calcNumber(8)">8</button>
            <button class="calculator-btn" onclick="calcNumber(9)">9</button>
            <button class="calculator-btn operator" onclick="calcOperation('*')">×</button>
            <button class="calculator-btn" onclick="calcNumber(4)">4</button>
            <button class="calculator-btn" onclick="calcNumber(5)">5</button>
            <button class="calculator-btn" onclick="calcNumber(6)">6</button>
            <button class="calculator-btn operator" onclick="calcOperation('-')">-</button>
            <button class="calculator-btn" onclick="calcNumber(1)">1</button>
            <button class="calculator-btn" onclick="calcNumber(2)">2</button>
            <button class="calculator-btn" onclick="calcNumber(3)">3</button>
            <button class="calculator-btn operator" onclick="calcOperation('+')">+</button>
            <button class="calculator-btn zero" onclick="calcNumber(0)">0</button>
            <button class="calculator-btn" onclick="calcNumber('.')">.</button>
            <button class="calculator-btn operator" onclick="calcEquals()">=</button>
        </div>`;
    }

    function createNotes(container) {
        container.innerHTML = `
            <div class="notes-app">
                <div class="notes-toolbar">
                    <button onclick="formatText('bold')"><i class="fas fa-bold"></i></button>
                    <button onclick="formatText('italic')"><i class="fas fa-italic"></i></button>
                    <button onclick="formatText('underline')"><i class="fas fa-underline"></i></button>
                </div>
                <div class="notes-content" contenteditable="true" id="notes-editor">
                    Start typing your notes here...
                </div>
            </div>`;
    }

    function createFinder(container) {
        container.innerHTML = `
            <div class="finder">
                <div class="finder-sidebar">
                    <div class="finder-item active">
                        <i class="fas fa-house"></i>
                        <span>Home</span>
                    </div>
                    <div class="finder-item">
                        <i class="fas fa-desktop"></i>
                        <span>Desktop</span>
                    </div>
                    <div class="finder-item">
                        <i class="fas fa-download"></i>
                        <span>Downloads</span>
                    </div>
                    <div class="finder-item">
                        <i class="fas fa-image"></i>
                        <span>Pictures</span>
                    </div>
                    <div class="finder-item">
                        <i class="fas fa-music"></i>
                        <span>Music</span>
                    </div>
                    <div class="finder-item">
                        <i class="fas fa-file"></i>
                        <span>Documents</span>
                    </div>
                </div>
                <div class="finder-content">
                <div class="folder-tile">
                <img src="/os_interface/icon/dock/folder.png" alt="folder"/>
                <span>Home</span>
                    </div>
                    <div class="folder-tile">
                   <img src="/os_interface/icon/dock/folder.png" alt="folder"/>
                   <span>Desktop</span>
                    </div>
                    <div class="folder-tile">
                   <img src="/os_interface/icon/dock/folder.png" alt="folder"/>
                    <span>Personals</span>
                    </div>
                    <div class="folder-tile">
                   <img src="/os_interface/icon/dock/folder.png" alt="folder"/>
                    <span>Bin</span>
                    </div>
                </div>
            </div>`;
    }

    //did yousing online sorces
    function createMaps(container) {
        // Load Leaflet CSS
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css';
        document.head.appendChild(leafletCSS);
    
        // Load Leaflet JS
        const leafletJS = document.createElement('script');
        leafletJS.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
        
        leafletJS.onload = function() {
            // Create map container with explicit height
            container.innerHTML = `<div id="map" style="height: 400px;width:800px"></div>`;
            
            // Initialize map
            const map = L.map('map').setView([51.505, -0.09], 13);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Add marker
            L.marker([51.5, -0.09])
                .addTo(map)
                .bindPopup('A sample location in London.')
                .openPopup();
        };
        
        document.head.appendChild(leafletJS);
    }

    //fucntion to create an appstore
    function createAppStore(container) {
        // Clear container and add app store structure
        container.innerHTML = `
            <div class="app-store">
                <div class="app-store-header">
                    <div class="search-bar">
                        <input type="text" placeholder="Search the App Store...">
                        <button class="search-button">Search</button>
                    </div>
                    <div class="categories">
                        <button class="category active">Featured</button>
                        <button class="category">Categories</button>
                        <button class="category">Top Charts</button>
                        <button class="category">Updates</button>
                    </div>
                </div>
                <div class="app-grid">
                    <!-- Apps will be loaded here -->
                </div>
            </div>
        `;

        const apps = [
            {
                "name": "Music",
                "image": "/os_interface/icon/dock/music.png",
                "description": "This is a muci player",
                "rating": 4.5,
                "appPrice": "3.99$"
            },
            {
                "name": "Calendar",
                "image": "/os_interface/icon/dock/calendar.png",
                "description": "a calendar app",
                "rating": 4.5,
                "appPrice": "0.99$"
            },
            {
                "name": "Mails",
                "image": "/os_interface/icon/dock/mail.png",
                "description": "Connect with people",
                "rating": 4.5,
                "appPrice": "5.99$"
            },
            {
                "name": "Photos",
                "image": "/os_interface/icon/dock/photos.png",
                "description": "Store your memories",
                "rating": 3.4,
                "appPrice": "1.99$"
            },
            {
                "name": "Reminders",
                "image": "/os_interface/icon/dock/reminders.png",
                "description": "Donot forget",
                "rating": 4.0,
                "appPrice": "0.99$"
            },
            {
                "name": "Vs Code",
                "image": "/os_interface/icon/dock/vscode.svg",
                "description": "Create, code, communicate",
                "rating": 4.7,
                "appPrice": "0.00$"
            }
        ]
        const appGrid = container.querySelector(".app-grid");
        apps.forEach(app => {
            const appElement = document.createElement("div");
            appElement.className = 'app-card';
            appElement.innerHTML = `
            <img src="${app.image}" alt="${app.description}">
            <div class="app-info">
                <h3>${app.name}</h3>
                <p>${app.rating}"</p>
                    <button class="download-btn">${app.appPrice}</button>
            </div>`;
            appGrid.appendChild(appElement);
        });
    }

    function createSafari(container){
        container.innerHTML = `
        <div class="safari-browser">
            <div class="toolbar">
                <div class="navigation-buttons">
                    <button class="nav-btn back" title="Back">←</button>
                    <button class="nav-btn forward" title="Forward">→</button>
                    <button class="nav-btn refresh" title="Refresh">↻</button>
                </div>
                <div class="address-bar">
                    <input type="text" placeholder="Search or enter website name" value="https://www.google.com">
                    <button class="go-btn">Go</button>
                </div>
                <div class="extras">
                    <button class="share-btn" title="Share">↑</button>
                    <button class="bookmarks-btn" title="Bookmarks">☆</button>
                </div>
            </div>
            <div class="tab-bar">
                <div class="tab active" data-url="https://www.google.com">
                    <span>Google</span>
                    <button class="close-tab">×</button>
                </div>
                <button class="new-tab">+</button>
            </div>
            <div class="browser-content">
                <iframe src="https://www.w3schools.com/" class="active-tab"></iframe>
            </div>
            <div class="status-bar">
                <span class="status-text">Connected</span>
            </div>
        </div>
    `;   
}

function makeBasicTerminal(container) {
    // Create terminal content structure
    container.innerHTML = `
        <div class="terminal-content">
            <div class="terminal-output" id="terminal-output">
                <div class="welcome-message">
                    Last login: ${new Date().toString()}<br>
                    Type 'help' for available commands
                </div>
            </div>
            <div class="terminal-input-line">
                <span class="prompt">$</span>
                <input type="text" id="terminal-command" autofocus>
            </div>
        </div>
    `;

    // Available commands
    const commands = {
        help: {
            desc: "Show available commands",
            execute: () => {
                let output = "Available commands:\n";
                for (const entry of Object.entries(commands)) {
                    const cmd = entry[0];
                    const desc = entry[1].desc;
                    output += `${cmd.padEnd(10)}${desc}\n`;
                }
                return output;
            }
        },
        clear: {
            desc: "Clear terminal screen",
            execute: () => {
                document.getElementById('terminal-output').innerHTML = '';
                return '';
            }
        },
        ls: {
            desc: "List directory contents",
            execute: () => "Desktop    Documents    Downloads    Pictures"
        },
        date: {
            desc: "Show current date/time",
            execute: () => new Date().toString()
        },
        echo: {
            desc: "Display message",
            execute: (text) => text.join(' ')
        },
        exit:{
            desc: "Exit the terminal",
            execute: () => {
               
            }
        }
    };

    // Handle command input
    const commandInput = container.querySelector('#terminal-command');
    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = commandInput.value.trim();
            commandInput.value = '';
            
            // Display command
            addLine(`$ ${input}`, 'command');
            
            // Process command
            const [cmd, ...args] = input.split(' ');
           if(commands[cmd]){
            const output = commands[cmd].execute(args);
            if(output)addLine(output);
           }else{
            addLine('Command Not found:' ,"error");
           }
            
            // Auto-scroll
            container.scrollTop = container.scrollHeight;
        }
    });

    // Helper to add lines to terminal
    function addLine(text, type = 'output') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        document.getElementById('terminal-output').appendChild(line);
    }

    // Focus input when clicking terminal
    container.addEventListener('click', () => {
        commandInput.focus();
    });
}
    
});

// Calculator functions (global scope)
let calculatorState = {
    currentInput: '0',
    previousInput: '',
    operation: null,
    resetInput: false
};

function calcNumber(number) {
    const { currentInput, resetInput } = calculatorState;
    
    if (currentInput === '0' || resetInput) {
        calculatorState.currentInput = number.toString();
        calculatorState.resetInput = false;
    } else {
        calculatorState.currentInput += number.toString();
    }
    updateDisplay();
}

function calcOperation(op) {
    const { currentInput, previousInput, operation } = calculatorState;
    
    if (op === '%') {
        calculatorState.currentInput = (parseFloat(currentInput) / 100).toString();
        updateDisplay();
        return;
    }
    
    if (currentInput !== '0') {
        calculatorState.resetInput = true;
        if (previousInput !== '' && operation !== null) {
            calcEquals();
        }
        calculatorState.previousInput = calculatorState.currentInput;
        calculatorState.operation = op;
    }
}

function calcEquals() {
    const { currentInput, previousInput, operation } = calculatorState;
    
    if (operation === null || previousInput === '') return;
    
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            computation = prev / current;
            break;
        default:
            return;
    }
    
    calculatorState.currentInput = computation.toString();
    calculatorState.operation = null;
    calculatorState.resetInput = true;
    updateDisplay();
}

function calcClear() {
    calculatorState = {
        currentInput: '0',
        previousInput: '',
        operation: null,
        resetInput: false
    };
    updateDisplay();
}

function updateDisplay() {
    const display = document.getElementById('calc-display');
    if (display) {
        display.textContent = calculatorState.currentInput;
    }
}
