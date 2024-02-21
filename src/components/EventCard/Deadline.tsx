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

const hide: MantineStyleProp = {
    // visibility: 'hidden'
    display: 'none'
}

const Deadline = ({ deadline, isFirst, flex }: DeadlineProps) => {
    const timeFromNow = moment(deadline.timestamp).fromNow()

    const dedlineContianer = useRef<HTMLDivElement>(null);
    const trxtContainer = useRef<HTMLDivElement>(null);

    const [deadlineWidth, setDeadlineWidth] = useState<number>(0);
    const [textWidth, setTextWidth] = useState<number>(0);

    useEffect(() => {
        if (dedlineContianer.current && trxtContainer.current) {
            console.log(dedlineContianer.current);

            setDeadlineWidth(dedlineContianer.current?.clientWidth - 38);
            setTextWidth(trxtContainer.current?.clientWidth);
        }
    }, [])

    const textIsLongerAndFirst = textWidth >= deadlineWidth && !isFirst;



    return (
        <>
            {/* <pre>
                {JSON.stringify({ textWidth, deadlineWidth }, null, 2)}
            </pre> */}
            {isFirst && (
                <Divider
                    color="HCI-Green.8"
                    mr={textIsLongerAndFirst ? "xs" : undefined}
                    size="xl"
                    w={"100%"}
                    orientation="vertical"
                />
            )}
            <Flex
                bg={!isFirst ? 'HCI-Green.4' : ''}
                flex={!isFirst ? flex : undefined}
                justify="end"
                ref={dedlineContianer}
            >
                <Flex direction="column" align="end" py={!isFirst ? 'lg' : undefined} style={isFirst ? { position: 'absolute', left: -textWidth * 2, top: 0 } : {}} ref={trxtContainer}>
                    <Text c={'HCI-Green.8'} fw="bold" style={textIsLongerAndFirst ? hide : {}}>
                        <IconBell />
                        {` ${deadline.name}`}
                    </Text>
                    <Text c={'HCI-Green.8'} fw="bold" style={textIsLongerAndFirst ? hide : {}}>
                        {moment(deadline.timestamp).format('MM/DD')}
                    </Text>
                    <Text c={'HCI-Green.8'} fw="bold" style={textIsLongerAndFirst ? hide : {}}>
                        {timeFromNow}
                    </Text>
                </Flex>
                {!isFirst && (
                    <Divider
                        color="HCI-Green.8"
                        ml={!textIsLongerAndFirst ? "xl" : undefined}
                        size="xl"
                        w={"100%"}
                        orientation="vertical"
                    />
                )
                }
            </Flex>
        </>
    )
}

export default Deadline
