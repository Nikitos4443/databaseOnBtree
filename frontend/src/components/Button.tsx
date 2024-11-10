import {Button} from "@chakra-ui/react"
import {operations} from "./Present.tsx";
import {createUser, deleteUser, fetchUser, fetchUsers, updateUser} from "../utils/requests.ts";

const ButtonComponent = ({ operation, setItems, setMessage, data }: { operation: operations, setItems: any, setMessage: any, data: any}) => {

    const handleOperation = async () => {
        switch (operation) {
            case operations.get: {
                const user = await fetchUser(parseInt(data.id));
                if(!user) {
                    setMessage({message: "No data fetched", status: 'error'})
                    return;
                }

                setMessage({message: "Data fetched successfully", status: 'success'})
                setItems([user]);
                break;
            }
            case operations.getAll: {
                const users = await fetchUsers();
                if(!users) {
                    setMessage({message: "No data fetched", status: 'error'})
                    return;
                }

                setMessage({message: "Data fetched successfully", status: 'success'})
                setItems(users);
                break;
            }
            case operations.create: {
                const newUser = {name: data.name, surname: data.surname, age: parseInt(data.age), city: data.city};
                console.log(newUser)
                const users = await createUser(newUser);
                if(!users) {
                    setMessage({message: "No records created", status: 'error'})
                    return;
                }

                setMessage({message: "Record created successfully", status: 'success'})
                setItems(users);
                break;
            }
            case operations.update: {
                const updatedUser = {name: data.name, surname: data.surname, age: parseInt(data.age), city: data.city};
                const updatedData = await updateUser(parseInt(data.id), updatedUser);
                if(!updatedData) {
                    setMessage({message: "No records updated", status: 'error'})
                    return;
                }

                setMessage({message: "Record updated successfully", status: 'success'})
                setItems(updatedData);
                break;
            }
            case operations.delete: {
                const deletedData = await deleteUser(parseInt(data.id));
                console.log(deletedData)
                if(!deletedData) {
                    setMessage({message: "No data deleted", status: 'error'})
                    return;
                }
                setMessage({message: "Data deleted successfully", status: 'success'})
                setItems(deletedData);
                break;
            }
            default:
                break;
        }
    };

    return (
        <>
            <Button colorPalette="teal" onClick={handleOperation}>{operation}</Button>
        </>
    )
}

export default ButtonComponent;