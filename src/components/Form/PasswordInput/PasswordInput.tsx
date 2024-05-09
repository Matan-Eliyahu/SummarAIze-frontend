import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons from react-icons library
import styles from './PasswordInput.module.scss'
import { InputFormElement } from '../../../common/types';

interface PasswordInputProps {
    elem: InputFormElement;
}
const PasswordInput: React.FC<PasswordInputProps> = (props) => {
    const { elem } = props
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <label key={`${elem.name}Lbl`}>
            {elem.label}
            <div className={styles.passwordInputContainer}>
                <input
                    key={elem.name}
                    type={showPassword ? 'text' : 'password'}
                    name={elem.name}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                />
                <div className={styles.passwordToggle} onClick={handleTogglePassword}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
            </div>
        </label>
    );
};

export default PasswordInput;