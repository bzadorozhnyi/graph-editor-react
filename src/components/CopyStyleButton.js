import CancelIcon from '@mui/icons-material/Cancel';
import ColorizeIcon from '@mui/icons-material/Colorize';
import IconButton from '@mui/material/IconButton';
import customDeepCopy from '../customDeepCopy';

function CopyStyleButton(props) {
    let { frames, setFrames, selectedFrameIndex, type } = props;

    return (
        <IconButton
            onClick={() => {
                frames[selectedFrameIndex].elements.isActiveCopy[type] = !frames[selectedFrameIndex].elements.isActiveCopy[type];
                setFrames(customDeepCopy(frames));
            }}
            size='large'
        >
            {
                frames[selectedFrameIndex].elements.isActiveCopy[type]
                    ? <CancelIcon fontSize="inherit" />
                    : <ColorizeIcon fontSize="inherit" />
            }
        </IconButton>
    );
}

export default CopyStyleButton;