import React, {useEffect, useState} from "react";
import {Button} from "@mui/material";

export function SenderName({title, id}: { title?: string, id: string }) {
    const [showId, setShowId] = useState<boolean>(false);
    return <Button size={"small"}
                   onClick={() => setShowId(!showId)}>{showId ? id : (title ? title : id.substring(0, 5))}</Button>;
}

export function Uuid({data}: { data: string }) {
    const [full, setFull] = useState<boolean>(false);
    return <Button size={"small"} onClick={() => setFull(!full)}>{full ? data : data.substring(0, 5)}</Button>;
}

export function TimeSince(props: { time?: Date }) {
    const [time, setTime] = useState<string>('');
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(timeSince(props.time!));
        }, 1000);
        setTime(timeSince(props.time!));
        return () => {
            clearInterval(interval);
        }
    }, [setTime, props.time]);
    if (time) {
        return <span>{time} ago</span>
    } else {
        return null;
    }
}

export function UnreadDelimiter() {
    return <div>
        <h3 style={{textAlign: 'center', color: 'yellow'}}>----------------- unread messages -----------------</h3>
    </div>
}

function timeSince(date?: Date) {
    if (!date) {
        return '';
    }
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return "minute";
}