import Button from './Button';
import Table from "./dbtable.tsx";
import { useState } from "react";
import { Alert } from "./ui/alert";
import { Box, Input } from "@chakra-ui/react";
import { Field } from "./ui/field.tsx";

export enum operations {
    get = "Get by id",
    getAll = "GetAll",
    create = "Create",
    update = "Update",
    delete = "Delete"
}

interface MessageState {
    message: string;
    status: string;
}

function Present() {
    const [items, setItems] = useState([]);
    const [message, setMessage] = useState<MessageState>({ message: '', status: '' });
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        surname: "",
        age: "",
        city: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="100vw"
                height="100vh"
                gap="20px"
            >
                <Table items={items} />

                <Box display="flex" gap="2vw">
                    <Button
                        operation={operations.get}
                        setItems={setItems}
                        setMessage={setMessage}
                        data={formData}
                    />

                    <Button
                        operation={operations.getAll}
                        setItems={setItems}
                        setMessage={setMessage}
                        data={formData}
                    />

                    <Button
                        operation={operations.create}
                        setItems={setItems}
                        setMessage={setMessage}
                        data={formData}
                    />

                    <Button
                        operation={operations.update}
                        setItems={setItems}
                        setMessage={setMessage}
                        data={formData}
                    />

                    <Button
                        operation={operations.delete}
                        setItems={setItems}
                        setMessage={setMessage}
                        data={formData}
                    />
                </Box>

                <Box display="flex" gap="2vw" marginTop="5vh">
                    <Field label="Id" width="10vw">
                        <Input
                            value={formData.id}
                            onChange={handleInputChange}
                            name="id"
                            placeholder="Enter Id"
                        />
                    </Field>
                    <Field label="Name" width="10vw">
                        <Input
                            value={formData.name}
                            onChange={handleInputChange}
                            name="name"
                            placeholder="Enter your name"
                        />
                    </Field>
                    <Field label="Surname" width="10vw">
                        <Input
                            value={formData.surname}
                            onChange={handleInputChange}
                            name="surname"
                            placeholder="Enter your surname"
                        />
                    </Field>
                    <Field label="Age" width="10vw">
                        <Input
                            value={formData.age}
                            onChange={handleInputChange}
                            name="age"
                            type="number"
                            placeholder="Enter your age"
                        />
                    </Field>
                    <Field label="City" width="10vw">
                        <Input
                            value={formData.city}
                            onChange={handleInputChange}
                            name="city"
                            placeholder="Enter your city"
                        />
                    </Field>
                </Box>
                {message.message && <Alert status={message.status} title={message.message} width="20vw" />}
            </Box>
        </>
    );
}

export default Present;
