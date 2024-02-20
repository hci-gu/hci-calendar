import { DeadlineType } from "@/src/types/types";
import { Flex, Text } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import moment from "moment";

export default function DeadlineText({ event }: { event: DeadlineType }) {
    return (
        <>
            <Flex h="100%" align="flex-end" direction="column" p="md">
                <Text style={{ textWrap: 'nowrap' }} fw="bold" c={'HCI-Green.8'}>
                    <IconBell />
                    {` ${event.name}`}
                </Text>
                <Text style={{ textWrap: 'nowrap' }} fw="bold" c={'HCI-Green.8'}>
                    {moment(event.timestamp).format('MM/DD')}
                </Text>
            </Flex>

        </>

    )
}
