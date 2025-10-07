let allSites = [];
const siteListContainer = document.getElementById('site-list-container');
const siteDetailsContainer = document.getElementById('site-details-container');
const searchInput = document.getElementById('site-search');
const searchContainer = document.getElementById('search-container');

// 1. Fetch the JSON data when the page loads
async function loadSites() {
    try {
        const response = await fetch('Sites.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allSites = await response.json();
        renderSiteList(allSites);
    } catch (error) {
        console.error("Could not load Sites.json:", error);
        siteListContainer.innerHTML = '<p>Error loading site data. Check console for details.</p>';
    }
}

// 2. Render the list of sites
function renderSiteList(sites) {
    siteDetailsContainer.classList.add('hidden');
    siteListContainer.innerHTML = ''; // Clear previous list

    if (sites.length === 0) {
        siteListContainer.innerHTML = '<p>No sites found matching your search.</p>';
        return;
    }

    sites.forEach(site => {
        const item = document.createElement('div');
        item.classList.add('list-item');
        // Data attributes store the full site object for easy access later
        item.dataset.siteId = site.Sites; 
        
        item.innerHTML = `
            <strong>${site.Sites} • ${site.City}</strong>
            <br> Devices: ${site.Devices}
        `;
        
        item.addEventListener('click', () => showSiteDetails(site));
        siteListContainer.appendChild(item);
    });
}

// 3. Auto-filtering based on 'Sites' column
function filterSites() {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Filter the list based on the 'Sites' column
    const filteredSites = allSites.filter(site => 
        site.Sites && site.Sites.toLowerCase().includes(searchTerm)
    );
    
    renderSiteList(filteredSites);
}

// 4. Show the details view when an item is clicked
function showSiteDetails(site) {
    // 1. HIDE the search bar
    searchContainer.classList.add('hidden'); 
    
    // Hide the list and show the details container
    siteListContainer.classList.add('hidden');
    siteDetailsContainer.classList.remove('hidden');

    // Generate the Google Maps URL
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${site.Latitude},${site.Logitude}`;

    siteDetailsContainer.innerHTML = `
        <button class="close-button" onclick="goBackToList()">&times;</button>
        
        <h2>Details for ${site.Sites}</h2>
        <div class="detail-item"><strong>Site:</strong> ${site.Sites}</div>
        <div class="detail-item"><strong>Name:</strong> ${site.Name}</div>
        <div class="detail-item"><strong>Address:</strong> ${site.Address}</div>
        <a href="${mapsUrl}" target="_blank" class="map-button">Open Google Maps</a>
        
        <div class="detail-item"><strong>Devices:<br></strong> ${site.Devices.replace(/\n/g, '<br>')}</div>
        
        <div class="detail-item"><strong>Other Details:<br></strong> ${site['Other Details'].replace(/\n/g, '<br>')}</div>
        
        <div class="detail-item"><strong>Coordinates:</strong> ${site.Latitude}, ${site.Logitude}</div>
        
        <button onclick="goBackToList()" class="map-button" style="background-color: #6c757d;">Back to List</button>
    `;
}

// 5. Go back to the main list view
function goBackToList() {
    // 2. SHOW the search bar
    searchContainer.classList.remove('hidden'); 
    
    siteDetailsContainer.classList.add('hidden');
    siteListContainer.classList.remove('hidden');
    // Re-render the list based on the current search term, in case it was filtered
    filterSites(); 
}

// Initialize listeners
function init() {
    // Set up the auto-filter listener (fires on every keystroke)
    searchInput.addEventListener('input', filterSites); 

    // Load the data
    loadSites();
}

// Start the application
init();