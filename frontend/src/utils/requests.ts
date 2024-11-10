import {useEffect} from "react";

export const fetchUsers = async () => {
    try {
        const response = await fetch('http://localhost:5000/getAll');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};

export const fetchUser = async (id: number) => {
    try {
        const response = await fetch(`http://localhost:5000/get/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};


export const createUser = async (data: any) => {
    try {
        const response = await fetch('http://localhost:5000/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: data }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};

export const updateUser = async (id: number, data: any) => {
    try {
        const response = await fetch(`http://localhost:5000/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};

export const deleteUser = async (id: number) => {
    try {
        const response = await fetch(`http://localhost:5000/delete/${id}`, {
            method: 'DELETE',
        });

        return await response.json();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
};
