import React from 'react';
import userData from '../users.json';
import { JSX } from 'react/jsx-runtime';
// @ts-ignore
import Svg from '../123.svg';

interface UserData {
    id: number;
    firstname: string;
    lastname: string;
}

export const User: () => JSX.Element = () => {
    return (<div>
        <h1>{userData.firstname} {userData.lastname}</h1>
        <div><Svg/></div>
        <p>{userData.lastname}</p>
    </div>)
}