import React from 'react';
import {LinearProgress, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    bar: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2)
        }
    }
}));

export default function Progress() {
    const classes = useStyles();

    return (
        <div className={classes.bar}>
            <LinearProgress />
        </div>
    );
}