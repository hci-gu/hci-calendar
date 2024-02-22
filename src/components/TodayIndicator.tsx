import moment from "moment";
import { positionAndWidthForDates } from "../lib/utils";
import { Text } from "@mantine/core";

export const TodayIndicator = () => {
    const [x] = positionAndWidthForDates([new Date()], window.innerWidth);
    return (
        <>
            <div style={{ position: "absolute", height: "100%", width: x, backdropFilter: "grayscale(1)", zIndex: 1000, borderRight: "5px solid red" }} />
            <Text size="xl" c="red" style={{ position: "absolute", left: 8 + x, zIndex: 1000 }} >{moment().format('DD')}</Text>
        </>
    );
};