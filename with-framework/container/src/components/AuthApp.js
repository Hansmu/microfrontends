import {mount} from 'auth/AuthApp'; // Exporting mount, because we're trying to be library agnostic
import React, { useRef, useEffect } from 'react';
import {useHistory} from "react-router-dom";

export default function AuthApp() {
    const ref = useRef(null);
    const history = useHistory();

    useEffect(() => {
        if (ref.current) {
            const { onParentNavigate } = mount(ref.current, {
                initialPath: history.location.pathname,
                onNavigate: ({ pathname: nextPathName }) => {
                    if (history.location.pathname !== nextPathName) {
                        history.push(nextPathName);
                    }
                }
            });

            history.listen(onParentNavigate);
        }
    }, []);

    return (
        <div ref={ref}/>
    );
}