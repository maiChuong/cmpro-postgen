---
layout: default
title: Visitor Insights Dashboard
permalink: /dashboard/
order: 3
---

<style>
  /* Basic styling for the dashboard cards and layout */
    main {
        padding: 0px 25px;
    }
  .dashboard-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin: 2em auto;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }

  .metric-card {
    padding: 1.5em;
    background: #fdfdfd;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    color: #333;
    border: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
  }

  .metric-card h2 {
    margin-top: 0;
    font-size: 1.2em;
    color: #1a5276;
    border-bottom: 2px solid #aed6f1;
    padding-bottom: 0.5em;
    margin-bottom: 1em;
  }

  .metric-card .value {
    font-size: 2em;
    margin: 0;
    font-weight: 600;
    color: #1f618d;
    line-height: 1.2;
  }

  .metric-card .label {
    font-size: 0.9em;
    color: #566573;
    font-weight: normal;
    margin-top: auto;
  }
  
  .unavailable-label {
    font-size: 0.7em;
    display: block;
    margin-top: 5px;
    font-style: italic;
  }

  #visitor-chart-container {
      margin-top: 2em;
  }
</style>

<h1>Visitor Insights Dashboard</h1>

<p>This dashboard provides an overview of visitor traffic to the <a href="https://maichuong.github.io/cmpro-postgen/" target="_blank" rel="noopener">cmpro-postgen</a> project page. The total visitor count is live, but detailed analytics require a more advanced service.</p>

<div class="dashboard-container">
  <div id="total-visitors-card" class="metric-card">
    <h2>👥 Total Visitors</h2>
    <p id="total-visitors" class="value">Loading...</p>
    <span class="label">All-time page views</span>
  </div>
  <div id="traffic-types-card" class="metric-card">
    <h2>🌐 Traffic Sources</h2>
    <p id="traffic-sources" class="value">N/A</p>
    <span class="label">Direct, Referral, Organic<span class="unavailable-label">A simple hit counter cannot provide this data.</span></span>
  </div>
  <div id="devices-card" class="metric-card">
    <h2>💻 Devices</h2>
    <p id="device-types" class="value">N/A</p>
    <span class="label">Desktop, Mobile<span class="unavailable-label">A simple hit counter cannot provide this data.</span></span>
  </div>
</div>

<div id="visitor-chart-container" class="metric-card">
  <h2>📈 Visitor Trend Over Time</h2>
  <p id="chart-status">A chart requires historical data (e.g., visitors per day), which is not available with a simple hit counter. A full analytics service would be needed to store and display this information.</p>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const namespace = 'maichuong.github.io';
    const key = 'cmpro-postgen';
    // This API call gets the current value of the counter.
    // Another script will be added later to increment the counter on each visit.
    const url = `https://api.countapi.xyz/get/${namespace}/${key}`;

    const totalVisitorsElem = document.getElementById('total-visitors');

    fetch(url)
        .then(res => res.json())
        .then(data => {
            // If the key has never been hit, data.value will be null.
            totalVisitorsElem.textContent = (data.value || 0).toLocaleString();
        })
        .catch(error => {
            console.error('Error fetching visitor count:', error);
            totalVisitorsElem.textContent = "Error";
            totalVisitorsElem.style.color = '#c0392b';
        });
});
</script>

