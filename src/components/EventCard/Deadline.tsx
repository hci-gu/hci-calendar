import { DeadlineType } from '@/src/types/types'
import { Divider, Flex, MantineStyleProp, Text } from '@mantine/core'
import { IconBell } from '@tabler/icons-react'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'

type DeadlineProps = {
    deadline: DeadlineType
    isFirst: boolean
    flex: number
}

const absolutePos: MantineStyleProp = {
    // position: 'absolute',
    top: 0,
    left: 0,
}

const Deadline = ({ deadline, isFirst, flex }: DeadlineProps) => {
    const timeFromNow = moment(deadline.timestamp).fromNow()

    const dedlineContianer = useRef<HTMLDivElement>(null);
    const trxtContainer = useRef<HTMLDivElement>(null);

    const [deadlineWidth, setDeadlineWidth] = useState<number>(0);
    const [textWidth, setTextWidth] = useState<number>(0);

    useEffect(() => {
        if (dedlineContianer.current && trxtContainer.current) {
            setDeadlineWidth(dedlineContianer.current?.clientWidth);
            setTextWidth(trxtContainer.current?.clientWidth);
        }
    }, [])

    console.table({ textWidth, deadlineWidth });
    console.log(textWidth < deadlineWidth, dedlineContianer.current);



    return (
        <>
            {/* <pre>
                {JSON.stringify({ textWidth, deadlineWidth }, null, 2)}
            </pre> */}
            <Flex
                bg={!isFirst ? 'HCI-Green.4' : ''}
                flex={!isFirst ? flex : undefined}
                justify="end"
                style={isFirst ? absolutePos : {}}
                ref={dedlineContianer}
            >
                {isFirst && (
                    <Divider
                        color="HCI-Green.8"
                        mr="xs"
                        size="xl"
                        orientation="vertical"
                    />
                )}
                <Flex direction="column" align="end" py="lg" px="md" ref={trxtContainer} style={textWidth > deadlineWidth ? { display: 'none' } : {}}>
                    <Text c={'HCI-Green.8'} fw="bold">
                        <IconBell />
                        {` ${deadline.name}`}
                    </Text>
                    <Text c={'HCI-Green.8'} fw="bold">
                        {moment(deadline.timestamp).format('MM/DD')}
                    </Text>
                    <Text c={'HCI-Green.8'} fw="bold" >
                        {timeFromNow}
                    </Text>
                </Flex>
                {!isFirst && (
                    <Divider
                        color="HCI-Green.8"
                        ml="xs"
                        size="xl"
                        orientation="vertical"
                    />
                )
                }
            </Flex>
        </>
    )
}

export default Deadline
