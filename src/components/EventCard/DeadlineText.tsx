import { colorType } from "@/src/lib/mantineConfig";
import { DeadlineFormType } from "@/src/types/zod";
import { Flex, Text } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import moment from "moment";

export default function DeadlineText({ event, color }: { event: DeadlineFormType, color: colorType }) {
    return (
        <>
            <Flex h="100%" align="flex-end" direction="column" p="md">
                <Text style={{ textWrap: 'nowrap' }} fw="bold" c={color + ".8"}>
                    <IconBell />
                    {` ${event.name}`}
                </Text>
                <Text style={{ textWrap: 'nowrap' }} fw="bold" c={color + ".8"}>
                    {moment(event.timestamp).format('MM/DD')}
                </Text>
                <Text style={{ textWrap: 'nowrap' }} fw="bold" c={color + ".8"}>
                    {moment(event.timestamp).fromNow()}
                </Text>
            </Flex>

        </>

    )
}
