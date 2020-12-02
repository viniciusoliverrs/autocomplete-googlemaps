    let placeSearch;
    let autocomplete;
    let key_api = "AIzaSyAVwFOvGU1J_R3WyycRGAyqhd8n8H5pZ9M";

    function initAutocomplete() {
        // Create the autocomplete object, restricting the search predictions to
        // geographical location types.
        autocomplete = new google.maps.places.Autocomplete(
            document.getElementById("address"), {
                types: ["geocode"]
            }
        );
        // Avoid paying for data that you don't need by restricting the set of
        // place fields that are returned to just the address components.
        autocomplete.setFields(["address_component"]);
        // When the user selects an address from the drop-down, populate the
        // address fields in the form.
        autocomplete.addListener("place_changed", fillInAddress);
    }

    function fillInAddress() {
        // Get the place details from the autocomplete object.
        const place = autocomplete.getPlace();
        getGeo(document.getElementById("address").value);
    }

    function getGeo(items) {
        console.log('Address: ' + items);
        $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${items}&key=${key_api}`, (data) => {
            let results = data.results;
            if (data.status == "OK") {
                results.forEach(result => {
                    let inputLat = document.createElement("input");
                    let inputLng = document.createElement("input");

                    inputLat.type = 'hidden';
                    inputLng.type = 'hidden';

                    inputLat.setAttribute('id', 'latitude');
                    inputLng.setAttribute('id', 'longitude');

                    inputLat.value = result.geometry.location.lat;
                    inputLng.value = result.geometry.location.lng;

                    inputLat.name = 'latitude';
                    inputLng.name = 'longitude';

                    document.getElementById('geo').appendChild(inputLat);
                    document.getElementById('geo').appendChild(inputLng);
                    items = items.split(',')
                    document.getElementById("address").value = items[0].toUpperCase();
                    console.log('Address: ' + items[0] + ' - ' + result.geometry.location.lat + " - " + result.geometry.location.lng)
                });
            } else {
                getGeo(items);
            }
        });
    }
    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    function geolocate() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                const circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy,
                });
                autocomplete.setBounds(circle.getBounds());
            });
        }
    }