import React from 'react';

function RegisterWG() {
    return (
        <div className='formContainer'>
            <h2>Register WG</h2>
            <form className='loginForm'>
                <div className='formGroup'>
                    <label htmlFor='wgName'>WG Name</label>
                    <input 
                        type='text' 
                        id='wgName' 
                        name='wgName' 
                        required 
                    />
                </div>
                <div className='formGroup'>
                    <label htmlFor='wgPassword'>Password</label>
                    <input 
                        type='password' 
                        id='wgPassword' 
                        name='wgPassword' 
                        required 
                    />
                </div>
            </form>
        </div>
    );
}

export default RegisterWG;