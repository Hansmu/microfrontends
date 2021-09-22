import {mount} from 'marketing/MarketingApp'; // Exporting mount, because we're trying to be library agnostic
import React, { useRef, useEffect } from 'react';

export default function MarketingApp() {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            mount(ref.current);
        }
    }, []);

    return (
        <div ref={ref}/>
    );
}