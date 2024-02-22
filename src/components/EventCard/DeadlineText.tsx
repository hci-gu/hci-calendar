import { colorType } from "@/src/lib/mantineConfig";
import { getColor } from "@/src/lib/utils";
import { DeadlineFormType } from "@/src/types/zod";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex, Text } from "@mantine/core";
import moment from "moment";

export default function DeadlineText({ event, color }: { event: DeadlineFormType, color: colorType }) {
    const is14DaysFromNow = moment(event.timestamp).isBefore(moment().add(14, 'days'))

    return (
        <>
            <Flex h="100%" align="flex-end" direction="column" p="md">
                <Flex align="center" gap="xs">
                    <FontAwesomeIcon icon={faBell} color={`var(--mantine-color-${color}-8)`} />
                    <Text style={{ textWrap: 'nowrap' }} fw="bold" c={color + ".8"}>
                        {event.name}
                    </Text>
                </Flex>
                <Text style={{ textWrap: 'nowrap' }} fw="bold" c={color + ".8"}>
                    {moment(event.timestamp).format('MM/DD')}
                </Text>

                {is14DaysFromNow &&
                    <Text style={{ textWrap: 'nowrap' }} fw="bold" c={color + ".8"}>
                        {moment(event.timestamp).fromNow()}
                    </Text>
                }
            </Flex>

        </>

    )
}
