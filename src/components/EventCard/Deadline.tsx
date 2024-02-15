import { deadlinesType } from "@/src/types/zod";
import { Divider, Flex, Text } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import moment from "moment";

type DeadlineProps = {
    deadline: deadlinesType
    isFirst: boolean
}

const Deadline = ({ deadline, isFirst }: DeadlineProps) => {
    return (
        <Flex bg={!isFirst ? 'HCI-Green.4' : ''}>
            <Flex direction="column" align="end" py="lg" px="md">
                <Text c={'HCI-Green.8'} fw="bold">
                    <IconBell />
                    {` ${deadline.name}`}
                </Text>
                <Text c={'HCI-Green.8'} fw="bold">
                    {moment(deadline.timestamp).fromNow()}
                </Text>
            </Flex>

            <Divider color='HCI-Green.8' ml="xs" size="xl" orientation="vertical" />
        </Flex>
    );
};

export default Deadline;