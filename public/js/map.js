// Stop if map div not exists
const mapDiv = document.getElementById("map");
const mapMessage = document.getElementById("map-message");

if (mapDiv) {

    // API Key
    const apiKey = "K71xQdGqiiq3RbW82PkX";

    // Location from backend
    const location = mapLocation;

    // Default coordinates (India)
    const defaultCoordinates = [71.474, 22.983];

    // Setup API Key
    maptilersdk.config.apiKey = apiKey;

    // Create Map
    const map = new maptilersdk.Map({
        container: "map",
        style: maptilersdk.MapStyle.STREETS,
        center: defaultCoordinates,
        zoom: 4
    });

    // Function
    async function showMapLocation() {

        try {

            const response = await fetch(
                `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${apiKey}`
            );

            const data = await response.json();

            let coordinates;
            let popupText;

            // LOCATION FOUND
            if (data.features.length > 0) {
                mapMessage.innerText = "";
                coordinates = data.features[0].center;

                popupText = `
                    <div style="font-size:14px">
                        📍 <b>${location}</b>
                    </div>
                `;

                // Move map
                map.flyTo({
                    center: [
                        coordinates[0],
                        coordinates[1] - 0.01
                    ],
                    zoom: 11
                });

            }

            // LOCATION NOT FOUND
            else {
                mapMessage.innerText =
                    "Exact location could not be found. Showing default location.";
                coordinates = defaultCoordinates;

                popupText = `
                    <div style="font-size:14px;color:red">
                        Location Not Found
                    </div>
                `;

                map.flyTo({
                    center: defaultCoordinates,
                    zoom: 4
                });
            }

            // Marker
            const marker = new maptilersdk.Marker({
                color: "#ff385c",
                offset: [0, -30]
            })
                .setLngLat(coordinates)
                .setPopup(
                    new maptilersdk.Popup({
                        offset: 25,
                        closeButton: false,
                        closeOnClick: false
                    }).setHTML(popupText)
                )
                .addTo(map);

            // OPEN POPUP ON HOVER

            marker.getElement().addEventListener("mouseenter", () => {
                marker.togglePopup();
            });

            // HIDE POPUP
            marker.getElement().addEventListener("mouseleave", () => {

                // small delay prevents flicker
                setTimeout(() => {

                    if (!marker.getPopup().isOpen()) return;

                    marker.togglePopup();

                }, 200);

            });

        } catch (err) {

            console.log(err);

            // If API fails
            map.flyTo({
                center: defaultCoordinates,
                zoom: 4
            });

            new maptilersdk.Marker({
                color: "#ff385c",
                offset: [0, -30]
            })
                .setLngLat(defaultCoordinates)
                .setPopup(
                    new maptilersdk.Popup()
                        .setHTML("<b>Map Error</b>")
                )
                .addTo(map);
        }
    }

    // Run
    showMapLocation();
}