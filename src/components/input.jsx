import { InputCustom } from "../style/style";

const Input = ({type, value, onChange, onClick, placeholder, name}) => {
    return(
        <InputCustom type={type} value={value} onClick={onClick} onChange={onChange} placeholder={placeholder} name={name} />
    );
};

export default Input