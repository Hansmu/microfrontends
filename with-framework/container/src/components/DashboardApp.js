import {mount} from 'dashboard/DashboardApp'; // Exporting mount, because we're trying to be library agnostic
import React, { useRef, useEffect } from 'react';

export default function DashboardApp() {
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