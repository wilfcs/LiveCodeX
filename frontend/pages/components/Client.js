import React, { useEffect } from 'react'
import Avatar from 'react-avatar'

const Client = ({userName}) => {
    useEffect(() => {
        console.log(userName);
    }, []);
  return (
    <div className='client'>
        <Avatar name={userName} size={50} round="14px"/>
        <span className="userName">{userName}</span>
    </div>
  )
}

export default Client