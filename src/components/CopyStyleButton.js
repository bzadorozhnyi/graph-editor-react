import CancelIcon from '@mui/icons-material/Cancel';
import ColorizeIcon from '@mui/icons-material/Colorize';
import IconButton from '@mui/material/IconButton';

function CopyStyleButton(props) {
    let { elements, setElements, isActiveCopy, type } = props;

    return (
        <IconButton
            onClick={() => {
                if(type === 'node') {
                    elements.isNodeStyleCopyActive = !isActiveCopy;
                }
                if(type === 'edge') {
                    elements.isEdgeStyleCopyActive = !isActiveCopy;
                }
                setElements({...elements});
            }}
            size='large'
        >
            {isActiveCopy ? <CancelIcon fontSize="inherit" /> : <ColorizeIcon fontSize="inherit" />}
        </IconButton>
    );
}

export default CopyStyleButton;