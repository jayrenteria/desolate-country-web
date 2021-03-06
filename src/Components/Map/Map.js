/* global google */
import React, {useState, useRef} from 'react';
import GoogleMapReact from 'google-map-react';
import Button from '@material-ui/core/Button';

import geoData from '../../data/BIA_National_LAR_geo.json';
import Marker from '../Marker/Marker';

import './styles.css';

function Map({dataToShow, setInstitution}) {
    const [heatMapVisible, setHeatMapVisible] = useState(true);
    const [iconsVisible, setIconsVisible] = useState(true);
    const mapEl = useRef(null);
    // US default center/zoom
    const defaults = {
        center: {
            lat: 37.6762908,
            lng: -101.3426515
        },
        zoom: 5
    }

    const handleApiLoaded = (map, maps) => {

        console.log(map);
        console.log(maps);
        console.log(mapEl);
        console.log(geoData);
        
        if (mapEl !== undefined) {
            mapEl.current = map;
            // add geo json is for direct files not urls
            mapEl.current.data.addGeoJson(
                geoData
            )
            mapEl.current.data.setStyle({
                fillColor: "green",
                strokeWeight: 1
            });
        }
      };

    const toggleHeatMap = () => {
        
        setHeatMapVisible(!heatMapVisible);
        if (mapEl !== undefined) {
            console.log(mapEl.current.heatmap)   
            mapEl.current.heatmap.setMap(!heatMapVisible ?
                mapEl.current.map_ : null)      
        }
    }

    const toggleIcons = () => {
        setIconsVisible(!iconsVisible);
    }

    let data = {}
    let heatMapData = {   
        positions: [],
        options: {   
            radius: 40,   
            opacity: 0.6,
        }
    }
    for (let i = 0; i < dataToShow.length; i++) {
        const item = dataToShow[i];
        if ( !data[`${item.latitude}-${item.longitude}`]) {
            data[`${item.latitude}-${item.longitude}`] = {
                name_of_institution: item.name_of_institution,
                latitude: item.latitude,
                longitude: item.longitude,
                institution_type: item.institution_type,
                native_serving_mission: item.native_serving_mission,
                abuse_claim: item.abuse_claim,
                years: []
            }
        }
        data[`${item.latitude}-${item.longitude}`].years.push(item)
        if (!data[`${item.latitude}-${item.longitude}`].abuse_claim && item.abuse_claim) {
            data[`${item.latitude}-${item.longitude}`].abuse_claim = true;
        }

        if (item.abuse_claim) {
            heatMapData.positions.push({ lat:item.latitude, lng: item.longitude });
        }
        
    }

    const mapChangeHandler = mapSettings => {
        console.log(`Zoom level: ${mapSettings.zoom}`)
    }

    return(
        <div style={{width: '100%', height: '800px', position: 'relative'}}>
            <Button className="toggle-heatmap" variant="contained" color={heatMapVisible ? 'secondary' : 'primary' } onClick={() => toggleHeatMap()}>Heatmap</Button>
            <Button className="toggle-icons" variant="contained" color={iconsVisible ? 'secondary' : 'primary' } onClick={() => toggleIcons()}>Icons</Button>
            <GoogleMapReact
                ref={mapEl}
                bootstrapURLKeys={{ key: '' }}
                defaultCenter={defaults.center}
                defaultZoom={defaults.zoom}
                heatmapLibrary={true}          
                heatmap={heatMapData}
                onChange={mapChangeHandler}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            >
                {Object.values(data).map(item => {
                    return(
                        <Marker
                            key={`${item.name_of_institution}-${item.name}`}
                            lat={item.latitude}
                            lng={item.longitude}
                            text={item.name_of_institution}
                            institution={item}
                            setInstitution={setInstitution}
                            transparentIcon={!iconsVisible}
                        />
                    )
                })}
            </GoogleMapReact>
        </div>
    )
}

export default Map;