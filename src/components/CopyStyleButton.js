import CancelIcon from '@mui/icons-material/Cancel';
import ColorizeIcon from '@mui/icons-material/Colorize';
import IconButton from '@mui/material/IconButton';
import customDeepCopy from '../customDeepCopy';

function CopyStyleButton(props) {
    let { elements, setElements, type } = props;

    return (
        <IconButton
            onClick={() => {
                elements.isActiveCopy[type] = !elements.isActiveCopy[type];
                setElements(customDeepCopy(elements));
            }}
            size='large'
        >
            {
                elements.isActiveCopy[type]
                    ? <CancelIcon fontSize="inherit" />
                    : <ColorizeIcon labelSize="inherit" />
            }
        </IconButton>
    );
}

export default CopyStyleButton;