import {Table} from "@chakra-ui/react";
import React from "react";

interface demoProps {
    items: Array<{ key: number, value: {name: string, surname: string, age: number, city: string} }>
}

const Demo: React.FC<demoProps> = ({items}) => {

    return (
        <Table.ScrollArea
            borderWidth="1px"
            rounded="md"
            height="50vh"
            maxHeight="50vh"
            width="80vw"
        >
            <Table.Root size="sm" stickyHeader>
                <Table.Header>
                    <Table.Row bg="bg.subtle">
                        <Table.ColumnHeader>Id</Table.ColumnHeader>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Surname</Table.ColumnHeader>
                        <Table.ColumnHeader>Age</Table.ColumnHeader>
                        <Table.ColumnHeader>City</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {items.length !== 0 && items.map((item) => (
                        <Table.Row key={item.key}>
                            <Table.Cell>{item.key}</Table.Cell>
                            <Table.Cell>{item.value.name}</Table.Cell>
                            <Table.Cell>{item.value.surname}</Table.Cell>
                            <Table.Cell>{item.value.age}</Table.Cell>
                            <Table.Cell>{item.value.city}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
};

export default Demo;
