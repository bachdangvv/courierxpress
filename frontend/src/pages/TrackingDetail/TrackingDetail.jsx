import React from 'react';
import {useParams, Link} from 'react-router-dom';

// Importing Data
import trackingData from '../../data/tracking.json';

// Importing CSS
import './TrackingDetail.css';

const TrackingDetail = () => {
    const {trackingCode} = useParams();

    const order = trackingData.find(
        (item) => item.trackingCode.toLowerCase() === trackingCode.toLowerCase()
    );

    return (
        <>
            
        </>
    );
};

export default TrackingDetail;