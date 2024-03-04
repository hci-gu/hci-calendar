import moment from "moment";
import { positionAndWidthForDates } from "../lib/utils";
import { Text } from "@mantine/core";

export const TodayIndicator = () => {
    const [x] = positionAndWidthForDates([new Date()], window.innerWidth);
    return (
        <>
            <div style={{ position: "absolute", height: "calc(100% - 59px)", width: x, backdropFilter: "grayscale(1)", zIndex: 1000, borderRight: "3px solid var(--mantine-color-red-text)", pointerEvents: "none" }} />
            <Text size="xl" c="red" style={{ position: "absolute", left: 8 + x, zIndex: 1000 }} >{moment().format('DD')}</Text>
        </>
    );
};